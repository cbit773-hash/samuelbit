-- ============================================================
-- INVESPRO — ESQUEMA COMPLETO DE BASE DE DATOS v1.0
-- Ejecutar en: Supabase → SQL Editor → New Query → Run
-- ============================================================


-- ============================================================
-- PARTE 1: TIPOS ENUM
-- ============================================================

-- Jerarquía corporativa de 7 niveles
CREATE TYPE user_role AS ENUM (
  'CLIENT',        -- Inversor final (terminal de trading)
  'AGENT',         -- Agente de ventas (Dialer)
  'TEAM_LEADER',   -- Líder de mesa de agentes
  'FLOOR_MANAGER', -- Responsable de 2-3 mesas
  'MANAGER',       -- Capacitación y metas globales
  'CHIEF',         -- Asistente del Head (Depósitos y Leads)
  'HEAD'           -- Súper Admin (Control total)
);

-- Estado del lead en el CRM
CREATE TYPE lead_status AS ENUM (
  'Nuevo',
  'Contactado',
  'En seguimiento',
  'Cerca de cierre',
  'No contesta',
  'Cerrado (FTD)',
  'Descartado'
);

-- Estado del depósito
CREATE TYPE deposit_status AS ENUM (
  'Verificando',
  'Aprobado',
  'Rechazado'
);

-- Tipo de depósito
CREATE TYPE deposit_type AS ENUM (
  'FTD',        -- First Time Deposit (conversión nueva)
  'RETENCION'   -- Retención / Upsell
);


-- ============================================================
-- PARTE 2: TABLAS PRINCIPALES
-- ============================================================

