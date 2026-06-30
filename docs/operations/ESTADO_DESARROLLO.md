# Estado InvestPRO Lite

> Snapshot operativo InvestPRO Lite — HEAD CRM básico, terminal y wallet  
> **Última actualización:** junio 2026 — go-live ejecutado

## Producción

| Capa | URL / ref | Estado |
|------|-----------|--------|
| **Frontend** | https://cbit773.cbit773.workers.dev | Desplegado (`npm run deploy`) |
| **Supabase** | https://rierlbcvpvfxkffxnyup.supabase.co | Activo |
| **Hosting** | Cloudflare Workers `cbit773` | OK |
| **Repo** | https://github.com/cbit773-hash/samuelbit | Sincronizar con `git push` |

## Go-live aplicado

| Paso | Estado |
|------|--------|
| Migración `20260629100000_investpro_lite_core.sql` | Aplicada en prod |
| Migraciones `202605360002`, `202605370001` | Aplicadas en prod |
| Edge Functions (8) | Desplegadas |
| Auth Site URL + Redirects | Configurados vía Management API |
| Smoke HTTP frontend | HTTP 200 OK |

## Scripts operativos

```bash
npm run deploy                 # Workers cbit773 (prod)
npm run db:push:pooler         # migraciones (SUPABASE_DB_PASSWORD)
npm run deploy:edge-functions  # Edge Functions
npm run configure:prod-auth    # Auth URLs prod
npm run verify:prod-smoke      # PROD_URL=https://cbit773.cbit773.workers.dev
npm run verify:supabase
node scripts/verify-lite-rpcs.mjs
```

## Auth Supabase (prod)

| Campo | Valor |
|-------|--------|
| Site URL | `https://cbit773.cbit773.workers.dev` |
| Redirect URLs | `https://cbit773.cbit773.workers.dev/**`, `.../auth/restablecer` |

Confirm email: **desactivado**.

## Smoke manual pendiente (browser)

1. [ ] `/registro` → onboarding
2. [ ] Depósito `manual_bank` → CHIEF aprueba (`approve-transaction`)
3. [ ] Trade live + margin call en `/dashboard/trade`

Usuarios dev: `chief@investpro.com` / `client@investpro.com` — `Dev2026!Inv`

## Notas

- `verify-lite-rpcs.mjs` puede marcar MISSING en RPCs con firma específica (PostgREST devuelve 404 con body `{}`); la migración sí se aplicó.
- Bucket `deposit-receipts`: crear en Storage si falla upload de comprobante.
- Notificaciones Resend: stub en `supabase/functions/_shared/notifications.ts` (opcional configurar después).
