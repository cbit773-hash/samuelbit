-- InvestPRO — Twilio VoIP call logs
-- MVP: outbound calls, no recording

CREATE TABLE IF NOT EXISTS public.call_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES public.leads(id) ON DELETE SET NULL,
  agent_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  twilio_call_sid TEXT UNIQUE,
  direction TEXT NOT NULL DEFAULT 'outbound' CHECK (direction IN ('outbound', 'inbound')),
  from_number TEXT,
  to_number TEXT,
  status TEXT NOT NULL DEFAULT 'queued',
  duration_seconds INT,
  recording_url TEXT,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  ended_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_call_logs_agent_id ON public.call_logs (agent_id);
CREATE INDEX IF NOT EXISTS idx_call_logs_lead_id ON public.call_logs (lead_id);
CREATE INDEX IF NOT EXISTS idx_call_logs_twilio_sid ON public.call_logs (twilio_call_sid)
  WHERE twilio_call_sid IS NOT NULL;

ALTER TABLE public.call_logs ENABLE ROW LEVEL SECURITY;

-- Agente: ver e insertar sus propias llamadas
DROP POLICY IF EXISTS call_logs_agent_select ON public.call_logs;
CREATE POLICY call_logs_agent_select ON public.call_logs
  FOR SELECT
  USING (agent_id = auth.uid());

DROP POLICY IF EXISTS call_logs_agent_insert ON public.call_logs;
CREATE POLICY call_logs_agent_insert ON public.call_logs
  FOR INSERT
  WITH CHECK (agent_id = auth.uid());

-- Liderazgo: lectura de todas las llamadas
DROP POLICY IF EXISTS call_logs_leadership_select ON public.call_logs;
CREATE POLICY call_logs_leadership_select ON public.call_logs
  FOR SELECT
  USING (
    (SELECT role FROM public.profiles WHERE id = auth.uid())
    IN ('HEAD', 'CHIEF', 'MANAGER', 'FLOOR_MANAGER', 'TEAM_LEADER')
  );

-- Updates solo vía service_role (webhooks Twilio)
GRANT SELECT, INSERT ON public.call_logs TO authenticated;
GRANT ALL ON public.call_logs TO service_role;
