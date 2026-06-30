-- ============================================================
-- InvestPRO Lite — country_code, audit_log, fiat LATAM genérico,
-- RPCs staff HEAD lite, aprobación transacciones, brackets SL/TP
-- ============================================================

-- ─── 1. country_code interno (sin exponer nombres en UI) ─────

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS country_code CHAR(2);

ALTER TABLE public.leads
  ADD COLUMN IF NOT EXISTS country_code CHAR(2);

UPDATE public.profiles SET country_code = CASE
  WHEN lower(coalesce(country, '')) LIKE '%per%' THEN 'PE'
  WHEN lower(coalesce(country, '')) LIKE '%colom%' THEN 'CO'
  WHEN lower(coalesce(country, '')) LIKE '%mex%' THEN 'MX'
  WHEN lower(coalesce(country, '')) LIKE '%chil%' THEN 'CL'
  WHEN lower(coalesce(country, '')) LIKE '%argen%' THEN 'AR'
  ELSE 'LA'
END
WHERE country_code IS NULL AND country IS NOT NULL;

UPDATE public.leads SET country_code = CASE
  WHEN lower(coalesce(country, '')) LIKE '%per%' THEN 'PE'
  WHEN lower(coalesce(country, '')) LIKE '%colom%' THEN 'CO'
  WHEN lower(coalesce(country, '')) LIKE '%mex%' THEN 'MX'
  WHEN lower(coalesce(country, '')) LIKE '%chil%' THEN 'CL'
  WHEN lower(coalesce(country, '')) LIKE '%argen%' THEN 'AR'
  ELSE 'LA'
END
WHERE country_code IS NULL AND country IS NOT NULL;

-- ─── 2. audit_log inmutable ─────────────────────────────────

