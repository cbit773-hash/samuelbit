# ARCHITECTURE.md — Zaki Bit Trading Platform

> **Versión:** 1.0.0  
> **Fecha:** 2026-04  
> **Autores:** Arquitecto Senior / Lead Fullstack  
> **Estado:** Documento base — Fase de diseño
> **Alcance:** Plataforma de trading de alcance global con cumplimiento internacional (GDPR/AML).

---

## 1. Stack Tecnológico y Justificación

### Frontend Core

| Tecnología | Versión | Justificación |
|---|---|---|
| **React 18** | ^18.3 | Concurrent Mode + Suspense para UI sin bloqueos durante actualizaciones de precios en tiempo real. Ecosistema maduro para trading UI. |
| **Vite 5** | ^5.2 | HMR instantáneo crítico para iterar en componentes de charts. Build con ESBuild: 10-20× más rápido que CRA. Tree-shaking agresivo reduce bundle final. |
| **TypeScript 5** | ^5.4 | Tipado estricto para esquemas de órdenes, posiciones y datos de mercado. Evita errores en cálculos financieros críticos. |
| **Tailwind CSS 3** | ^3.4 | Utility-first permite construir el sistema "Zaki Bit". Variables: `primary: #f59e0b` (Naranja Bit), `background: #050505` (Negro profundo), `surface: rgba(255, 255, 255, 0.03)` (Efecto cristal GlassCards). |

### Web3 & Crypto

| Tecnología | Caso de uso | Justificación |
|---|---|---|
| **Coinbase Wallet SDK** | Conexión Web3 | Integración nativa con Coinbase Wallet. Soporte para divisas globales (USD, USDT, ETH, BTC). |
| **Ethers.js / Viem** | Faucet & Contratos | Interacción con Smart Contracts para solicitar tokens de prueba (valores internacionales) y reflejarlos en el balance. |

### State Management

| Tecnología | Caso de uso | Justificación |
|---|---|---|
| **Zustand 4** | Estado global de trading (posiciones abiertas, equity, margen, modo auto/manual) | Mínimo boilerplate vs Redux. Middleware `immer` para mutaciones inmutables de posiciones. Suscripciones selectivas evitan re-renders masivos en cada tick de precio. |
| **React Query 5** | Sincronización de datos REST (historial, perfil de usuario, órdenes pasadas) | Cache + stale-while-revalidate ideal para datos que cambian cada 5–60 segundos. Retry automático, optimistic updates para órdenes. |

### Datos en Tiempo Real

| Tecnología | Caso de uso |
|---|---|
| **Formato de Tiempo** | Todos los relojes de mercado, gráficos y timestamps operan estrictamente en **formato UTC**. |
| **WebSocket nativo** | Stream de velas (OHLCV), precios bid/ask, book de órdenes |
| **Finage API** | Datos de Forex e Índices (REST + WS) |
| **Binance WS API** | Datos de criptomonedas |
| **lightweight-charts 4** | Renderizado de candlestick charts (WebGL, 60fps). Debe incluir el logo de Zaki Bit como marca de agua en el fondo del gráfico. |

### Backend (Referencia para contratos de API)

```
Node.js 20 + Fastify + PostgreSQL + Redis (pub/sub para WS fan-out)
```

---

## 2. Arquitectura de Carpetas (Feature-Based)

