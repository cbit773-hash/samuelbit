# 16. Arquitectura y Definición del Rol: ADVISOR (Retención & Gestión de Carteras)

## 1. Visión General del Rol

El **ADVISOR** (Asesor de Retención) es el especialista en relaciones a largo plazo. Mientras el Agente caza FTDs (primeros depósitos), el Advisor se dedica a cultivar a los clientes que ya depositaron para que depositen **más y más frecuentemente**. Su valor no se mide en cantidad de llamadas, sino en el **AUM** (Assets Under Management / Activos Bajo Gestión) que logra retener y hacer crecer.

El Advisor es también la primera línea de defensa contra el **Churn** (abandono). Cuando un cliente quiere retirar todo su dinero, el Advisor lo contacta para intentar convencerlo de quedarse.

---

## 2. Prompt del Sistema (IA Persona)

> **Prompt: System Persona - ADVISOR (Wealth Guardian)**
> **Rol:** Eres "ADVISOR", el guardián de la cartera. Tu voz es la que el cliente escucha cuando tiene miedo de perder dinero. Tu trabajo no es vender un producto nuevo, sino **proteger la relación y expandir la confianza**. Eres un consejero financiero que llama en los momentos clave.
>
> **Mentalidad:** Empático pero estratégico. Sabes cuándo llamar (cuando el PnL está en verde) y cuándo consolar (cuando el PnL está en rojo).
>
> **Regla de Oro:** Nunca dejes que un cliente retire sin haber tenido al menos una "Llamada de Retención" contigo.

---

## 3. Las 10 Tareas Operativas

1. **Cartera Activa:** Vista consolidada de todos los clientes con su equidad, PnL y fecha de último depósito.
2. **Upsell Pipeline:** Lista de clientes con alta probabilidad de depositar más (basado en su PnL positivo o actividad reciente).
3. **Rescate Anti-Churn:** Alertas de clientes que solicitaron retiros o llevan semanas inactivos.
4. **Llamada de Retención:** Interfaz de marcación con script de retención integrado y datos del cliente en pantalla.
5. **Monitor PnL:** Vista en tiempo real de las ganancias/pérdidas de todos los clientes de su cartera.
6. **Alertas de Margen:** Notificaciones de clientes cuyo nivel de margen está peligrosamente bajo (Margin Call inminente).
7. **Programa VIP:** Gestión de beneficios premium (Silver, Gold, Diamond) para incentivar depósitos más grandes.
8. **KPIs de Retención:** Métricas clave: tasa de retención a 90 días, volumen de upsells, ticket promedio, churn rate.
9. **CRM Notas:** Historial de interacciones con cada cliente (llamadas, promesas, preocupaciones).
10. **Compliance:** Verificación del estado KYC de sus clientes y reenvío de documentación legal.

---

## 4. Políticas de Acceso (Supabase RLS)

| Tabla | Permisos |
|---|---|
| `profiles` (Clientes) | Lee solo los clientes asignados a su cartera. |
| `leads` | No aplica (los Advisors no trabajan con leads fríos). |
| `deposits` | Lee los depósitos de **sus** clientes. |
| `withdrawals` | Lee las solicitudes de retiro de **sus** clientes (para intervenir). |
| `trading_positions` | Lee las posiciones abiertas de **sus** clientes (para hablar con conocimiento de causa). |
| `system_settings` | Bloqueado. |

---

## 5. El Momento Clave: "Efecto Dopamina"

La estrategia más poderosa del Advisor es llamar al cliente **cuando va ganando**. Si el PnL muestra +$1,200, el cliente se siente inteligente y poderoso. Ese es el momento exacto para decirle: "Carlos, tu portafolio está haciendo historia. Imagina si tuvieras el doble de capital operando."
