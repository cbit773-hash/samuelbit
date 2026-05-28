-- Wrapper seguro: solo crea/retorna wallet del usuario autenticado
CREATE OR REPLACE FUNCTION public.ensure_my_wallet()
RETURNS UUID
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
  RETURN public.ensure_client_wallet(v_uid);
END;
$$;

GRANT EXECUTE ON FUNCTION public.ensure_my_wallet() TO authenticated;