```
zaki-bit/
├── public/
│   └── assets/                    # Logos, íconos estáticos
│
├── src/
│   ├── app/                       # Configuración global
│   │   ├── App.tsx                # Root con RouterProvider
│   │   ├── router.tsx             # React Router v6 con rutas protegidas
│   │   ├── providers.tsx          # QueryClientProvider + ToastProvider
│   │   └── global.css             # Variables CSS Zaki Bit
│   │
│   ├── features/                  # Módulos por dominio funcional
│   │   │
│   │   ├── auth/                  # MÓDULO A: Autenticación
│   │   │   ├── components/
│   │   │   │   ├── LoginForm.tsx
│   │   │   │   ├── TwoFactorModal.tsx
│   │   │   │   └── RoleGuard.tsx  # HOC de protección por rol
│   │   │   ├── hooks/
│   │   │   │   └── useAuth.ts
│   │   │   ├── services/
│   │   │   │   └── auth.service.ts
│   │   │   ├── store/
│   │   │   │   └── auth.store.ts  # Zustand slice
│   │   │   └── types/
│   │   │       └── auth.types.ts
│   │   │
│   │   ├── trading/               # MÓDULO B: Core Trading
│   │   │   ├── components/
│   │   │   │   ├── CandlestickChart.tsx
│   │   │   │   ├── OrderTicket.tsx        # Boleta manual (SL/TP)
│   │   │   │   ├── AutoSignalPanel.tsx    # Modo automático + AI
│   │   │   │   ├── PositionsList.tsx
│   │   │   │   ├── MarginIndicator.tsx
│   │   │   │   └── indicators/
│   │   │   │       ├── BollingerBands.ts
│   │   │   │       ├── SMA.ts
│   │   │   │       └── RSI.ts
│   │   │   ├── hooks/
│   │   │   │   ├── useMarketWebSocket.ts
│   │   │   │   ├── useMarginCalculator.ts
│   │   │   │   └── useOrderExecution.ts
│   │   │   ├── services/
│   │   │   │   ├── finage.service.ts
│   │   │   │   └── binance.service.ts
│   │   │   ├── store/
│   │   │   │   └── trading.store.ts       # Posiciones, equity, margen
│   │   │   └── types/
│   │   │       └── trading.types.ts
│   │   │
│   │   ├── dashboard/             # MÓDULO C: Dashboard Inversor
│   │   │   ├── components/
│   │   │   │   ├── AccountSummary.tsx
│   │   │   │   ├── EquityChart.tsx
│   │   │   │   └── RecentActivity.tsx
│   │   │   └── hooks/
│   │   │       └── useDashboardData.ts
│   │   │
│   │   ├── wallet/                # MÓDULO D: Gestión de Capital
│   │   │   ├── components/
│   │   │   │   ├── DepositCard.tsx        # Vinculación de tarjetas (Agnóstico de región)
│   │   │   │   ├── WithdrawFiat.tsx       # International Bank Transfer (SWIFT) + validaciones
│   │   │   │   ├── WithdrawCrypto.tsx     # ERC20/TRC20 (Soporte Global)
│   │   │   │   ├── FaucetPanel.tsx        # MÓDULO WEB3: Carga de tokens falsos
│   │   │   │   └── TransactionHistory.tsx
│   │   │   ├── hooks/
│   │   │   │   └── useWeb3Faucet.ts       # Integración Coinbase Wallet
│   │   │   └── types/
│   │   │       └── wallet.types.ts
│   │   │
│   │   ├── legal/                 # MÓDULO G: Zaki Legal
│   │   │   └── components/
│   │   │       └── LegalView.tsx          # 4 Pilares: T&C Globales, Regulación Internacional, KYC, Protección de Datos (GDPR). Estética "Zaki Bit".
│   │   │
│   │   ├── advisor/               # MÓDULO E: Panel Asesor
│   │   │   ├── components/
│   │   │   │   ├── ClientList.tsx
│   │   │   │   ├── AccountHealthBadge.tsx # Indicador de Margin Call risk
│   │   │   │   └── ClientDetail.tsx
│   │   │   └── hooks/
│   │   │       └── useAdvisorClients.ts
│   │   │
│   │   └── admin/                 # MÓDULO F: Super Admin
│   │       ├── components/
│   │       │   ├── GlobalMetrics.tsx
│   │       │   ├── DepositVsWithdrawChart.tsx
│   │       │   ├── UserManagement.tsx
│   │       │   └── VolumeTracker.tsx
│   │       └── hooks/
│   │           └── useAdminMetrics.ts
│   │
│   ├── shared/                    # Código reutilizable
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── Navbar.tsx
│   │   │   │   ├── Sidebar.tsx            # Dinámico por rol. Incluye logo Zaki Bit y enlace a Zaki Legal en el footer.
│   │   │   │   └── MainLayout.tsx         # Refleja identidad Zaki Bit (colores #050505 y Naranja Bit).
│   │   │   ├── ui/
│   │   │   │   ├── GlassCard.tsx          # Componente base con efecto cristal surface rgba(255, 255, 255, 0.03).
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Badge.tsx
│   │   │   │   ├── Modal.tsx
│   │   │   │   └── Spinner.tsx
│   │   │   └── charts/
│   │   │       └── MiniSparkline.tsx
│   │   ├── hooks/
│   │   │   ├── useWebSocket.ts            # WS genérico con reconexión
│   │   │   └── usePermissions.ts          # RBAC helper
│   │   └── utils/
│   │       ├── formatters.ts              # Moneda, porcentaje, fecha
│   │       ├── margin.calculator.ts       # Fórmulas financieras
│   │       └── validators.ts              # Wallets, cuentas bancarias
│   │
│   └── config/
│       ├── constants.ts                   # URLs de API, WS endpoints
│       └── permissions.config.ts          # Mapa RBAC
│
├── ARCHITECTURE.md
├── tailwind.config.js
├── vite.config.ts
├── tsconfig.json
└── package.json
```