CREATE TABLE IF NOT EXISTS public.audit_log (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action      TEXT NOT NULL,
  resource    TEXT NOT NULL,
  resource_id UUID,
  old_data    JSONB,
  new_data    JSONB,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS audit_log_head_select ON public.audit_log;
CREATE POLICY audit_log_head_select ON public.audit_log
  FOR SELECT TO authenticated
  USING (public.get_my_role() IN ('HEAD', 'CHIEF'));

DROP POLICY IF EXISTS audit_log_no_update ON public.audit_log;
CREATE POLICY audit_log_no_update ON public.audit_log
  FOR UPDATE TO authenticated USING (false);

DROP POLICY IF EXISTS audit_log_no_delete ON public.audit_log;
CREATE POLICY audit_log_no_delete ON public.audit_log
  FOR DELETE TO authenticated USING (false);

CREATE OR REPLACE FUNCTION public.write_audit_log(
  p_action TEXT,
  p_resource TEXT,
  p_resource_id UUID DEFAULT NULL,
  p_old_data JSONB DEFAULT NULL,
  p_new_data JSONB DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.audit_log (user_id, action, resource, resource_id, old_data, new_data)
  VALUES (auth.uid(), p_action, p_resource, p_resource_id, p_old_data, p_new_data);
END;
$$;

-- ─── 3. Cuenta bancaria LATAM genérica ───────────────────────

ALTER TABLE public.company_bank_accounts
  ADD COLUMN IF NOT EXISTS country_code CHAR(2) DEFAULT 'LA',
  ADD COLUMN IF NOT EXISTS rail TEXT DEFAULT 'manual_bank';

INSERT INTO public.company_bank_accounts (id, bank_name, currency, cci, holder, ruc, sort_order, country_code, rail)
VALUES (
  'latam-usd-default',
  'Banco operativo LATAM',
  'USD',
  '000-000-000000000000-00',
  'InvestPRO',
  NULL,
  0,
  'LA',
  'manual_bank'
)
ON CONFLICT (id) DO UPDATE SET
  rail = EXCLUDED.rail,
  country_code = EXCLUDED.country_code;

-- ─── 4. Storage deposit-receipts (reforzar políticas) ────────

INSERT INTO storage.buckets (id, name, public)
VALUES ('deposit-receipts', 'deposit-receipts', false)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS deposit_receipts_insert ON storage.objects;
CREATE POLICY deposit_receipts_insert ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'deposit-receipts'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

DROP POLICY IF EXISTS deposit_receipts_select_own ON storage.objects;
CREATE POLICY deposit_receipts_select_own ON storage.objects
  FOR SELECT TO authenticated
  USING (
    bucket_id = 'deposit-receipts'
    AND (
      (storage.foldername(name))[1] = auth.uid()::text
      OR public.is_leadership()
    )
  );

-- ─── 5. RPC: aprobar / rechazar transacción (CHIEF/HEAD) ─────

CREATE OR REPLACE FUNCTION public.chief_review_transaction(
  p_tx_id UUID,
  p_action TEXT,
  p_reason TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_tx RECORD;
  v_wallet RECORD;
BEGIN
  IF NOT public.is_chief_role() AND public.get_my_role() <> 'HEAD' THEN
    RAISE EXCEPTION 'Forbidden: CHIEF or HEAD required';
  END IF;

  SELECT * INTO v_tx FROM public.transactions WHERE id = p_tx_id FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Transaction not found';
  END IF;

  IF v_tx.status NOT IN ('pending', 'processing') THEN
    RAISE EXCEPTION 'Transaction not reviewable (status: %)', v_tx.status;
  END IF;

  IF p_action = 'approve' THEN
    IF v_tx.type = 'deposit' THEN
      SELECT * INTO v_wallet FROM public.wallets WHERE id = v_tx.wallet_id FOR UPDATE;
      UPDATE public.wallets SET
        balance = balance + v_tx.net_amount,
        total_deposited = total_deposited + v_tx.net_amount,
        updated_at = NOW()
      WHERE id = v_tx.wallet_id;
    END IF;

    UPDATE public.transactions SET
      status = 'completed',
      approved_by = auth.uid(),
      completed_at = NOW(),
      notes = COALESCE(notes, '') || CASE WHEN p_reason IS NOT NULL THEN ' | ' || p_reason ELSE '' END
    WHERE id = p_tx_id;

    PERFORM public.write_audit_log(
      'TRANSACTION_APPROVED', 'transactions', p_tx_id,
      to_jsonb(v_tx), jsonb_build_object('status', 'completed')
    );

    RETURN jsonb_build_object('success', true, 'status', 'completed');
  ELSIF p_action = 'reject' THEN
  IF v_tx.type = 'withdrawal' AND v_tx.status = 'pending' THEN
      UPDATE public.wallets SET
        balance = balance + v_tx.amount,
        updated_at = NOW()
      WHERE id = v_tx.wallet_id;
    END IF;

    UPDATE public.transactions SET
      status = 'cancelled',
      approved_by = auth.uid(),
      notes = COALESCE(notes, '') || ' | Rechazado: ' || COALESCE(p_reason, 'sin motivo')
    WHERE id = p_tx_id;

    PERFORM public.write_audit_log(
      'TRANSACTION_REJECTED', 'transactions', p_tx_id,
      to_jsonb(v_tx), jsonb_build_object('status', 'cancelled')
    );

    RETURN jsonb_build_object('success', true, 'status', 'cancelled');
  ELSE
    RAISE EXCEPTION 'Invalid action: use approve or reject';
  END IF;
END;
$$;

GRANT EXECUTE ON FUNCTION public.chief_review_transaction(UUID, TEXT, TEXT) TO authenticated;

-- ─── 6. RPCs staff HEAD lite (leads + teams) ─────────────────

CREATE OR REPLACE FUNCTION public.staff_list_leads(
  p_status TEXT DEFAULT NULL,
  p_assigned_to UUID DEFAULT NULL
)
RETURNS SETOF public.leads
LANGUAGE plpgsql
VOLATILE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.is_staff_management() THEN
    RAISE EXCEPTION 'Forbidden: staff management role required';
  END IF;
  SET LOCAL row_security = off;
  RETURN QUERY
  SELECT * FROM public.leads l
  WHERE (p_status IS NULL OR l.status::text = p_status)
    AND (p_assigned_to IS NULL OR l.assigned_to = p_assigned_to)
  ORDER BY l.created_at DESC;
END;
$$;

CREATE OR REPLACE FUNCTION public.staff_get_lead(p_lead_id UUID)
RETURNS public.leads
LANGUAGE plpgsql
VOLATILE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  row public.leads;
BEGIN
  IF NOT public.is_staff_management() THEN
    RAISE EXCEPTION 'Forbidden: staff management role required';
  END IF;
  SET LOCAL row_security = off;
  SELECT * INTO row FROM public.leads WHERE id = p_lead_id;
  RETURN row;
END;
$$;

CREATE OR REPLACE FUNCTION public.staff_assign_lead(
  p_lead_id UUID,
  p_agent_id UUID
)
RETURNS public.leads
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  row public.leads;
BEGIN
  IF NOT public.is_staff_management() THEN
    RAISE EXCEPTION 'Forbidden: staff management role required';
  END IF;
  SET LOCAL row_security = off;
  UPDATE public.leads SET
    assigned_to = p_agent_id,
    last_contact = NOW()
  WHERE id = p_lead_id
  RETURNING * INTO row;
  IF row.id IS NULL THEN
    RAISE EXCEPTION 'Lead not found';
  END IF;
  RETURN row;
END;
$$;

CREATE OR REPLACE FUNCTION public.staff_update_lead(
  p_lead_id UUID,
  p_patch JSONB
)
RETURNS public.leads
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  row public.leads;
  new_status public.lead_status;
BEGIN
  IF NOT public.is_staff_management() THEN
    RAISE EXCEPTION 'Forbidden: staff management role required';
  END IF;
  IF p_patch ? 'status' THEN
    new_status := (p_patch->>'status')::public.lead_status;
  END IF;
  SET LOCAL row_security = off;
  UPDATE public.leads SET
    first_name = COALESCE(p_patch->>'first_name', first_name),
    last_name = COALESCE(p_patch->>'last_name', last_name),
    phone = CASE WHEN p_patch ? 'phone' THEN p_patch->>'phone' ELSE phone END,
    email = CASE WHEN p_patch ? 'email' THEN p_patch->>'email' ELSE email END,
    status = COALESCE(new_status, status),
    interest = CASE WHEN p_patch ? 'interest' THEN p_patch->>'interest' ELSE interest END,
    notes = CASE WHEN p_patch ? 'notes' THEN p_patch->>'notes' ELSE notes END,
    country_code = CASE WHEN p_patch ? 'country_code' THEN (p_patch->>'country_code')::char(2) ELSE country_code END,
    last_contact = NOW()
  WHERE id = p_lead_id
  RETURNING * INTO row;
  IF row.id IS NULL THEN
    RAISE EXCEPTION 'Lead not found';
  END IF;
  RETURN row;
END;
$$;

CREATE OR REPLACE FUNCTION public.staff_list_teams()
RETURNS SETOF public.teams
LANGUAGE plpgsql
VOLATILE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.is_staff_management() THEN
    RAISE EXCEPTION 'Forbidden: staff management role required';
  END IF;
  SET LOCAL row_security = off;
  RETURN QUERY SELECT * FROM public.teams ORDER BY name;
END;
$$;

CREATE OR REPLACE FUNCTION public.staff_get_client_bundle(p_client_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
VOLATILE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_profile public.profiles;
  v_wallet public.wallets;
  v_lead public.leads;
  v_txs JSONB;
  v_calls JSONB;
BEGIN
  IF NOT public.is_staff_management() THEN
    RAISE EXCEPTION 'Forbidden: staff management role required';
  END IF;
  SET LOCAL row_security = off;

  SELECT * INTO v_profile FROM public.profiles WHERE id = p_client_id;
  IF v_profile.id IS NULL THEN
    RAISE EXCEPTION 'Client not found';
  END IF;

  SELECT * INTO v_wallet FROM public.wallets WHERE client_id = p_client_id;
  SELECT * INTO v_lead FROM public.leads WHERE client_user_id = p_client_id ORDER BY created_at DESC LIMIT 1;

  SELECT COALESCE(jsonb_agg(to_jsonb(t) ORDER BY t.created_at DESC), '[]'::jsonb)
  INTO v_txs
  FROM (SELECT * FROM public.transactions WHERE client_id = p_client_id ORDER BY created_at DESC LIMIT 50) t;

  SELECT COALESCE(jsonb_agg(to_jsonb(c) ORDER BY c.started_at DESC), '[]'::jsonb)
  INTO v_calls
  FROM (
    SELECT * FROM public.call_logs
    WHERE lead_id IN (SELECT id FROM public.leads WHERE client_user_id = p_client_id)
    ORDER BY started_at DESC LIMIT 20
  ) c;

  RETURN jsonb_build_object(
    'profile', to_jsonb(v_profile),
    'wallet', to_jsonb(v_wallet),
    'lead', to_jsonb(v_lead),
    'transactions', v_txs,
    'calls', v_calls
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.staff_list_leads(TEXT, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.staff_get_lead(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.staff_assign_lead(UUID, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.staff_update_lead(UUID, JSONB) TO authenticated;
GRANT EXECUTE ON FUNCTION public.staff_list_teams() TO authenticated;
GRANT EXECUTE ON FUNCTION public.staff_get_client_bundle(UUID) TO authenticated;

-- ─── 7. Brackets SL/TP — cierre automático ───────────────────

CREATE OR REPLACE FUNCTION public.close_position_at_price(
  p_position_id UUID,
  p_close_price NUMERIC,
  p_reason TEXT DEFAULT 'manual'
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_pos RECORD;
  v_pnl NUMERIC;
  v_contract NUMERIC := 1;
BEGIN
  SELECT * INTO v_pos
  FROM public.positions
  WHERE id = p_position_id AND status = 'OPEN'
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'not_found');
  END IF;

  IF v_pos.type = 'BUY' THEN
    v_pnl := (p_close_price - v_pos.open_price) * v_pos.volume * v_contract;
  ELSE
    v_pnl := (v_pos.open_price - p_close_price) * v_pos.volume * v_contract;
  END IF;

  UPDATE public.positions SET
    close_price = p_close_price,
    pnl = v_pnl,
    status = 'CLOSED',
    closed_at = NOW()
  WHERE id = p_position_id;

  IF COALESCE(v_pos.account_mode, 'demo') = 'demo' THEN
    UPDATE public.wallets SET
      demo_balance = GREATEST(0, COALESCE(demo_balance, 0) + v_pnl),
      updated_at = NOW()
    WHERE client_id = v_pos.client_id;
  ELSE
    UPDATE public.wallets SET
      balance = GREATEST(0, COALESCE(balance, 0) + v_pnl),
      updated_at = NOW()
    WHERE client_id = v_pos.client_id;
  END IF;

  PERFORM public.write_audit_log(
    'POSITION_CLOSED', 'positions', p_position_id,
    NULL, jsonb_build_object('reason', p_reason, 'pnl', v_pnl, 'close_price', p_close_price)
  );

  RETURN jsonb_build_object('ok', true, 'pnl', v_pnl, 'reason', p_reason);
END;
$$;

CREATE OR REPLACE FUNCTION public.evaluate_position_brackets(
  p_symbol TEXT,
  p_price NUMERIC
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_pos RECORD;
  v_closed INT := 0;
  v_hit BOOLEAN;
BEGIN
  IF p_price IS NULL OR p_price <= 0 THEN
    RETURN jsonb_build_object('closed', 0);
  END IF;

  FOR v_pos IN
    SELECT * FROM public.positions
    WHERE status = 'OPEN'
      AND symbol = p_symbol
      AND (stop_loss IS NOT NULL OR take_profit IS NOT NULL)
  LOOP
    v_hit := false;
    IF v_pos.type = 'BUY' THEN
      IF v_pos.stop_loss IS NOT NULL AND p_price <= v_pos.stop_loss THEN v_hit := true; END IF;
      IF v_pos.take_profit IS NOT NULL AND p_price >= v_pos.take_profit THEN v_hit := true; END IF;
    ELSE
      IF v_pos.stop_loss IS NOT NULL AND p_price >= v_pos.stop_loss THEN v_hit := true; END IF;
      IF v_pos.take_profit IS NOT NULL AND p_price <= v_pos.take_profit THEN v_hit := true; END IF;
    END IF;

    IF v_hit THEN
      PERFORM public.close_position_at_price(v_pos.id, p_price, 'bracket');
      v_closed := v_closed + 1;
    END IF;
  END LOOP;

  RETURN jsonb_build_object('closed', v_closed, 'symbol', p_symbol, 'price', p_price);
END;
$$;

GRANT EXECUTE ON FUNCTION public.close_position_at_price(UUID, NUMERIC, TEXT) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.evaluate_position_brackets(TEXT, NUMERIC) TO authenticated, service_role;

-- ─── 8. create_deposit: gateway manual_bank ──────────────────

CREATE OR REPLACE FUNCTION public.create_deposit_transaction(
  p_amount NUMERIC,
  p_payment_method TEXT,
  p_gateway TEXT,
  p_notes TEXT DEFAULT NULL,
  p_company_bank_id TEXT DEFAULT NULL,
  p_client_bank TEXT DEFAULT NULL,
  p_cci_origin TEXT DEFAULT NULL,
  p_amount_pen_declared NUMERIC DEFAULT NULL,
  p_receipt_path TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID := auth.uid();
  v_wallet_id UUID;
  v_wallet RECORD;
  v_fee NUMERIC;
  v_net NUMERIC;
  v_status public.transaction_status;
  v_tx_id UUID;
  v_processing_count INT;
  v_bank_id TEXT;
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  IF p_amount < 10 OR p_amount > 100000 THEN
    RAISE EXCEPTION 'Amount must be between 10 and 100000 USD';
  END IF;

  v_wallet_id := public.ensure_client_wallet(v_user_id);
  SELECT * INTO v_wallet FROM public.wallets WHERE id = v_wallet_id FOR UPDATE;

  IF v_wallet.is_frozen THEN
    RAISE EXCEPTION 'Wallet is frozen';
  END IF;

  SELECT COUNT(*) INTO v_processing_count
  FROM public.transactions
  WHERE client_id = v_user_id AND type = 'deposit' AND status IN ('pending', 'processing');

  IF v_processing_count >= 5 THEN
    RAISE EXCEPTION 'Too many pending deposits (max 5)';
  END IF;

  IF p_gateway IN ('manual', 'manual_bank') THEN
    v_fee := 0;
    v_status := 'pending';
    v_bank_id := COALESCE(p_company_bank_id, 'latam-usd-default');
  ELSIF p_gateway = 'nowpayments' THEN
    v_fee := ROUND(p_amount * 0.005, 2);
    v_status := 'processing';
    v_bank_id := p_company_bank_id;
  ELSIF p_gateway = 'stripe' THEN
    v_fee := ROUND(p_amount * 0.029 + 0.30, 2);
    v_status := 'processing';
    v_bank_id := p_company_bank_id;
  ELSE
    v_fee := 0;
    v_status := 'pending';
    v_bank_id := p_company_bank_id;
  END IF;

  v_net := ROUND(p_amount - v_fee, 2);

  INSERT INTO public.transactions (
    wallet_id, client_id, type, amount, fee, net_amount,
    payment_method, status, gateway, notes,
    company_bank_id, client_bank, cci_origin, amount_pen_declared, receipt_path
  ) VALUES (
    v_wallet_id, v_user_id, 'deposit', p_amount, v_fee, v_net,
    p_payment_method, v_status, p_gateway, p_notes,
    v_bank_id, p_client_bank, p_cci_origin, p_amount_pen_declared, p_receipt_path
  )
  RETURNING id INTO v_tx_id;

  RETURN jsonb_build_object(
    'transaction_id', v_tx_id,
    'wallet_id', v_wallet_id,
    'net_amount', v_net,
    'status', v_status::text
  );
END;
$$;
