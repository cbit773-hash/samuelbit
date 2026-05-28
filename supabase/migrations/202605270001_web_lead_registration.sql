-- ============================================================
-- INVESPRO — Registros web: source, archivos CSV, notificaciones HEAD/CHIEF
-- ============================================================

ALTER TABLE public.leads
  ADD COLUMN IF NOT EXISTS source TEXT NOT NULL DEFAULT 'manual',
  ADD COLUMN IF NOT EXISTS client_user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_leads_source_created
  ON public.leads (source, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_leads_client_user
  ON public.leads (client_user_id)
  WHERE client_user_id IS NOT NULL;

-- ─── Tabla de archivos exportados ─────────────────────────────
CREATE TABLE IF NOT EXISTS public.lead_registration_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  file_name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_lead_registration_files_lead
  ON public.lead_registration_files (lead_id);

ALTER TABLE public.lead_registration_files ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS lead_files_leadership_select ON public.lead_registration_files;
CREATE POLICY lead_files_leadership_select ON public.lead_registration_files
  FOR SELECT TO authenticated
  USING (
    (SELECT role FROM public.profiles WHERE id = auth.uid())
    IN ('HEAD', 'CHIEF', 'MANAGER')
  );

-- ─── Storage bucket (CSV privados) ────────────────────────────
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'lead-registrations',
  'lead-registrations',
  false,
  1048576,
  ARRAY['text/csv', 'text/plain', 'application/csv']
)
ON CONFLICT (id) DO UPDATE SET
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS lead_reg_storage_leadership_select ON storage.objects;
CREATE POLICY lead_reg_storage_leadership_select ON storage.objects
  FOR SELECT TO authenticated
  USING (
    bucket_id = 'lead-registrations'
    AND (
      (SELECT role FROM public.profiles WHERE id = auth.uid())
      IN ('HEAD', 'CHIEF', 'MANAGER')
    )
  );

-- ─── Onboarding: lead web + notificar staff ───────────────────
CREATE OR REPLACE FUNCTION public.complete_client_onboarding(p_payload JSONB)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_uid UUID := auth.uid();
  v_email TEXT;
  v_full_name TEXT;
  v_first TEXT;
  v_last TEXT;
  v_phone TEXT;
  v_country TEXT;
  v_interest TEXT;
  v_utm TEXT;
  v_wallet_id UUID;
  v_lead_id UUID;
  v_notification_id UUID;
  v_staff RECORD;
  v_lead_name TEXT;
BEGIN
  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  v_first := COALESCE(NULLIF(trim(p_payload->>'first_name'), ''), 'Usuario');
  v_last := COALESCE(NULLIF(trim(p_payload->>'last_name'), ''), '');
  v_phone := NULLIF(trim(p_payload->>'phone'), '');
  v_country := NULLIF(trim(p_payload->>'country'), '');
  v_interest := COALESCE(NULLIF(trim(p_payload->>'interest'), ''), 'Desconocido');
  v_utm := NULLIF(trim(p_payload->>'utm_notes'), '');

  SELECT email, full_name INTO v_email, v_full_name
  FROM public.profiles WHERE id = v_uid;

  IF v_email IS NULL THEN
    SELECT email INTO v_email FROM auth.users WHERE id = v_uid;
  END IF;

  v_full_name := trim(v_first || ' ' || v_last);
  v_lead_name := v_full_name;

  UPDATE public.profiles
  SET
    email = COALESCE(v_email, email),
    full_name = v_full_name,
    phone = COALESCE(v_phone, phone),
    country = COALESCE(v_country, country),
    interest_level = v_interest,
    role = 'CLIENT',
    onboarding_completed_at = NOW(),
    updated_at = NOW()
  WHERE id = v_uid;

  v_wallet_id := public.ensure_client_wallet(v_uid);

  IF v_email IS NOT NULL OR v_phone IS NOT NULL THEN
    SELECT id INTO v_lead_id
    FROM public.leads
    WHERE (v_email IS NOT NULL AND lower(email) = lower(v_email))
       OR (v_phone IS NOT NULL AND phone = v_phone)
    ORDER BY created_at DESC
    LIMIT 1;

    IF v_lead_id IS NOT NULL THEN
      UPDATE public.leads
      SET
        first_name = v_first,
        last_name = v_last,
        phone = COALESCE(v_phone, phone),
        email = COALESCE(v_email, email),
        country = COALESCE(v_country, country),
        interest = v_interest,
        status = 'Nuevo',
        source = 'web',
        client_user_id = v_uid,
        notes = CASE
          WHEN v_utm IS NOT NULL THEN
            CASE
              WHEN notes IS NULL OR notes NOT LIKE '%[WEB]%' THEN COALESCE(notes || E'\n', '') || '[WEB] ' || v_utm
              ELSE notes
            END
          WHEN notes IS NULL OR notes NOT LIKE '%[WEB]%' THEN COALESCE(notes, '') || '[WEB] Registro autónomo'
          ELSE notes
        END
      WHERE id = v_lead_id;
    ELSE
      INSERT INTO public.leads (
        first_name, last_name, phone, email, country, status, interest, notes, source, client_user_id
      )
      VALUES (
        v_first,
        v_last,
        COALESCE(v_phone, 'sin-telefono'),
        v_email,
        v_country,
        'Nuevo',
        v_interest,
        CASE WHEN v_utm IS NOT NULL THEN '[WEB] ' || v_utm ELSE '[WEB] Registro autónomo' END,
        'web',
        v_uid
      )
      RETURNING id INTO v_lead_id;
    END IF;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'notifications'
  ) THEN
    INSERT INTO public.notifications (user_id, type, title, body, metadata)
    VALUES (
      v_uid,
      'system',
      'Bienvenido a InvestPRO',
      'Tu cuenta está lista. Completa tu verificación KYC y realiza tu primer depósito desde el panel.',
      jsonb_build_object('wallet_id', v_wallet_id, 'lead_id', v_lead_id)
    )
    RETURNING id INTO v_notification_id;

    IF v_lead_id IS NOT NULL THEN
      FOR v_staff IN
        SELECT id FROM public.profiles WHERE role IN ('HEAD', 'CHIEF')
      LOOP
        INSERT INTO public.notifications (user_id, type, title, body, metadata)
        VALUES (
          v_staff.id,
          'system',
          'Nuevo registro web',
          v_lead_name || ' se registró desde la landing. Revisa y asigna un agente.',
          jsonb_build_object(
            'lead_id', v_lead_id,
            'source', 'web',
            'link', '/dashboard/head?tab=web-registrations',
            'client_user_id', v_uid
          )
        );
      END LOOP;
    END IF;
  END IF;

  RETURN jsonb_build_object(
    'ok', true,
    'wallet_id', v_wallet_id,
    'lead_id', v_lead_id,
    'notification_id', v_notification_id
  );
END;
$$;

REVOKE ALL ON FUNCTION public.complete_client_onboarding(JSONB) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.complete_client_onboarding(JSONB) TO authenticated;