---

## 3. Modelo de Datos y Roles (RBAC)

### 3.1 Esquemas de Usuario

```typescript
// Rol base — heredado por todos
interface BaseUser {
  id: string;                        // UUID v4
  email: string;
  fullName: string;
  phone: string;
  role: 'INVESTOR' | 'ADVISOR' | 'SUPER_ADMIN';
  status: 'ACTIVE' | 'SUSPENDED' | 'PENDING_KYC';
  createdAt: Date;
  updatedAt: Date;
  twoFactorEnabled: boolean;
}

// Inversor — cliente de trading
interface Investor extends BaseUser {
  role: 'INVESTOR';
  advisorId: string | null;          // FK → Advisor
  account: TradingAccount;
  kycStatus: 'PENDING' | 'VERIFIED' | 'REJECTED'; // Gestionado por Asesor o SuperAdmin
  riskProfile: 'CONSERVATIVE' | 'MODERATE' | 'AGGRESSIVE';
}

// Asesor — gestiona cartera de inversores
interface Advisor extends BaseUser {
  role: 'ADVISOR';
  clientIds: string[];               // FK[] → Investor
  commissionRate: number;            // % sobre ganancias de clientes
  totalAUM: number;                  // Assets Under Management (USD)
}

// Super Admin — control total de la plataforma
interface SuperAdmin extends BaseUser {
  role: 'SUPER_ADMIN';
  permissions: AdminPermission[];    // Granular para auditoría
}

// Cuenta de trading del inversor
interface TradingAccount {
  id: string;
  investorId: string;
  balance: number;                   // Saldo disponible (USD)
  equity: number;                    // Balance + P&L flotante
  usedMargin: number;                // Margen comprometido en posiciones
  freeMargin: number;                // equity - usedMargin
  marginLevel: number;               // (equity / usedMargin) × 100
  openPositions: Position[];
  leverage: number;                  // Ej: 100 (1:100)
}
```

### 3.2 Esquema de Posición y Orden

```typescript
interface Position {
  id: string;
  accountId: string;
  symbol: string;                    // Ej: 'EURUSD', 'BTCUSDT'
  type: 'BUY' | 'SELL';
  volume: number;                    // En lotes (0.01 mínimo)
  openPrice: number;
  currentPrice: number;
  stopLoss: number | null;
  takeProfit: number | null;
  floatingPnL: number;               // P&L no realizado
  usedMargin: number;
  openedAt: Date;
  source: 'MANUAL' | 'AI_SIGNAL';
}

interface Order {
  id: string;
  positionId: string | null;
  type: 'MARKET' | 'LIMIT' | 'STOP';
  status: 'PENDING' | 'FILLED' | 'CANCELLED' | 'REJECTED';
  symbol: string;
  direction: 'BUY' | 'SELL';
  volume: number;
  requestedPrice: number;
  executedPrice: number | null;
  createdAt: Date;
  executedAt: Date | null;
}
```

### 3.3 Mapa de Permisos RBAC

