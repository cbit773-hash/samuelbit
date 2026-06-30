# Guía — Registro de clientes y recuperación de contraseña

> **Nota:** La simulación RBAC en login fue retirada. Solo acceso con Supabase Auth real (`/registro` o usuarios creados en Dashboard).

## Flujo de registro (`/registro`) — contraseña generada

1. **Paso 1 — Identidad:** nombre, apellido, email, teléfono (con país).
2. **Paso 2 — Confirmación:** resumen de datos, aceptación de T&C, botón **Crear cuenta** (el usuario no escribe contraseña).
3. Al crear cuenta: el sistema genera una contraseña segura (`generateSecurePassword`) y registra en Supabase Auth.
4. RPC `complete_client_onboarding`: perfil CLIENT, wallet, lead web, notificaciones HEAD/CHIEF (devuelve `lead_id`).
5. Frontend invoca `process-web-lead` con `lead_id` vía [`web-lead-processing.service.ts`](../src/core/supabase/services/web-lead-processing.service.ts) (fire-and-forget; CSV en Storage sin contraseña).
6. **Pantalla “Tu contraseña está lista”:** checklist, copiar clave, **Ir a mi cuenta**, **Hacer mi primer depósito**, o **Establecer nueva contraseña** (`updatePassword`).
7. La contraseña **no** se guarda en `leads`, CSV ni email (solo en pantalla en memoria).

Detalle operativo Head: [`GUIA_LEADS_WEB.md`](GUIA_LEADS_WEB.md).

## Migraciones requeridas

Aplicar todas las migraciones en `supabase/migrations/` (orden por timestamp), por ejemplo:

```bash
npx supabase db push
```

Mínimo para registro cliente: hasta `202605320001_auth_profiles_hardening.sql`.

Verificar:

```sql
SELECT proname FROM pg_proc WHERE proname = 'complete_client_onboarding';
```

## Edge Function

```bash
supabase functions deploy process-web-lead
```

Secrets: `APP_URL`, `RESEND_API_KEY` (opcional). Ver `GUIA_LEADS_WEB.md`.

## Recuperación de contraseña

| Ruta | Función |
|------|---------|
| `/auth/recuperar` | Envía email con `resetPasswordForEmail` |
| `/auth/restablecer` | Usuario define nueva contraseña (`updateUser`) |

## Configuración Supabase (Auth)

1. **Authentication → URL Configuration**
   - Site URL: `http://localhost:5173` (dev)
   - Redirect URLs: `http://localhost:5173/auth/restablecer`

2. **Authentication → Providers → Email**
   - Desactivar **Confirm email** para login inmediato tras registro.

3. **Authentication → Password security** (evita error 422 al cambiar contraseña)
   - Requisitos: mayúscula, minúscula, número y símbolo (o alinear validación en app).
   - Si activas **Secure password change** o **Require current password**, el flujo `/auth/restablecer` debe usar el enlace del correo (`type=recovery` en la URL), no una sesión normal ya iniciada.
   - Contraseña nueva debe ser **distinta** a la anterior.

3. Variables en `.env`:

```env
VITE_APP_URL=http://localhost:5173
```

## Prueba rápida (E2E)

1. Ir a `/registro?utm_source=google&utm_campaign=test&asset=crypto` — badge de interés visible.
2. Completar paso 1 y paso 2 (indicador “Paso 1 de 2”).
3. Pantalla contraseña → Copiar → **Ir a mi cuenta** (sin pasar por `/auth/login`; sesión ya activa).
4. Opcional: **Hacer mi primer depósito** → tab `depositar`.
5. Supabase: `profiles`, `leads` (`source=web`, `client_user_id`), `lead_registration_files` + bucket `lead-registrations` (invocar edge dentro de 10 min).
6. Login HEAD → `/dashboard/head?tab=web-registrations`.
7. Consola/`dataLayer`: evento `lead_form_submit` con UTM si GTM está configurado.
