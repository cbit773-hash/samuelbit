-- ============================================================
-- InvestPRO — Auth + profiles hardening (permission denied fix)
-- RLS: profiles_own_row only. Role via get_auth_role RPC.
-- ============================================================

-- ─── 1. Grants explícitos ─────────────────────────────────────

GRANT USAGE ON SCHEMA public TO authenticated, anon;
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;

-- ─── 2. get_auth_role — rol del usuario autenticado (sin RLS cliente) ─

CREATE OR REPLACE FUNCTION public.get_auth_role()
RETURNS TEXT
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RETURN NULL;
  END IF;
  RETURN public.get_my_role();
END;
$$;

-- ─── 3. ensure_my_profile — crear fila si falta ───────────────

CREATE OR REPLACE FUNCTION public.ensure_my_profile()
RETURNS public.profiles
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_uid UUID := auth.uid();
  v_email TEXT;
  v_name TEXT;
  row public.profiles;
BEGIN
  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  SET LOCAL row_security = off;

  SELECT * INTO row FROM public.profiles WHERE id = v_uid;
  IF FOUND THEN
    RETURN row;
  END IF;

  SELECT
    COALESCE(u.email, ''),
    COALESCE(u.raw_user_meta_data->>'full_name', 'Usuario InvestPRO')
  INTO v_email, v_name
  FROM auth.users u
  WHERE u.id = v_uid;

  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    v_uid,
    COALESCE(v_email, ''),
    COALESCE(v_name, 'Usuario InvestPRO'),
    COALESCE(
      (SELECT (raw_user_meta_data->>'role')::public.user_role FROM auth.users WHERE id = v_uid),
      'CLIENT'::public.user_role
    )
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = COALESCE(NULLIF(public.profiles.full_name, ''), EXCLUDED.full_name),
    updated_at = NOW()
  RETURNING * INTO row;

  RETURN row;
END;
$$;

-- ─── 4. Backfill: auth.users sin fila en profiles ─────────────

INSERT INTO public.profiles (id, email, full_name, role)
SELECT
  u.id,
  COALESCE(u.email, ''),
  COALESCE(u.raw_user_meta_data->>'full_name', 'Usuario InvestPRO'),
  COALESCE((u.raw_user_meta_data->>'role')::public.user_role, 'CLIENT')
FROM auth.users u
LEFT JOIN public.profiles p ON p.id = u.id
WHERE p.id IS NULL
ON CONFLICT (id) DO NOTHING;

-- ─── 5. staff_get_profile — rama propia con row_security off ───

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
  SET LOCAL row_security = off;

  IF p_id = auth.uid() THEN
    SELECT * INTO row FROM public.profiles WHERE id = p_id;
    RETURN row;
  END IF;

  IF NOT public.is_staff_management() THEN
    RAISE EXCEPTION 'Forbidden: staff management role required';
  END IF;

  SELECT * INTO row FROM public.profiles WHERE id = p_id;
  RETURN row;
END;
$$;

-- ─── 6. Trigger on_auth_user_created ──────────────────────────

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

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ─── 7. Grants RPCs ───────────────────────────────────────────

GRANT EXECUTE ON FUNCTION public.get_auth_role() TO authenticated;
GRANT EXECUTE ON FUNCTION public.ensure_my_profile() TO authenticated;
