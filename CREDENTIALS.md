# Credenciales de Acceso - InvestPRO

La simulación RBAC (botones de 7 niveles en login) fue **retirada**. Solo hay acceso con usuarios reales en Supabase Auth.

## Clientes (inversores)

1. Ir a **`/registro`** y completar el formulario.
2. Guardar la contraseña generada en pantalla (no se envía por email).
3. Iniciar sesión en **`/auth/login`** con ese correo y contraseña.
4. Panel: **`/dashboard/trade`** (terminal) · Cuenta: **`/dashboard/account?tab=resumen`**

## Personal (HEAD, CHIEF, AGENT, etc.)

### Desarrollo rápido (7 roles @investpro.com)

Ver **`docs/operations/USUARIOS_PRUEBA_INVESTPRO.md`** — contraseña `Dev2026!Inv`, script `npm run seed:dev-users` y SQL post-seed.

### Alta manual

1. Crear usuario en **Supabase Dashboard → Authentication → Users** (email + contraseña).
2. Tras el primer login, la app ejecuta `ensure_my_profile` y crea fila en `profiles`.
3. Asignar rol en SQL (ver `docs/guides/GUIA_STAFF_AUTH.md`):

```sql
UPDATE public.profiles SET role = 'HEAD' WHERE email = 'tu@correo.com';
```

Roles válidos: `CLIENT`, `AGENT`, `TEAM_LEADER`, `FLOOR_MANAGER`, `MANAGER`, `CHIEF`, `HEAD`.

## Recuperación de contraseña

- **`/auth/recuperar`** — solicitar enlace por email
- **`/auth/restablecer`** — definir nueva contraseña (redirect configurado en Supabase Auth)

## Variables de entorno requeridas

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=...
VITE_APP_URL=http://localhost:5173
```

## No usar en producción

- **`supabase/seed_data.sql`** — borra datos y rompe FK con `auth.users`. Solo para entornos de demo aislados.

## Vaciar todo y empezar de cero

- **`supabase/scripts/reset_all_operational_data.sql`** — ver `docs/operations/RESET_DATOS_OPERATIVOS.md`
