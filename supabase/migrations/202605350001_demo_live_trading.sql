-- Demo / Live dual-book trading (InvestPRO)

ALTER TABLE public.wallets
  ADD COLUMN IF NOT EXISTS demo_balance NUMERIC NOT NULL DEFAULT 0;

ALTER TABLE public.positions
  ADD COLUMN IF NOT EXISTS account_mode TEXT NOT NULL DEFAULT 'demo'
    CHECK (account_mode IN ('demo', 'live'));

ALTER TABLE public.pending_orders
  ADD COLUMN IF NOT EXISTS account_mode TEXT NOT NULL DEFAULT 'demo'
    CHECK (account_mode IN ('demo', 'live'));

-- Backfill existing rows
UPDATE public.positions p
SET account_mode = CASE
  WHEN COALESCE(w.balance, 0) > 0 THEN 'live'
  ELSE 'demo'
END
FROM public.wallets w
WHERE w.client_id = p.client_id;

UPDATE public.wallets
SET demo_balance = 10000
WHERE demo_balance = 0 OR demo_balance IS NULL;

-- ─── ensure_demo_funds ───────────────────────────────────────
CREATE OR REPLACE FUNCTION public.ensure_demo_funds()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_uid UUID := auth.uid();
  v_wallet RECORD;
  v_demo_start CONSTANT NUMERIC := 10000;
BEGIN
  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  PERFORM public.ensure_client_wallet(v_uid);

  SELECT * INTO v_wallet FROM public.wallets WHERE client_id = v_uid FOR UPDATE;

  IF COALESCE(v_wallet.demo_balance, 0) <= 0 THEN
    UPDATE public.wallets SET demo_balance = v_demo_start, updated_at = NOW()
    WHERE client_id = v_uid;
    v_wallet.demo_balance := v_demo_start;
  END IF;

  RETURN jsonb_build_object(
    'demo_balance', v_wallet.demo_balance,
    'balance', v_wallet.balance,
    'account_mode', v_wallet.account_mode
  );
END;
$$;

