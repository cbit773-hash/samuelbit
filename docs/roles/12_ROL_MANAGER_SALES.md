# 12. Arquitectura y Definición del Rol: MANAGER (Sales & Training)

## 1. Visión General del Rol

El **MANAGER** (Director de Ventas & Capacitación) es el líder táctico del piso de ventas. Su objetivo principal es asegurar la máxima conversión y retención del capital que ingresa a la plataforma. No ejecuta la infraestructura (como el Head) ni audita la legitimidad legal o matemática (como el Chief); su única obsesión es que **las mesas alcancen su cuota**.

Su labor combina el análisis numérico (Pacing, Conversion Rates, Heatmaps) con la gestión humana y técnica (Quality Assurance de llamadas, Capacitación, Gamificación e intervención directa en crisis).

---

## 2. Prompt del Sistema (IA Persona)

Para interactuar o programar agentes que asuman este rol o asistan en él, se debe utilizar el siguiente **Protocolo de Actuación**:

> **Prompt: System Persona - MANAGER (Sales & Training)**
> **Rol:** Eres "MANAGER", el Director de Ventas en un Broker Financiero de Alto Rendimiento. Tu obsesión es el *Conversion Rate* (FTD) y el *Ticket Promedio* (Retención). Si un agente no vende, es tu responsabilidad entrenarlo o reemplazarlo.
>
> **1. Mentalidad y Objetivo**
> - **Cultura de Alto Rendimiento:** No aceptas excusas. Exiges un volumen de llamadas constante y un *pitch* agresivo pero altamente profesional.
> - **Micro y Macro Visión:** Miras el bosque (metas globales semanales/mensuales) y el árbol (la llamada fallida de un agente novato).
> - **Tono de Comunicación:** Motivador, exigente, hiper-analítico, enfocado en tácticas de persuasión y métricas de desempeño. Eres el entrenador del equipo élite.
>
> **2. Pilares Operativos (Protocolos)**
> - **Aseguramiento de Cuotas (Pacing):** Evalúas constantemente el progreso frente a la meta. Si el ritmo decae, exiges planes de choque inmediatos.
> - **Quality Assurance (QA):** Crees en la corrección continua. Escuchas llamadas con objeciones fallidas para reescribir el guión de los agentes.
> - **Capacitación Continua:** Agentes por debajo del estándar (ej. < 2% de conversión) entran a un PIP (Performance Improvement Plan) con una fecha límite estricta.
>
> **3. Restricciones de Seguridad**
> - No manejas dinero ni apruebas depósitos. No creas las reglas del sistema. Tu poder es sobre el recurso humano y sus métricas comerciales.

---

## 3. Las 10 Tareas Operativas (El Panel del Manager)

El frontend de la plataforma dota al MANAGER de 10 herramientas críticas específicas para dominar el piso de ventas:

### 1. Radar de Metas (FTD & Retención)
Monitorea en tiempo real el *Pacing* global. Compara la cantidad de First Time Deposits y el volumen de capital retenido contra la cuota semanal. Detecta si la proyección es alcanzar o fallar la meta.

### 2. Quality Assurance (QA) de Llamadas
Tabla de auditoría donde el Manager puede escuchar grabaciones de las llamadas. Analiza la duración, la objeción principal del cliente y si el agente logró agendar una cita o perdió el prospecto.

### 3. Academy & Training
Gestión de módulos de capacitación interna. El Manager asigna entrenamientos (ej. *Compliance Básico*, *Manejo de Objeciones Nivel 2*) y monitorea qué porcentaje de los agentes lo ha completado.

### 4. Leaderboard (Gamificación)
Ranking en vivo de los *Top Performers*. Destaca a los agentes que traen mayor cantidad de FTDs y volumen, fomentando un ambiente de competencia constructiva en el piso.

### 5. PIPs (Performance Improvement Plans)
Sistema automatizado que marca a agentes con bajo RTO (ej. menos del 2% de conversión en 7 días). El Manager gestiona estos plazos de intervención y, si no mejoran, sugiere formalmente su baja.

### 6. Mapa de Calor de Conversión
Análisis táctico del origen de los leads. Muestra visualmente qué fuentes de tráfico (Meta Ads, Google Search, Native Ads) están convirtiendo mejor y cuáles están quemando presupuesto.

### 7. Control de Presencia (Tiempos Muertos)
Auditoría del estado laboral en vivo. Alertas automáticas para agentes que han excedido su límite de pausa o "descanso", permitiendo al Manager forzar su desconexión o exigir productividad.

### 8. Análisis de Objeciones
Gráficos que mapean por qué se pierden los cierres en la última semana (ej. "Falta de dinero", "Miedo a estafa"). Permite al Manager crear nuevos *scripts* o contramedidas en tiempo real.

### 9. Simulador de Bonos
Calculadora financiera que permite proyectar incentivos. Ej: "Si doy un bono de $50 extra por FTD hoy, y proyectamos 140 ventas, este es el impacto en la nómina". Permite aprobar promos de piso relámpago.

### 10. Rescate de VIPs (Anti-Churn)
Alertas críticas (*SOS*) para cuentas de alto patrimonio (> $10k) que están pidiendo retiro completo por molestia. El Manager puede intervenir la llamada o reasignar la cuenta al agente élite del piso.

---

## 4. Políticas de Acceso en Base de Datos (Supabase RLS)

A nivel de Base de Datos, el MANAGER tiene permisos altamente estadísticos y de gestión, pero **no financieros**.

| Tabla | Permisos RLS (Role = 'manager') |
|---|---|
| `profiles` (Usuarios) | **Read:** Todos los empleados por debajo de él (Floor, TL, Agent). **Update:** Modificar niveles de capacitación o asignar PIPs. |
| `leads` | **Read:** Todo el ecosistema (para análisis). **Update:** Asignar o reasignar masivamente leads entre las mesas. |
| `deposits` / `withdrawals` | **Read:** Lectura para generar reportes y leaderboards. **Update:** Totalmente bloqueado (solo Chief/Head aprueban). |
| `system_settings` | **Read:** Todo. **Update:** Bloqueado. |
| `trading_positions` | **Read:** Para ayudar en rescate VIP. **Update:** Bloqueado. |

---

## 5. Diferencias Estructurales Clave

Para evitar fricción en la cadena de mando:

*   **MANAGER vs. CHIEF:** El Manager asegura que *entre* el dinero convenciendo al cliente. El Chief audita que ese dinero *realmente haya llegado* a la cuenta bancaria sin fraude. El Manager presiona por la velocidad; el Chief por la precisión legal y matemática.
*   **MANAGER vs. FLOOR MANAGER:** El Manager ve el global de las ventas, define los guiones, proyecta metas y despide a los ineficientes. El Floor Manager es el jefe de una o dos mesas específicas, escuchando en vivo a sus agentes, respirándoles en la nuca para que apliquen las tácticas del Manager.
*   **MANAGER vs. HEAD:** El Head decide el presupuesto de marketing y el plan de compensación anual. El Manager exprime ese presupuesto operando los equipos diariamente.
