# 17. Arquitectura y Definición del Rol: CLIENT (Inversor Final)

## 1. Visión General del Rol

El **CLIENT** (Inversor / Usuario Final) es la razón de existir de todo el ecosistema. Es la persona que deposita dinero real en la plataforma para operar en los mercados financieros (Forex, Crypto, Acciones, Commodities). Todo el aparato de ventas, retención y auditoría existe para servirle y, al mismo tiempo, generar volumen de trading que produzca comisiones para el broker.

El dashboard del cliente debe transmitir **confianza institucional**, **transparencia** y **facilidad de uso**. No debe verse como un panel interno de operaciones, sino como la interfaz de un banco digital premium.

---

## 2. Las 10 Secciones del Panel del Inversor

1. **Resumen de Cuenta:** Balance total, equidad flotante, margen libre y PnL diario. La primera impresión de solidez financiera.
2. **Portafolio (Posiciones Abiertas):** Lista de todos los trades activos con su instrumento, tipo (BUY/SELL), volumen, precio de apertura, precio actual y PnL en tiempo real.
3. **Depositar Fondos:** Formularios de depósito por tarjeta de crédito (Stripe) y criptomonedas (USDT, BTC, ETH). Links y QR codes integrados.
4. **Solicitar Retiro:** Formulario de retiro con selección de método (transferencia bancaria, crypto). Incluye restricción de que solo se puede retirar el "margen libre".
5. **Historial de Movimientos:** Log completo de depósitos y retiros con sus estados (Aprobado, Pendiente, Rechazado).
6. **Rendimiento:** Gráfica visual del rendimiento de la cuenta a lo largo del tiempo (mensual, anual, YTD).
7. **Billetera Web3:** Vista de activos cripto segregados (USDT, BTC, ETH) con sus equivalentes en USD.
8. **Notificaciones:** Avisos del broker: depósitos aprobados, alertas de posiciones, mensajes del asesor.
9. **Seguridad:** Estado de verificación KYC y configuración de autenticación 2FA.
10. **Soporte:** Chat directo con su asesor asignado.

---

## 3. Políticas de Acceso (Supabase RLS)

El Cliente es un **usuario aislado**. Solo puede ver su propia información.

| Tabla | Permisos |
|---|---|
| `profiles` | Lee y actualiza SOLO su propio perfil (`id = auth.uid()`). |
| `deposits` | Lee SOLO sus depósitos (`client_id = auth.uid()`). Puede INSERT (solicitar depósito). |
| `withdrawals` | Lee SOLO sus retiros. Puede INSERT (solicitar retiro). |
| `trading_positions` | Lee SOLO sus posiciones (`user_id = auth.uid()`). |
| `leads` | Bloqueado totalmente (no es un concepto que el cliente deba conocer). |
| `system_settings` | Bloqueado totalmente. |

---

## 4. Principios de Diseño UX

1. **Confianza Visual:** Uso de colores institucionales (azul profundo, blanco, verde para ganancias). Nada de colores agresivos o "gamer".
2. **Transparencia:** El cliente siempre debe poder ver su balance real, sus posiciones y su historial completo.
3. **Facilidad de Depósito:** El botón de "Depositar" debe ser visible y accesible desde cualquier sección.
4. **Retiro Claro:** El proceso de retiro debe ser transparente pero pasar por un flujo de aprobación interno (el Advisor puede intervenir antes de que se procese).
