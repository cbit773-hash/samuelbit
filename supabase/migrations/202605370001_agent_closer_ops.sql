-- ============================================================
-- INVESPRO — Operaciones AGENT (Closer): presencia, callbacks, SOS, leaderboard
-- ============================================================

-- ─── Presencia laboral ───────────────────────────────────────
DO $$ BEGIN
  CREATE TYPE public.agent_presence AS ENUM (
    'ready', 'in_call', 'wrap_up', 'break', 'restroom', 'offline'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS work_status public.agent_presence NOT NULL DEFAULT 'offline',
  ADD COLUMN IF NOT EXISTS work_status_since TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS work_status_note TEXT;

-- ─── Atribución agente en transacciones ──────────────────────
ALTER TABLE public.transactions
  ADD COLUMN IF NOT EXISTS referred_by_agent_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_transactions_referred_agent
  ON public.transactions (referred_by_agent_id)
  WHERE referred_by_agent_id IS NOT NULL;

-- ─── Callbacks programados ───────────────────────────────────
CREATE TABLE IF NOT EXISTS public.lead_callbacks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  agent_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  scheduled_at TIMESTAMPTZ NOT NULL,
  timezone TEXT NOT NULL DEFAULT 'America/Lima',
  reason TEXT,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'completed', 'cancelled', 'missed')),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_lead_callbacks_agent_scheduled
  ON public.lead_callbacks (agent_id, scheduled_at)
  WHERE status = 'pending';

ALTER TABLE public.lead_callbacks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS lead_callbacks_agent_all ON public.lead_callbacks;
CREATE POLICY lead_callbacks_agent_all ON public.lead_callbacks
  FOR ALL
  USING (agent_id = auth.uid())
  WITH CHECK (agent_id = auth.uid());

DROP POLICY IF EXISTS lead_callbacks_leadership_select ON public.lead_callbacks;
CREATE POLICY lead_callbacks_leadership_select ON public.lead_callbacks
  FOR SELECT
  USING (
    public.get_my_role() IN ('HEAD', 'CHIEF', 'MANAGER', 'FLOOR_MANAGER', 'TEAM_LEADER')
  );

-- ─── Alertas SOS ─────────────────────────────────────────────
DO $$ BEGIN
  CREATE TYPE public.sos_status AS ENUM ('open', 'acknowledged', 'resolved', 'cancelled');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS public.sos_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  lead_id UUID REFERENCES public.leads(id) ON DELETE SET NULL,
  call_log_id UUID REFERENCES public.call_logs(id) ON DELETE SET NULL,
  floor_manager_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  team_id UUID REFERENCES public.teams(id) ON DELETE SET NULL,
  status public.sos_status NOT NULL DEFAULT 'open',
  message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  acknowledged_at TIMESTAMPTZ,
  resolved_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_sos_alerts_team_status
  ON public.sos_alerts (team_id, status, created_at DESC);

ALTER TABLE public.sos_alerts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS sos_alerts_agent_insert ON public.sos_alerts;
CREATE POLICY sos_alerts_agent_insert ON public.sos_alerts
  FOR INSERT WITH CHECK (agent_id = auth.uid());

DROP POLICY IF EXISTS sos_alerts_agent_select ON public.sos_alerts;
CREATE POLICY sos_alerts_agent_select ON public.sos_alerts
  FOR SELECT USING (agent_id = auth.uid());

DROP POLICY IF EXISTS sos_alerts_supervisor_select ON public.sos_alerts;
CREATE POLICY sos_alerts_supervisor_select ON public.sos_alerts
  FOR SELECT USING (
    public.get_my_role() IN ('HEAD', 'CHIEF', 'MANAGER', 'FLOOR_MANAGER', 'TEAM_LEADER')
    AND (
      team_id IS NULL
      OR team_id IN (SELECT team_id FROM public.profiles WHERE id = auth.uid())
      OR public.get_my_role() IN ('HEAD', 'CHIEF', 'MANAGER')
    )
  );

DROP POLICY IF EXISTS sos_alerts_supervisor_update ON public.sos_alerts;
CREATE POLICY sos_alerts_supervisor_update ON public.sos_alerts
  FOR UPDATE USING (
    public.get_my_role() IN ('FLOOR_MANAGER', 'TEAM_LEADER', 'HEAD', 'CHIEF', 'MANAGER')
  );

-- ─── Tipos de notificación ───────────────────────────────────
ALTER TYPE public.notification_type ADD VALUE IF NOT EXISTS 'sos_open';
ALTER TYPE public.notification_type ADD VALUE IF NOT EXISTS 'sos_ack';
ALTER TYPE public.notification_type ADD VALUE IF NOT EXISTS 'callback_due';

