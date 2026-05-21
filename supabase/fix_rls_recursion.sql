-- ============================================================
-- INVESPRO — FIX DEFINITIVO: Recursión Infinita en RLS
-- Pega TODO esto en Supabase → SQL Editor → New Query → Run
-- ============================================================

-- 1. Eliminar TODAS las políticas de profiles (el problema es una de ellas)
DROP POLICY IF EXISTS "ver_propio_perfil" ON public.profiles;
DROP POLICY IF EXISTS "alta_direccion_ve_todos_perfiles" ON public.profiles;
DROP POLICY IF EXISTS "alta_direccion_lee_todos" ON public.profiles;
DROP POLICY IF EXISTS "user_manage_own_profile" ON public.profiles;

-- 2. Crear función SECURITY DEFINER que lee el rol SIN activar RLS
--    (rompe la recursión infinita)
CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS TEXT AS $$
  SELECT role::text FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- 3. Política simple: cada usuario ve y edita SOLO su propia fila
CREATE POLICY "own_profile"
  ON public.profiles FOR ALL
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- 4. Alta Dirección lee todos usando la función (SIN recursión)
CREATE POLICY "leadership_reads_all"
  ON public.profiles FOR SELECT
  USING (
    public.get_my_role() IN ('HEAD', 'CHIEF', 'MANAGER', 'FLOOR_MANAGER', 'TEAM_LEADER')
  );

-- 5. Fix del trigger (infalible)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    new.id,
    COALESCE(new.email, ''),
    COALESCE(new.raw_user_meta_data->>'full_name', 'Usuario InvesPro')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'handle_new_user error: %', SQLERRM;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
