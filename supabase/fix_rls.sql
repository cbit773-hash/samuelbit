-- ============================================================
-- INVESPRO — FIX DEFINITIVO: Permisos RLS (Forbidden/500)
-- Pega TODO esto en Supabase → SQL Editor → New Query → Run
-- ============================================================

-- 1. Eliminar TODAS las políticas de profiles (causaban recursión infinita y error 403)
DROP POLICY IF EXISTS "ver_propio_perfil" ON public.profiles;
DROP POLICY IF EXISTS "alta_direccion_ve_todos_perfiles" ON public.profiles;
DROP POLICY IF EXISTS "alta_direccion_lee_todos" ON public.profiles;
DROP POLICY IF EXISTS "user_manage_own_profile" ON public.profiles;
DROP POLICY IF EXISTS "own_profile" ON public.profiles;
DROP POLICY IF EXISTS "leadership_reads_all" ON public.profiles;

-- 2. Crear función SECURITY DEFINER que lee el rol SIN activar RLS
--    (Esto soluciona el error 500 de recursión infinita)
CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS TEXT AS $$
  SELECT role::text FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- 3. Política maestra: cada usuario ve y edita SOLO su propia fila
--    (Esto soluciona el error 403 Forbidden al intentar actualizar el rol)
CREATE POLICY "own_profile_access"
  ON public.profiles FOR ALL
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- 4. Alta Dirección lee todos usando la función (SIN recursión)
CREATE POLICY "leadership_reads_all_profiles"
  ON public.profiles FOR SELECT
  USING (
    public.get_my_role() IN ('HEAD', 'CHIEF', 'MANAGER', 'FLOOR_MANAGER', 'TEAM_LEADER')
  );
