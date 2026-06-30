# 04. Roadmap de Implementación — InvestPRO

Este documento refleja el **estado real del repositorio** respecto al plan original de 4 semanas. La plataforma superó el alcance del MVP inicial: hay 7 dashboards operativos, backend en Supabase (sin Node.js propio) y múltiples integraciones documentadas en guías operativas.

**Última actualización:** Mayo 2026

---

## Resumen ejecutivo

| Área | Estado | Notas |
|------|--------|-------|
| Frontend (Vite + React + TS + Tailwind) | Hecho | App en producción local; deploy pendiente en Cloudflare |
| Supabase (Auth, DB, RLS, migraciones) | Hecho | Schema + 8 migraciones + seeds |
| RBAC (7 roles) | Hecho | `MainLayout`, rutas por rol, demo + login real |
| Trading (charts, WS, posiciones en BD) | Parcial | Shell Fortrade, multi-stream Binance, velas REST, margen v1, pending orders |
| Wallet y pagos | Parcial | Código NOWPayments + manual; cuenta/deploy pendiente |
| CRM y dialer | Parcial | Agent CRM en vivo; Twilio VoIP en código, deploy pendiente |
| Legal y captación | Hecho | `/legal/*`, `/registro` estilo Fortrade, GTM, UTM |
| KYC y notificaciones | Parcial | Código listo; Resend API key pendiente |
| Web3 (Coinbase) | Parcial | SDK en wallet UI; faucet simulado, no on-chain |

---

## Fase 1: Arquitectura base y diseño UI

**Objetivo:** Cimientos del proyecto y sistema de diseño.

- [x] Elaboración de `ARCHITECTURE.md` y documentación en `docs/`
- [x] Proyecto **Vite + React + TypeScript** (`package.json`, `src/main.tsx`)
- [x] **Supabase**: Auth, PostgreSQL, RLS, Storage (KYC), migraciones en `supabase/migrations/`
- [x] **React Router** con rutas públicas y protegidas por rol (`src/app/router.tsx`, `MainLayout`)
- [x] **Tailwind** — paleta ámbar / negro (`tailwind.config.js`, `index.css`)
- [x] **Layout base**: sidebar dinámico por rol, navbar en landings (`MainLayout`, `Navbar`)
- [x] UI por feature (dashboards, tabs, tablas, formularios) — sin librería `GlassCard` centralizada, pero patrón visual consistente

---

## Fase 2: Trading engine y WebSockets

**Objetivo:** Datos de mercado en tiempo real.

- [x] **lightweight-charts** en `CandlestickChart.tsx` (terminal de trading)
- [x] **Zustand** — `trading.store.ts`, `wallet.store.ts`, `auth.store.ts`
- [x] **`useMarketWebSocket.ts`** — Binance WS, reconexión, `MarketLiveBadge`
- [x] Web Workers para indicadores (SMA, Bollinger, RSI) — `indicators.worker.ts`, `useIndicatorWorker`, overlay en `CandlestickChart`
- [x] **Order Book** (`OrderBook.tsx`) y lista de posiciones (`PositionsList`, `ClientPositionsTable`)
- [x] Posiciones del cliente en **Supabase** — `positions.service.ts`, `useClientPositions.ts`, abrir/cerrar desde terminal

---

## Fase 3: Gestión de órdenes y riesgo

**Objetivo:** Apertura, gestión y métricas de posiciones.

- [x] `margin.calculator.ts` + tests Vitest — `src/features/trading/utils/margin.calculator.ts`
- [x] Boleta de órdenes — integrada en `TradingTerminal.tsx` (compra/venta por volumen; no componente `OrderTicket.tsx` aislado)
- [x] Apertura y cierre **reales en BD** (no solo mock local)
- [ ] Motor **Margin Call / Stop Out** automático — no implementado
- [x] Panel de métricas del cliente — KPIs en `ClientDashboard` (balance wallet, PnL, posiciones abiertas)

---

## Fase 4: Web3, legal y roles

