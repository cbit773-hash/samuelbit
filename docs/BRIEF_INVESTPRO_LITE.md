# Brief Técnico — InvestPRO Lite

> **Producto:** InvestPRO Lite  
> **Tagline:** Plataforma CFD Perú-first — terminal, wallet, CRM  
> **Versión:** 1.0 — junio 2026  
> **Repo:** `https://github.com/cbit773-hash/samuelbit`  
> **Producción:** `https://cbit773.cbit773.workers.dev`

---

## Cómo usar este documento

| Audiencia | Qué leer |
|-----------|----------|
| Stakeholders | Este brief §1–3 + [operations/12_REQUISITOS_PARA_INICIAR.md](operations/12_REQUISITOS_PARA_INICIAR.md) |
| Arquitectos | [architecture/ARQUITECTURA_LITE.md](architecture/ARQUITECTURA_LITE.md) + [architecture/ADRS.md](architecture/ADRS.md) |
| Desarrollo | [ESTRUCTURA_PROYECTO.md](ESTRUCTURA_PROYECTO.md) + [operations/05_PROJECT_SETUP_GUIDE.md](operations/05_PROJECT_SETUP_GUIDE.md) |
| Operaciones | [operations/ESTADO_DESARROLLO.md](operations/ESTADO_DESARROLLO.md) + [operations/DEVOPS.md](operations/DEVOPS.md) |

**Hilo vivo:** [operations/ESTADO_DESARROLLO.md](operations/ESTADO_DESARROLLO.md)

---

## 1. Resumen ejecutivo

**InvestPRO Lite** es una plataforma web de broker CFD para Latinoamérica (Perú como mercado inicial). Integra terminal de trading, wallet, CRM jerárquico (7 roles) y captación web en un SPA desplegado en Cloudflare Workers con backend Supabase.

**Modelo:** B-Book simulado — el broker es contraparte; sin envío a mercado externo en MVP.

---

## 2. Ecosistema documental

| Documento | Rol |
|-----------|-----|
| [README.md](README.md) | Índice maestro |
| [architecture/ARQUITECTURA_LITE.md](architecture/ARQUITECTURA_LITE.md) | Arquitectura técnica lite |
| [operations/ESTADO_DESARROLLO.md](operations/ESTADO_DESARROLLO.md) | Snapshot producción |
| [architecture/06_DATABASE_ARCHITECTURE.md](architecture/06_DATABASE_ARCHITECTURE.md) | BD, RLS, RPCs |
| [design/INVESTPRO_DESIGN_SYSTEM.md](design/INVESTPRO_DESIGN_SYSTEM.md) | Identidad visual |
| [roles/README.md](roles/README.md) | RBAC |
| [guides/README.md](guides/README.md) | Manuales operativos |

---

## 3. Estado junio 2026

| Aspecto | Estado |
|---------|--------|
| Frontend Workers `cbit773` | Desplegado |
| Migración `investpro_lite_core` | Aplicada |
| 8 Edge Functions | Desplegadas |
| Auth prod | Configurado |
| Smoke browser (registro, depósito, trade) | Pendiente |

---

## 4. Stack

React 19 · Vite 8 · TypeScript 6 · Tailwind 3 · Zustand 5 · Supabase · lightweight-charts 4 · Cloudflare Workers

---

## 5. Design system

Tema oscuro + acento lima `#9fe870`. Archivos: `invest-semantic.css`, `public/design/variables.css`, [design/INVESTPRO_DESIGN_SYSTEM.md](design/INVESTPRO_DESIGN_SYSTEM.md).

---

## 6. RBAC

`HEAD` → `CHIEF` → `MANAGER` → `FLOOR_MANAGER` → `TEAM_LEADER` → `AGENT` → `CLIENT`

---

## 7. Glosario

| Término | Definición |
|---------|------------|
| **InvestPRO Lite** | Alcance arquitectónico de este despliegue |
| **B-Book** | Broker como contraparte del cliente |
| **FTD** | First Time Deposit |
| **RLS** | Row Level Security en PostgreSQL |

---

*Brief InvestPRO Lite v1.0 — junio 2026*