-- Realtime SOS
DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.sos_alerts;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ─── RPC: estado laboral ─────────────────────────────────────
CREATE OR REPLACE FUNCTION public.set_my_work_status(
  p_status public.agent_presence,
  p_note TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_uid UUID := auth.uid();
BEGIN
  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  UPDATE public.profiles
  SET
    work_status = p_status,
    work_status_since = NOW(),
    work_status_note = p_note,
    updated_at = NOW()
  WHERE id = v_uid;

  RETURN jsonb_build_object('status', p_status::text, 'since', NOW());
END;
$$;

GRANT EXECUTE ON FUNCTION public.set_my_work_status(public.agent_presence, TEXT) TO authenticated;

-- ─── RPC: programar callback ─────────────────────────────────
CREATE OR REPLACE FUNCTION public.agent_schedule_callback(
  p_lead_id UUID,
  p_scheduled_at TIMESTAMPTZ,
  p_reason TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_uid UUID := auth.uid();
  v_id UUID;
BEGIN
  IF v_uid IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;

  IF NOT EXISTS (
    SELECT 1 FROM public.leads WHERE id = p_lead_id AND assigned_to = v_uid
  ) THEN
    RAISE EXCEPTION 'Lead not assigned to you';
  END IF;

  INSERT INTO public.lead_callbacks (lead_id, agent_id, scheduled_at, reason)
  VALUES (p_lead_id, v_uid, p_scheduled_at, p_reason)
  RETURNING id INTO v_id;

  UPDATE public.leads
  SET status = 'En seguimiento',
      notes = COALESCE(notes, '') || E'\nCallback: ' || COALESCE(p_reason, '') || ' @ ' || p_scheduled_at::text,
      last_contact = NOW()
  WHERE id = p_lead_id;

  RETURN v_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.agent_schedule_callback(UUID, TIMESTAMPTZ, TEXT) TO authenticated;

-- ─── RPC: listar callbacks del agente ────────────────────────
CREATE OR REPLACE FUNCTION public.agent_list_my_callbacks()
RETURNS SETOF public.lead_callbacks
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT * FROM public.lead_callbacks
  WHERE agent_id = auth.uid() AND status = 'pending'
  ORDER BY scheduled_at ASC;
$$;

GRANT EXECUTE ON FUNCTION public.agent_list_my_callbacks() TO authenticated;

-- ─── RPC: activar SOS ────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.agent_raise_sos(
  p_lead_id UUID DEFAULT NULL,
  p_message TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_uid UUID := auth.uid();
  v_team_id UUID;
  v_sos_id UUID;
  v_supervisor RECORD;
BEGIN
  IF v_uid IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;

  IF (SELECT role FROM public.profiles WHERE id = v_uid) <> 'AGENT' THEN
    RAISE EXCEPTION 'Only agents can raise SOS';
  END IF;

  IF p_lead_id IS NOT NULL AND NOT EXISTS (
    SELECT 1 FROM public.leads WHERE id = p_lead_id AND assigned_to = v_uid
  ) THEN
    RAISE EXCEPTION 'Lead not assigned to you';
  END IF;

  SELECT team_id INTO v_team_id FROM public.profiles WHERE id = v_uid;

  INSERT INTO public.sos_alerts (agent_id, lead_id, team_id, message, status)
  VALUES (v_uid, p_lead_id, v_team_id, p_message, 'open')
  RETURNING id INTO v_sos_id;

  FOR v_supervisor IN
    SELECT id, role FROM public.profiles
    WHERE team_id = v_team_id
      AND role IN ('FLOOR_MANAGER', 'TEAM_LEADER')
  LOOP
    PERFORM public.create_notification(
      v_supervisor.id,
      'sos_open',
      'SOS — Agente pide ayuda',
      COALESCE(p_message, 'Un agente activó el botón SOS durante una llamada.'),
      jsonb_build_object('sos_id', v_sos_id, 'agent_id', v_uid, 'lead_id', p_lead_id)
    );
  END LOOP;

  RETURN v_sos_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.agent_raise_sos(UUID, TEXT) TO authenticated;

-- ─── RPC: reconocer SOS (supervisor) ─────────────────────────
CREATE OR REPLACE FUNCTION public.supervisor_ack_sos(p_sos_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_role TEXT := public.get_my_role();
  v_row public.sos_alerts%ROWTYPE;
BEGIN
  IF v_role NOT IN ('FLOOR_MANAGER', 'TEAM_LEADER', 'HEAD', 'CHIEF', 'MANAGER') THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;

  SELECT * INTO v_row FROM public.sos_alerts WHERE id = p_sos_id;
  IF NOT FOUND THEN RAISE EXCEPTION 'SOS not found'; END IF;

  UPDATE public.sos_alerts
  SET status = 'acknowledged', acknowledged_at = NOW(), floor_manager_id = auth.uid()
  WHERE id = p_sos_id;

  PERFORM public.create_notification(
    v_row.agent_id,
    'sos_ack',
    'SOS recibido',
    'Tu supervisor tomó nota de tu alerta SOS.',
    jsonb_build_object('sos_id', p_sos_id)
  );

  RETURN jsonb_build_object('id', p_sos_id, 'status', 'acknowledged');
END;
$$;

GRANT EXECUTE ON FUNCTION public.supervisor_ack_sos(UUID) TO authenticated;

-- ─── RPC: leaderboard de mesa ────────────────────────────────
CREATE OR REPLACE FUNCTION public.agent_team_leaderboard(
  p_days INT DEFAULT 30
)
RETURNS TABLE (
  agent_id UUID,
  full_name TEXT,
  ftd_count BIGINT,
  approved_volume NUMERIC,
  rank_pos INT
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_team_id UUID;
BEGIN
  SELECT team_id INTO v_team_id FROM public.profiles WHERE id = auth.uid();
  IF v_team_id IS NULL THEN RETURN; END IF;

  RETURN QUERY
  WITH ranked AS (
    SELECT
      p.id AS agent_id,
      p.full_name,
      COUNT(d.id) FILTER (WHERE d.type = 'FTD' AND d.status = 'Aprobado')::BIGINT AS ftd_count,
      COALESCE(SUM(d.amount) FILTER (WHERE d.status = 'Aprobado'), 0)::NUMERIC AS approved_volume,
      ROW_NUMBER() OVER (
        ORDER BY
          COUNT(d.id) FILTER (WHERE d.type = 'FTD' AND d.status = 'Aprobado') DESC,
          COALESCE(SUM(d.amount) FILTER (WHERE d.status = 'Aprobado'), 0) DESC
      )::INT AS rank_pos
    FROM public.profiles p
    LEFT JOIN public.deposits d ON d.agent_id = p.id
      AND d.created_at >= NOW() - (p_days || ' days')::INTERVAL
    WHERE p.team_id = v_team_id AND p.role = 'AGENT'
    GROUP BY p.id, p.full_name
  )
  SELECT r.agent_id, r.full_name, r.ftd_count, r.approved_volume, r.rank_pos
  FROM ranked r
  ORDER BY r.rank_pos;
END;
$$;

GRANT EXECUTE ON FUNCTION public.agent_team_leaderboard(INT) TO authenticated;

-- ─── RPC: depósito en nombre del cliente (agente) ────────────
CREATE OR REPLACE FUNCTION public.agent_create_deposit_transaction(
  p_client_id UUID,
  p_amount NUMERIC,
  p_payment_method TEXT,
  p_gateway TEXT,
  p_notes TEXT DEFAULT NULL,
  p_lead_id UUID DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_agent_id UUID := auth.uid();
  v_wallet_id UUID;
  v_wallet RECORD;
  v_fee NUMERIC;
  v_net NUMERIC;
  v_status public.transaction_status;
  v_tx_id UUID;
  v_processing_count INT;
BEGIN
  IF v_agent_id IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;

  IF (SELECT role FROM public.profiles WHERE id = v_agent_id) <> 'AGENT' THEN
    RAISE EXCEPTION 'Only agents can create client deposits';
  END IF;

  IF p_lead_id IS NOT NULL THEN
    IF NOT EXISTS (
      SELECT 1 FROM public.leads
      WHERE id = p_lead_id AND assigned_to = v_agent_id
        AND (client_user_id IS NULL OR client_user_id = p_client_id)
    ) THEN
      RAISE EXCEPTION 'Lead not assigned or client mismatch';
    END IF;
  END IF;

  IF p_amount < 10 OR p_amount > 100000 THEN
    RAISE EXCEPTION 'Amount must be between 10 and 100000 USD';
  END IF;

  v_wallet_id := public.ensure_client_wallet(p_client_id);
  SELECT * INTO v_wallet FROM public.wallets WHERE id = v_wallet_id FOR UPDATE;

  IF v_wallet.is_frozen THEN RAISE EXCEPTION 'Wallet is frozen'; END IF;

  SELECT COUNT(*) INTO v_processing_count
  FROM public.transactions
  WHERE client_id = p_client_id AND type = 'deposit' AND status IN ('pending', 'processing');

  IF v_processing_count >= 5 THEN RAISE EXCEPTION 'Too many pending deposits (max 5)'; END IF;

  IF p_gateway = 'nowpayments' THEN
    v_fee := ROUND(p_amount * 0.005, 2);
  ELSE
    v_fee := 0;
  END IF;

  v_net := ROUND(p_amount - v_fee, 2);
  v_status := 'processing';

  INSERT INTO public.transactions (
    wallet_id, client_id, type, amount, fee, net_amount,
    payment_method, status, gateway, notes, referred_by_agent_id
  ) VALUES (
    v_wallet_id, p_client_id, 'deposit', p_amount, v_fee, v_net,
    p_payment_method, v_status, p_gateway,
    COALESCE(p_notes, 'Depósito iniciado por agente'),
    v_agent_id
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

GRANT EXECUTE ON FUNCTION public.agent_create_deposit_transaction(UUID, NUMERIC, TEXT, TEXT, TEXT, UUID) TO authenticated;

GRANT SELECT ON public.lead_callbacks TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.sos_alerts TO authenticated;
GRANT SELECT ON public.deposits TO authenticated;