```typescript
// config/permissions.config.ts

export type Permission =
  | 'trading:execute'          // Ejecutar órdenes
  | 'trading:view'             // Ver charts y precios
  | 'wallet:deposit'           // Iniciar depósito
  | 'wallet:withdraw'          // Solicitar retiro
  | 'advisor:view_clients'     // Ver lista de clientes asignados
  | 'advisor:view_accounts'    // Ver cuentas de clientes
  | 'advisor:manage_kyc'       // Aprobar o rechazar KYC de sus clientes
  | 'admin:manage_users'       // CRUD de usuarios
  | 'admin:view_metrics'       // Ver métricas globales
  | 'admin:approve_withdrawals'// Aprobar/rechazar retiros
  | 'admin:manage_roles'       // Asignar roles
  | 'admin:manage_kyc';        // Aprobar o rechazar KYC globalmente

export const ROLE_PERMISSIONS: Record<BaseUser['role'], Permission[]> = {
  INVESTOR: [
    'trading:execute',
    'trading:view',
    'wallet:deposit',
    'wallet:withdraw',
  ],
  ADVISOR: [
    'trading:view',
    'advisor:view_clients',
    'advisor:view_accounts',
    'advisor:manage_kyc',
  ],
  SUPER_ADMIN: [
    'trading:view',
    'admin:manage_users',
    'admin:view_metrics',
    'admin:approve_withdrawals',
    'admin:manage_roles',
    'admin:manage_kyc',
  ],
};

// Helper hook — uso en componentes
// const { can } = usePermissions();
// if (can('trading:execute')) { ... }
```

---

## 4. Estrategia de Datos Real-Time

### 4.1 Arquitectura de WebSockets

```
┌─────────────────────────────────────────────────────────────┐
│                     BROWSER (React App)                      │
│                                                             │
│   useMarketWebSocket.ts                                      │
│   ┌─────────────────────────────────────────────────────┐   │
│   │  WebSocket Manager (Singleton)                       │   │
│   │  - Auto-reconnect (exponential backoff)             │   │
│   │  - Heartbeat cada 30s                               │   │
│   │  - Queue de mensajes si WS offline                  │   │
│   └──────────────┬──────────────────────────────────────┘   │
│                  │ onMessage                                  │
│                  ▼                                           │
│   trading.store.ts (Zustand)                                 │
│   ┌─────────────────────────────────────────────────────┐   │
│   │  currentPrice[symbol] → recalcula floatingPnL       │   │
│   │  candles[symbol]      → actualiza chart             │   │
│   │  equity               → recalcula marginLevel       │   │
│   └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                  │
     WebSocket TLS (wss://)
                  │
┌─────────────────▼─────────────────────────────────────────┐
│                   BACKEND / PROXY                          │
│   Fastify WS Gateway                                       │
│   ├── Finage WS  →  Forex + Índices (OHLCV, bid/ask)     │
│   └── Binance WS →  Crypto (kline, bookTicker)            │
│                                                            │
│   Redis Pub/Sub fan-out → múltiples clientes              │
└────────────────────────────────────────────────────────────┘
```

### 4.2 Formato de Mensajes WS

```typescript
// Mensaje entrante normalizado (agnóstico de fuente)
interface MarketTickMessage {
  type: 'TICK';
  symbol: string;
  bid: number;
  ask: number;
  timestamp: number;
}

interface CandleMessage {
  type: 'CANDLE';
  symbol: string;
  timeframe: '1m' | '5m' | '15m' | '1h' | '4h' | '1d';
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  isClosed: boolean;
  timestamp: number;
}
```

### 4.3 React Query para Datos REST

```typescript
// Configuración global del QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 30,          // 30s para datos semi-estáticos
      cacheTime: 1000 * 60 * 5,      // 5min en caché
      retry: 3,
      refetchOnWindowFocus: true,
    },
  },
});

// Endpoints clave:
// GET /api/account/:id         → balance, equity (cada 10s)
// GET /api/positions/open      → posiciones abiertas
// GET /api/history/candles     → datos históricos para chart inicial
// GET /api/wallet/transactions → historial de depósitos/retiros
```

---

## 5. Flujo de Operaciones: Margen, Equity y Margin Call

### 5.1 Fórmulas Financieras

