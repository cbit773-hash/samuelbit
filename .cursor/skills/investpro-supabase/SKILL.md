---
name: investpro-supabase
description: Crea migraciones SQL, RPCs, RLS y Edge Functions en Supabase para InvestPRO. Usar con db push, migración, RLS, audit_log, chief_review_transaction, Edge Functions o políticas Storage.
disable-model-invocation: true
---

# Supabase — InvestPRO Lite

## Checklist nueva migración

```
- [ ] SQL en supabase/migrations/YYYYMMDDHHMMSS_nombre.sql
- [ ] Un solo archivo por timestamp
- [ ] RLS fail-closed + GRANT EXECUTE en RPCs
- [ ] npm run test:rls (artefactos locales)
- [ ] npm run db:push:pooler
- [ ] node scripts/verify-lite-rpcs.mjs
- [ ] Deploy Edge Function si aplica
```

## RPCs lite clave

| RPC | Uso |
|-----|-----|
| `chief_review_transaction` | CHIEF aprueba/rechaza depósitos |
| `staff_get_client_bundle` | Cliente 360° HEAD |
| `staff_list_leads` | CRM leads |
| `evaluate_position_brackets` | SL/TP server-side |
| `close_position_at_price` | Cierre forzado posición |
| `create_deposit_transaction` | Depósito manual_bank |

Migración core: `supabase/migrations/20260629100000_investpro_lite_core.sql`

## Edge Functions

| Función | Rol |
|---------|-----|
| `approve-transaction` | Aprobación CHIEF vía HTTP |
| `binance-market-data` | Proxy klines prod |
| `evaluate-position-brackets` | Cron/cierre brackets |
| `process-web-lead` | Registro web + CSV |
| `create-deposit-for-client` | Crypto NOWPayments |

Deploy: `npm run deploy:edge-functions`

Shared: `supabase/functions/_shared/cors.ts`, `supabase-admin.ts`

## Auth

- Checklist: `docs/operations/SUPABASE_AUTH_CHECKLIST.md`
- Script: `npm run configure:prod-auth`
- Confirm email: **desactivado** en prod

## Docs

- `docs/architecture/06_DATABASE_ARCHITECTURE.md`
- `docs/operations/DEVOPS.md`
