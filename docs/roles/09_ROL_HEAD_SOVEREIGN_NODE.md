# 09 — Rol HEAD: Sovereign Node (Súper Administrador)

> Documento técnico-funcional del nivel más alto de la jerarquía operativa de **InvestPRO**.

---

## 1. Definición del Rol

El **HEAD** es el nivel supremo de control dentro de InvestPRO. Actúa como un **Sovereign Node** — un nodo soberano con visibilidad total y autoridad absoluta sobre cada aspecto de la operación: personal, clientes, finanzas, riesgo y seguridad.

| Atributo | Valor |
|:---|:---|
| Código de rol | `HEAD` |
| Nivel jerárquico | 7/7 (Máximo) |
| Acceso | Lectura y escritura global |
| Reporta a | Nadie (Nivel superior) |
| Supervisa a | CHIEF, MANAGER, FLOOR_MANAGER, TEAM_LEADER, AGENT, CLIENT |

---

## 2. Módulos del Dashboard

El panel del HEAD se organiza en **7 pestañas** principales, accesibles desde la barra de navegación superior y desde el sidebar izquierdo.

### 2.1 Overview (Centro de Comando)

Pantalla principal con visión 360° de la operación en tiempo real.

**Componentes:**

| Widget | Descripción |
|:---|:---|
| **Barra de Estado del Servidor** | Muestra latencia (ms), uptime (%), hora del servidor y estado de conexión en vivo. |
| **KPI Cards** | Revenue del mes, Total FTDs, Retención (Upsells) y Conversión Global. Cada card incluye porcentaje de cambio con indicador visual (▲ verde / ▼ rojo). |
| **Panel de Riesgo** | Exposición neta (Net Exposure) con barra de gradiente bajo→medio→alto. Muestra posiciones Long vs Short y botón **Emergency Stop** para detener toda operación de trading instantáneamente. |
| **Top 5 Agentes** | Ranking con barras de progreso por meta de FTDs, tasa de conversión en tiempo real y revenue generado. |
| **Live Deposit Stream** | Ticker animado que muestra depósitos entrando a la plataforma con país (bandera), monto, tipo (FTD/Retención) y tiempo transcurrido. |
| **Alertas del Sistema** | Notificaciones categorizadas por severidad (peligro, advertencia, informativo) — agentes inactivos, leads sin contactar, depósitos pendientes. |

**Acciones disponibles:**
- Activar/desactivar Emergency Stop
- Monitoreo pasivo de KPIs sin necesidad de navegar

---

### 2.2 Personal (Gestión de Personal)

Control total sobre los empleados de la organización.

**Funcionalidades:**

| Función | Descripción |
|:---|:---|
| **Ver todos los empleados** | Tabla completa con nombre, email, rol, mesa asignada, estado y fecha de ingreso. |
| **Crear usuario** | Modal para registrar nuevo empleado con nombre, correo, rol y mesa. |
| **Cambiar rol** | Clic en el badge de rol → selector desplegable para cambiar entre los 7 niveles. |
| **Reasignar mesa** | Clic en el nombre de la mesa → selector desplegable con las mesas disponibles. |
| **Bloquear usuario** | Botón rojo que abre modal de confirmación. Al confirmar, el usuario pierde acceso inmediato a la plataforma. Su fila se atenúa visualmente y muestra un candado. |
| **Desbloquear usuario** | Botón verde que restaura el acceso del usuario bloqueado. |
| **Búsqueda** | Filtro por nombre o email en tiempo real. |
| **Filtro por rol** | Badges clicables que filtran la tabla por rol específico (AGENT, TEAM_LEADER, etc.). |

**Estadísticas visibles:**
- Total de personal
- Activos
- Bloqueados
- Total de agentes

---

### 2.3 CRM & Leads

Gestión completa del pipeline de ventas con acceso al perfil detallado de cada cliente.

**Funcionalidades:**

