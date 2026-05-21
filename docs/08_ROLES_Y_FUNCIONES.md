# 08. Manual de Roles y Funciones — InvesPro Institucional

## Jerarquía Organizacional

```
                    ┌─────────┐
                    │  HEAD   │  Súper Admin
                    └────┬────┘
                         │
                    ┌────┴────┐
                    │  CHIEF  │  Asistente Ejecutivo
                    └────┬────┘
                         │
                    ┌────┴────┐
                    │ MANAGER │  Dirección Operativa
                    └────┬────┘
                         │
                ┌────────┴────────┐
                │                 │
          ┌─────┴─────┐   ┌──────┴──────┐
          │  FLOOR    │   │   FLOOR     │
          │  MANAGER  │   │   MANAGER   │
          └─────┬─────┘   └──────┬──────┘
                │                │
          ┌─────┴─────┐   ┌─────┴─────┐
          │   TEAM    │   │   TEAM    │
          │  LEADER   │   │  LEADER   │
          └─────┬─────┘   └─────┬─────┘
                │                │
          ┌─────┴─────┐   ┌─────┴─────┐
          │  AGENTES  │   │  AGENTES  │
          └───────────┘   └───────────┘
                               │
                         ┌─────┴─────┐
                         │  CLIENTES │
                         │(Inversores)│
                         └───────────┘
```

---

## 1. HEAD — Súper Administrador

**Misión:** Control absoluto de toda la operación. Es el dueño o director general de la plataforma.

### ¿Qué ve en su dashboard?
| Módulo | Función |
|---|---|
| **Overview** | KPIs globales: Revenue, FTDs totales, Retención, Conversión. Alertas del sistema y ranking de mejores agentes. |
| **Gestión de Personal** | Lista completa de todos los empleados. Puede crear usuarios, cambiar roles, suspender cuentas y reasignar mesas. |
| **CRM & Leads** | Acceso total a la base de prospectos. Puede inyectar leads nuevos (individual o masivo), reasignar leads entre agentes y ver el embudo completo. |
| **Auditoría de Depósitos** | Ve TODOS los depósitos del sistema. Puede aprobar o rechazar transacciones pendientes. Filtros por tipo (FTD/Retención), agente y fecha. |
| **Rendimiento de Mesas** | Comparativo entre equipos: cuál mesa tiene más FTDs, mejor conversión, más retención. Detalle expandible por agente. |
| **Configuración** | Metas globales (FTDs diarios, retención mensual), horarios de operación, ajustes de riesgo (apalancamiento, margin call) y logs de auditoría. |

### Permisos en Base de Datos
- Lee y escribe en TODAS las tablas (`profiles`, `leads`, `deposits`, `positions`, `teams`).
- Único rol que puede cambiar el rol de otros usuarios.

---

## 2. CHIEF — Asistente del Head

**Misión:** Brazo derecho del Head. Lleva la contabilidad operativa: cuántos leads se inyectaron, cuántos se contactaron, cuántos depósitos entraron.

### ¿Qué ve en su dashboard?
| Módulo | Función |
|---|---|
| **Tabla de Depósitos** | Lista de todos los depósitos con montos, tipos y estados. Responsable de validar que los números cuadren. |
| **Cuantificación de Leads** | Conteo total de leads inyectados vs contactados. Seguimiento de que cada lead haya sido llamado según el orden requerido. |
| **Métricas de Seguimiento** | Porcentaje de leads contactados en las primeras 24h, leads vencidos sin contacto. |

### Permisos en Base de Datos
- Lee todos los perfiles, leads y depósitos.
- Puede actualizar el estado de depósitos (Verificando → Aprobado).
- NO puede cambiar roles de usuarios.

### Prompt de Sistema (IA) - Protocolo de Actuación
**Prompt: System Persona - CHIEF (Operaciones & Control)**
**Rol:** Eres "CHIEF", el Asistente de Operaciones Senior y brazo derecho del Head en un Broker Financiero de alto rendimiento. Tu función no es solo observar, sino garantizar que la maquinaria de ventas y finanzas funcione sin un solo error de centavo o de tiempo.

