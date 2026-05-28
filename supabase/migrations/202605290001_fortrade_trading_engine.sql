-- InvestPRO — Motor trading Fortrade: margen, pending orders, RPCs

ALTER TABLE public.wallets
  ADD COLUMN IF NOT EXISTS leverage INT NOT NULL DEFAULT 100,
  ADD COLUMN IF NOT EXISTS account_mode TEXT NOT NULL DEFAULT 'demo'
    CHECK (account_mode IN ('demo', 'live'));

CREATE TABLE IF NOT EXISTS public.pending_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  symbol TEXT NOT NULL,
  side TEXT NOT NULL CHECK (side IN ('BUY', 'SELL')),
  order_type TEXT NOT NULL CHECK (order_type IN ('LIMIT', 'STOP')),
  volume DECIMAL(10, 4) NOT NULL CHECK (volume > 0),
  trigger_price DECIMAL(18, 8) NOT NULL CHECK (trigger_price > 0),
  stop_loss DECIMAL(18, 8),
  take_profit DECIMAL(18, 8),
  status TEXT NOT NULL DEFAULT 'PENDING'
    CHECK (status IN ('PENDING', 'FILLED', 'CANCELLED', 'EXPIRED')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pending_orders_client
  ON public.pending_orders (client_id, status);

ALTER TABLE public.pending_orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS pending_orders_client_select ON public.pending_orders;
CREATE POLICY pending_orders_client_select ON public.pending_orders
  FOR SELECT TO authenticated
  USING (client_id = auth.uid());

DROP POLICY IF EXISTS pending_orders_client_insert ON public.pending_orders;
CREATE POLICY pending_orders_client_insert ON public.pending_orders
  FOR INSERT TO authenticated
  WITH CHECK (client_id = auth.uid());

DROP POLICY IF EXISTS pending_orders_client_update ON public.pending_orders;
CREATE POLICY pending_orders_client_update ON public.pending_orders
  FOR UPDATE TO authenticated
  USING (client_id = auth.uid())
  WITH CHECK (client_id = auth.uid());

DROP POLICY IF EXISTS pending_orders_leadership_select ON public.pending_orders;
CREATE POLICY pending_orders_leadership_select ON public.pending_orders
  FOR SELECT TO authenticated
  USING (public.is_leadership());

-- Abrir posición con validación de margen
CREATE OR REPLACE FUNCTION public.open_position_with_risk(
  p_symbol TEXT,
  p_type TEXT,
  p_volume NUMERIC,
  p_open_price NUMERIC,
  p_stop_loss NUMERIC DEFAULT NULL,
  p_take_profit NUMERIC DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID := auth.uid();
  v_wallet RECORD;
  v_equity NUMERIC;
  v_used_margin NUMERIC;
  v_needed NUMERIC;
  v_leverage INT;
  v_pos_id UUID;
  v_open_count INT;
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  IF p_volume <= 0 OR p_open_price <= 0 THEN
    RAISE EXCEPTION 'Invalid volume or price';
  END IF;

  SELECT * INTO v_wallet FROM public.wallets WHERE client_id = v_user_id;
  IF NOT FOUND THEN
    v_wallet.id := public.ensure_client_wallet(v_user_id);
    SELECT * INTO v_wallet FROM public.wallets WHERE client_id = v_user_id;
  END IF;

  IF v_wallet.is_frozen THEN
    RAISE EXCEPTION 'Wallet is frozen';
  END IF;

  v_leverage := COALESCE(v_wallet.leverage, 100);
  v_needed := (p_volume * p_open_price) / v_leverage;

  SELECT COALESCE(SUM((volume * open_price) / v_leverage), 0) INTO v_used_margin
  FROM public.positions
  WHERE client_id = v_user_id AND status = 'OPEN';

  v_equity := COALESCE(v_wallet.balance, 0);

  IF v_equity - v_used_margin < v_needed THEN
    RAISE EXCEPTION 'Insufficient margin';
  END IF;

  SELECT COUNT(*) INTO v_open_count
  FROM public.positions
  WHERE client_id = v_user_id AND status = 'OPEN';

  IF v_open_count >= 50 THEN
    RAISE EXCEPTION 'Too many open positions';
  END IF;

  INSERT INTO public.positions (
    client_id, symbol, type, volume, open_price, stop_loss, take_profit, status
  ) VALUES (
    v_user_id, p_symbol, p_type, p_volume, p_open_price, p_stop_loss, p_take_profit, 'OPEN'
  )
  RETURNING id INTO v_pos_id;

  RETURN jsonb_build_object('position_id', v_pos_id, 'ok', true);
END;
$$;

GRANT EXECUTE ON FUNCTION public.open_position_with_risk(TEXT, TEXT, NUMERIC, NUMERIC, NUMERIC, NUMERIC) TO authenticated;

CREATE OR REPLACE FUNCTION public.place_pending_order(
  p_symbol TEXT,
  p_side TEXT,
  p_order_type TEXT,
  p_volume NUMERIC,
  p_trigger_price NUMERIC,
  p_stop_loss NUMERIC DEFAULT NULL,
  p_take_profit NUMERIC DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID := auth.uid();
  v_order_id UUID;
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  INSERT INTO public.pending_orders (
    client_id, symbol, side, order_type, volume, trigger_price, stop_loss, take_profit
  ) VALUES (
    v_user_id, p_symbol, p_side, p_order_type, p_volume, p_trigger_price, p_stop_loss, p_take_profit
  )
  RETURNING id INTO v_order_id;

  RETURN jsonb_build_object('order_id', v_order_id, 'ok', true);
END;
$$;

GRANT EXECUTE ON FUNCTION public.place_pending_order(TEXT, TEXT, TEXT, NUMERIC, NUMERIC, NUMERIC, NUMERIC) TO authenticated;

CREATE OR REPLACE FUNCTION public.cancel_pending_order(p_order_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.pending_orders
  SET status = 'CANCELLED'
  WHERE id = p_order_id
    AND client_id = auth.uid()
    AND status = 'PENDING';

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Order not found or not cancellable';
  END IF;

  RETURN jsonb_build_object('ok', true);
END;
$$;

GRANT EXECUTE ON FUNCTION public.cancel_pending_order(UUID) TO authenticated;
