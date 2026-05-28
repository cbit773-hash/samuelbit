# Guía — Terminal Fortrade (InvestPRO)

> TradingView, precios de prueba, APIs y costos: [`GUIA_TRADINGVIEW_TERMINAL_MERCADO.md`](GUIA_TRADINGVIEW_TERMINAL_MERCADO.md)

## Acceso

- **Cliente:** `/dashboard/trade` — terminal unificada (`TradingWorkspace`: watchlist, gráfico, boleta, panel inferior).
- **Cuenta / depósitos:** `/dashboard/account?tab=...`
- **Supervisor (HEAD/CHIEF):** `/dashboard/supervisor-market` — posiciones clientes (solo lectura).

## Shell unificada

Todos los roles usan `PlatformShell` (icon rail + navegación + barra de métricas).

Variable de entorno:

- `VITE_FORTADE_SHELL=false` — layout legacy anterior.
- Por defecto (omitida o `true`) — shell Fortrade activa.

## Instrumentos live (v1)

Binance WebSocket: `BTCUSDT`, `ETHUSDT`, `EURUSDT`, `XAUUSDT`.

Copy en UI: CFD vía Binance; no es Forex interbancario.

## Cuenta DEMO / REAL

| Modo | Libro | Saldo inicial | Operar |
|------|-------|---------------|--------|
| **Demo** | `wallets.demo_balance` | $10,000 USD virtual | Siempre que haya margen libre |
| **Real** | `wallets.balance` | Depósito acreditado | Solo si `balance > 0` |

- `wallets.account_mode`: `demo` | `live` (persistido en BD).
- **AccountModeSwitcher** en barra de métricas y toolbar del gráfico.
- **DemoAccountBanner:** fondos virtuales + botón **Reiniciar demo** (`reset_demo_account`).
- Modo Real con balance 0: CTA **Depositar** → `/dashboard/account?tab=depositar`.
- KYC recomendado en UI (no bloquea RPC de apertura).

Posiciones y órdenes pendientes llevan `account_mode`; al cambiar de modo solo se muestran las del libro activo.

## Jerarquía de precios en UI

| Zona | Qué muestra |
|------|-------------|
| **Panel Operar** (derecha / sheet móvil) | Precio de mercado grande, bid/ask y ejecución COMPRAR/VENDER — **única fuente para operar** |
| **Toolbar del gráfico** | Par activo, estado live, modo demo/real, timeframes, toggle **Entradas**, chip «N abiertas en {par}» |
| **Gráfico** | Velas + hint de clic (sin precio gigante duplicado) |
| **Tabla Abiertas** | P&L por posición, cierre y selección de fila (sincroniza SL/TP en chart) |

## Gráfico en vivo (Binance)

- **Tema:** fondo oscuro Fortrade (`chart-theme.ts`) alineado al shell.
- **Velas:** REST `api.binance.com` (120 velas) por símbolo activo e intervalo **15m / 1h / 1d** (toolbar).
- **Ticks:** WebSocket combined `@trade` actualiza la **última vela** del bucket actual (no datos simulados).
- **Política de overlays** (`chart-overlay-policy.ts`, `useChartPositionOverlays.ts`):
  - Máximo **2** líneas de entrada del símbolo activo: posición **seleccionada** en la tabla + la más reciente si no hay selección.
  - Toggle **Entradas** en toolbar: off → solo línea de mercado y «Precio orden» (clic límite/stop).
  - Etiquetas en eje solo en la posición seleccionada; markers y SL/TP solo en la seleccionada.
- **Clic en el gráfico:** fija precio en tabs **Límite** / **Stop** del panel de orden (línea preview «Precio orden»).

Archivos: `CandlestickChart.tsx`, `ChartToolbar.tsx`, `useTradingChartData.ts`, `useChartPositionOverlays.ts`, `chart-time.ts`.

## Boleta de orden

Panel derecho (desktop) o sheet móvil **Operar** (misma lógica en ambos vía `OrderPanel`):

- Tabs: **Mercado** | **Límite** | **Stop**
- Volumen por defecto **0.01**; presets con estado activo visible
- Preview: margen requerido, libre después, apalancamiento
- **Bloqueos:** banner ámbar **encima** de COMPRAR/VENDER (`getOrderBlockReason`: cotización WS, depósito, margen)
- **≥3 posiciones** abiertas en el mismo par: confirmación antes de abrir otra
- **Demo:** botón **Cerrar todas en {par}** (bucle `closePosition` en cliente; sin RPC masivo)

## Motor de riesgo (server-side)

- `leverage` en wallet (default 100)
- RPC `open_position_with_risk` — valida margen según modo activo
- RPC `close_position_settle` — acredita PnL al libro correcto
- RPC `switch_account_mode`, `ensure_demo_funds`, `reset_demo_account`

## Panel inferior (operaciones)

- Tab **Abiertas:** filtro **Solo {par activo}** (default) vs **Todas**; contador `N en BTC / total`.
- Clic en fila → `selectedPositionId` → resalta fila y sincroniza overlays del gráfico.
- Tab **Resumen:** incluye «Posiciones abiertas en {par}: N».

## Órdenes pendientes (LIMIT / STOP)

- Pestaña **Pendientes** en el panel inferior de `/dashboard/trade`
- Filtradas por `account_mode` activo
- RPCs `place_pending_order`, `cancel_pending_order`
- Ejecución automática en cliente (`usePendingOrderWatcher`) cuando el precio toca el nivel

## Migraciones

- `supabase/migrations/202605290001_fortrade_trading_engine.sql` — motor base
- `supabase/migrations/202605350001_demo_live_trading.sql` — demo_balance, dual book, RPCs

Desplegar: `npx supabase db push`

## Tests

```bash
npm run test
npx tsc --noEmit
```

- `margin.calculator.test.ts` — margen y equity
- `order-guards.test.ts` — razones de bloqueo demo vs live
- `chart-time.test.ts` — buckets OHLC 15m/1h
- `chart-overlay-policy.test.ts` — selección máx. 2 posiciones en chart

## Checklist E2E manual

1. Cliente demo → `/dashboard/trade` → gráfico oscuro sin precio duplicado en chart.
2. Modo Demo → balance ~$10,000 → COMPRAR 0.01 → posición en **Abiertas** (filtro solo par activo).
3. Abrir 4+ posiciones mismo par → gráfico muestra ≤2 entradas; sin amontonar labels en eje.
4. Seleccionar fila en **Abiertas** → SL/TP solo en esa posición en el gráfico.
5. Toggle **Entradas** off → solo mercado + precio orden (clic límite/stop).
6. WS offline o sin margen → banner de bloqueo sobre botones COMPRAR/VENDER.
7. 3.er trade mismo símbolo → diálogo de confirmación.
8. **Cerrar todas en {par} (demo)** o **Reiniciar demo** → tabla limpia, chart sin entradas.
9. Switch **Real**, balance $0 → botones deshabilitados + CTA depositar.
10. Posiciones demo no aparecen en modo Real y viceversa.
11. Mobile: sheet **Operar** — mismos bloqueos y confirmaciones que panel desktop.
