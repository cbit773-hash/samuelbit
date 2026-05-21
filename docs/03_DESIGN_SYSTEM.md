# 03. Sistema de Diseño UX/UI (InvesPro)

La interfaz de **InvesPro** debe transmitir seguridad, tecnología avanzada y profesionalismo institucional. A diferencia de las plataformas genéricas, InvesPro apuesta por una estética moderna, limpia y altamente reactiva.

## 1. Identidad Visual (Paleta de Colores)

El sistema de diseño de Tailwind CSS debe configurarse estrictamente con los siguientes tokens de color en `tailwind.config.js`:

- **Background (Negro Profundo)**: `#050505`
  - Utilizado para el fondo principal de la aplicación. Elimina el contraste estridente del blanco absoluto, reduciendo la fatiga visual de los traders que observan monitores por horas.
- **Primary (Naranja Bit)**: `#f59e0b` (Amber 500)
  - Color de acción principal (Call to Action). Representa la energía, el dinamismo crypto y la identidad central de "InvesPro".
  - *Variaciones*: Hover `#d97706` (Amber 600), Glow Effect `rgba(245, 158, 11, 0.5)`.
- **Surface / Glassmorphism**: `rgba(255, 255, 255, 0.03)`
  - Utilizado para tarjetas (Cards), paneles laterales y modales. Se debe combinar con `backdrop-blur-md` y bordes sutiles `border border-white/10`.
- **Semantic Colors (Trading)**:
  - Positivo / Compra (Bullish): `#10b981` (Emerald) - *"Velas verdes"*
  - Negativo / Venta (Bearish): `#ef4444` (Red) - *"Velas rojas"*
  - Alertas (Margin Call): `#f43f5e` (Rose)

## 2. Tipografía y Estructura

- **Fuente Principal**: *Inter* o *Roboto* para legibilidad máxima en datos numéricos e interfaces densas de trading.
- **Jerarquía**:
  - `h1`: Títulos de panel (ej. "Dashboard Inversor", "InvesPro Legal").
  - Monospace: **Obligatorio** usar fuentes monoespaciadas para los precios en tiempo real, saldos y tablas de órdenes (`font-mono`), para evitar que el texto "salte" al cambiar los dígitos.

## 3. Componentes Base (UI Kit)

### 3.1 GlassCard
El componente fundamental de layout. Todo panel de control, gráfico o formulario debe estar contenido dentro de una GlassCard.
```tsx
// Ejemplo conceptual
<div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 shadow-xl">
  {children}
</div>
```

### 3.2 Micro-Interacciones
- **Botones de Ejecución (Buy/Sell)**: Deben incluir un efecto visual de "presionado" rápido (`active:scale-95`) y un `transition-all` suave para confirmar al usuario que su orden fue enviada.
- **Actualización de Precios**: Los números en el panel de posiciones deben tener destellos (flashes) de color temporal. Si el P&L sube, brilla verde levemente y se desvanece; si baja, brilla rojo.

## 4. Gráficos (Charting)
- Los gráficos provistos por `lightweight-charts` deben configurarse programáticamente para usar el fondo `#050505`, eliminar los bordes por defecto, y colorear las velas usando la paleta semántica.
- **Marca de agua**: InvesPro exige que el gráfico incluya una marca de agua (Watermark) semitransparente con el nombre "InvesPro" en el fondo, para branding en caso de que los usuarios tomen capturas de pantalla de sus operaciones.

## 5. Responsive Design
- **Mobile First**: Aunque las terminales de trading suelen ser Desktop, la app debe ser completamente responsiva.
- En móvil, los paneles complejos (Order Book, Charts) deben estar en pestañas (Tabs) en lugar de apilarse en una columna interminable.
