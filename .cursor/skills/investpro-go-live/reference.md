# Go-live — Troubleshooting

## Supabase CLI 403

- Causa: token de otra cuenta (ej. cuenta GitHub ajena vs cbit773-hash)
- Fix: generar `SUPABASE_ACCESS_TOKEN` en cuenta dueña del proyecto InvesPro
- Login: `npx supabase login --token sbp_...`

## db push — historial divergente

```
Remote migration versions not found in local migrations directory
```

- Remoto tiene migraciones que no existen localmente
- Fix: `npx supabase migration repair --status reverted <versiones>`
- Luego `npm run db:push:pooler`

## db push — duplicate key schema_migrations

- Causa: dos archivos con el mismo timestamp de migración
- Fix: renombrar uno (ej. `202605360001` → `202605360002`)

## verify-lite-rpcs — MISSING en RPCs

- Falso negativo común: PostgREST devuelve 404 al llamar RPC con body `{}`
- Si `db push` terminó OK y `audit_log` existe, la migración está aplicada
- Opcional: recargar schema en SQL Editor: `NOTIFY pgrst, 'reload schema';`

## Edge Functions — Module not found

- Verificar imports en `supabase/functions/_shared/`
- Ejemplo: `notifications.ts` requerido por `create-deposit-for-client`

## Cloudflare — infinite loop _redirects

- No usar `public/_redirects` con Workers SPA
- Usar `not_found_handling: single-page-application` en `wrangler.jsonc`

## Git push 403

- Push con cuenta `cbit773-hash`: `gh auth login`

## Bucket deposit-receipts

- Si falla upload de comprobante, crear bucket privado `deposit-receipts` en Storage Dashboard
