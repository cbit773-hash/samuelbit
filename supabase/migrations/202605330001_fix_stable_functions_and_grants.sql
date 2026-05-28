-- ============================================================
-- InvestPRO — Fix: STABLE + SET LOCAL (error 0A000) + GRANTs cliente
-- PostgreSQL no permite SET LOCAL en funciones STABLE/IMMUTABLE.
-- ============================================================

-- ─── 1. Helpers: STABLE → VOLATILE ───────────────────────────

CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS TEXT
LANGUAGE plpgsql
VOLATILE
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
VOLATILE
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

CREATE OR REPLACE FUNCTION public.get_auth_role()
RETURNS TEXT
LANGUAGE plpgsql
VOLATILE
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

CREATE OR REPLACE FUNCTION public.staff_list_profiles(
  p_role TEXT DEFAULT NULL,
  p_team_id UUID DEFAULT NULL
)
RETURNS SETOF public.profiles
LANGUAGE plpgsql
VOLATILE
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
VOLATILE
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

-- ─── 2. GRANTs tabla para rol authenticated (PostgREST) ───────

GRANT SELECT, INSERT, UPDATE, DELETE ON public.positions TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.pending_orders TO authenticated;
GRANT SELECT ON public.wallets TO authenticated;
GRANT SELECT ON public.transactions TO authenticated;
GRANT SELECT, UPDATE ON public.notifications TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.leads TO authenticated;
GRANT SELECT, INSERT ON public.kyc_documents TO authenticated;