```
DEFINICIONES:
─────────────────────────────────────────────────────────────

Balance       = Saldo depositado + P&L realizado (órdenes cerradas)
Floating P&L  = Suma de (precio_actual - precio_apertura) × volumen × valor_pip
Equity        = Balance + Floating P&L

Margen Usado  = Suma de (volumen × precio_apertura × tamaño_contrato) / leverage
Margen Libre  = Equity - Margen Usado

Nivel Margen  = (Equity / Margen Usado) × 100

UMBRALES:
─────────────────────────────────────────────────────────────
≥ 200%   → Estado SALUDABLE  (color: #00f2ff)
100–200% → Estado ALERTA     (color: #ffb800)
< 100%   → MARGIN CALL       (color: #ff0055) — cierre automático
≤  50%   → STOP OUT          → sistema cierra posiciones más grandes
```

### 5.2 Diagrama de Flujo de Margin Call

```
┌──────────────────────────────────────────────────────────────┐
│                     TICK DE PRECIO (WS)                       │
└───────────────────────────┬──────────────────────────────────┘
                            │
                            ▼
                 updateCurrentPrice(symbol, price)
                 en trading.store.ts (Zustand)
                            │
                            ▼
              recalcularFloatingPnL(posiciones)
                   → suma P&L de cada posición
                            │
                            ▼
              equity = balance + floatingPnL
                            │
                            ▼
              marginLevel = (equity / usedMargin) × 100
                            │
              ┌─────────────┴─────────────────┐
              │                               │
         marginLevel < 100%          marginLevel ≥ 100%
              │                               │
              ▼                               ▼
     🚨 MARGIN CALL EVENT              Actualizar UI
     - Notificación push               (indicadores verdes)
     - Email/SMS al inversor
     - Alerta al asesor asignado
     - Intentar cerrar posición
       menos rentable primero
              │
              ▼
     marginLevel ≤ 50% ?
         │           │
        SÍ           NO
         │           │
         ▼           ▼
    STOP OUT    Esperar acción
    - Cierre       del cliente
      automático
      de TODAS
      posiciones
```

### 5.3 Implementación en Zustand

```typescript
// features/trading/store/trading.store.ts (esquema)

interface TradingState {
  positions: Position[];
  balance: number;
  equity: number;
  usedMargin: number;
  freeMargin: number;
  marginLevel: number;
  marginStatus: 'HEALTHY' | 'WARNING' | 'MARGIN_CALL' | 'STOP_OUT';
  currentPrices: Record<string, number>;

  // Acciones
  updatePrice: (symbol: string, price: number) => void;
  openPosition: (order: NewOrderRequest) => Promise<void>;
  closePosition: (positionId: string) => Promise<void>;
  recalculateMetrics: () => void;
}

// La acción updatePrice dispara automáticamente recalculateMetrics()
// recalculateMetrics() → calcula equity → calcula marginLevel → evalúa umbrales
```

### 5.4 Flujo de Faucet & Web3 (Tokens de Prueba)

Para facilitar el testeo de la plataforma mediante fondos simulados:
1. **Conexión Web3:** El usuario vincula su **Coinbase Wallet** utilizando el SDK oficial.
2. **Carga de Tokens (Faucet):** A través del componente `FaucetPanel.tsx`, el usuario solicita tokens de prueba.
3. **Impacto Inmediato:** El monto solicitado se añade al `Balance` del usuario en el estado global (`trading.store.ts`).
4. **Recálculo Automático:** Este cambio en el balance incrementa inmediatamente el **Equity** (Balance + Floating P&L) y el **Margen Libre** (Equity - Margen Usado), permitiendo al usuario abrir posiciones sin requerir recargar la página.

---

## 6. Sistema de Indicadores Técnicos

### Capa de Cálculo (fuera del render cycle)

```typescript
// Todos los indicadores se calculan en Web Workers para no bloquear el UI thread

// SMA (Simple Moving Average)
SMA(candles: Candle[], period: number): number[]

// Bollinger Bands (requiere SMA + desviación estándar)
BollingerBands(candles: Candle[], period: 20, multiplier: 2): {
  upper: number[]; middle: number[]; lower: number[];
}

// RSI (Relative Strength Index)
RSI(candles: Candle[], period: 14): number[]
// → Oversold < 30, Neutral 30-70, Overbought > 70
```

