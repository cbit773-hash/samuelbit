# 15. Arquitectura y Definición del Rol: TEAM LEADER (Líder de Mesa)

## 1. Visión General del Rol

El **TEAM LEADER** es el supervisor directo de una mesa de 4 a 6 agentes. A diferencia del Floor Manager (que controla 2-3 mesas y tiene una visión más macro), el Team Leader vive **dentro** de la mesa. Conoce a cada agente por nombre, sabe quién vende mejor los lunes, quién flaquea después de las 3 PM y quién necesita coaching en objeciones de riesgo.

Su misión es doble: **maximizar el rendimiento colectivo de su mesa** y **ser el primer escalón de apoyo** cuando un agente tiene problemas con un cierre difícil.

---

## 2. Prompt del Sistema (IA Persona)

> **Prompt: System Persona - TEAM LEADER (Sargento de Mesa)**
> **Rol:** Eres "TEAM LEADER", el sargento táctico de una mesa de ventas. Tu equipo son tus soldados y cada lead perdido es una batalla que te duele personalmente.
>
> **Mentalidad:** Proteccionista con tu equipo pero implacable con la mediocridad. Si un agente no puede cerrar, lo entrenas. Si después de entrenar sigue sin cerrar, lo reportas para PIP.
>
> **Tono:** Cercano, motivador pero directo. Eres el "hermano mayor" de la mesa.

---

## 3. Las 10 Tareas Operativas

1. **Estado de Mesa:** Monitoreo en vivo de los 6 agentes (quién está en llamada, disponible o en break).
2. **Leads de Mesa:** Reasignación interna de leads entre agentes de su mesa exclusivamente.
3. **Escucha de Llamadas:** Barge-in / Whisper para coaching en vivo durante llamadas activas.
4. **Alertas SOS:** Recibe los "Panic Buttons" de sus agentes y les brinda apoyo inmediato.
5. **Minutaje:** Control de cuántas llamadas y minutos ha realizado cada agente en el día.
6. **KPIs de Mesa:** Dashboard consolidado de FTDs, CR%, volumen y leads quemados de su mesa.
7. **Control de Asistencia:** Registro de check-in/check-out y tiempos de break de cada agente.
8. **Coaching Rápido:** Envío de notas de corrección post-llamada al terminal del agente.
9. **Ranking de Mesa:** Leaderboard interno que muestra el top performer de la mesa.
10. **Reporte Diario:** Generación del cierre de turno que se envía al Floor Manager.

---

## 4. Políticas de Acceso (Supabase RLS)

| Tabla | Permisos |
|---|---|
| `profiles` | Lee solo los agentes de **su** mesa. |
| `leads` | Lee y reasigna leads asignados a **su** mesa. No ve otras mesas. |
| `deposits` | Lee depósitos de **sus** agentes (para KPIs). |
| `withdrawals` | Bloqueado. |
| `system_settings` | Bloqueado. |

---

## 5. Diferencia con Floor Manager

| Aspecto | Team Leader | Floor Manager |
|---|---|---|
| **Alcance** | 1 mesa (4-6 agentes) | 2-3 mesas (20-30 agentes) |
| **Foco** | Coaching individual | Gestión táctica macro |
| **Take-Over** | Puede escuchar y whisper | Puede hacer Take-Over completo |
| **Reporta a** | Floor Manager | Manager |
