# 05. Guía de Creación Segura del Proyecto

Esta guía detalla el paso a paso estructurado para inicializar el proyecto técnico sin sobrescribir ni dañar la arquitectura y documentación ya existente. Como desarrollador, debes seguir estos pasos en orden cronológico.

## Paso 1: Inicialización de Git
El proyecto ya tiene un repositorio remoto asignado. El primer paso es asegurar que el código local esté trackeado.
```bash
# 1. Inicializar git en la carpeta actual
git init

# 2. Agregar el repositorio remoto
git remote add origin https://github.com/cbit773-hash/samuelbit.git

# 3. Guardar la documentación arquitectónica actual
git add .
git commit -m "docs: inicialización de la arquitectura y roadmap del proyecto InvesPro"

# 4. Subir los cambios a la rama principal (main/master)
git branch -M main
git push -u origin main
```

## Paso 2: Creación del Proyecto Vite (React + TS)
En lugar de crear una nueva carpeta, inicializaremos Vite **en el directorio actual** para mantener los archivos `.md` en su lugar.
```bash
# Inicializar Vite en la carpeta actual (el punto '.' significa "aquí")
# Nota: Vite puede advertir que la carpeta no está vacía, puedes confirmar con 'y' (yes)
npm create vite@latest . -- --template react-ts

# Instalar las dependencias base que trae Vite
npm install
```

## Paso 3: Instalación de Dependencias Core
Instalaremos las dependencias definidas en el stack tecnológico (`ARCHITECTURE.md`).
```bash
# Router y estado
npm install react-router-dom zustand @tanstack/react-query

# Tailwind CSS, PostCSS y Autoprefixer
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Iconos y Gráficos
npm install lucide-react lightweight-charts

# Supabase (Base de datos y Autenticación)
npm install @supabase/supabase-js
```

## Paso 4: Configuración de Tailwind CSS
Abre el archivo generado `tailwind.config.js` y configurarlo con los colores "InvesPro" (Naranja Bit `#f59e0b` y Fondo `#050505`).
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#050505',
        primary: '#f59e0b',
        // Añadir los colores definidos en ../design/03_DESIGN_SYSTEM.md
      }
    },
  },
  plugins: [],
}
```
Y reemplazar el contenido de `src/index.css` por las directivas base de Tailwind:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  background-color: #050505;
  color: #ffffff;
}
```

## Paso 5: Estructura de Carpetas e Inicialización de Supabase
1. Crea la estructura de carpetas definida en el documento de arquitectura.
```bash
mkdir -p src/features src/shared src/config
```
2. Crea un archivo `.env` en la raíz (asegúrate de que esté en `.gitignore`):
```env
VITE_SUPABASE_URL=tu_url_de_supabase
VITE_SUPABASE_ANON_KEY=tu_anon_key_de_supabase
```

## Paso 6: Verificación del Entorno
Finalmente, ejecuta el servidor de desarrollo para validar que Vite, Tailwind y React funcionan correctamente.
```bash
npm run dev
```

> **Nota de Seguridad:** Al usar `npm create vite@latest .`, el comando respetará tus archivos Markdown ya creados y solo añadirá los archivos base de React (`package.json`, `index.html`, `src/`, etc.).