| Función | Descripción |
|:---|:---|
| **Ver todos los leads** | Tabla con ID, nombre, teléfono, país, status, agente asignado y fecha de creación. |
| **Agregar lead** | Modal para crear un lead individual con nombre, teléfono, país y email. |
| **Cambiar status** | Clic en el badge de status → selector con 7 estados posibles (Nuevo → Cerrado FTD). |
| **Reasignar agente** | Clic en el nombre del agente → selector con lista de agentes disponibles. |
| **Auto-asignar** | Botón que distribuye todos los leads sin agente automáticamente usando round-robin entre los agentes activos. |
| **Búsqueda** | Por nombre o país. |
| **Filtro por status** | Todos, Nuevo, Contactado, En seguimiento, Cerca de cierre, Cerrado (FTD). |

**Perfil del Cliente (Panel Slide-Out):**

Al hacer clic en el nombre de un lead, se abre un panel lateral derecho con información completa:

| Sección | Contenido |
|:---|:---|
| **Encabezado** | Nombre, teléfono, email, país, ID del lead. |
| **Estadísticas rápidas** | Total depositado ($), cantidad de llamadas, cantidad de notas, agente asignado. |
| **Depósitos** | Lista de todos los depósitos del cliente con monto, tipo (FTD/Retención), status (Aprobado/Verificando/Rechazado) y fecha. |
| **Historial de Llamadas** | Registro de cada llamada con tipo (Entrante/Saliente), duración, resultado y agente que realizó la llamada. |
| **Notas del Agente** | Timeline de notas escritas por los agentes sobre el cliente, con fecha y autor. |

---

### 2.4 Depósitos (Auditoría Financiera)

Panel de control para aprobar, rechazar y auditar todos los depósitos de la plataforma.

**Funcionalidades:**

| Función | Descripción |
|:---|:---|
| **Aprobar depósito** | Botón verde que cambia el status a "Aprobado". |
| **Rechazar depósito** | Botón rojo que cambia el status a "Rechazado". |
| **Revertir decisión** | Botón para devolver un depósito ya procesado al estado "Verificando". |
| **Filtro por tipo** | Todos, FTD, Retención. |
| **Filtro por status** | Todo Status, Verificando, Aprobado, Rechazado. |
| **Búsqueda** | Por nombre de cliente o agente responsable. |

**Métricas en tiempo real:**
- Total aprobado (mes)
- Monto pendiente de verificación
- Cantidad por verificar
- Total de depósitos

---

### 2.5 Mesas (Rendimiento de Equipos)

Análisis comparativo del desempeño de cada mesa de operaciones.

**Información por mesa:**