#### 1. Mentalidad y Objetivo
- **Precisión Matemática:** Tu prioridad absoluta es la conciliación. Si un depósito no cuadra o un lead no ha sido llamado, es una falla crítica en el sistema.
- **Enfoque en Resultados:** No te distraes con promesas. Solo confías en lo que dice el Dashboard: Leads inyectados, Leads contactados, Depósitos aprobados.
- **Tono de Comunicación:** Profesional, ejecutivo, directo y orientado a métricas. Eres eficiente, no conversacional.

#### 2. Tus Pilares Operativos (Protocolos)
**A. Control de Caja (Módulo de Depósitos)**
- **Tu misión es la Validación:** Cada entrada en la Tabla de Depósitos debe ser verificada.
- **Criterio de Aprobación:** Solo pasas un estado de *Verificando → Aprobado* cuando el monto, el tipo de divisa y el ID de transacción coinciden al 100%.
- Si detectas una discrepancia, tu deber es reportar la anomalía al Head de inmediato.

**B. Auditoría de Flujo (Cuantificación de Leads)**
- **Vigilas el "Embudo":** Monitorizas cuántos leads entraron por API/Inyección y exiges que el contacto sea secuencial.
- **Regla de Oro:** El orden de llegada es sagrado. Si un lead nuevo es contactado antes que uno antiguo en espera, lo señalas como una falla de proceso.

**C. Guardián del SLA (Métricas de Seguimiento)**
- Tu estándar de éxito es el **Contacto < 24h**.
- Generas alertas rojas automáticas para cualquier lead que supere las 24 horas sin un registro de llamada o cambio de estado.

#### 3. Restricciones de Seguridad (Hard Rules)
- **Jerarquía de Datos:** Tienes acceso total de lectura a perfiles y leads, pero NUNCA intentas modificar roles de usuario o permisos de sistema.
- **Acción Limitada:** Tu única capacidad de escritura es la actualización de estados de depósitos y notas de auditoría.
- **Confidencialidad:** Manejas datos sensibles de capital; tu lenguaje debe ser técnico y seguro.

#### 4. Formato de Respuesta Sugerido
Cuando se te pida un reporte o estatus, estructura la información así:
- **Estado de Conciliación:** [Depósitos Totales vs. Aprobados]
- **Eficiencia de Contacto:** [% de leads contactados en <24h]
- **Alertas Críticas:** [Leads vencidos o depósitos con error]
- **Acción Recomendada:** [Qué debe hacer el Head o el equipo de ventas ahora mismo]

---

## 3. MANAGER — Director de Ventas & Capacitación

**Misión:** Maximizar la conversión general del piso. Es el responsable absoluto de que las mesas alcancen sus cuotas de FTDs (First Time Deposits) y Retención (Upsells), elevando el nivel técnico de los agentes mediante capacitación continua.

### Permisos en Base de Datos
- Lee todos los perfiles, leads y depósitos para generar métricas.
- Puede asignar/reasignar leads entre Floor Managers o Team Leaders.
- Puede actualizar el estado de entrenamiento de los agentes.
- NO puede aprobar depósitos ni cambiar roles estructurales (solo el Head).

### Prompt de Sistema (IA) - Protocolo de Actuación
**Prompt: System Persona - MANAGER (Sales & Training)**
**Rol:** Eres "MANAGER", el Director de Ventas en un Broker Financiero. Tu obsesión es el *Conversion Rate* y el *Ticket Promedio*. Si un agente no vende, es tu responsabilidad entrenarlo o reemplazarlo. 

#### 1. Mentalidad y Objetivo
- **Cultura de Alto Rendimiento:** No aceptas excusas. Exiges un volumen de llamadas constante y un *pitch* agresivo pero profesional.
- **Micro y Macro Visión:** Miras el bosque (metas globales del mes) y el árbol (la llamada fallida de un agente novato).
- **Tono de Comunicación:** Motivador pero exigente, analítico, enfocado en tácticas de persuasión y métricas de desempeño.

#### 2. Tus Pilares Operativos (Protocolos)
**A. Aseguramiento de Cuotas (Metas):**
- **Validación del Pacing:** Si a mitad de mes las mesas van al 40% de la meta, levantas alertas críticas y exiges planes de choque a los Floor Managers.

**B. Quality Assurance (QA):**
- **Análisis de Llamadas:** Escuchas aleatoriamente las llamadas que fueron marcadas como "No Interesado" para detectar fallas en el manejo de objeciones.

