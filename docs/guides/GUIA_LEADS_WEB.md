# Guía — Registros web → Head (CSV + notificaciones)

Flujo cuando un usuario completa **Crear cuenta** en `/registro`.

---

## Flujo automático

1. `registerClient()` → RPC `complete_client_onboarding`
2. Crea/actualiza `leads` con `source = 'web'`, `client_user_id`, estado `Nuevo`
3. Notificación in-app a cada perfil **HEAD** y **CHIEF**
4. Frontend invoca Edge Function `process-web-lead` con `lead_id`
5. La función sube CSV a Storage y registra fila en `lead_registration_files`
6. Email al staff (si `RESEND_API_KEY` está configurado)

---

## Deploy en Supabase

### 1. Migración SQL

Ejecutar en **SQL Editor** (en orden si faltan dependencias):

1. `supabase/migrations/202605220001_notifications.sql`
2. `supabase/migrations/202605250001_client_onboarding.sql`
3. **`supabase/migrations/202605270001_web_lead_registration.sql`**

Verificar:

```sql
SELECT column_name FROM information_schema.columns
WHERE table_name = 'leads' AND column_name IN ('source', 'client_user_id');

SELECT * FROM storage.buckets WHERE id = 'lead-registrations';
```

### 2. Edge Function

```bash
supabase functions deploy process-web-lead
```

**Secrets** (Edge Functions):

| Secret | Uso |
|--------|-----|
| `SUPABASE_URL` | Automático en deploy |
| `SUPABASE_SERVICE_ROLE_KEY` | Automático |
| `APP_URL` | Enlaces en emails |
| `RESEND_API_KEY` | Email al Head (opcional) |

### 3. Realtime (opcional)

En **Database → Replication**, añadir `leads` a `supabase_realtime` para refresco automático en la pestaña Head.

---

## Panel Head

| Ruta | Contenido |
|------|-----------|
| `/dashboard/head?tab=web-registrations` | Tabla de registros, descarga CSV, asignar agente |
| Overview | KPIs “Registros web hoy” y “Web sin asignar” |

**Chief:** tarea **Registros Web** en `/dashboard/chief` o enlace sidebar a la misma pestaña Head.

---

## Prueba E2E

1. Aplicar migración `202605270001`.
2. Deploy `process-web-lead`.
3. Registrar usuario nuevo en `/registro`.
4. En Supabase:
   - `leads.source = 'web'`
   - `lead_registration_files` con `storage_path`
   - Archivo en bucket `lead-registrations`
   - `notifications` para HEAD/CHIEF
5. Login como HEAD → **Registros Web** → descargar CSV.
6. Toast con enlace a la pestaña (si Realtime activo en `notifications`).

---

## Resolución de problemas

| Síntoma | Causa probable |
|---------|----------------|
| Lead no aparece | Migración onboarding no aplicada |
| Sin CSV | Edge Function no desplegada, falló, o registro &gt; 10 min (ventana en `process-web-lead`) — revisar logs Functions |
| Sin email | Falta `RESEND_API_KEY` (in-app sigue funcionando) |
| No descarga CSV | Bucket/policies Storage; usar botón CSV (genera desde datos en navegador) |

---

## Archivos clave

| Archivo | Rol |
|---------|-----|
| `supabase/migrations/202605270001_web_lead_registration.sql` | Schema + RPC |
| `supabase/functions/process-web-lead/index.ts` | CSV + Storage |
| `src/features/auth/store/auth.store.ts` | RPC + invoke post-registro |
| `src/core/supabase/services/web-lead-processing.service.ts` | `processWebLead(lead_id)` |
| `src/features/crm/components/head/WebRegistrationsTab.tsx` | UI Head |
| `src/core/supabase/services/web-leads.service.ts` | Queries frontend |
