# Estructura del proyecto — Samuel bit (InvesPro)

> Árbol orientado a desarrollo. Se omiten `node_modules/`, `.git/`, `dist/` y cachés de build.

## Código del cliente (inversor)

| Rol | Archivo principal | Ruta en la app |
|-----|-------------------|----------------|
| **Cuenta / billetera (actual)** | `src/features/client/pages/ClientAccountPage.tsx` | `/dashboard/account` |
| **Terminal de trading** | `src/features/trading/pages/TradingTerminal.tsx` + `layout/TradingWorkspace.tsx` | `/dashboard/trade` |
| **Redirección legacy** | `src/features/client/components/LegacyClientRedirect.tsx` | `/dashboard/client` → redirige |
| **Dashboard antiguo** | `src/features/client/pages/ClientDashboard.tsx` | (legacy, no es la ruta principal) |
| **Rutas** | `src/app/router.tsx` | Registra `account`, `trade`, `client` |
| **Datos compartidos** | `src/features/client/context/ClientDataContext.tsx` | Wallet, perfil, refresh |
| **Pestañas de cuenta** | `src/features/client/tabs/*.tsx` | Resumen, depósito, retiro, etc. |
| **Documentación del rol** | `docs/17_ROL_CLIENT_INVESTOR.md` | Especificación funcional |

La página que hoy muestra la UI del inversor es **`ClientAccountPage.tsx`**, que compone las pestañas definidas en `src/features/client/config/account-tabs.ts`.

---

## Raíz del repositorio

```
Samuel bit/
├── .env / .env.example
├── ARCHITECTURE.md
├── CREDENTIALS.md
├── README.md
├── index.html
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── docs/                    # Documentación de negocio y guías
├── public/                  # Assets estáticos (imágenes, design tokens)
├── scripts/                 # Utilidades Node (seed, migraciones tema, health)
├── src/                     # Frontend React + Vite
└── supabase/                # Backend: migraciones, Edge Functions, SQL
```

---

## `src/` — Frontend

```
src/
├── main.tsx
├── App.tsx
├── index.css
├── app/
│   └── router.tsx                 # Rutas de toda la app
├── config/
│   └── supabase.ts
├── core/
│   ├── payments/                  # NOWPayments, payment.service
│   ├── reports/
│   ├── supabase/
│   │   ├── client.ts
│   │   ├── database.types.ts
│   │   ├── hooks/
│   │   └── services/              # wallet, positions, kyc, web-leads, etc.
│   └── twilio/
├── features/
│   ├── advisor/                   # Panel asesor
│   ├── auth/                      # Login, registro, recuperar contraseña
│   ├── client/                    # ★ PANEL DEL INVERSOR
│   │   ├── components/
│   │   ├── config/
│   │   │   └── account-tabs.ts
│   │   ├── context/
│   │   │   └── ClientDataContext.tsx
│   │   ├── pages/
│   │   │   ├── ClientAccountPage.tsx   # ★ Entrada principal cliente
│   │   │   └── ClientDashboard.tsx     # Legacy
│   │   └── tabs/
│   │       ├── AccountSummaryTab.tsx
│   │       ├── DepositTab.tsx
│   │       ├── WithdrawTab.tsx
│   │       ├── TransactionsTab.tsx
│   │       ├── PortfolioTab.tsx
│   │       ├── NotificationsTab.tsx
│   │       └── SecurityKycTab.tsx
│   ├── crm/                       # Staff: agent, floor, head, manager…
│   ├── kyc/
│   ├── landing/                   # Marketing, captación, registro web
│   ├── legal/
│   ├── notifications/
│   ├── reports/
│   ├── trading/                   # ★ Ver sección detallada más abajo
│   └── wallet/                    # ★ Ver sección detallada más abajo
├── shared/
│   ├── components/
│   ├── layout/                    # PlatformShell, RoleNav, MainLayout…
│   ├── routing/
│   │   └── paths.ts
│   ├── theme/
│   └── ui/                        # Bolt* design system
└── styles/
    ├── bolt-tokens.css
    └── invest-semantic.css
```

---

## `src/features/client/` — Panel del inversor (detalle)

