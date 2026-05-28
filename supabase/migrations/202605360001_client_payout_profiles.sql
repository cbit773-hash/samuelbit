-- ============================================================
-- INVESPRO — Perfil de retiro cliente (CCI + crypto) + aprobación CHIEF
-- ============================================================

CREATE TABLE IF NOT EXISTS public.client_payout_profiles (
  client_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  bank_name TEXT,
  bank_cci TEXT,
  account_holder TEXT,
  crypto_address TEXT,
  crypto_network TEXT NOT NULL DEFAULT 'TRC20',
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'approved', 'rejected')),
  previous_snapshot JSONB,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  rejection_reason TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_client_payout_profiles_status
  ON public.client_payout_profiles (status, submitted_at DESC);

ALTER TABLE public.client_payout_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS payout_profiles_own_select ON public.client_payout_profiles;
CREATE POLICY payout_profiles_own_select ON public.client_payout_profiles
  FOR SELECT TO authenticated
  USING (client_id = auth.uid());

-- Writes only via RPC (SECURITY DEFINER)

CREATE OR REPLACE FUNCTION public.is_chief_role()
RETURNS BOOLEAN
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN public.get_my_role() = 'CHIEF';
END;
$$;

CREATE OR REPLACE FUNCTION public.is_payout_staff_reader()
RETURNS BOOLEAN
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN public.get_my_role() IN ('CHIEF', 'HEAD', 'MANAGER');
END;
$$;

CREATE OR REPLACE FUNCTION public.get_my_payout_profile()
RETURNS JSONB
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_uid UUID := auth.uid();
  row public.client_payout_profiles;
BEGIN
  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  SELECT * INTO row FROM public.client_payout_profiles WHERE client_id = v_uid;
  IF NOT FOUND THEN
    RETURN NULL;
  END IF;

  RETURN to_jsonb(row);
END;
$$;

CREATE OR REPLACE FUNCTION public.submit_my_payout_profile(p_payload JSONB)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_uid UUID := auth.uid();
  v_bank TEXT;
  v_cci TEXT;
  v_holder TEXT;
  v_crypto TEXT;
  v_network TEXT;
  v_existing public.client_payout_profiles;
  v_staff RECORD;
  v_name TEXT;
BEGIN
  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  v_bank := NULLIF(trim(p_payload->>'bank_name'), '');
  v_cci := NULLIF(trim(p_payload->>'bank_cci'), '');
  v_holder := NULLIF(trim(p_payload->>'account_holder'), '');
  v_crypto := NULLIF(trim(p_payload->>'crypto_address'), '');
  v_network := COALESCE(NULLIF(trim(p_payload->>'crypto_network'), ''), 'TRC20');

  IF v_cci IS NULL OR length(v_cci) < 8 THEN
    RAISE EXCEPTION 'CCI inválido (mínimo 8 caracteres)';
  END IF;
  IF v_holder IS NULL OR length(v_holder) < 3 THEN
    RAISE EXCEPTION 'Titular de cuenta requerido (mínimo 3 caracteres)';
  END IF;
  IF v_bank IS NULL OR length(v_bank) < 2 THEN
    RAISE EXCEPTION 'Banco requerido';
  END IF;

  SELECT * INTO v_existing FROM public.client_payout_profiles WHERE client_id = v_uid;

  INSERT INTO public.client_payout_profiles (
    client_id, bank_name, bank_cci, account_holder, crypto_address, crypto_network,
    status, previous_snapshot, submitted_at, reviewed_at, reviewed_by, rejection_reason, updated_at
  ) VALUES (
    v_uid,
    v_bank,
    v_cci,
    v_holder,
    v_crypto,
    v_network,
    'pending',
    CASE
      WHEN v_existing.client_id IS NOT NULL AND v_existing.status = 'approved' THEN to_jsonb(v_existing)
      ELSE NULL
    END,
    NOW(),
    NULL,
    NULL,
    NULL,
    NOW()
  )
  ON CONFLICT (client_id) DO UPDATE SET
    bank_name = EXCLUDED.bank_name,
    bank_cci = EXCLUDED.bank_cci,
    account_holder = EXCLUDED.account_holder,
    crypto_address = EXCLUDED.crypto_address,
    crypto_network = EXCLUDED.crypto_network,
    status = 'pending',
    previous_snapshot = EXCLUDED.previous_snapshot,
    submitted_at = NOW(),
    reviewed_at = NULL,
    reviewed_by = NULL,
    rejection_reason = NULL,
    updated_at = NOW();

  SELECT full_name INTO v_name FROM public.profiles WHERE id = v_uid;

  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'notifications'
  ) THEN
    FOR v_staff IN
      SELECT id FROM public.profiles WHERE role IN ('CHIEF', 'HEAD')
    LOOP
      INSERT INTO public.notifications (user_id, type, title, body, metadata)
      VALUES (
        v_staff.id,
        'system',
        'Nuevo perfil de retiro',
        COALESCE(v_name, 'Cliente') || ' envió datos bancarios para revisión.',
        jsonb_build_object(
          'client_id', v_uid,
          'link', '/dashboard/chief?task=payout-profiles'
        )
      );
    END LOOP;
  END IF;

  RETURN public.get_my_payout_profile();
