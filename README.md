# InvesPro Trading Platform 🚀

> **Plataforma de trading CFD — operación Perú-first (SAC, PEN/USD, bancos locales).**

Bienvenido al repositorio oficial de **InvesPro**, una plataforma de trading de próxima generación diseñada para inversores, asesores y administradores. Este proyecto utiliza tecnologías de vanguardia para ofrecer una experiencia fluida, datos en tiempo real y características avanzadas como integración Web3 y cumplimiento normativo integral.

## 📚 Documentación del Proyecto

Como parte del inicio arquitectónico, toda la documentación de diseño y lineamientos técnicos se encuentra estructurada para guiar al equipo de desarrollo:

0. **[Brief Técnico y Arquitectónico](./docs/BRIEF_TECNICO_ARQUITECTONICO.md)**: Documento maestro de arquitectura senior — resumen ejecutivo, dominios, ADRs, stack real, flujos críticos y playbook para replicar este tipo de plataforma. **Punto de entrada principal.**
1. **[Estructura del proyecto](./docs/ESTRUCTURA_PROYECTO.md)**: Árbol de carpetas, mapa del código del **cliente/inversor**, terminal de trading, wallet, CRM y servicios Supabase.
2. **[Arquitectura Principal](./ARCHITECTURE.md)**: Diseño original — Stack Tecnológico, Modelos de Datos, Roles (RBAC), Estrategia Real-Time y Flujo de Operaciones.
3. **[Manual Técnico y Estándares](./docs/01_TECHNICAL_STANDARDS.md)**: Convenciones de código, manejo del estado global (Zustand), y guías de testing.
4. **[Lógica de Negocio y Módulos Core](./docs/02_BUSINESS_LOGIC.md)**: Detalle del motor de trading, integración Web3 (Coinbase Wallet) y el módulo "InvesPro Legal".
5. **[Sistema de Diseño UX/UI](./docs/03_DESIGN_SYSTEM.md)**: Lineamientos estéticos ("Naranja Bit" y "Negro profundo"), tipografía, y estructura de componentes Glassmorphism.
6. **[Guía mercado Perú](./docs/GUIA_PERU_MERCADO.md)** · **[Pagos Perú](./docs/GUIA_PERU_PAGOS.md)** · **[AML/KYC Perú](./docs/GUIA_PERU_AML_KYC.md)**

## 🛠️ Stack Tecnológico Resumido

- **Frontend**: React 19, Vite 8, TypeScript 6, Tailwind CSS 3
- **Backend**: Supabase (PostgreSQL + Auth + Storage + Edge Functions)
- **Estado Global**: Zustand 5 (Trading Core), ClientDataContext (server state)
- **Tiempo Real**: Binance WebSocket, Lightweight Charts 4, Supabase Realtime
- **Integraciones**: Twilio Voice, NOWPayments, Coinbase Wallet SDK

## 🚀 Inicio Rápido (Desarrolladores)

```bash
# 1. Clonar el repositorio
git clone https://github.com/cbit773-hash/samuelbit.git
cd samuelbit

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env

# 4. Iniciar servidor de desarrollo
npm run dev
```

## 👥 Equipo y Roles (RBAC)

La plataforma soporta una jerarquía institucional de **7 roles**:

`HEAD` → `CHIEF` → `MANAGER` → `FLOOR_MANAGER` → `TEAM_LEADER` → `AGENT` → `CLIENT`

Detalle completo en [`docs/08_ROLES_Y_FUNCIONES.md`](./docs/08_ROLES_Y_FUNCIONES.md) y [`docs/BRIEF_TECNICO_ARQUITECTONICO.md`](./docs/BRIEF_TECNICO_ARQUITECTONICO.md).

---
*Arquitectura diseñada por el equipo de Ingeniería Principal (Senior Architecture).*