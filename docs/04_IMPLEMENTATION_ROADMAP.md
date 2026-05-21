# 04. Roadmap de Implementación (InvesPro)

Este documento detalla el plan de acción estructurado en 4 semanas (Fases) para llevar la plataforma **InvesPro** desde su diseño arquitectónico hasta un MVP funcional.

## Fase 1: Arquitectura Base y Diseño UI (Semana 1)
**Objetivo:** Establecer los cimientos del proyecto y el sistema de diseño.

- [x] Elaboración de `ARCHITECTURE.md` y documentación técnica (`docs/`).
- [ ] Inicialización del proyecto con Vite + React + TypeScript.
- [ ] Configuración del backend as a service con **Supabase** (Autenticación, Base de datos y Storage).
- [ ] Configuración del enrutamiento (React Router v6) con protección de rutas (RBAC).
- [ ] Configuración de `tailwind.config.js` (Paleta Naranja Bit / Negro Profundo).
- [ ] Construcción del Layout Base (Navbar, Sidebar dinámico).
- [ ] Desarrollo de componentes UI puros (GlassCard, Modales, Botones, Tablas).

## Fase 2: Trading Engine y WebSockets (Semana 2)
**Objetivo:** Implementar la visualización de datos de mercado en tiempo real.

- [ ] Integración de `lightweight-charts` con renderizado WebGL optimizado y marca de agua de "InvesPro".
- [ ] Configuración de `Zustand` store para el motor de trading global.
- [ ] Desarrollo de `useMarketWebSocket.ts` para conexión con APIs (Finage/Binance).
- [ ] Creación de Web Workers para el cálculo asíncrono de indicadores (SMA, Bollinger Bands, RSI).
- [ ] Visualización de "Order Book" y lista de posiciones en tiempo real.

## Fase 3: Gestión de Órdenes y Cálculos de Riesgo (Semana 3)
**Objetivo:** Permitir la apertura, gestión y liquidación automática de posiciones.

- [ ] Implementación de calculadoras financieras completas (`margin.calculator.ts` con Vitest).
- [ ] Desarrollo del `OrderTicket` (interfaz de compra/venta).
- [ ] Lógica de apertura y cierre simulado (Mock backend o A-Book simulado).
- [ ] Implementación del motor de Margin Call y Stop Out (Alertas y cierre forzoso).
- [ ] Panel de métricas del inversor (Balance, Equity, Margen Libre).

## Fase 4: Integración Web3, Módulo Legal y Roles (Semana 4)
**Objetivo:** Completar el cumplimiento normativo (Legal) y métodos de fondeo.

- [ ] Integración Web3 con **Coinbase Wallet SDK**.
- [ ] Componente Faucet: Smart Contract interaction para inyección de fondos de prueba al Balance.
- [ ] Módulo **InvesPro Legal** (T&C, Privacidad, KYC de 2 niveles, AML visual).
- [ ] Dashboard del Asesor (Vista de clientes asignados y su Margin Level).
- [ ] Dashboard Super Admin (Aprobación KYC, gestión global, analíticas de depósitos/retiros).

## Siguientes Pasos (Post MVP)
- Integración de pagos Fiat (Ramp/Stripe).
- Implementación real del backend Node.js (Fastify + PostgreSQL).
- Auditoría de seguridad e Integración de WebSockets Pub/Sub mediante Redis.