```
src/features/client/
├── components/
│   ├── ActionBanner.tsx              # Mensajes éxito/error en cuenta
│   ├── CryptoDepositSection.tsx      # Bloque depósito crypto en cuenta
│   ├── DepositContextBanner.tsx      # Contexto al volver de un depósito
│   ├── DepositTrustFooter.tsx        # Pie de confianza en depósitos
│   ├── LegacyClientRedirect.tsx      # /dashboard/client → account
│   ├── WalletErrorBanner.tsx
│   └── WalletTabSkeleton.tsx
├── config/
│   └── account-tabs.ts               # IDs y metadatos de pestañas (?tab=)
├── context/
│   └── ClientDataContext.tsx         # Provider: wallet, perfil, refreshAll
├── pages/
│   ├── ClientAccountPage.tsx         # ★ Entrada: /dashboard/account
│   └── ClientDashboard.tsx           # Legacy (no usar como principal)
└── tabs/
    ├── AccountSummaryTab.tsx         # Resumen, balance, métricas
    ├── DepositTab.tsx                # Depositar (Perú + crypto)
    ├── WithdrawTab.tsx               # Solicitar retiro
    ├── TransactionsTab.tsx             # Historial movimientos
    ├── PortfolioTab.tsx              # Posiciones abiertas
    ├── NotificationsTab.tsx
    └── SecurityKycTab.tsx            # KYC + seguridad
```

---

## `src/features/trading/` — Terminal de mercado (detalle)

Ruta: `/dashboard/trade` · Guía: [GUIA_TRADINGVIEW_TERMINAL_MERCADO.md](./GUIA_TRADINGVIEW_TERMINAL_MERCADO.md)

```
src/features/trading/
├── components/
│   ├── AccountModeSwitcher.tsx       # Demo / Live
│   ├── CandlestickChart.tsx          # Gráfico principal (lightweight-charts)
│   ├── ChartToolbar.tsx              # Timeframe, indicadores, herramientas
│   ├── ClientPositionsSnapshot.tsx   # Resumen posiciones en terminal
│   ├── ClientPositionsTable.tsx
│   ├── DemoAccountBanner.tsx
│   ├── InstrumentWatchlist.tsx       # Lista de instrumentos
│   ├── MarketLiveBadge.tsx           # Estado conexión mercado
│   ├── MobileOrderSheet.tsx          # Panel órdenes en móvil
│   ├── OperationsBottomPanel.tsx     # Posiciones + historial inferior
│   ├── OrderBook.tsx
│   ├── OrderPanel.tsx                # Market / limit, volumen, SL/TP
│   ├── PendingOrderForm.tsx          # Órdenes pendientes
│   └── PositionsList.tsx
├── config/
│   └── instruments.ts                # Catálogo de símbolos
├── context/
│   └── TradingPositionsContext.tsx
├── hooks/
│   ├── useBinanceKlines.ts           # Velas desde Binance
│   ├── useChartPositionOverlays.ts
│   ├── useClientMetricsBootstrap.ts
│   ├── useClientPositions.ts
│   ├── useIndicatorWorker.ts
│   ├── useMarketWebSocket.ts
│   ├── useMultiMarketStream.ts       # Precios multi-mercado
│   ├── useNotificationRealtime.ts
│   ├── usePendingOrderWatcher.ts     # Ejecuta órdenes pendientes
│   ├── useTradingChartData.ts
│   └── useWalletTradingSync.ts       # Sincroniza wallet ↔ trading
├── layout/
│   └── TradingWorkspace.tsx          # ★ Layout completo del terminal
├── pages/
│   ├── TradingTerminal.tsx           # ★ Página del terminal (cliente)
│   └── SupervisorMarketPage.tsx      # Vista supervisor staff
├── store/
│   └── trading.store.ts              # Zustand: símbolo, modo, UI terminal
├── utils/
│   ├── chart-time.ts
│   ├── indicators.ts
│   ├── margin.calculator.ts          # Margen requerido / libre
│   ├── order-guards.ts
│   ├── pending-order.utils.ts
│   ├── position-mappers.ts
│   ├── symbol-map.ts
│   ├── trading-account.ts
│   └── ws-safe.ts
└── workers/
    └── indicators.worker.ts          # RSI, EMA, etc. en Web Worker
```

