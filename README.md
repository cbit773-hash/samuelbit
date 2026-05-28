# InvesPro Trading Platform 🚀

> **Plataforma de trading CFD — operación Perú-first (SAC, PEN/USD, bancos locales).**

Bienvenido al repositorio oficial de **InvesPro**, una plataforma de trading de próxima generación diseñada para inversores, asesores y administradores. Este proyecto utiliza tecnologías de vanguardia para ofrecer una experiencia fluida, datos en tiempo real y características avanzadas como integración Web3 y cumplimiento normativo integral.

## 📚 Documentación del Proyecto

Como parte del inicio arquitectónico, toda la documentación de diseño y lineamientos técnicos se encuentra estructurada para guiar al equipo de desarrollo:

0. **[Estructura del proyecto](./docs/ESTRUCTURA_PROYECTO.md)**: Árbol de carpetas, mapa del código del **cliente/inversor**, terminal de trading, wallet, CRM y servicios Supabase. Punto de entrada para ubicar archivos rápidamente.
1. **[Arquitectura Principal](./ARCHITECTURE.md)**: El documento central con el Stack Tecnológico, Modelos de Datos, Roles (RBAC), Estrategia Real-Time y Flujo de Operaciones.
2. **[Manual Técnico y Estándares](./docs/01_TECHNICAL_STANDARDS.md)**: Convenciones de código, manejo del estado global (Zustand), y guías de testing.
3. **[Lógica de Negocio y Módulos Core](./docs/02_BUSINESS_LOGIC.md)**: Detalle del motor de trading, integración Web3 (Coinbase Wallet) y el módulo "InvesPro Legal".
4. **[Sistema de Diseño UX/UI](./docs/03_DESIGN_SYSTEM.md)**: Lineamientos estéticos ("Naranja Bit" y "Negro profundo"), tipografía, y estructura de componentes Glassmorphism.
5. **[Guía mercado Perú](./docs/GUIA_PERU_MERCADO.md)** · **[Pagos Perú](./docs/GUIA_PERU_PAGOS.md)** · **[AML/KYC Perú](./docs/GUIA_PERU_AML_KYC.md)**

## 🛠️ Stack Tecnológico Resumido

- **Frontend**: React 18, Vite 5, TypeScript 5, Tailwind CSS 3
- **Estado Global**: Zustand 4 (Trading Core), React Query 5 (REST Server State)
- **Tiempo Real**: WebSockets Nativos, Finage API, Binance WS API, Lightweight Charts 4
- **Web3**: Coinbase Wallet SDK, Ethers.js / Viem

## 🚀 Inicio Rápido (Desarrolladores)

*Nota: El proyecto actualmente se encuentra en fase de diseño de arquitectura. Los siguientes comandos estarán disponibles una vez se inicialice el repositorio con Vite.*

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

La plataforma soporta tres niveles de acceso principal:
- **Investores (`INVESTOR`)**: Usuarios que operan en los mercados.
- **Asesores (`ADVISOR`)**: Profesionales que gestionan la cartera y riesgo de sus clientes.
- **Super Administradores (`SUPER_ADMIN`)**: Control total, métricas globales y cumplimiento KYC/AML.

---
*Arquitectura diseñada por el equipo de Ingeniería Principal (Senior Architecture).*