---
name: investpro-crm-rbac
description: Implementa flujos CRM y RBAC InvestPRO — HEAD 4 tabs, CHIEF treasury, leads, staff bundles, depósitos manual_bank. Usar con dashboard head/chief, staff_get_client_bundle, roles o asignación de leads.
disable-model-invocation: true
---

# CRM y RBAC — InvestPRO Lite

## Roles (jerarquía)

`HEAD` → `CHIEF` → `MANAGER` → `FLOOR_MANAGER` → `TEAM_LEADER` → `AGENT` → `CLIENT`

Docs por rol: `docs/roles/`

## HEAD Dashboard (4 tabs)

Archivo: `src/features/crm/pages/HeadDashboard.tsx`

| Tab | Componente |
|-----|------------|
| overview | `OverviewTab` |
| clientes | `ClientsTab` → detalle `/dashboard/head/clientes/:userId` |
| leads | `LeadsTab` |
| personnel | `PersonnelTab` |

Bundle cliente: `staff_get_client_bundle` vía `src/core/supabase/services/staff.service.ts`

## CHIEF — Treasury

- Ruta: `/dashboard/chief`
- Aprueba depósitos `manual_bank` y retiros
- RPC: `chief_review_transaction` · Edge: `approve-transaction`
- Flujo fiat: `ManualBankFlow.tsx` → `DepositTab.tsx`

## Registro cliente

- `/registro` → `complete_client_onboarding`
- Sin confirm email en prod (login inmediato)
- Guía: `docs/guides/GUIA_REGISTRO_AUTH.md`

## RBAC en frontend

- Rutas: `src/app/router.tsx`
- Nav por rol: `src/shared/layout/role-navigation.config.ts`
- Guard: `src/shared/routing/RequireRouteAccess.tsx`

## Usuarios dev

`npm run seed:dev-users` · contraseña común en `docs/operations/USUARIOS_PRUEBA_INVESTPRO.md`

## Smoke CRM

1. Registro → fila en `profiles` + `leads`
2. Depósito manual → `transactions` pending → CHIEF aprueba → `wallets.balance` sube
3. AGENT: leads asignados en `LeadsTab`