-- ─── switch_account_mode ─────────────────────────────────────
CREATE OR REPLACE FUNCTION public.switch_account_mode(p_mode TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_uid UUID := auth.uid();
  v_wallet RECORD;
BEGIN
  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  IF p_mode NOT IN ('demo', 'live') THEN
    RAISE EXCEPTION 'Invalid account mode';
  END IF;

  PERFORM public.ensure_client_wallet(v_uid);
  PERFORM public.ensure_demo_funds();

  UPDATE public.wallets
  SET account_mode = p_mode, updated_at = NOW()
  WHERE client_id = v_uid
  RETURNING * INTO v_wallet;

  RETURN jsonb_build_object(
    'account_mode', v_wallet.account_mode,
    'demo_balance', v_wallet.demo_balance,
    'balance', v_wallet.balance,
    'leverage', v_wallet.leverage
  );
END;
$$;

-- ─── reset_demo_account ────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.reset_demo_account()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_uid UUID := auth.uid();
  v_demo_start CONSTANT NUMERIC := 10000;
BEGIN
  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  UPDATE public.positions
  SET status = 'CLOSED', closed_at = NOW(), pnl = 0, close_price = open_price
  WHERE client_id = v_uid AND status = 'OPEN' AND account_mode = 'demo';

  UPDATE public.pending_orders
  SET status = 'CANCELLED'
  WHERE client_id = v_uid AND status = 'PENDING' AND account_mode = 'demo';

  UPDATE public.wallets
  SET demo_balance = v_demo_start, account_mode = 'demo', updated_at = NOW()
  WHERE client_id = v_uid;

  RETURN jsonb_build_object('ok', true, 'demo_balance', v_demo_start);
END;
$$;

-- ─── open_position_with_risk (dual book) ─────────────────────
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
  v_mode TEXT;
  v_book_balance NUMERIC;
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

  PERFORM public.ensure_client_wallet(v_user_id);

  SELECT * INTO v_wallet FROM public.wallets WHERE client_id = v_user_id FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Wallet not found';
  END IF;

  IF v_wallet.is_frozen THEN
    RAISE EXCEPTION 'Wallet is frozen';
  END IF;

  v_mode := COALESCE(v_wallet.account_mode, 'demo');

  IF v_mode = 'demo' THEN
    PERFORM public.ensure_demo_funds();
    SELECT * INTO v_wallet FROM public.wallets WHERE client_id = v_user_id;
    v_book_balance := COALESCE(v_wallet.demo_balance, 0);
  ELSE
    v_book_balance := COALESCE(v_wallet.balance, 0);
    IF v_book_balance <= 0 THEN
      RAISE EXCEPTION 'Insufficient funds — deposit required';
    END IF;
  END IF;

  v_leverage := COALESCE(v_wallet.leverage, 100);
  v_needed := (p_volume * p_open_price) / v_leverage;

  SELECT COALESCE(SUM((volume * open_price) / v_leverage), 0) INTO v_used_margin
  FROM public.positions
  WHERE client_id = v_user_id AND status = 'OPEN' AND account_mode = v_mode;

  v_equity := v_book_balance;

  IF v_equity - v_used_margin < v_needed THEN
    RAISE EXCEPTION 'Insufficient margin';
  END IF;

  SELECT COUNT(*) INTO v_open_count
  FROM public.positions
  WHERE client_id = v_user_id AND status = 'OPEN' AND account_mode = v_mode;

  IF v_open_count >= 50 THEN
    RAISE EXCEPTION 'Too many open positions';
  END IF;

  INSERT INTO public.positions (
    client_id, symbol, type, volume, open_price, stop_loss, take_profit, status, account_mode
  ) VALUES (
    v_user_id, p_symbol, p_type, p_volume, p_open_price, p_stop_loss, p_take_profit, 'OPEN', v_mode
  )
  RETURNING id INTO v_pos_id;

  RETURN jsonb_build_object('position_id', v_pos_id, 'ok', true, 'account_mode', v_mode);
END;
$$;

-- ─── close_position_settle ─────────────────────────────────────
CREATE OR REPLACE FUNCTION public.close_position_settle(
  p_position_id UUID,
  p_close_price NUMERIC,
  p_pnl NUMERIC
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID := auth.uid();
  v_pos RECORD;
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  SELECT * INTO v_pos
  FROM public.positions
  WHERE id = p_position_id AND client_id = v_user_id AND status = 'OPEN'
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Position not found or already closed';
  END IF;

  UPDATE public.positions
  SET
    close_price = p_close_price,
    pnl = p_pnl,
    status = 'CLOSED',
    closed_at = NOW()
  WHERE id = p_position_id;

  IF v_pos.account_mode = 'demo' THEN
    UPDATE public.wallets
    SET demo_balance = GREATEST(0, COALESCE(demo_balance, 0) + COALESCE(p_pnl, 0)), updated_at = NOW()
    WHERE client_id = v_user_id;
  ELSE
    UPDATE public.wallets
    SET balance = GREATEST(0, COALESCE(balance, 0) + COALESCE(p_pnl, 0)), updated_at = NOW()
    WHERE client_id = v_user_id;
  END IF;

  RETURN jsonb_build_object('ok', true, 'pnl', p_pnl);
END;
$$;

-- ─── place_pending_order (tag account_mode) ──────────────────
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
  v_mode TEXT;
  v_order_id UUID;
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  SELECT COALESCE(account_mode, 'demo') INTO v_mode
  FROM public.wallets WHERE client_id = v_user_id;

  IF v_mode IS NULL THEN
    v_mode := 'demo';
  END IF;

  IF v_mode = 'live' THEN
    IF COALESCE((SELECT balance FROM public.wallets WHERE client_id = v_user_id), 0) <= 0 THEN
      RAISE EXCEPTION 'Insufficient funds — deposit required';
    END IF;
  ELSE
    PERFORM public.ensure_demo_funds();
  END IF;

  INSERT INTO public.pending_orders (
    client_id, symbol, side, order_type, volume, trigger_price, stop_loss, take_profit, account_mode
  ) VALUES (
    v_user_id, p_symbol, p_side, p_order_type, p_volume, p_trigger_price, p_stop_loss, p_take_profit, v_mode
  )
  RETURNING id INTO v_order_id;

  RETURN jsonb_build_object('order_id', v_order_id, 'ok', true, 'account_mode', v_mode);
END;
$$;

GRANT EXECUTE ON FUNCTION public.ensure_demo_funds() TO authenticated;
GRANT EXECUTE ON FUNCTION public.switch_account_mode(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.reset_demo_account() TO authenticated;
GRANT EXECUTE ON FUNCTION public.close_position_settle(UUID, NUMERIC, NUMERIC) TO authenticated;
