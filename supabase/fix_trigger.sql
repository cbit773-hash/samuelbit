-- ============================================================
-- INVESPRO — FIX COMPLETO DE PERMISOS Y TABLA
-- Pega TODO esto en Supabase → SQL Editor → New Query → Run
-- ============================================================

-- 1. Quitar el FK de team_id que puede causar conflictos
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_team_id_fkey;

-- 2. Quitar políticas anteriores para recrearlas limpias
DROP POLICY IF EXISTS "ver_propio_perfil" ON public.profiles;
DROP POLICY IF EXISTS "alta_direccion_ve_todos_perfiles" ON public.profiles;
DROP POLICY IF EXISTS "user_manage_own_profile" ON public.profiles;

-- 3. Política maestra: cada usuario puede hacer cualquier cosa en SU propia fila
CREATE POLICY "user_manage_own_profile"
  ON public.profiles FOR ALL
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- 4. Alta Dirección puede leer todos los perfiles
CREATE POLICY "alta_direccion_lee_todos"
  ON public.profiles FOR SELECT
  USING (
    (SELECT role FROM public.profiles WHERE id = auth.uid())
    IN ('HEAD', 'CHIEF', 'MANAGER', 'FLOOR_MANAGER', 'TEAM_LEADER')
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
