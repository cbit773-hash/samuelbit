# Usuarios de prueba @investpro.com (desarrollo)

> **Solo desarrollo / staging.** No usar en producción ni commitear `SUPABASE_SERVICE_ROLE_KEY`.

**Contraseña común:** `Dev2026!Inv`

**Login:** [http://localhost:5173/auth/login](http://localhost:5173/auth/login)

---

## Tabla de acceso


| Rol           | Email                                                           | Contraseña  | Panel tras login         |
| ------------- | --------------------------------------------------------------- | ----------- | ------------------------ |
| CLIENT        | [client@investpro.com](mailto:client@investpro.com)             | Dev2026!Inv | `/dashboard/trade`       |
| AGENT         | [agent@investpro.com](mailto:agent@investpro.com)               | Dev2026!Inv | `/dashboard/agent`       |
| TEAM_LEADER   | [teamleader@investpro.com](mailto:teamleader@investpro.com)     | Dev2026!Inv | `/dashboard/team-leader` |
| FLOOR_MANAGER | [floormanager@investpro.com](mailto:floormanager@investpro.com) | Dev2026!Inv | `/dashboard/floor`       |
| MANAGER       | [manager@investpro.com](mailto:manager@investpro.com)           | Dev2026!Inv | `/dashboard/manager`     |
| CHIEF         | [chief@investpro.com](mailto:chief@investpro.com)               | Dev2026!Inv | `/dashboard/chief`       |
| HEAD          | [head@investpro.com](mailto:head@investpro.com)                 | Dev2026!Inv | `/dashboard/head`        |


Los nombres en perfil coinciden con los perfiles demo de `supabase/seed_data.sql` (referencia histórica).

---

## Creación automática (recomendado)

### 1. Service role en `.env`

En Supabase Dashboard → **Settings → API** → copiar **service_role** (secreto, no va en `VITE_`*):

```env
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

También deben existir `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`.

### 2. Ejecutar seed

```bash
npm run seed:dev-users
```

El script crea usuarios en Auth con `user_metadata.role` y `full_name`. El trigger `handle_new_user` inserta el perfil con el rol correcto.

### 3. SQL post-seed (equipos + wallet cliente)

CLI (proyecto vinculado):

```bash
npx supabase db query -f supabase/scripts/seed_dev_role_users_post.sql --linked
```

O en **SQL Editor**: `[supabase/scripts/seed_dev_role_users_post.sql](../supabase/scripts/seed_dev_role_users_post.sql)`

### 4. Verificar

```sql
SELECT email, role, full_name, team_id
FROM public.profiles
WHERE email LIKE '%@investpro.com'
ORDER BY role;
```

Probar login con cada fila de la tabla superior.

### 5. Leads demo para el agente (CRM / dialer)

Tras el post-seed, asigna leads al UUID real de `agent@investpro.com` (no uses `seed_data.sql` en este flujo):

```bash
npx supabase db query -f supabase/scripts/seed_agent_demo_leads.sql --linked
```

Verificación:

```sql
SELECT COUNT(*) FROM public.leads
WHERE assigned_to = (SELECT id FROM public.profiles WHERE email = 'agent@investpro.com');
```

Debe ser **> 0**. Luego login AGENT → `/dashboard/agent?tab=dialer`. Checklist completo: `[GUIA_AGENT_CLOSER_E2E.md](GUIA_AGENT_CLOSER_E2E.md)`.

---

## Creación manual (sin service role)

1. **Authentication → Users → Add user** por cada email de la tabla.
2. Contraseña: `Dev2026!Inv`
3. Activar **Auto Confirm User**
4. En **User Metadata** (JSON), ejemplo para HEAD:

```json
{
  "role": "HEAD",
  "full_name": "Samuel Director"
}
```

1. Ejecutar el SQL post-seed del paso 3 anterior.

Si el usuario ya existía sin metadata, asignar rol:

```sql
UPDATE public.profiles SET role = 'HEAD', full_name = 'Samuel Director'
WHERE email = 'head@investpro.com';
```

Ver también `[GUIA_STAFF_AUTH.md](GUIA_STAFF_AUTH.md)`.

---

## Metadata por usuario (script / manual)


| Rol           | `full_name` en metadata |
| ------------- | ----------------------- |
| HEAD          | Samuel Director         |
| CHIEF         | Ana Ríos                |
| MANAGER       | Roberto Mendoza         |
| FLOOR_MANAGER | Carlos Navarro          |
| TEAM_LEADER   | Laura Gómez             |
| AGENT         | Pedro Ruiz              |
| CLIENT        | Fernando Guzmán         |


---

## No usar en este flujo

- `**supabase/seed_data.sql**` — borra datos operativos y desvincula FK de `auth.users`. Ver `[CREDENTIALS.md](../CREDENTIALS.md)`.