---

## `src/features/wallet/` — Billetera y pagos (detalle)

Usado desde las pestañas del cliente y flujos de depósito/retiro.

```
src/features/wallet/
├── components/
│   ├── CryptoDepositPanel.tsx        # NOWPayments / crypto
│   ├── ManualDepositPeruFlow.tsx     # Transferencia bancaria Perú
│   ├── TransactionList.tsx
│   ├── TransactionStatusBadge.tsx
│   └── WithdrawalPeruFlow.tsx
├── constants/
│   └── transaction-status.ts
├── hooks/
│   └── useWalletData.ts
├── pages/
│   └── WalletDashboard.tsx           # Legacy; redirige a /dashboard/account
├── store/
│   └── wallet.store.ts
└── utils/
    └── format-usd.ts
```

---

## `src/features/landing/` — Marketing y captación

```
src/features/landing/
├── components/
│   ├── AdvancedToolsSection.tsx
│   ├── BenefitsSection.tsx
│   ├── Footer.tsx / HeroSection.tsx / Navbar.tsx
│   ├── TickerTape.tsx / WhatWeOfferSection.tsx
│   ├── captacion/                    # Formulario /registro
│   │   ├── CaptacionFormCard.tsx
│   │   ├── LeadIdentityStep.tsx
│   │   ├── LeadCredentialsStep.tsx
│   │   └── …
│   └── marketing/                    # Landing pública
│       ├── LandingHero.tsx
│       ├── TerminalShowcase.tsx
│       └── …
├── hooks/
│   ├── useCaptacionForm.ts
│   └── useRegistroFormVisible.ts
├── pages/
│   ├── LandingPage.tsx               # /
│   ├── CaptacionLanding.tsx          # /registro
│   └── MarketsPage.tsx               # /mercados
└── types/
    └── captacion-form.ts
```

---

## `src/features/crm/` — Staff (ventas y operaciones)

```
src/features/crm/
├── components/head/
│   ├── ClientProfile.tsx
│   ├── DepositsTab.tsx / LeadsTab.tsx / FraudTab.tsx
│   ├── OverviewTab.tsx / PerformanceTab.tsx
│   ├── PersonnelTab.tsx / SettingsTab.tsx
│   └── WebRegistrationsTab.tsx       # Leads web → procesar
├── hooks/
│   ├── useAgentCrm.ts
│   └── useTwilioDialer.ts
└── pages/
    ├── AgentDashboard.tsx            # /dashboard/agent
    ├── TeamLeaderDashboard.tsx
    ├── FloorDashboard.tsx
    ├── ManagerDashboard.tsx
    ├── ChiefDashboard.tsx
    └── HeadDashboard.tsx             # /dashboard/head
```

---

## `src/core/supabase/services/` — Capa de datos

```
src/core/supabase/services/
├── index.ts                          # Re-export central
├── wallet.service.ts
├── positions.service.ts
├── orders.service.ts
├── deposits.service.ts
├── profiles.service.ts
├── kyc.service.ts
├── notifications.service.ts
├── leads.service.ts
├── teams.service.ts
├── calls.service.ts                  # Twilio
├── web-leads.service.ts
└── web-lead-processing.service.ts
```

---

## `supabase/` — Backend

```
supabase/
├── config.toml
├── schema.sql
├── migrations/                    # SQL versionado (RLS, wallet, trading…)
├── functions/                     # Edge Functions
│   ├── approve-transaction/
│   ├── create-deposit/
│   ├── nowpayments-webhook/
│   ├── process-web-lead/
│   ├── request-withdrawal/
│   ├── twilio-voice/
│   ├── twilio-voice-token/
│   ├── twilio-voice-status/
│   └── _shared/
├── scripts/
│   ├── reset_all_operational_data.sql
│   └── seed_dev_role_users_post.sql
└── tests/
```

---

## `docs/` — Documentación

### Índice de guías operativas

