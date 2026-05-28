-- ============================================================
-- InvestPRO — Perfiles RLS canónico (sin recursión)
-- Supersedes: 202605300001_fix_rls_recursion.sql (políticas en profiles con get_my_role)
-- Modelo: profiles = solo fila propia (RLS); staff = RPCs SECURITY DEFINER
-- ============================================================

-- ─── 1. Eliminar TODAS las políticas de profiles ─────────────

DO $$
DECLARE
  pol RECORD;
BEGIN
  FOR pol IN
    SELECT policyname FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'profiles'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.profiles', pol.policyname);
  END LOOP;
END $$;

DROP POLICY IF EXISTS "ver_propio_perfil" ON public.profiles;
DROP POLICY IF EXISTS "alta_direccion_ve_todos_perfiles" ON public.profiles;
DROP POLICY IF EXISTS "alta_direccion_lee_todos" ON public.profiles;
DROP POLICY IF EXISTS "user_manage_own_profile" ON public.profiles;
DROP POLICY IF EXISTS "own_profile" ON public.profiles;
DROP POLICY IF EXISTS "own_profile_access" ON public.profiles;
DROP POLICY IF EXISTS "leadership_reads_all" ON public.profiles;
DROP POLICY IF EXISTS "leadership_reads_all_profiles" ON public.profiles;
DROP POLICY IF EXISTS "profiles_own_all" ON public.profiles;
DROP POLICY IF EXISTS "profiles_leadership_select" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Super admins (HEAD, CHIEF) can view all profiles" ON public.profiles;

-- ─── 2. Helpers (leen profiles con RLS desactivado localmente) ─

CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS TEXT
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  r TEXT;
BEGIN
  SET LOCAL row_security = off;
  SELECT role::text INTO r FROM public.profiles WHERE id = auth.uid();
  RETURN r;
END;
$$;

CREATE OR REPLACE FUNCTION public.is_leadership(p_user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  ok BOOLEAN;
BEGIN
  SET LOCAL row_security = off;
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = p_user_id AND role IN ('HEAD', 'CHIEF')
  ) INTO ok;
  RETURN COALESCE(ok, false);
END;
$$;

CREATE OR REPLACE FUNCTION public.is_staff_management()
RETURNS BOOLEAN
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN public.get_my_role() IN (
    'HEAD', 'CHIEF', 'MANAGER', 'FLOOR_MANAGER', 'TEAM_LEADER'
  );
END;
$$;

-- ─── 3. Una sola política en profiles (sin subconsultas) ───────

CREATE POLICY profiles_own_row
  ON public.profiles
  FOR ALL
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- ─── 4. RPCs para CRM / alta dirección ───────────────────────

CREATE OR REPLACE FUNCTION public.staff_list_profiles(
  p_role TEXT DEFAULT NULL,
  p_team_id UUID DEFAULT NULL
)
RETURNS SETOF public.profiles
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.is_staff_management() THEN
    RAISE EXCEPTION 'Forbidden: staff management role required';
  END IF;

  SET LOCAL row_security = off;

  RETURN QUERY
  SELECT *
  FROM public.profiles p
  WHERE (p_role IS NULL OR p.role::text = p_role)
    AND (p_team_id IS NULL OR p.team_id = p_team_id)
  ORDER BY p.created_at DESC;
END;
$$;

CREATE OR REPLACE FUNCTION public.staff_get_profile(p_id UUID)
RETURNS public.profiles
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  row public.profiles;
BEGIN
  IF p_id = auth.uid() THEN
    RETURN (SELECT * FROM public.profiles WHERE id = p_id);
  END IF;

  IF NOT public.is_staff_management() THEN
    RAISE EXCEPTION 'Forbidden: staff management role required';
  END IF;

  SET LOCAL row_security = off;
  SELECT * INTO row FROM public.profiles WHERE id = p_id;
  RETURN row;
END;
$$;

CREATE OR REPLACE FUNCTION public.staff_update_profile(
  p_id UUID,
  p_patch JSONB
)
RETURNS public.profiles
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  row public.profiles;
  new_role public.user_role;
BEGIN
  IF p_id IS NULL OR p_patch IS NULL OR p_patch = '{}'::jsonb THEN
    RAISE EXCEPTION 'Invalid profile update payload';
  END IF;

  -- Usuario puede actualizar su propio perfil (campos no sensibles)
  IF p_id = auth.uid() THEN
    IF p_patch ? 'role' THEN
      RAISE EXCEPTION 'Cannot change own role via this RPC';
    END IF;
    UPDATE public.profiles SET
      full_name = COALESCE(p_patch->>'full_name', full_name),
      phone = CASE WHEN p_patch ? 'phone' THEN p_patch->>'phone' ELSE phone END,
      country = CASE WHEN p_patch ? 'country' THEN p_patch->>'country' ELSE country END,
      interest_level = CASE WHEN p_patch ? 'interest_level' THEN p_patch->>'interest_level' ELSE interest_level END,
      team_id = CASE
        WHEN p_patch ? 'team_id' AND (p_patch->>'team_id') IS NULL THEN NULL
        WHEN p_patch ? 'team_id' THEN (p_patch->>'team_id')::uuid
        ELSE team_id
      END,
      updated_at = NOW()
    WHERE id = p_id
    RETURNING * INTO row;
    RETURN row;
  END IF;

  -- Editar otro perfil: solo staff; cambiar role solo HEAD/CHIEF
  IF NOT public.is_staff_management() THEN
    RAISE EXCEPTION 'Forbidden: staff management role required';
  END IF;

  IF p_patch ? 'role' AND NOT public.is_leadership() THEN
    RAISE EXCEPTION 'Forbidden: only HEAD/CHIEF can change roles';
  END IF;

  SET LOCAL row_security = off;

  IF p_patch ? 'role' THEN
    new_role := (p_patch->>'role')::public.user_role;
  END IF;

  UPDATE public.profiles SET
    full_name = COALESCE(p_patch->>'full_name', full_name),
    phone = CASE WHEN p_patch ? 'phone' THEN p_patch->>'phone' ELSE phone END,
    country = CASE WHEN p_patch ? 'country' THEN p_patch->>'country' ELSE country END,
    interest_level = CASE WHEN p_patch ? 'interest_level' THEN p_patch->>'interest_level' ELSE interest_level END,
    role = COALESCE(new_role, role),
    team_id = CASE
      WHEN p_patch ? 'team_id' AND (p_patch->>'team_id') IS NULL THEN NULL
      WHEN p_patch ? 'team_id' THEN (p_patch->>'team_id')::uuid
      ELSE team_id
    END,
    updated_at = NOW()
  WHERE id = p_id
  RETURNING * INTO row;

  IF row.id IS NULL THEN
    RAISE EXCEPTION 'Profile not found';
  END IF;

  RETURN row;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_my_role() TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.is_leadership(UUID) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.is_staff_management() TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.staff_list_profiles(TEXT, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.staff_get_profile(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.staff_update_profile(UUID, JSONB) TO authenticated;

-- ─── 5. Trigger registro auth ─────────────────────────────────

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
    COALESCE((NEW.raw_user_meta_data->>'role')::public.user_role, 'CLIENT')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'handle_new_user error: %', SQLERRM;
  RETURN NEW;
END;
$$;