**Objetivo:** Cumplimiento normativo, fondeo y roles operativos.

- [x] **Coinbase Wallet SDK** — dependencia instalada; conexión en `wallet.store.ts` / UI en `WalletDashboard`
- [ ] Faucet on-chain (smart contract) — solo simulación UI en wallet; sin contrato desplegado
- [x] **Módulo legal público**
  - `/legal/terminos`, `/legal/privacidad`, `/legal/riesgos`
  - Banner `RiskDisclaimer` en landings, login y dashboards
  - Centro legal en dashboard: `LegalView`
  - Referencia: `docs/LEGAL_PUBLICACION.md`
- [x] **KYC** — upload cliente, revisión CHIEF, Storage, RPCs (`docs/GUIA_KYC.md`)
- [x] **Dashboards por rol** (7 niveles RBAC):

| Rol | Ruta | Estado |
|-----|------|--------|
| CLIENT | `/dashboard/trade` + `/dashboard/account?tab=...` | En vivo (wallet, trading, KYC) |
| AGENT | `/dashboard/agent` | En vivo (10 herramientas, Twilio, SOS, cobro) · `GUIA_AGENT_CLOSER_E2E.md` |
| TEAM_LEADER | `/dashboard/team-leader` | UI |
| FLOOR_MANAGER | `/dashboard/floor` | UI |
| MANAGER | `/dashboard/manager` | UI |
| CHIEF | `/dashboard/chief` | En vivo (transacciones, reportes, KYC) |
| HEAD | `/dashboard/head` | En vivo (KPIs, leads, depósitos, personal) |
| ADVISOR | `/dashboard/advisor` | UI |

---

## Extensiones implementadas (post-plan original)

Funcionalidad añadida después del roadmap de 4 semanas, alineada con `docs/12_REQUISITOS_PARA_INICIAR.md`.

### Autenticación y onboarding

- [x] Login real + demo por rol (`auth.store.ts`)
- [x] Registro cliente: `registerClient` + RPC `complete_client_onboarding`
- [x] Registros web → Head: notificación HEAD/CHIEF, CSV Storage, pestaña `web-registrations` (`docs/GUIA_LEADS_WEB.md`)
- [x] Recuperación de contraseña: `/auth/recuperar`, `/auth/restablecer`
- [x] Guía: `docs/GUIA_REGISTRO_AUTH.md`

### Captación y marketing

- [x] Landing principal `/` (Hero, beneficios, mercados, footer legal)
- [x] Landing de captación **`/registro`** — diseño tipo Fortrade (card centrada, 2 pasos: identidad → credenciales)
  - Componentes: `src/features/landing/components/captacion/`
  - UTM → `interest` en lead; `trackLeadConversion` (GTM)
- [x] Plan Google Ads documentado — `docs/11_PLAN_MERCADEO_GOOGLE_ADS.md`

### Wallet y pagos

- [x] Tablas `wallets`, `transactions`, RPCs atómicas, RLS
- [x] UI depósito manual / crypto / retiros — `ClientDashboard`, `WalletDashboard`
- [x] Edge Functions: `create-deposit`, `nowpayments-webhook`, `approve-transaction`, `request-withdrawal`
- [x] CHIEF aprueba/rechaza transacciones
- [ ] **Deploy operativo** NOWPayments (cuenta, secrets, IPN) — ver `docs/GUIA_NOWPAYMENTS.md`

### CRM y telefonía

- [x] CRM leads en Supabase — asignación, estados, notas (`leads.service.ts`)
- [x] Dashboard Agent — cola dialer, callbacks, FTD vía `deposits`
- [x] **Dialer VoIP Twilio (código)** — `call_logs`, Edge Functions, `useTwilioDialer`, botón Llamar
- [ ] **Deploy operativo** Twilio (cuenta, número, TwiML App) — ver `docs/GUIA_TWILIO_VOIP.md`

### Notificaciones y reportes

