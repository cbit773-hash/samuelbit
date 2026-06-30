---
name: investpro-go-live
description: Orquesta go-live y redeploy de InvestPRO Lite en Cloudflare Workers y Supabase. Usar cuando el usuario pida deploy, producción, smoke prod, Auth URLs, db push, edge functions o verificación post-release.
disable-model-invocation: true
---

# Go-live InvestPRO Lite

## URLs

| Capa | Valor |
|------|--------|
| Frontend | `https://cbit773.cbit773.workers.dev` |
| Supabase | `https://rierlbcvpvfxkffxnyup.supabase.co` |
| Project ref | `rierlbcvpvfxkffxnyup` |

## Workflow (orden estricto)

```
- [ ] 1. Cargar .env (no commitear)
- [ ] 2. Supabase CLI login + link
- [ ] 3. Migraciones
- [ ] 4. Edge Functions
- [ ] 5. Auth URLs
- [ ] 6. Deploy frontend
- [ ] 7. Smoke automatizado
```

### Paso 1 — Variables en `.env`

Requeridas: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_APP_URL`, `SUPABASE_DB_PASSWORD`, `SUPABASE_ACCESS_TOKEN`. Ver `.env.example`.

### Paso 2 — CLI Supabase

```powershell
Get-Content .env | ForEach-Object { if ($_ -match '^([^#=]+)=(.*)$') { Set-Item -Path "env:$($matches[1])" -Value $matches[2] } }
npx supabase login --token $env:SUPABASE_ACCESS_TOKEN
npx supabase link --project-ref rierlbcvpvfxkffxnyup
```

### Paso 3 — Migraciones

```powershell
npm run db:push:pooler
node scripts/verify-lite-rpcs.mjs
```

### Paso 4 — Edge Functions

```powershell
npm run deploy:edge-functions
```

Smoke klines: `GET /functions/v1/binance-market-data?symbol=BTCUSDT&interval=1h&limit=5` con header `apikey` (anon).

### Paso 5 — Auth

```powershell
npm run configure:prod-auth
```

O manual: Dashboard → Auth → URL Configuration (Site URL + Redirect URLs prod).

### Paso 6 — Frontend

```powershell
npm run deploy
```

### Paso 7 — Verificación

```powershell
$env:PROD_URL="https://cbit773.cbit773.workers.dev"
npm run verify:prod-smoke
npm run verify:supabase
```

## Smoke manual (browser)

1. `/registro` → onboarding
2. Depósito `manual_bank` → CHIEF aprueba
3. Trade live en `/dashboard/trade`

Usuarios dev: `docs/operations/USUARIOS_PRUEBA_INVESTPRO.md`

## Troubleshooting

Ver [reference.md](reference.md).
