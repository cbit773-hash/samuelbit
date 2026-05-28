# Guía — Usuarios staff reales (HEAD, CHIEF, AGENT…)

No usar `seed_data.sql` en un proyecto con clientes reales.

## 1. Crear usuario en Auth

**Supabase Dashboard → Authentication → Users → Add user**

- Email corporativo
- Contraseña segura
- Marcar **Auto Confirm User** si Confirm email está activado

## 2. Primer login en la app

`/auth/login` → la app llama `ensure_my_profile` y crea fila en `profiles` con rol por defecto `CLIENT`.

## 3. Asignar rol operativo

**SQL Editor:**

```sql
UPDATE public.profiles
SET role = 'AGENT',  -- HEAD | CHIEF | MANAGER | FLOOR_MANAGER | TEAM_LEADER | AGENT
    full_name = 'Nombre Apellido',
    team_id = NULL  -- UUID de teams si aplica
WHERE email = 'agente@tuempresa.com';
```

## 4. Verificar acceso

| Rol | Ruta dashboard |
|-----|----------------|
| HEAD | `/dashboard/head` |
| CHIEF | `/dashboard/chief` |
| MANAGER | `/dashboard/manager` |
| FLOOR_MANAGER / TEAM_LEADER | `/dashboard/floor` |
| AGENT | `/dashboard/agent` |

## 5. Equipos (opcional)

```sql
INSERT INTO public.teams (name) VALUES ('Mesa Alpha') RETURNING id;
-- Asignar team_id en profiles de agentes y floor_manager_id en teams
```

## Seguridad

- No compartir `service_role` en el frontend
- Rotar contraseñas de staff periódicamente
- HEAD/CHIEF: revisar RLS en migraciones `202605310001` y `202605320001`