END;
$$;

CREATE OR REPLACE FUNCTION public.chief_list_pending_payout_profiles()
RETURNS JSONB
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_result JSONB;
BEGIN
  IF NOT public.is_payout_staff_reader() THEN
    RAISE EXCEPTION 'Forbidden: CHIEF, HEAD or MANAGER required';
  END IF;

  SET LOCAL row_security = off;

  SELECT COALESCE(jsonb_agg(row ORDER BY (row->>'submitted_at') DESC), '[]'::jsonb)
  INTO v_result
  FROM (
    SELECT jsonb_build_object(
      'client_id', cpp.client_id,
      'bank_name', cpp.bank_name,
      'bank_cci', cpp.bank_cci,
      'account_holder', cpp.account_holder,
      'crypto_address', cpp.crypto_address,
      'crypto_network', cpp.crypto_network,
      'status', cpp.status,
      'submitted_at', cpp.submitted_at,
      'rejection_reason', cpp.rejection_reason,
      'previous_snapshot', cpp.previous_snapshot,
      'email', p.email,
      'full_name', p.full_name,
      'phone', p.phone,
      'kyc_status', p.kyc_status
    ) AS row
    FROM public.client_payout_profiles cpp
    JOIN public.profiles p ON p.id = cpp.client_id
    WHERE cpp.status = 'pending'
  ) sub;

  RETURN v_result;
END;
$$;

CREATE OR REPLACE FUNCTION public.chief_review_payout_profile(
  p_client_id UUID,
  p_decision TEXT,
  p_reason TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_reviewer UUID := auth.uid();
  v_row public.client_payout_profiles;
  v_title TEXT;
  v_body TEXT;
BEGIN
  IF NOT public.is_chief_role() THEN
    RAISE EXCEPTION 'Forbidden: CHIEF role required';
  END IF;

  IF p_decision NOT IN ('approved', 'rejected') THEN
    RAISE EXCEPTION 'Invalid decision';
  END IF;

  IF p_decision = 'rejected' AND (p_reason IS NULL OR length(trim(p_reason)) < 3) THEN
    RAISE EXCEPTION 'Rejection reason required';
  END IF;

  UPDATE public.client_payout_profiles
  SET
    status = p_decision,
    reviewed_at = NOW(),
    reviewed_by = v_reviewer,
    rejection_reason = CASE WHEN p_decision = 'rejected' THEN trim(p_reason) ELSE NULL END,
    updated_at = NOW()
  WHERE client_id = p_client_id AND status = 'pending'
  RETURNING * INTO v_row;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'No pending payout profile for this client';
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'notifications'
  ) THEN
    IF p_decision = 'approved' THEN
      v_title := 'Perfil de retiro aprobado';
      v_body := 'Tus datos bancarios fueron verificados. Ya puedes solicitar retiros.';
    ELSE
      v_title := 'Perfil de retiro rechazado';
      v_body := COALESCE(trim(p_reason), 'Corrige los datos y envía de nuevo.');
    END IF;

    INSERT INTO public.notifications (user_id, type, title, body, metadata)
    VALUES (
      p_client_id,
      'system',
      v_title,
      v_body,
      jsonb_build_object('link', '/dashboard/account?tab=perfil')
    );
  END IF;

  RETURN to_jsonb(v_row);
END;
$$;

-- ─── request_withdrawal: exigir perfil approved para retiro bancario ───

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

GRANT EXECUTE ON FUNCTION public.get_my_payout_profile() TO authenticated;
GRANT EXECUTE ON FUNCTION public.submit_my_payout_profile(JSONB) TO authenticated;
GRANT EXECUTE ON FUNCTION public.chief_list_pending_payout_profiles() TO authenticated;
GRANT EXECUTE ON FUNCTION public.chief_review_payout_profile(UUID, TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.request_withdrawal(
  NUMERIC, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT
) TO authenticated, service_role;