-- 2.1 TABLA: Perfiles de Usuario (Extiende auth.users de Supabase Auth)
CREATE TABLE public.profiles (
  id           UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email        TEXT UNIQUE NOT NULL,
  full_name    TEXT NOT NULL,
  phone        TEXT NULL,
  role         user_role DEFAULT 'CLIENT' NOT NULL,
  team_id      UUID NULL,                    -- Mesa a la que pertenece (Agentes/TL)
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

-- 2.2 TABLA: Mesas de Trabajo (Equipos de Agentes)
CREATE TABLE public.teams (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name         TEXT NOT NULL,                -- Ej: "Mesa Alpha", "Mesa Beta"
  floor_manager_id UUID REFERENCES public.profiles(id) NULL,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- Añadir FK de team a profiles ahora que teams existe
ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_team_id_fkey
  FOREIGN KEY (team_id) REFERENCES public.teams(id);

-- 2.3 TABLA: Leads / Prospectos del CRM
CREATE TABLE public.leads (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name   TEXT NOT NULL,
  last_name    TEXT NOT NULL,
  phone        TEXT NOT NULL,
  email        TEXT NULL,
  country      TEXT NULL,
  status       lead_status DEFAULT 'Nuevo' NOT NULL,
  interest     TEXT DEFAULT 'Desconocido',   -- Crypto, Forex, Acciones
  notes        TEXT NULL,                    -- Notas del agente
  assigned_to  UUID REFERENCES public.profiles(id) NULL,  -- Agente asignado
  created_by   UUID REFERENCES public.profiles(id) NULL,  -- Chief/Head que inyectó el lead
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  last_contact TIMESTAMPTZ NULL
);

-- 2.4 TABLA: Depósitos (FTD y Retención)
CREATE TABLE public.deposits (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id    UUID REFERENCES public.profiles(id) NOT NULL,  -- El cliente que deposita
  agent_id     UUID REFERENCES public.profiles(id) NOT NULL,  -- El agente que cerró
  amount       DECIMAL(15,2) NOT NULL,
  currency     TEXT DEFAULT 'USD' NOT NULL,
  type         deposit_type NOT NULL,
  status       deposit_status DEFAULT 'Verificando' NOT NULL,
  notes        TEXT NULL,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- 2.5 TABLA: Posiciones de Trading (Cuenta del Cliente)
CREATE TABLE public.positions (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id    UUID REFERENCES public.profiles(id) NOT NULL,
  symbol       TEXT NOT NULL,               -- 'BTCUSDT', 'EURUSD'
  type         TEXT NOT NULL,               -- 'BUY' | 'SELL'
  volume       DECIMAL(10,4) NOT NULL,
  open_price   DECIMAL(18,8) NOT NULL,
  close_price  DECIMAL(18,8) NULL,          -- NULL = posición abierta
  stop_loss    DECIMAL(18,8) NULL,
  take_profit  DECIMAL(18,8) NULL,
  pnl          DECIMAL(15,2) NULL,
  status       TEXT DEFAULT 'OPEN',         -- 'OPEN' | 'CLOSED'
  opened_at    TIMESTAMPTZ DEFAULT NOW(),
  closed_at    TIMESTAMPTZ NULL
);


-- ============================================================
-- PARTE 3: ROW LEVEL SECURITY (RLS)
-- ============================================================

CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS TEXT
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE r TEXT;
BEGIN
  SET LOCAL row_security = off;
  SELECT role::text INTO r FROM public.profiles WHERE id = auth.uid();
  RETURN r;
END;
$$;

ALTER TABLE public.profiles  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deposits  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.positions ENABLE ROW LEVEL SECURITY;

-- ── PROFILES ──────────────────────────────────────────────
-- Solo fila propia. Staff lista/edita vía RPCs (migración 202605310001).
CREATE POLICY profiles_own_row
  ON public.profiles FOR ALL TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- ── LEADS ──────────────────────────────────────────────────
-- Agentes solo ven sus leads asignados
CREATE POLICY "agente_ve_sus_leads"
  ON public.leads FOR SELECT
  USING (assigned_to = auth.uid());

-- Floor Manager y superiores ven todos los leads
CREATE POLICY "liderazgo_ve_todos_leads"
  ON public.leads FOR ALL
  USING (
    public.get_my_role() IN ('HEAD', 'CHIEF', 'MANAGER', 'FLOOR_MANAGER', 'TEAM_LEADER')
  );

-- ── DEPOSITS ───────────────────────────────────────────────
-- El cliente ve sus propios depósitos
CREATE POLICY "cliente_ve_sus_depositos"
  ON public.deposits FOR SELECT
  USING (client_id = auth.uid());

-- El agente ve los depósitos que él cerró
CREATE POLICY "agente_ve_sus_cierres"
  ON public.deposits FOR SELECT
  USING (agent_id = auth.uid());

-- Alta Dirección ve y gestiona todos los depósitos
CREATE POLICY "liderazgo_gestiona_depositos"
  ON public.deposits FOR ALL
  USING (public.get_my_role() IN ('HEAD', 'CHIEF', 'MANAGER'));

-- ── POSITIONS ──────────────────────────────────────────────
-- El cliente ve solo sus posiciones de trading
CREATE POLICY "cliente_ve_sus_posiciones"
  ON public.positions FOR ALL
  USING (client_id = auth.uid());


-- ============================================================
-- PARTE 4: FUNCIONES Y TRIGGERS AUTOMÁTICOS
-- ============================================================

-- Auto-crear perfil cuando un usuario se registra con Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.email, ''),
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Usuario InvestPRO'),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'CLIENT')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'handle_new_user error: %', SQLERRM;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Auto-actualizar updated_at en profiles
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at();


-- ============================================================
-- PARTE 5: DATOS SEMILLA (SEED DATA para pruebas)
-- ============================================================

-- Insertar mesas de trabajo
INSERT INTO public.teams (id, name) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Mesa Alpha'),
  ('22222222-2222-2222-2222-222222222222', 'Mesa Beta'),
  ('33333333-3333-3333-3333-333333333333', 'Mesa Gamma');

-- ============================================================
-- FIN DEL SCRIPT
-- ============================================================