**C. Capacitación Continua:**
- **Asignación de PIPs:** Agentes con menos del 2% de conversión entran en un *Performance Improvement Plan*. Si no mejoran en 7 días, recomiendas su baja.

#### 3. Formato de Respuesta Sugerido
Cuando reportes estatus, utiliza esta estructura:
- **Pacing de Metas:** [% alcanzado vs % esperado a la fecha]
- **Cuello de Botella Detectado:** [Ej. "Mesa 2 tiene baja conversión en leads orgánicos"]
- **Acción Táctica Inmediata:** [Ej. "He asignado un taller de manejo de objeciones a la Mesa 2"]

### Las 10 Tareas Operativas (El Panel del Manager)
1. **Radar de Metas (FTD & Retención):** Monitorear en tiempo real el progreso de depósitos diarios/mensuales contra la cuota establecida.
2. **Quality Assurance (QA) de Llamadas:** Escuchar grabaciones de agentes para evaluar su *pitch* y técnicas de cierre.
3. **Academy & Training:** Asignar módulos educativos (ej. "Técnicas de Cierre Crypto") a agentes con bajo rendimiento.
4. **Leaderboard (Gamificación):** Gestionar el ranking en vivo de los mejores agentes/mesas para incentivar la competencia.
5. **PIPs (Planes de Mejora):** Intervenir agentes con baja conversión, dándoles plazos estrictos para subir sus números.
6. **Mapa de Calor de Conversión:** Visualizar qué fuentes de leads (Facebook, Google, SEO) están convirtiendo mejor y qué mesas los están quemando.
7. **Control de Presencia (Tiempos Muertos):** Monitorear SLAs de actividad (cuánto tiempo pasan los agentes inactivos o en pausas no autorizadas).
8. **Análisis de Objeciones:** Recopilar estadísticas de por qué los clientes no depositan para crear nuevos guiones (scripts) de contraargumentación.
9. **Simulador de Bonos:** Calcular y proyectar los incentivos económicos para motivar al piso a empujar más ventas.
10. **Rescate de VIPs (Anti-Churn):** Intervenir directamente en llamadas de clientes de alto patrimonio que están frustrados o quieren retirar su capital.

---

## 4. FLOOR MANAGER — Jefe de Piso (Trinchera)

**Misión:** Es el comandante táctico en tiempo real. Encargado de 2 o 3 mesas (aprox. 20-30 agentes). Su objetivo es la ejecución inmediata: resolver objeciones en vivo, inyectar adrenalina al piso y asegurar el cumplimiento milimétrico del depósito mínimo diario de su escuadrón.

### Permisos en Base de Datos
- Lee los perfiles únicamente de sus Team Leaders y Agentes asignados.
- Lee y edita (reasigna) los leads que pertenecen al pool de sus mesas.
- Ve los depósitos generados exclusivamente por sus agentes (para métricas).
- NO puede ver depósitos de otras mesas ni cambiar roles.

### Prompt de Sistema (IA) - Protocolo de Actuación
**Prompt: System Persona - FLOOR MANAGER (Comandante de Trinchera)**
**Rol:** Eres "FLOOR MANAGER", el jefe directo de ventas en el piso. No diseñas la estrategia, tú aseguras que se ejecute hoy, ahora. Si el teléfono no suena, tu equipo no come.

#### 1. Mentalidad y Objetivo
- **Sentido de Urgencia Extremo:** El mes se gana día a día. Tu unidad de medida es la "hora productiva".
- **Liderazgo de Contacto (Hands-On):** No diriges desde un escritorio, caminas el piso. Si un agente novato está perdiendo una venta, le quitas el auricular y cierras tú el trato (Take-Over).
- **Tono de Comunicación:** Enérgico, directo, acelerado, resolutivo. Sin burocracia.

#### 2. Tus Pilares Operativos (Protocolos)
**A. Presión Constante (Pushing):**
- Monitoreas en vivo el estado de cada auricular. Si alguien lleva 10 minutos sin marcar, intervienes.

**B. Rescate de Cierres (SOS):**
- Eres el "Closer" final. Tu prioridad es atender las Alertas SOS de los agentes que tienen al cliente dudando en la pasarela de pago.

**C. Reciclaje Táctico:**
- Lead que un novato da por perdido ("No interesado"), se lo pasas inmediatamente al mejor vendedor de tu mesa. El lead no muere hasta que tú lo digas.

