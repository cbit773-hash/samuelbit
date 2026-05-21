-- ============================================================
-- INVESPRO — EXTENSIÓN: Wallet y Pasarela de Pagos
-- Ejecutar en Supabase SQL Editor DESPUÉS del schema.sql
-- ============================================================

-- ─── Enum de estado de transacción ──────────────────────────
DO $$ BEGIN
  CREATE TYPE public.transaction_status AS ENUM ('pending', 'processing', 'completed', 'failed', 'cancelled');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.transaction_type AS ENUM ('deposit', 'withdrawal');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.payment_method AS ENUM ('card', 'bank_transfer', 'crypto_btc', 'crypto_eth', 'crypto_usdt', 'crypto_usdc');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ─── Tabla: Wallets (Billetera de cada cliente) ─────────────
CREATE TABLE IF NOT EXISTS public.wallets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL UNIQUE,
  balance DECIMAL(14,2) NOT NULL DEFAULT 0.00,
  currency VARCHAR(3) NOT NULL DEFAULT 'USD',
  total_deposited DECIMAL(14,2) NOT NULL DEFAULT 0.00,
  total_withdrawn DECIMAL(14,2) NOT NULL DEFAULT 0.00,
  is_frozen BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Tabla: Transacciones (Historial de movimientos) ────────
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_id UUID NOT NULL REFERENCES public.wallets(id),
  client_id UUID NOT NULL,
  type public.transaction_type NOT NULL,
  amount DECIMAL(14,2) NOT NULL,
  fee DECIMAL(14,2) NOT NULL DEFAULT 0.00,
  net_amount DECIMAL(14,2) NOT NULL,
  currency VARCHAR(3) NOT NULL DEFAULT 'USD',
  payment_method public.payment_method NOT NULL,
  status public.transaction_status NOT NULL DEFAULT 'pending',
  -- Payment gateway references
  external_id VARCHAR(255),         -- Stripe payment_intent ID o NOWPayments invoice ID
  external_url VARCHAR(500),        -- URL de pago (checkout link)
  gateway VARCHAR(50),              -- 'stripe', 'nowpayments', 'manual'
  -- Crypto-specific
  crypto_address VARCHAR(255),      -- Dirección de depósito generada
  crypto_txid VARCHAR(255),         -- TX hash de la blockchain
  crypto_network VARCHAR(50),       -- 'BTC', 'ETH', 'TRC20', etc.
  -- Metadata
  notes TEXT,
  approved_by UUID,                 -- Quién aprobó (para depósitos manuales)
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- ─── Tabla: Crypto Addresses (Direcciones reutilizables) ────
CREATE TABLE IF NOT EXISTS public.crypto_addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL,
  network VARCHAR(50) NOT NULL,     -- 'BTC', 'ETH', 'TRC20'
  address VARCHAR(255) NOT NULL,
  label VARCHAR(100),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Índices ─────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_transactions_client ON public.transactions(client_id);
CREATE INDEX IF NOT EXISTS idx_transactions_wallet ON public.transactions(wallet_id);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON public.transactions(status);
CREATE INDEX IF NOT EXISTS idx_crypto_addresses_client ON public.crypto_addresses(client_id);

-- NOTA: "profiles" es una VIEW en Supabase, no se pueden crear triggers.
-- Las wallets se crean on-demand desde el servicio wallet.service.ts
-- cuando el cliente accede por primera vez a su billetera.

-- ─── RLS ─────────────────────────────────────────────────────
ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crypto_addresses ENABLE ROW LEVEL SECURITY;

-- Wallets: el cliente solo ve su propia billetera
CREATE POLICY wallet_select ON public.wallets FOR SELECT USING (
  client_id = auth.uid() OR
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('HEAD', 'CHIEF'))
);

-- Transactions: el cliente ve sus propias transacciones, HEAD/CHIEF ven todas
CREATE POLICY transactions_select ON public.transactions FOR SELECT USING (
  client_id = auth.uid() OR
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('HEAD', 'CHIEF'))
);

CREATE POLICY transactions_insert ON public.transactions FOR INSERT WITH CHECK (
  client_id = auth.uid() OR
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('HEAD', 'CHIEF', 'AGENT'))
);

-- Crypto addresses: el cliente ve sus propias direcciones
CREATE POLICY crypto_addresses_select ON public.crypto_addresses FOR SELECT USING (
  client_id = auth.uid() OR
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('HEAD', 'CHIEF'))
);

-- ─── Seed: Crear wallets para clientes existentes ───────────
INSERT INTO public.wallets (client_id, balance, total_deposited)
SELECT id, 0.00, 0.00 FROM public.profiles WHERE role = 'CLIENT'
ON CONFLICT (client_id) DO NOTHING;

-- ============================================================
-- FIN — Ejecutar en Supabase SQL Editor
-- ============================================================
