-- ============================================================
-- InvestPRO Lite — HEAD ficha cliente 360°
-- Bloqueo, ajuste saldos, posiciones staff, guards
-- ============================================================

-- ─── 1. Bloqueo en profiles ─────────────────────────────────

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS is_blocked BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS blocked_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS blocked_by UUID REFERENCES public.profiles(id),
  ADD COLUMN IF NOT EXISTS block_reason TEXT;

-- ─── 2. Helpers ─────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.is_head(p_user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE plpgsql
VOLATILE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  ok BOOLEAN;
BEGIN
  IF p_user_id IS NULL THEN
    RETURN false;
  END IF;
  SET LOCAL row_security = off;
  SELECT EXISTS (
    SELECT 1 FROM public.profiles WHERE id = p_user_id AND role = 'HEAD'
  ) INTO ok;
  RETURN COALESCE(ok, false);
END;
$$;

CREATE OR REPLACE FUNCTION public.assert_account_active(p_user_id UUID)
RETURNS VOID
LANGUAGE plpgsql
VOLATILE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF p_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;
  SET LOCAL row_security = off;
  IF EXISTS (
    SELECT 1 FROM public.profiles WHERE id = p_user_id AND is_blocked = true
  ) THEN
    RAISE EXCEPTION 'Account is blocked';
  END IF;
END;
$$;

-- ─── 3. staff_list_client_positions ─────────────────────────

CREATE OR REPLACE FUNCTION public.staff_list_client_positions(
  p_client_id UUID,
  p_status TEXT DEFAULT NULL,
  p_account_mode TEXT DEFAULT NULL,
  p_limit INT DEFAULT 50
)
RETURNS TABLE (
  id UUID,
  symbol TEXT,
  type TEXT,
  volume NUMERIC,
  open_price NUMERIC,
  close_price NUMERIC,
  pnl NUMERIC,
  status TEXT,
  account_mode TEXT,
  opened_at TIMESTAMPTZ,
  closed_at TIMESTAMPTZ
)
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
  SELECT
    p.id,
    p.symbol,
    p.type,
    p.volume,
    p.open_price,
    p.close_price,
    p.pnl,
    p.status,
    p.account_mode,
    p.opened_at,
    p.closed_at
  FROM public.positions p
  WHERE p.client_id = p_client_id
    AND (p_status IS NULL OR p.status = p_status)
    AND (p_account_mode IS NULL OR p.account_mode = p_account_mode)
  ORDER BY p.opened_at DESC
  LIMIT GREATEST(1, LEAST(COALESCE(p_limit, 50), 200));
END;
$$;

-- ─── 4. staff_set_client_wallet_balance (HEAD only) ─────────

CREATE OR REPLACE FUNCTION public.staff_set_client_wallet_balance(
  p_client_id UUID,
  p_book TEXT,
  p_new_balance NUMERIC,
  p_reason TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
VOLATILE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_wallet public.wallets;
  v_old JSONB;
  v_new JSONB;
BEGIN
  IF NOT public.is_head() THEN
    RAISE EXCEPTION 'Forbidden: HEAD role required';
  END IF;

  IF p_client_id IS NULL THEN
    RAISE EXCEPTION 'Client id required';
  END IF;

  IF p_reason IS NULL OR length(trim(p_reason)) < 3 THEN
    RAISE EXCEPTION 'Reason required (min 3 characters)';
  END IF;

  IF p_new_balance IS NULL OR p_new_balance < 0 THEN
    RAISE EXCEPTION 'Balance must be >= 0';
  END IF;

  IF p_book NOT IN ('live', 'demo') THEN
    RAISE EXCEPTION 'Invalid book: use live or demo';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM public.profiles WHERE id = p_client_id AND role = 'CLIENT'
  ) THEN
    RAISE EXCEPTION 'Target is not a client profile';
  END IF;

  PERFORM public.ensure_client_wallet(p_client_id);

  SELECT * INTO v_wallet FROM public.wallets WHERE client_id = p_client_id FOR UPDATE;

  v_old := jsonb_build_object(
    'balance', v_wallet.balance,
    'demo_balance', v_wallet.demo_balance
  );

  IF p_book = 'live' THEN
    UPDATE public.wallets
    SET balance = p_new_balance, updated_at = NOW()
    WHERE client_id = p_client_id
    RETURNING * INTO v_wallet;
  ELSE
    UPDATE public.wallets
    SET demo_balance = p_new_balance, updated_at = NOW()
    WHERE client_id = p_client_id
    RETURNING * INTO v_wallet;
  END IF;

  v_new := jsonb_build_object(
    'balance', v_wallet.balance,
    'demo_balance', v_wallet.demo_balance,
    'book', p_book,
    'reason', p_reason
  );

  PERFORM public.write_audit_log(
    'WALLET_BALANCE_SET', 'wallets', v_wallet.id, v_old, v_new
  );

  RETURN to_jsonb(v_wallet);
END;
$$;

-- ─── 5. staff_set_client_blocked (HEAD only) ────────────────

CREATE OR REPLACE FUNCTION public.staff_set_client_blocked(
  p_client_id UUID,
  p_blocked BOOLEAN,
  p_reason TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
VOLATILE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_profile public.profiles;
  v_wallet public.wallets;
  v_old JSONB;
BEGIN
  IF NOT public.is_head() THEN
    RAISE EXCEPTION 'Forbidden: HEAD role required';
  END IF;

  IF p_client_id IS NULL THEN
    RAISE EXCEPTION 'Client id required';
  END IF;

  IF p_blocked AND (p_reason IS NULL OR length(trim(p_reason)) < 3) THEN
    RAISE EXCEPTION 'Reason required when blocking (min 3 characters)';
  END IF;

  IF p_client_id = auth.uid() THEN
    RAISE EXCEPTION 'Cannot block your own account';
  END IF;

  SET LOCAL row_security = off;

  SELECT * INTO v_profile FROM public.profiles WHERE id = p_client_id;
  IF v_profile.id IS NULL THEN
    RAISE EXCEPTION 'Profile not found';
  END IF;

  IF v_profile.role = 'HEAD' THEN
    RAISE EXCEPTION 'Cannot block HEAD accounts';
  END IF;

  v_old := jsonb_build_object(
    'is_blocked', v_profile.is_blocked,
    'block_reason', v_profile.block_reason
  );

  UPDATE public.profiles SET
    is_blocked = p_blocked,
    blocked_at = CASE WHEN p_blocked THEN NOW() ELSE NULL END,
    blocked_by = CASE WHEN p_blocked THEN auth.uid() ELSE NULL END,
    block_reason = CASE WHEN p_blocked THEN trim(p_reason) ELSE NULL END,
    updated_at = NOW()
  WHERE id = p_client_id
  RETURNING * INTO v_profile;

  PERFORM public.ensure_client_wallet(p_client_id);

  UPDATE public.wallets SET
    is_frozen = p_blocked,
    updated_at = NOW()
  WHERE client_id = p_client_id
  RETURNING * INTO v_wallet;

  PERFORM public.write_audit_log(
    CASE WHEN p_blocked THEN 'CLIENT_BLOCKED' ELSE 'CLIENT_UNBLOCKED' END,
    'profiles',
    p_client_id,
    v_old,
    jsonb_build_object(
      'is_blocked', v_profile.is_blocked,
      'is_frozen', v_wallet.is_frozen,
      'block_reason', v_profile.block_reason
    )
  );

  RETURN jsonb_build_object(
    'profile', to_jsonb(v_profile),
    'wallet', to_jsonb(v_wallet)
  );
END;
$$;

-- ─── 6. staff_log_auth_admin_action (HEAD audit from Edge) ──

CREATE OR REPLACE FUNCTION public.staff_log_auth_admin_action(
  p_client_id UUID,
  p_action TEXT,
  p_details JSONB DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
VOLATILE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.is_head() THEN
    RAISE EXCEPTION 'Forbidden: HEAD role required';
  END IF;
  PERFORM public.write_audit_log(
    p_action, 'auth.users', p_client_id, NULL, COALESCE(p_details, '{}'::jsonb)
  );
END;
$$;

-- ─── 7. staff_get_client_bundle (extendido) ─────────────────

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
  v_open_count INT;
  v_closed_count INT;
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

  SELECT COUNT(*) INTO v_open_count
  FROM public.positions WHERE client_id = p_client_id AND status = 'OPEN';

  SELECT COUNT(*) INTO v_closed_count
  FROM public.positions WHERE client_id = p_client_id AND status = 'CLOSED';

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
    'calls', v_calls,
    'positions_open_count', v_open_count,
    'positions_closed_count', v_closed_count
  );
END;
$$;

-- ─── 8. Guards: cuenta bloqueada en RPCs cliente ────────────

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

  PERFORM public.assert_account_active(v_user_id);

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

  PERFORM public.assert_account_active(v_user_id);

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

CREATE OR REPLACE FUNCTION public.request_withdrawal(
  p_amount NUMERIC,
  p_payment_method TEXT,
  p_crypto_address TEXT DEFAULT NULL,
  p_crypto_network TEXT DEFAULT NULL,
  p_notes TEXT DEFAULT NULL,
  p_withdrawal_bank TEXT DEFAULT NULL,
  p_withdrawal_cci TEXT DEFAULT NULL,
  p_withdrawal_holder TEXT DEFAULT NULL
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
  v_tx_id UUID;
  v_profile public.client_payout_profiles;
  v_bank TEXT;
  v_cci TEXT;
  v_holder TEXT;
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  PERFORM public.assert_account_active(v_user_id);

  IF p_amount < 50 OR p_amount > 100000 THEN
    RAISE EXCEPTION 'Withdrawal amount must be between 50 and 100000 USD';
  END IF;

  IF p_payment_method = 'bank_transfer' THEN
    SELECT * INTO v_profile
    FROM public.client_payout_profiles
    WHERE client_id = v_user_id AND status = 'approved';

    IF NOT FOUND THEN
      RAISE EXCEPTION 'Debes tener un perfil de retiro aprobado. Completa Mi perfil y espera la verificación del CHIEF.';
    END IF;

    v_bank := COALESCE(NULLIF(trim(p_withdrawal_bank), ''), v_profile.bank_name);
    v_cci := COALESCE(NULLIF(trim(p_withdrawal_cci), ''), v_profile.bank_cci);
    v_holder := COALESCE(NULLIF(trim(p_withdrawal_holder), ''), v_profile.account_holder);

    IF v_cci IS NULL OR length(trim(v_cci)) < 8 THEN
      RAISE EXCEPTION 'CCI de destino requerido';
    END IF;
    IF v_holder IS NULL OR length(trim(v_holder)) < 3 THEN
      RAISE EXCEPTION 'Titular de cuenta requerido';
    END IF;
  ELSE
    v_bank := p_withdrawal_bank;
    v_cci := p_withdrawal_cci;
    v_holder := p_withdrawal_holder;
  END IF;

  v_wallet_id := public.ensure_client_wallet(v_user_id);
  SELECT * INTO v_wallet FROM public.wallets WHERE id = v_wallet_id FOR UPDATE;

  IF v_wallet.is_frozen THEN
    RAISE EXCEPTION 'Wallet is frozen';
  END IF;

  IF v_wallet.balance < p_amount THEN
    RAISE EXCEPTION 'Insufficient balance';
  END IF;

  UPDATE public.wallets SET
    balance = balance - p_amount,
    updated_at = NOW()
  WHERE id = v_wallet_id;

  INSERT INTO public.transactions (
    wallet_id, client_id, type, amount, fee, net_amount,
    payment_method, status, gateway,
    crypto_address, crypto_network, notes,
    withdrawal_bank, withdrawal_cci, withdrawal_holder
  ) VALUES (
    v_wallet_id, v_user_id, 'withdrawal', p_amount, 0, p_amount,
    p_payment_method, 'pending', 'manual',
    p_crypto_address, p_crypto_network, p_notes,
    v_bank, v_cci, v_holder
  )
  RETURNING id INTO v_tx_id;

  RETURN jsonb_build_object(
    'transaction_id', v_tx_id,
    'wallet_id', v_wallet_id,
    'new_balance', v_wallet.balance - p_amount
  );
END;
$$;

-- ─── 9. GRANTs ──────────────────────────────────────────────

GRANT EXECUTE ON FUNCTION public.is_head(UUID) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.assert_account_active(UUID) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.staff_list_client_positions(UUID, TEXT, TEXT, INT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.staff_set_client_wallet_balance(UUID, TEXT, NUMERIC, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.staff_set_client_blocked(UUID, BOOLEAN, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.staff_log_auth_admin_action(UUID, TEXT, JSONB) TO authenticated;