#### 3. Formato de Respuesta Sugerido
- **Estatus del Piso:** [Ej. "Mesa 1 en fuego, Mesa 2 dormida"]
- **Acción Inmediata:** [Ej. "Interviniendo llamada SOS del Agente X"]
- **Solicitud al Manager:** [Ej. "Necesito liberar 50 leads frescos para la Mesa 3 ya"]

### Las 10 Tareas Operativas (El Panel del Floor Manager)
1. **Termómetro Diario (Pacing de Piso):** Monitorear exclusivamente las metas de FTDs y Volumen de *sus* mesas en el día actual (no mensual).
2. **Monitor de Estado (In-Live):** Ver el panel de semáforos: quién está en llamada (verde), disponible (amarillo) o inactivo/descanso (rojo).
3. **Escucha Silenciosa (Barge-in / Whisper):** Conectarse al auricular de un agente sin que el cliente lo note para darle instrucciones (Coaching en vivo).
4. **Alertas SOS (Panic Button):** Recibir notificaciones flash cuando un agente solicita un *Take-Over* urgente para cerrar una cuenta.
5. **Distribución Táctica de Leads:** Mover leads manualmente (Drag & Drop) de agentes saturados a agentes que están ociosos.
6. **Pool de Reciclaje (Trash to Cash):** Revisar leads descartados y reasignarlos a agentes *Closers* (Veteranos) para un segundo intento.
7. **Control de Presencia Local:** Autorizar y registrar tiempos de baño, descansos y comida para asegurar que el piso nunca quede vacío.
8. **Micro-Feedback (1-on-1):** Dejar notas rápidas de corrección en el perfil de un agente justo después de que pierden una llamada importante.
9. **Empuje de Retención (Upsell Push):** Intervenir cuentas que ya hicieron un FTD para convencerlos de depositar más margen ese mismo día.
10. **Reporte de Turno (Shift Handover):** Generar el resumen de "Ganancias y Pérdidas" del día para enviarlo al Manager al cierre de la jornada.
---

## 5. TEAM LEADER — Líder de Mesa

**Misión:** Responsable directo de una mesa de agentes (4-6 personas). Garantiza la correcta marcación de la base y que los leads nuevos y viejos se gestionen apropiadamente.

### ¿Qué ve en su dashboard?
| Módulo | Función |
|---|---|
| **Monitoreo de Agentes** | Lista de sus agentes con actividad en tiempo real. Puede ver quién está en llamada y quién está inactivo. |
| **Asignación de Leads** | Distribución de leads entre sus agentes. Puede reasignar leads dentro de su mesa. |
| **Alertas SOS** | Recibe las alertas de sus agentes cuando necesitan apoyo inmediato. Botón de "Escuchar llamada". |
| **Marcación** | Monitoreo de cuántas llamadas ha hecho cada agente en el día (minutaje y cantidad). |

### Permisos en Base de Datos
- Lee los perfiles de sus agentes.
- Lee y actualiza los leads asignados a su mesa.
- NO puede ver depósitos, ni leads de otras mesas.

---

## 6. AGENTE — Operador de Ventas (Closer / Frontline)

**Misión:** Es el francotirador de la empresa. Su trabajo exclusivo es estar al teléfono marcando leads, manejar objeciones, cerrar First Time Deposits (FTDs) y retener a los clientes actuales (Upsells). Es el motor de ingresos de todo el broker.

### Permisos en Base de Datos
- Solo lee y actualiza SUS leads asignados (`assigned_to = su UUID`).
- Solo ve SUS depósitos cerrados (para calcular sus comisiones).
- NO puede ver leads de otros agentes, ni métricas globales de la mesa o el broker.

### Prompt de Sistema (IA) - Protocolo de Actuación
**Prompt: System Persona - AGENT (Frontline Closer)**
**Rol:** Eres "AGENT", un cerrador de ventas financieras de alto rendimiento. Tu único objetivo en la vida es la comisión. El teléfono es tu arma y la pasarela de pago es tu meta.

#### 1. Mentalidad y Objetivo
- **Cazador de FTDs:** Cada no es un paso más cerca del sí. No te desanimas, pasas al siguiente lead en milisegundos.
- **Control de la Conversación:** Tú guías al cliente, no dejas que él domine la llamada. Utilizas escasez, urgencia y empatía táctica.
- **Tono de Comunicación:** Seguro, carismático, persuasivo, conocedor de los mercados financieros y hambriento de éxito.

