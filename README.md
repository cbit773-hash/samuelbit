# InvestPRO Lite — Trading Platform

> **Plataforma CFD Perú-first** — terminal, wallet, CRM jerárquico, Supabase + Cloudflare Workers.

## Documentación

**Índice maestro:** [docs/README.md](./docs/README.md)

| Prioridad | Documento |
|-----------|-----------|
| 1 | [Arquitectura Lite](./docs/architecture/ARQUITECTURA_LITE.md) |
| 2 | [Brief InvestPRO Lite](./docs/BRIEF_INVESTPRO_LITE.md) |
| 3 | [Estado desarrollo](./docs/operations/ESTADO_DESARROLLO.md) |
| 4 | [Estructura del proyecto](./docs/ESTRUCTURA_PROYECTO.md) |

Guías Perú: [mercado](./docs/guides/GUIA_PERU_MERCADO.md) · [pagos](./docs/guides/GUIA_PERU_PAGOS.md) · [AML/KYC](./docs/guides/GUIA_PERU_AML_KYC.md)

## Stack

React 19 · Vite 8 · TypeScript 6 · Tailwind 3 · Zustand 5 · Supabase · lightweight-charts 4 · Cloudflare Workers

## Inicio rápido

```bash
git clone https://github.com/cbit773-hash/samuelbit.git
cd samuelbit
npm install
cp .env.example .env
npm run dev
```

## RBAC (7 roles)

`HEAD` → `CHIEF` → `MANAGER` → `FLOOR_MANAGER` → `TEAM_LEADER` → `AGENT` → `CLIENT`

Detalle: [docs/roles/08_ROLES_Y_FUNCIONES.md](./docs/roles/08_ROLES_Y_FUNCIONES.md)

## Cursor (agentes)

Reglas: `.cursor/rules/` · Skills: `.cursor/skills/` · Ver también [AGENTS.md](./AGENTS.md)
