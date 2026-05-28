-- ============================================================
-- SUPERSEDED BY: 202605310001_profiles_rls_canonical.sql
-- (No añadir políticas get_my_role() sobre public.profiles)
-- InvestPRO — Corregir recursión infinita en RLS (HTTP 500 en profiles)
-- Las políticas que hacen (SELECT role FROM profiles WHERE id = auth.uid())
-- re-disparan RLS sobre profiles y provocan error 42P17 en PostgREST.
-- ============================================================

CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS TEXT
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role::text FROM public.profiles WHERE id = auth.uid();
$$;

-- ─── profiles ────────────────────────────────────────────────

DROP POLICY IF EXISTS "ver_propio_perfil" ON public.profiles;
DROP POLICY IF EXISTS "alta_direccion_ve_todos_perfiles" ON public.profiles;
DROP POLICY IF EXISTS "alta_direccion_lee_todos" ON public.profiles;
DROP POLICY IF EXISTS "user_manage_own_profile" ON public.profiles;
DROP POLICY IF EXISTS "own_profile" ON public.profiles;
DROP POLICY IF EXISTS "leadership_reads_all" ON public.profiles;

CREATE POLICY profiles_own_all
  ON public.profiles FOR ALL
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY profiles_leadership_select
  ON public.profiles FOR SELECT
  USING (
    public.get_my_role() IN ('HEAD', 'CHIEF', 'MANAGER', 'FLOOR_MANAGER', 'TEAM_LEADER')
  );

-- ─── leads (schema inicial) ───────────────────────────────────

DROP POLICY IF EXISTS "liderazgo_ve_todos_leads" ON public.leads;
CREATE POLICY "liderazgo_ve_todos_leads"
  ON public.leads FOR ALL
  USING (
    public.get_my_role() IN ('HEAD', 'CHIEF', 'MANAGER', 'FLOOR_MANAGER', 'TEAM_LEADER')
  );

-- ─── deposits (schema inicial) ────────────────────────────────

DROP POLICY IF EXISTS "liderazgo_gestiona_depositos" ON public.deposits;
CREATE POLICY "liderazgo_gestiona_depositos"
  ON public.deposits FOR ALL
  USING (public.get_my_role() IN ('HEAD', 'CHIEF', 'MANAGER'));

-- ─── notifications ───────────────────────────────────────────

DROP POLICY IF EXISTS notifications_leadership_select ON public.notifications;
CREATE POLICY notifications_leadership_select ON public.notifications
  FOR SELECT USING (public.get_my_role() IN ('HEAD', 'CHIEF', 'MANAGER'));

-- ─── call_logs ────────────────────────────────────────────────

DROP POLICY IF EXISTS call_logs_leadership_select ON public.call_logs;
CREATE POLICY call_logs_leadership_select ON public.call_logs
  FOR SELECT
  USING (
    public.get_my_role() IN ('HEAD', 'CHIEF', 'MANAGER', 'FLOOR_MANAGER', 'TEAM_LEADER')
  );

-- ─── lead_registration_files + storage ───────────────────────

DROP POLICY IF EXISTS lead_files_leadership_select ON public.lead_registration_files;
CREATE POLICY lead_files_leadership_select ON public.lead_registration_files
  FOR SELECT TO authenticated
  USING (public.get_my_role() IN ('HEAD', 'CHIEF', 'MANAGER'));

DROP POLICY IF EXISTS lead_reg_storage_leadership_select ON storage.objects;
CREATE POLICY lead_reg_storage_leadership_select ON storage.objects
  FOR SELECT TO authenticated
  USING (
    bucket_id = 'lead-registrations'
    AND public.get_my_role() IN ('HEAD', 'CHIEF', 'MANAGER')
  );