---

## 7. Consideraciones de Seguridad

| Área | Medida |
|---|---|
| Autenticación | JWT (15min) + Refresh Token (7d) en httpOnly cookie |
| 2FA | TOTP (Google Authenticator) obligatorio para retiros |
| Datos de tarjeta | **Tokenización Segura:** Los datos viajan directo al proveedor de pagos. Copy UX obligatorio en UI: *"Para completar tu compra, añade un método de pago de forma segura. Tus datos serán procesados directamente por nuestro proveedor de pagos y no se almacenan en nuestros servidores. [Añadir tarjeta]"* |
| Wallets crypto | Validación de sintaxis por red antes de enviar al backend |
| Permisos API | Cada endpoint verifica el JWT role claim en backend |
| Rate limiting | 100 req/min por usuario en endpoints de trading |

---

## 8. Roadmap de Implementación

```
SEMANA 1  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ✅ ARCHITECTURE.md (este documento)
  ✅ tailwind.config.js (tema Zaki Bit: Naranja #f59e0b, Fondo #050505)
  ✅ Estructura de carpetas src/features/
  ✅ Layout principal (Navbar + Sidebar dinámico por rol)

SEMANA 2  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ⏳ [ESPERANDO CONFIRMACIÓN] CandlestickChart con lightweight-charts
  ⏳ WebSocket hook + integración Finage/Binance
  ⏳ Indicadores técnicos (BB, SMA, RSI)

SEMANA 3  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ⏳ OrderTicket (manual) + AutoSignalPanel (AI)
  ⏳ Zustand store completo de trading + cálculos de margen

SEMANA 4  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ⏳ Módulo Wallet y Web3 (Depósitos, retiros, Faucet Coinbase Wallet)
  ⏳ Panel Asesor + Dashboard Admin
  ⏳ Sección Zaki Legal (4 Pilares: T&C, Regulación, KYC, Protección de Datos)
```

---

## 9. Arquitectura de la Landing Page (Estilo eToro)

La página de aterrizaje (Landing Page) pública debe ser un embudo de conversión altamente optimizado, con una estructura y experiencia de usuario (UX) inspirada en plataformas globales de confianza como **eToro**.

### 9.1 Características Clave de la Landing Page
- **Hero Section Amigable y Clara**: Un mensaje directo sobre el acceso a mercados globales con un Call-to-Action (CTA) visible ("Empieza a invertir" / "Únete ahora"). Debe transmitir confianza inmediata, alejándose de estéticas "oscuras/hacker" para ser amigable con el usuario retail.
- **Social Proof y Datos Abiertos**: Mostrar métricas reales (o simuladas para MVP) como "Usuarios registrados", "Volumen de operaciones" y logotipos de cumplimiento normativo (Zaki Legal).
- **Educación e Información Transparente**: Secciones dedicadas a explicar *cómo funciona*, los beneficios de la integración Web3 (Coinbase Wallet) y la seguridad de los fondos. 
- **Presentación de Activos**: Carruseles interactivos o mini-gráficos (`MiniSparkline.tsx`) en vivo mostrando los activos principales (BTC, EUR/USD, SP500).
- **Diseño Responsivo y Limpio**: A diferencia de la terminal de trading (`#050505`), la landing page puede utilizar un modo dual o temas más claros y limpios para la captación inicial, haciendo la transición hacia la terminal profesional una vez que el usuario inicia sesión.

---

## 10. Base de Datos y Backend (Supabase)

Para acelerar el desarrollo del MVP y garantizar escalabilidad, el backend y la base de datos están delegados a **Supabase** (PostgreSQL).
- **Autenticación**: Gestión de usuarios (Email/Password, Social Auth) directamente integrada con Row Level Security (RLS).
- **Base de Datos Core**: Tablas de perfiles (`profiles`), cuentas de trading (`trading_accounts`), historial de órdenes (`orders`), y configuración KYC.
- **Tiempo Real**: Suscripciones a cambios en la base de datos vía WebSockets nativos de Supabase para actualización de balances de asesores.

---

*Documento generado como base de la plataforma Zaki Bit. Todos los módulos de código deben respetar los tipos, rutas y convenciones definidos aquí.*
