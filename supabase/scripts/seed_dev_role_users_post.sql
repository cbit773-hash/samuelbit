-- ============================================================
-- Post-seed: roles, equipos CRM + wallet cliente (@investpro.com)
-- Ejecutar después de: npm run seed:dev-users
-- ============================================================

-- Sincronizar rol y nombre desde auth.users (metadata del seed)
UPDATE public.profiles p
SET
  role = COALESCE((u.raw_user_meta_data->>'role')::public.user_role, p.role),
  full_name = COALESCE(NULLIF(u.raw_user_meta_data->>'full_name', ''), p.full_name),
  email = COALESCE(u.email, p.email),
  updated_at = NOW()
FROM auth.users u
WHERE p.id = u.id
  AND u.email LIKE '%@investpro.com';

-- Respaldo explícito por email
UPDATE public.profiles SET role = 'HEAD', full_name = 'Samuel Director' WHERE email = 'head@investpro.com';
UPDATE public.profiles SET role = 'CHIEF', full_name = 'Ana Ríos' WHERE email = 'chief@investpro.com';
UPDATE public.profiles SET role = 'MANAGER', full_name = 'Roberto Mendoza' WHERE email = 'manager@investpro.com';
UPDATE public.profiles SET role = 'FLOOR_MANAGER', full_name = 'Carlos Navarro' WHERE email = 'floormanager@investpro.com';
UPDATE public.profiles SET role = 'TEAM_LEADER', full_name = 'Laura Gómez' WHERE email = 'teamleader@investpro.com';
UPDATE public.profiles SET role = 'AGENT', full_name = 'Pedro Ruiz' WHERE email = 'agent@investpro.com';
UPDATE public.profiles SET role = 'CLIENT', full_name = 'Fernando Guzmán' WHERE email = 'client@investpro.com';

INSERT INTO public.teams (name)
SELECT 'Mesa Alpha'
WHERE NOT EXISTS (SELECT 1 FROM public.teams WHERE name = 'Mesa Alpha');

UPDATE public.profiles
SET team_id = (SELECT id FROM public.teams WHERE name = 'Mesa Alpha' LIMIT 1)
WHERE email IN ('agent@investpro.com', 'teamleader@investpro.com');

SELECT public.ensure_client_wallet(id)
FROM public.profiles
WHERE email = 'client@investpro.com';

-- Verificación
SELECT email, role, full_name, team_id
FROM public.profiles
WHERE email LIKE '%@investpro.com'
ORDER BY role;