#### 2. Tus Pilares Operativos (Protocolos)
**A. Rapidez de Marcación:**
- El tiempo entre colgar y marcar al siguiente lead debe ser menor a 15 segundos.
**B. Escalación Rápida:**
- Si un cliente tiene objeciones legales extremas o riesgo de perderse en el cierre, activas el botón SOS para que tu Floor Manager haga el *Take-Over*.
**C. Seguimiento Religioso:**
- Si agendas un "Callback" a las 4:00 PM, a las 4:00 PM exactas estás llamando.

#### 3. Formato de Respuesta Sugerido
- **Resultado del Lead:** [FTD Cerrado / No Interesado / Callback / SOS]
- **Monto / Objeción:** [Ej. FTD de $250. / Objeción: Falta de liquidez]

### Las 10 Tareas Operativas (El Panel del Agente)
1. **Auto-Dialer (Marcación de Fuego):** Interfaz principal para llamar leads uno tras otro sin tocar el teclado, con un cronómetro de duración de llamada.
2. **Panel de Cierre (FTDs & Upsells):** Visualización de "Mis Ventas" y el progreso personal hacia la meta diaria y las comisiones ganadas.
3. **Gestión de Agenda (Callbacks):** Calendario y notificaciones para no perder las llamadas agendadas con clientes interesados.
4. **Scripting Dinámico:** Teleprompter lateral que cambia los guiones sugeridos dependiendo de la objeción que el agente seleccione en pantalla.
5. **Botón SOS (Panic Button):** Botón rojo para pedir intervención inmediata (Barge-in/Take-Over) del Floor Manager cuando el cierre está en peligro.
6. **Enlace de Pago Rápido:** Generador de links mágicos (Stripe/Binance Pay) para enviar al cliente por SMS/WhatsApp mientras está en la llamada.
7. **Ranking Personal:** Posición del agente en el Leaderboard de su mesa para fomentar la motivación y gamificación.
8. **CRM (Historial y Notas):** Campo de texto rápido para registrar por qué el cliente no compró o qué le interesa.
9. **Material de Apoyo (Legal & KYC):** Envío a un clic de PDFs regulatorios o links de validación de identidad al correo del cliente.
10. **Control de Estado Laboral:** Botones para solicitar permiso de baño, almuerzo o marcarse como "Disponible" / "En Capacitación".

---

## 7. CLIENT (Inversor) — Usuario Final

**Misión:** Es el cliente de la plataforma de trading. Deposita fondos, opera en los mercados financieros y gestiona su portafolio.

### ¿Qué ve en su dashboard?
| Módulo | Función |
|---|---|
| **Resumen de Cuenta** | Balance total, equidad (equity), margen utilizado y margen libre. |
| **Terminal de Trading** | Gráfico de velas (CandlestickChart) con precios en tiempo real via WebSocket. Panel para abrir/cerrar posiciones de compra y venta. |
| **Billetera Web3** | Conexión con Coinbase Wallet para depósitos y retiros en criptomonedas. Faucet para testnet. |
| **InvesPro Legal** | Acceso a los 4 pilares legales: Términos y Condiciones, Marco Regulatorio, KYC/AML y Protección de Datos. |

### Permisos en Base de Datos
- Solo lee SU propio perfil.
- Solo ve SUS posiciones de trading abiertas y cerradas.
- Solo ve SUS depósitos.
- NO tiene acceso a ningún módulo del CRM, leads, ni datos de empleados.

---

## Tabla Comparativa de Acceso

| Recurso | Client | Agent | TL | Floor | Manager | Chief | Head |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| Su propio perfil | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Terminal de Trading | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Billetera Web3 | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Sus leads asignados | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Leads de su mesa | ❌ | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Todos los leads | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |
| Sus depósitos cerrados | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Todos los depósitos | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| Aprobar depósitos | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| Ver todos los perfiles | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Cambiar roles | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Configuración global | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |

---

> **Documento generado:** Mayo 2026  
> **Plataforma:** InvesPro Institucional v1.0  
> **Arquitectura:** 7 niveles RBAC con Supabase RLS
