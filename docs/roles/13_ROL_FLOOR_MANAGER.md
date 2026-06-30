# 13. Arquitectura y Definición del Rol: FLOOR MANAGER (Jefe de Piso / Trinchera)

## 1. Visión General del Rol

El **FLOOR MANAGER** es el comandante de ejecución en tiempo real. A diferencia del Manager (que observa todo el piso y proyecta métricas globales a futuro), el Floor Manager vive en el presente. Está a cargo de 2 o 3 mesas (aproximadamente 20 a 30 agentes). 

Su misión es simple y cruda: **hacer que sus agentes logren el depósito mínimo del día, hoy**. Es un líder *hands-on*, lo que significa que pasa la mayor parte del tiempo escuchando llamadas y resolviendo objeciones directamente con el cliente cuando un agente se bloquea.

---

## 2. Prompt del Sistema (IA Persona)

Para interactuar o programar agentes que asuman este rol o asistan en él, se debe utilizar el siguiente **Protocolo de Actuación**:

> **Prompt: System Persona - FLOOR MANAGER (Comandante de Trinchera)**
> **Rol:** Eres "FLOOR MANAGER", el jefe directo de ventas en el piso. No diseñas la estrategia a largo plazo, tú aseguras que el guión se ejecute perfectamente en la llamada actual. Si el teléfono no suena, tu equipo no come.
>
> **1. Mentalidad y Objetivo**
> - **Sentido de Urgencia Extremo:** El mes se gana día a día, minuto a minuto. Tu unidad de medida es la "hora productiva". Un agente inactivo es dinero perdido.
> - **Liderazgo de Contacto (Hands-On):** No diriges desde un escritorio, caminas el piso (virtual o físico). Si un novato está perdiendo una venta clave, no lo regañas después; le quitas el auricular y cierras tú el trato en ese mismo instante (*Take-Over*).
> - **Tono de Comunicación:** Enérgico, directo, acelerado, resolutivo y altamente empático pero firme con el cliente. Sin burocracia.
>
> **2. Pilares Operativos (Protocolos)**
> - **Presión Constante (Pushing):** Monitoreas el estado en vivo de cada auricular. Si alguien lleva 10 minutos en rojo (inactivo), intervienes.
> - **Rescate de Cierres (SOS):** Eres el "Closer" final. Atiendes las Alertas SOS de manera inmediata cuando el cliente está dudando en la pasarela de pago.
> - **Reciclaje Táctico:** Si un lead es dado por perdido ("Trash") por un novato, se lo asignas a tu mejor Closer. El lead no muere hasta que tú digas que no sirve.

---

## 3. Las 10 Tareas Operativas (El Panel de Trinchera)

El frontend de la plataforma dota al FLOOR MANAGER de 10 herramientas diseñadas para la microgestión y la intervención en vivo:

### 1. Termómetro Diario (Pacing de Piso)
Visualización masiva de las metas de FTDs y Volumen de Retención *exclusivas de sus mesas* para el día actual. Marca el pulso de urgencia.

### 2. Monitor In-Live (Mapa de Piso)
Panel de semáforos en tiempo real: muestra qué agente está en llamada (con cronómetro en vivo), quién está disponible, y quién está en descanso/inactivo.

### 3. Escucha Silenciosa (Barge-in / Whisper)
Permite al Floor Manager conectarse al canal de audio de un agente. Puede escuchar sin ser oído, o usar la función *Whisper* para hablarle al oído al agente sin que el cliente se entere (Coaching táctico).

### 4. Alertas SOS (Panic Button)
Un centro de notificaciones urgentes. Cuando un agente presiona el botón de pánico porque un cliente VIP está a punto de colgar, el Floor Manager recibe una alerta con contexto instantáneo para intervenir (Take-Over).

### 5. Reasignación Táctica (Drag & Drop)
Interfaz para mover rápidamente leads de la cola de un agente saturado a uno que está libre. Balanceo de cargas de trabajo manual e instantáneo.

### 6. Pool de Reciclaje (Trash to Cash)
Lista de leads que los agentes novatos han marcado como "No interesados". El Floor Manager los filtra y los reasigna a vendedores veteranos (Closers) para un segundo impacto.

### 7. Control de Presencia Local
Gestión de permisos temporales: autoriza o deniega pausas activas, idas al baño o descansos para asegurar que sus mesas nunca queden sin cobertura telefónica.

### 8. Micro-Feedback (1-on-1)
Herramienta para enviar notas correctivas rápidas al terminal del agente inmediatamente después de una llamada ("Te faltó mencionar la garantía de capital en el minuto 3").

### 9. Empuje de Retención (Upsell Push)
Alerta al Floor Manager cada vez que un cliente de su mesa realiza un FTD. Esto detona una orden inmediata para volver a llamar al cliente (aprovechando el pico de dopamina) y pedir un depósito mayor (Upsell).

### 10. Reporte de Turno (Shift Handover)
Al terminar el día, genera un resumen de "Ganancias y Pérdidas" (FTDs logrados, llamadas hechas, objeciones invencibles) que se envía automáticamente al Director (Manager).

---

## 4. Políticas de Acceso en Base de Datos (Supabase RLS)

El FLOOR MANAGER tiene una vista **horizontal y segmentada**. Solo ve lo que ocurre en su perímetro.

| Tabla | Permisos RLS (Role = 'floor_manager') |
|---|---|
| `profiles` (Usuarios) | **Read:** Solo agentes y Team Leaders de *sus propias mesas*. **Update:** Estado laboral (Forzar 'Disponible'). |
| `leads` | **Read/Update:** Solo los leads asignados a sus mesas. Puede cambiar su estado o reasignarlos internamente. |
| `deposits` | **Read:** Solo depósitos procesados por agentes de sus mesas. |
| `withdrawals` | **Read:** Solo para estar al tanto si un cliente de sus mesas intenta retirar. |
| `system_settings` | **Read:** Bloqueado/Restringido. |
| `trading_positions` | **Read:** De los clientes de su mesa para apoyar en llamadas de ventas y retención. |

---

## 5. El Concepto de "Take-Over" y "Whisper"

El valor técnico fundamental de este dashboard es la integración de telefonía (VoIP):
- **Barge-In / Whisper:** El Floor Manager se convierte en una voz en la cabeza del agente.
- **Take-Over:** El Floor Manager toma control absoluto del canal de voz. El agente queda muteado, y el Floor Manager habla directamente con el cliente asumiendo un rol de "Director Senior" para forzar el cierre de la venta.
