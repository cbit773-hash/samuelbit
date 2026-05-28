-- InvestPRO — Perú: cuentas bancarias empresa + campos depósito/retiro local

CREATE TABLE IF NOT EXISTS public.company_bank_accounts (
  id TEXT PRIMARY KEY,
  bank_name TEXT NOT NULL,
  currency VARCHAR(3) NOT NULL CHECK (currency IN ('PEN', 'USD')),
  cci TEXT NOT NULL,
  holder TEXT NOT NULL,
  ruc TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.company_bank_accounts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS company_bank_accounts_read ON public.company_bank_accounts;
CREATE POLICY company_bank_accounts_read ON public.company_bank_accounts
  FOR SELECT TO authenticated
  USING (is_active = true);

DROP POLICY IF EXISTS company_bank_accounts_staff ON public.company_bank_accounts;
CREATE POLICY company_bank_accounts_staff ON public.company_bank_accounts
  FOR ALL TO authenticated
  USING (public.is_leadership())
  WITH CHECK (public.is_leadership());

INSERT INTO public.company_bank_accounts (id, bank_name, currency, cci, holder, ruc, sort_order)
VALUES
  ('bcp-pen', 'BCP', 'PEN', '002-000-00XXXXXXXXXX-00', 'InvestPRO SAC', '20XXXXXXXXX', 1),
  ('interbank-usd', 'Interbank', 'USD', '003-000-00XXXXXXXXXX-00', 'InvestPRO SAC', '20XXXXXXXXX', 2)
ON CONFLICT (id) DO NOTHING;

ALTER TABLE public.transactions
  ADD COLUMN IF NOT EXISTS company_bank_id TEXT REFERENCES public.company_bank_accounts(id),
  ADD COLUMN IF NOT EXISTS client_bank TEXT,
  ADD COLUMN IF NOT EXISTS cci_origin TEXT,
  ADD COLUMN IF NOT EXISTS withdrawal_bank TEXT,
  ADD COLUMN IF NOT EXISTS withdrawal_cci TEXT,
  ADD COLUMN IF NOT EXISTS withdrawal_holder TEXT,
  ADD COLUMN IF NOT EXISTS amount_pen_declared NUMERIC(14, 2),
  ADD COLUMN IF NOT EXISTS receipt_path TEXT;

-- Storage bucket para vouchers (crear en dashboard si no existe)
INSERT INTO storage.buckets (id, name, public)
VALUES ('deposit-receipts', 'deposit-receipts', false)
ON CONFLICT (id) DO NOTHING;

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
  WHERE client_id = v_user_id
    AND type = 'deposit'
    AND status IN ('pending', 'processing');

  IF v_processing_count >= 5 THEN
    RAISE EXCEPTION 'Too many pending deposits (max 5)';
  END IF;

  IF p_gateway = 'nowpayments' THEN
    v_fee := ROUND(p_amount * 0.005, 2);
  ELSIF p_gateway = 'stripe' THEN
    v_fee := ROUND(p_amount * 0.029 + 0.30, 2);
  ELSE
    v_fee := 0;
  END IF;

  v_net := ROUND(p_amount - v_fee, 2);

  IF p_gateway = 'manual' THEN
    v_status := 'pending';
  ELSE
    v_status := 'processing';
  END IF;

  INSERT INTO public.transactions (
    wallet_id, client_id, type, amount, fee, net_amount,
    payment_method, status, gateway, notes,
    company_bank_id, client_bank, cci_origin, amount_pen_declared, receipt_path
  ) VALUES (
    v_wallet_id, v_user_id, 'deposit', p_amount, v_fee, v_net,
    p_payment_method, v_status, p_gateway, p_notes,
    p_company_bank_id, p_client_bank, p_cci_origin, p_amount_pen_declared, p_receipt_path
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
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  IF p_amount < 50 OR p_amount > 100000 THEN
    RAISE EXCEPTION 'Withdrawal amount must be between 50 and 100000 USD';
  END IF;

  IF p_payment_method = 'bank_transfer' THEN
    IF p_withdrawal_cci IS NULL OR length(trim(p_withdrawal_cci)) < 8 THEN
      RAISE EXCEPTION 'CCI de destino requerido';
    END IF;
    IF p_withdrawal_holder IS NULL OR length(trim(p_withdrawal_holder)) < 3 THEN
      RAISE EXCEPTION 'Titular de cuenta requerido';
    END IF;
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
    p_withdrawal_bank, p_withdrawal_cci, p_withdrawal_holder
  )
  RETURNING id INTO v_tx_id;

  RETURN jsonb_build_object(
    'transaction_id', v_tx_id,
    'wallet_id', v_wallet_id,
    'new_balance', v_wallet.balance - p_amount
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.create_deposit_transaction(
  NUMERIC, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, NUMERIC, TEXT
) TO authenticated, service_role;

GRANT EXECUTE ON FUNCTION public.request_withdrawal(
  NUMERIC, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT
) TO authenticated, service_role;
