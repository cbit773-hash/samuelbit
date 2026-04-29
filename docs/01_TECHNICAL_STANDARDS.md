# 01. Estándares Técnicos y Convenciones (Zaki Bit)

Este documento establece las normativas de desarrollo y arquitectura técnica requeridas para construir la plataforma **Zaki Bit** de manera robusta, escalable y mantenible. Como equipo de alto rendimiento, debemos seguir estas directrices de manera estricta.

## 1. Convenciones de Código y TypeScript

### 1.1 Tipado Estricto
- **Prohibido el uso de `any`**. Si el tipo es desconocido al momento de la escritura, utilice `unknown` y valide el tipo en tiempo de ejecución.
- Las interfaces deben utilizarse para definir modelos de datos y props de componentes. Reserve `type` para uniones (unions), tuplas y alias primitivos.
- Utilice `enum` para valores constantes fijos (ej. `OrderType`, `Role`) para asegurar legibilidad.

### 1.2 Nomenclatura
- **Archivos de React**: PascalCase (`CandlestickChart.tsx`, `LoginForm.tsx`).
- **Hooks**: camelCase con prefijo `use` (`useMarketWebSocket.ts`).
- **Servicios/Utilidades**: camelCase descriptivo (`binance.service.ts`, `margin.calculator.ts`).
- **Constantes**: UPPER_SNAKE_CASE (`MAX_LEVERAGE`, `DEFAULT_MARGIN_CALL_THRESHOLD`).

## 2. Gestión del Estado (State Management)

Zaki Bit opera en un entorno de alta frecuencia de datos. Separamos el estado en dos categorías claramente definidas:

### 2.1 Estado del Servidor (React Query)
- Usado para datos asíncronos REST (Historial de transacciones, Perfil de usuario, Configuración KYC).
- **Regla:** Ningún dato REST debe almacenarse en el estado global ni en `useState` (excepto filtros UI temporales).
- Las mutaciones (`useMutation`) deben utilizar *optimistic updates* para mejorar la percepción de velocidad, especialmente en la asignación de asesores y aprobación KYC.

### 2.2 Estado Global Reactivo (Zustand)
- Usado **exclusivamente** para el motor de trading y WebSockets (Precios en tiempo real, Posiciones Abiertas, Cálculo de Equidad y Margen).
- **Rendimiento:** Evite exportar el estado completo en un solo selector. Seleccione fragmentos atómicos para evitar re-renders innecesarios.
  ```typescript
  // ❌ INCORRECTO: Re-renderiza en CADA tick de CUALQUIER símbolo
  const { currentPrices } = useTradingStore(); 
  
  // ✅ CORRECTO: Re-renderiza SOLO cuando cambia BTCUSDT
  const btcPrice = useTradingStore((state) => state.currentPrices['BTCUSDT']);
  ```

## 3. Estructura de Componentes

### 3.1 Container vs Presentational
- Los componentes en `src/features/*/components` deben dividirse lógicamente:
  - **Containers**: Manejan lógica, llamadas a hooks (Zustand/React Query), y pasan datos hacia abajo.
  - **Presentational**: Reciben `props`, no tienen estado global, se enfocan en la UI y la estética "Zaki Bit".

### 3.2 Manejo de Errores y Suspense
- Cada módulo grande (Trading, Wallet, Admin) debe estar envuelto en su propio `<ErrorBoundary>`.
- Use `<Suspense>` de React 18 combinado con React Query para mostrar Skeletons (UI de carga) mientras se obtienen los datos.

## 4. Integración Continua (CI/CD)

- **Linter y Formatter**: `ESLint` estricto y `Prettier`. Fallos en linting rompen la pipeline.
- **Testing**: 
  - *Lógica financiera* (`margin.calculator.ts`): Cobertura del 100% con Vitest. Ningún cambio en las matemáticas de apalancamiento puede ir a producción sin pruebas automatizadas de casos límite (Stop Out, Margin Call).
  - *Componentes críticos*: Pruebas de integración con React Testing Library (ej. OrderTicket).

## 5. Rendimiento y WebGL

- El gráfico de velas (`CandlestickChart.tsx`) utiliza `lightweight-charts`, el cual renderiza en Canvas/WebGL.
- **IMPORTANTE:** Nunca sobreponga elementos DOM pesados sobre el gráfico con actualizaciones frecuentes, ya que forzará repaints del navegador.
- Los Web Workers deben utilizarse para calcular indicadores técnicos pesados (Bandas de Bollinger, medias móviles sobre miles de velas) para no saturar el hilo principal de la interfaz de usuario.
