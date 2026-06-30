# Checklist Supabase Auth (producción / desarrollo real)

Completar en **Supabase Dashboard** del proyecto vinculado (`rierlbcvpvfxkffxnyup`).

## Authentication → URL Configuration

| Campo | Valor (dev) | Valor (prod Cloudflare) |
|-------|-------------|-------------------------|
| Site URL | `http://localhost:5173` | `https://cbit773.cbit773.workers.dev` |
| Redirect URLs | `http://localhost:5173/auth/restablecer` | `https://cbit773.cbit773.workers.dev/**` y `https://cbit773.cbit773.workers.dev/auth/restablecer` |

En producción, sustituir por el dominio real (HTTPS) si cambia el proyecto Pages.

Script local: `npm run print:auth-urls`

## Authentication → Providers → Email

- [ ] **Confirm email** desactivado (login inmediato tras `/registro`)

## Migraciones

```bash
npx supabase db push
```

Debe responder: `Remote database is up to date.`

## Verificar RPCs (SQL Editor)

```sql
SELECT proname FROM pg_proc
WHERE proname IN ('complete_client_onboarding', 'ensure_my_profile', 'get_auth_role');
```

Deben existir las tres funciones.

## Script local

```bash
node scripts/verify-supabase-health.mjs
```
