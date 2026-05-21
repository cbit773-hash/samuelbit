# 14. Arquitectura y Definición del Rol: AGENT (Closer / Operador de Ventas)

## 1. Visión General del Rol

El **AGENT** (Agente de Ventas, Operador o "Closer") es el engranaje fundamental del broker. Todo el sistema, la inversión en marketing, la infraestructura tecnológica y el trabajo de la cúpula directiva convergen en un solo punto: **la llamada telefónica del agente**.

Su misión no es estratégica ni analítica; es puramente táctica y psicológica. El Agente debe contactar a los leads, generar confianza inmediata, rebatir objeciones de riesgo y cerrar el *First Time Deposit* (FTD) para que el cliente ingrese formalmente al ecosistema. También es responsable de realizar llamadas de *retención* (Upsells) a clientes que ya depositaron para invitarlos a aumentar su capital.

---

## 2. Prompt del Sistema (IA Persona)

Para interactuar o programar agentes que asuman este rol (ej. Voice AI Closers) o asistan en él, se debe utilizar el siguiente **Protocolo de Actuación**:

> **Prompt: System Persona - AGENT (Frontline Closer)**
> **Rol:** Eres "AGENT", un cerrador de ventas financieras de alto rendimiento. Tu único objetivo es generar depósitos (FTDs). El teléfono es tu arma y la pasarela de pago es tu línea de meta.
>
> **1. Mentalidad y Objetivo**
> - **Cazador de FTDs:** Un "No" es solo estadística. Tu tolerancia a la frustración es infinita. Si te cuelgan, marcas al siguiente en menos de 5 segundos.
> - **Control Absoluto:** El cliente no dirige la llamada, tú lo haces. Utilizas el sistema "Straight Line Persuasion": tono firme, empatía táctica, y direccionamiento constante hacia la activación de la cuenta.
> - **Tono de Comunicación:** Carismático, urgente, resolutivo. Eres el experto financiero que le hará ganar dinero al cliente, pero no tienes tiempo que perder con personas indecisas.
>
> **2. Pilares Operativos**
> - **Follow-up Implacable:** Si el cliente dice "llámame mañana a las 4", a las 3:59 ya tienes el dedo en el botón de marcar.
> - **Uso del SOS:** Eres orgulloso pero inteligente. Si sientes que la venta de un cliente con alto poder adquisitivo se te escapa de las manos por falta de experiencia técnica (ej. te pregunta cosas complejas de blockchain), presionas el Botón SOS para que tu Floor Manager tome la llamada (Take-Over) y cierre el trato.

---

## 3. Las 10 Tareas Operativas (El Arsenal de Ventas)

El frontend de la plataforma (AgentDashboard) dota al Agente de 10 herramientas diseñadas exclusivamente para optimizar su tiempo en llamada y aumentar su Conversion Rate (CR%):

### 1. Auto-Dialer (Marcación de Fuego)
El corazón del piso. Una interfaz de marcación predictiva o automática. El agente no busca a quién llamar; el sistema le pone el lead en pantalla, lanza la llamada y empieza el cronómetro de inmediato.

### 2. Panel de Cierre (FTDs & Comisiones)
El termómetro personal. Muestra cuántos depósitos ha logrado en el mes, el volumen total de dinero recaudado y, lo más importante, el cálculo en tiempo real de su **comisión proyectada**. 

### 3. Gestión de Agenda (Callbacks)
Calendario simplificado. Muestra únicamente a los prospectos que prometieron depositar más tarde. Lanza alertas sonoras cuando es el momento exacto de llamar a un lead "caliente".

### 4. Scripting Dinámico (Teleprompter)
Guiones de ventas adaptativos en pantalla. Si el cliente dice "No tengo liquidez", el agente hace clic en esa objeción, y el prompter le muestra exactamente las palabras precisas para rebatirla basándose en la psicología de ventas del broker.

### 5. Botón SOS (Ayuda en Vivo)
El botón de pánico (rojo brillante). Cuando un cliente VIP (high-ticket) está perdiendo el interés, el agente lo pulsa. El Floor Manager recibe la alerta y se conecta de inmediato al audio para salvar la venta (Barge-in / Take-Over).

### 6. Cobro Rápido (Payment Links)
Herramienta para generar *magic links* de Stripe o direcciones crypto (Binance Pay) en 1 clic. El agente se lo envía al WhatsApp o SMS del cliente y lo guía para que ponga su tarjeta mientras siguen en la llamada.

### 7. Leaderboard (Ranking Personal)
Gamificación pura. Muestra en qué posición de la mesa está el agente. Fomenta la competitividad (ej. "Estás a 2 FTDs de ganarle a Pedro y llevarte el bono semanal").

### 8. CRM Notas (Historial Rápido)
El "After Call Work". Interfaz veloz para seleccionar un estado (Call back, Trash, FTD) y dejar una nota rápida en el expediente del cliente antes de que el Dialer lance la siguiente llamada.

### 9. Material Legal & KYC
Envío exprés de documentos. Si el cliente pide pruebas de que el broker es legal, el agente presiona un botón que envía instantáneamente los PDFs de Regulación, Términos y Condiciones, y el enlace de Verificación de Identidad (KYC).

### 10. Control de Estado Laboral
Gestor de presencia (Ready, In Call, Break, Restroom). Impide que el Auto-Dialer le mande llamadas si tiene una pausa autorizada por el Floor Manager.

---

## 4. Políticas de Acceso en Base de Datos (Supabase RLS)

El Agente es el rol **más restringido** en cuanto a visibilidad horizontal. Vive en una "burbuja" para evitar distracciones y robo de leads.

| Tabla | Permisos RLS (Role = 'agent') |
|---|---|
| `profiles` (Usuarios) | **Read:** Solo ve su propio perfil. **Update:** Solo puede actualizar su estado de presencia (`status`). |
| `leads` | **Read/Update:** ÚNICA Y EXCLUSIVAMENTE los leads donde `assigned_to = auth.uid()`. No puede ver el pool global ni los leads de sus compañeros. |
| `deposits` | **Read:** Solo los depósitos que él mismo cerró (`agent_id = auth.uid()`). Sirve para su panel de comisiones. |
| `withdrawals` | **Read:** Bloqueado totalmente (evita desmoralización si un cliente retira fondos). |
| `system_settings` | **Read:** Bloqueado totalmente. |

---

## 5. El Flujo de Trabajo (The Loop)

1. **Log-In:** El agente se marca como *Ready*.
2. **Dialer:** El sistema lanza llamada -> L-890.
3. **PItch:** Aplica el Scripting Dinámico.
4. **Resistencia:** El cliente duda -> Activa Botón SOS.
5. **Cierre:** Genera el Link de Cobro Rápido.
6. **Cobro:** El cliente paga (FTD).
7. **CRM:** Guarda la nota.
8. **Loop:** El Dialer lanza el siguiente lead automáticamente en <15s.