| Dato | Descripción |
|:---|:---|
| **Nombre de la mesa** | Identificador (Mesa Alpha, Mesa Beta, Mesa Gamma). |
| **Manager asignado** | Floor Manager o Manager responsable. |
| **Número de agentes** | Cantidad de agentes activos en la mesa. |
| **Leads asignados** | Total de leads en el pipeline de la mesa. |
| **FTDs** | First-Time Deposits cerrados por la mesa. |
| **Retención** | Volumen de retención ($) generado. |
| **Conversión** | Tasa de conversión (%) leads → FTDs. |
| **Ranking** | Posición relativa entre todas las mesas (badge "TOP" para la #1). |

Cada mesa muestra una tabla interna con el desglose individual por agente: nombre, FTDs, leads, y tasa de conversión.

---

### 2.6 Anti-Fraude (Motor de Seguridad)

Sistema de detección de fraude con capacidad de acción inmediata.

**Tipos de alerta detectados:**

| Tipo | Descripción |
|:---|:---|
| **Abuso de Bono** | Cliente retira más del 80% de lo depositado con volumen de trading inferior al doble del bono. |
| **Arbitraje de Latencia** | Más de 50 trades en una hora con ejecución <50ms y ratio de profit >95%. |
| **Multi-Cuenta (IP)** | Múltiples cuentas registradas desde la misma dirección IP. |
| **Patrón de Chargeback** | 2+ chargebacks en 90 días o ratio de reversión >30%. |

**Niveles de severidad:** `LOW` → `MEDIUM` → `HIGH` → `CRITICAL`

**Acciones disponibles:**

| Acción | Descripción |
|:---|:---|
| **Investigar** | Marca la alerta como "En Investigación". |
| **Resolver** | Cierra la alerta como resuelta. |
| **Falso Positivo** | Descarta la alerta sin acción. |
| **Kill Switch** | Bloqueo inmediato del usuario. Abre modal de confirmación con evidencia del fraude. Al confirmar, se bloquean todas las operaciones, retiros y acceso del cliente. La acción se registra en logs inmutables. |

---

### 2.7 Configuración

Ajustes globales de la operación.

| Sección | Parámetros |
|:---|:---|
| **Metas Globales** | Meta de FTDs diarios por agente, meta de retención mensual (USD), conversión mínima (%), depósito mínimo (USD). |
| **Horarios de Operación** | Zona horaria, hora de inicio, hora de cierre. |
| **Ajustes de Riesgo** | Apalancamiento máximo (1:50 a 1:500), nivel de margin call (%). |
| **Logs de Auditoría** | Timeline de las últimas acciones realizadas en la plataforma: cambios de rol, reasignaciones, aprobaciones, etc. Cada registro muestra la acción, quién la ejecutó y cuándo. |

---

## 3. Permisos del HEAD

```
┌─────────────────────────┬───────────────────────┐
│ Capacidad               │ Nivel de Acceso       │
├─────────────────────────┼───────────────────────┤
│ Ver todos los perfiles  │ ✅ Lectura global      │
│ Crear usuarios          │ ✅ Escritura           │
│ Bloquear/Desbloquear    │ ✅ Escritura           │
│ Cambiar roles           │ ✅ Escritura           │
│ Ver todos los leads     │ ✅ Lectura global      │
│ Reasignar leads         │ ✅ Escritura           │
│ Aprobar depósitos       │ ✅ Escritura           │
│ Rechazar depósitos      │ ✅ Escritura           │
│ Activar Kill Switch     │ ✅ Escritura + 2FA     │
│ Configurar metas        │ ✅ Escritura           │
│ Emergency Stop          │ ✅ Acción crítica      │
│ Borrar logs de auditoría│ ❌ PROHIBIDO (inmutable)│
│ Modificar su propio rol │ ❌ PROHIBIDO           │
└─────────────────────────┴───────────────────────┘
```

---

## 4. Arquitectura Técnica

### Archivos principales del módulo HEAD:

| Archivo | Función |
|:---|:---|
| `HeadDashboard.tsx` | Orquestador principal con sistema de pestañas sincronizado con URL (`?tab=`). |
| `OverviewTab.tsx` | Centro de comando con KPIs, panel de riesgo, live deposits y alertas. |
| `PersonnelTab.tsx` | CRUD completo de empleados con bloqueo/desbloqueo y modales. |
| `LeadsTab.tsx` | CRM con reasignación, auto-assign y perfil de cliente. |
| `ClientProfile.tsx` | Panel slide-out con historial completo del lead. |
| `DepositsTab.tsx` | Auditoría financiera con aprobación/rechazo. |
| `PerformanceTab.tsx` | Ranking de mesas con desglose por agente. |
| `FraudTab.tsx` | Motor anti-fraude con Kill Switch. |
| `SettingsTab.tsx` | Configuración global y logs de auditoría. |

### Navegación:

El sidebar izquierdo del `MainLayout.tsx` contiene enlaces directos a cada pestaña usando query params:
```
/dashboard/head?tab=overview     → Centro de Comando
/dashboard/head?tab=personnel    → Gestión de Personal
/dashboard/head?tab=leads        → CRM & Leads
/dashboard/head?tab=deposits     → Auditoría Depósitos
/dashboard/head?tab=performance  → Rendimiento Mesas
/dashboard/head?tab=fraud        → Anti-Fraude
```

---

## 5. Principios de Diseño

- **Estética Cyber-Corporate**: Fondo oscuro profundo (`#060d14`), acentos en cyan neón (`#00E5FF`), emerald para KPIs positivos.
- **Control granular**: Cada acción es un clic. Sin menús enterrados.
- **Inmutabilidad de auditoría**: Todo cambio se registra. Nada es borrable.
- **Confirmación de acciones críticas**: Bloqueos y Kill Switch requieren modal de confirmación.
- **Feedback visual inmediato**: Las tablas se actualizan al instante al ejecutar una acción.