- [x] Tabla `notifications`, Realtime, toasts (`useNotificationRealtime`)
- [x] Edge Functions + plantillas Resend (`docs/GUIA_NOTIFICACIONES.md`)
- [ ] API key Resend en producción — pendiente
- [x] Reportes CHIEF — CSV/PDF conciliación (`docs/GUIA_REPORTES_Y_REALTIME.md`)

### Servicios de datos

- [x] Servicios Supabase: `profiles`, `leads`, `deposits`, `positions`, `teams`, `wallet`, `kyc`, `calls`, `notifications`
- [x] Hooks genéricos: `useSupabaseQuery`, `useSupabaseMutation`
- [x] Tipos: `database.types.ts`

---

## Pendiente para lanzamiento operativo

Prioridad según `docs/12_REQUISITOS_PARA_INICIAR.md`:

| Ítem | Tipo | Guía / acción |
|------|------|----------------|
| Cuenta y deploy NOWPayments | Operativo | `docs/GUIA_NOWPAYMENTS.md` |
| Cuenta y deploy Twilio VoIP | Operativo | `docs/GUIA_TWILIO_VOIP.md` |
| API key Resend | Operativo | `docs/GUIA_NOTIFICACIONES.md` |
| Dominio + DNS + deploy frontend | Infra | Cloudflare Pages / Vercel |
| Supabase Pro + migraciones en prod | Infra | SQL en orden del repo |
| SAS, T&C revisados por abogado | Legal | Ya publicados en web; revisión externa recomendada |
| Google Ads verificado | Marketing | `docs/11_PLAN_MERCADEO_GOOGLE_ADS.md` |

---

## Siguientes pasos técnicos (post-MVP)

- [ ] `margin.calculator.ts` con cobertura Vitest y reglas Stop Out / Margin Call
- [x] Web Workers para indicadores técnicos pesados (SMA 20, BB 20/2σ, RSI 14)
- [ ] Componente `OrderTicket` dedicado (SL/TP en UI)
- [ ] Faucet Web3 real (contrato + red test/mainnet configurada)
- [ ] Pasarela fiat (Stripe / Ramp) — Fase 2 negocio
- [ ] Backend Node.js propio (Fastify) — opcional; hoy Supabase cubre el MVP
- [ ] Redis Pub/Sub para escalado de WebSockets
- [ ] Auditoría de seguridad externa
- [ ] Auto-dial predictivo y barge-in en dialer (Fase 2 VoIP)

---

## Mapa de documentación relacionada

| Documento | Contenido |
|-----------|-----------|
| [`ARCHITECTURE.md`](../ARCHITECTURE.md) | Arquitectura global y RBAC |
| [`12_REQUISITOS_PARA_INICIAR.md`](12_REQUISITOS_PARA_INICIAR.md) | Checklist de lanzamiento |
| [`GUIA_NOWPAYMENTS.md`](GUIA_NOWPAYMENTS.md) | Pasarela crypto |
| [`GUIA_TWILIO_VOIP.md`](GUIA_TWILIO_VOIP.md) | Dialer agentes |
| [`GUIA_REGISTRO_AUTH.md`](GUIA_REGISTRO_AUTH.md) | Auth y onboarding |
| [`GUIA_KYC.md`](GUIA_KYC.md) | Verificación de identidad |
| [`GUIA_NOTIFICACIONES.md`](GUIA_NOTIFICACIONES.md) | Email y Realtime |
| [`LEGAL_PUBLICACION.md`](LEGAL_PUBLICACION.md) | URLs legales |
| [`11_PLAN_MERCADEO_GOOGLE_ADS.md`](11_PLAN_MERCADEO_GOOGLE_ADS.md) | Campañas y landing `/registro` |
| [`19_GUIA_FUNCIONAMIENTO_SISTEMA.md`](19_GUIA_FUNCIONAMIENTO_SISTEMA.md) | Qué es cada pantalla y módulo |
| [`GUIA_LEADS_WEB.md`](GUIA_LEADS_WEB.md) | Registro `/registro` → lead + CSV + panel Head |

---

*Roadmap alineado al estado del código — InvestPRO — Mayo 2026*