| Archivo | Tema |
|---------|------|
| [ESTRUCTURA_PROYECTO.md](./ESTRUCTURA_PROYECTO.md) | **Este archivo** — árbol de carpetas y mapa de código |
| [17_ROL_CLIENT_INVESTOR.md](./17_ROL_CLIENT_INVESTOR.md) | Rol inversor / panel cliente |
| [GUIA_TERMINAL_FORTADE.md](./GUIA_TERMINAL_FORTADE.md) | Terminal Fortrade |
| [GUIA_TRADINGVIEW_TERMINAL_MERCADO.md](./GUIA_TRADINGVIEW_TERMINAL_MERCADO.md) | Gráficos, mercado, terminal |
| [GUIA_LEADS_WEB.md](./GUIA_LEADS_WEB.md) | Captación y leads web |
| [GUIA_KYC.md](./GUIA_KYC.md) | Verificación KYC |
| [GUIA_REGISTRO_AUTH.md](./GUIA_REGISTRO_AUTH.md) | Auth y registro |
| [GUIA_STAFF_AUTH.md](./GUIA_STAFF_AUTH.md) | Auth staff |
| [GUIA_PERU_PAGOS.md](./GUIA_PERU_PAGOS.md) | Pagos Perú |
| [GUIA_PERU_AML_KYC.md](./GUIA_PERU_AML_KYC.md) | AML/KYC Perú |
| [GUIA_NOWPAYMENTS.md](./GUIA_NOWPAYMENTS.md) | Crypto / NOWPayments |
| [GUIA_TWILIO_VOIP.md](./GUIA_TWILIO_VOIP.md) | Llamadas Twilio |
| [USUARIOS_PRUEBA_INVESTPRO.md](./USUARIOS_PRUEBA_INVESTPRO.md) | Usuarios de prueba |
| [19_GUIA_FUNCIONAMIENTO_SISTEMA.md](./19_GUIA_FUNCIONAMIENTO_SISTEMA.md) | Funcionamiento global |

### Documentos de arquitectura y roles (serie numerada)

```
docs/
├── 01_TECHNICAL_STANDARDS.md
├── 02_BUSINESS_LOGIC.md
├── 03_DESIGN_SYSTEM.md
├── 04_IMPLEMENTATION_ROADMAP.md
├── 05_PROJECT_SETUP_GUIDE.md
├── 06_DATABASE_ARCHITECTURE.md
├── 07_SECURITY_INFRASTRUCTURE.md
├── 08_ROLES_Y_FUNCIONES.md
├── 09_ROL_HEAD_SOVEREIGN_NODE.md … 18_MANEJO_BROKER_SISTEMA_AGRESIVO.md
├── 19_GUIA_FUNCIONAMIENTO_SISTEMA.md
└── GUIA_*.md, INVESTPRO_DESIGN_SYSTEM.md, BOLT_DESIGN_SYSTEM.md, …
```

---

## `scripts/` y `public/`

```
scripts/
├── seed-dev-users.mjs
├── verify-supabase-health.mjs
├── purge-storage-buckets.mjs
└── migrate-*-theme.mjs

public/
├── favicon.svg
├── assets/
└── design/                        # theme.css, tokens.json
```

---

## Tema visual global (oscuro + lima)

| Token | Valor | Uso |
|-------|-------|-----|
| Fondo app | `#1a1d21` | Landing, dashboard, shells |
| Panel | `#2a2d30` | Nav lateral, secciones |
| Acento / CTA | `#9fe870` | Botones, logo PRO, checks |
| Texto en CTA | `#163300` | Sobre botón lima |
| Tarjeta formulario | `#ffffff` | Registro, login (`.bolt-card-form`) |

Archivos clave: `src/styles/invest-semantic.css`, `tailwind.config.js`, `src/shared/theme/invest-theme.ts`.

---

## Flujo rápido: ¿dónde edito qué?

| Quiero cambiar… | Carpeta / archivo |
|-----------------|-------------------|
| Pestaña de cuenta del cliente | `src/features/client/tabs/` |
| Layout o navegación del inversor | `src/shared/layout/` + `role-navigation.config.ts` |
| Gráfico / órdenes | `src/features/trading/` |
| Depósitos Perú / crypto | `src/features/wallet/` + `src/features/client/components/` |
| API / base de datos | `src/core/supabase/services/` + `supabase/migrations/` |
| Landing y captación | `src/features/landing/` |
