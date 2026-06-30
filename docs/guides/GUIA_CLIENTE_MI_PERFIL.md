# Guía — Mi perfil (cliente) y aprobación CHIEF

## Ruta cliente

`/dashboard/account?tab=perfil`

## Contenido

1. **Tarjeta InvestPRO** — nombre, ID corto, estado KYC (solo lectura).
2. **Datos personales** — email, nombre (bloqueado si KYC verificado), teléfono editable, país, registro.
3. **Cuenta de retiro** — banco, CCI, titular, USDT TRC20 opcional.

## Flujo de aprobación

| Estado | Cliente | Retiro bancario |
|--------|---------|-----------------|
| Sin registro | Completa formulario | Bloqueado |
| `pending` | Ve datos completos | Bloqueado |
| `approved` | Ve datos; puede solicitar cambio | Habilitado (prefill en Retirar) |
| `rejected` | Ve motivo; corrige y reenvía | Bloqueado |

1. Cliente → **Enviar a revisión** → RPC `submit_my_payout_profile`
2. Notificación in-app a CHIEF y HEAD
3. CHIEF → Dashboard → **Datos de retiro (CCI)** → Aprobar / Rechazar
4. RPC `chief_review_payout_profile` → notificación al cliente

## CHIEF

- Ruta: `/dashboard/chief?task=payout-profiles`
- Tarea: **Datos de retiro (CCI)**
- Solo rol **CHIEF** puede aprobar/rechazar (HEAD/MANAGER listan).

## Migración

`supabase/migrations/202605360001_client_payout_profiles.sql`

```bash
npx supabase db push
```

## Prueba E2E

1. Cliente completa Mi perfil → estado `pending` en `client_payout_profiles`.
2. CHIEF aprueba → cliente `approved`.
3. Cliente retira por banco → campos prellenados.
4. Cliente solicita cambio CCI → `pending` → retiro bancario bloqueado hasta nueva aprobación.

## Archivos

| Archivo | Rol |
|---------|-----|
| `src/features/client/tabs/ProfileTab.tsx` | UI cliente |
| `src/core/supabase/services/client-payout-profile.service.ts` | API |
| `src/features/crm/components/chief/PayoutProfileReviewPanel.tsx` | UI CHIEF |
