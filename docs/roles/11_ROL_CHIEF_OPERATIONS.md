# 11. Arquitectura y Definición del Rol: CHIEF (Operaciones & Control)

## 1. Visión General del Rol

El **CHIEF** (Chief Operating Officer / Asistente Senior de Dirección) es el brazo derecho del HEAD (Sovereign Node). Mientras el Head se enfoca en la estrategia global, configuración del negocio y visión macro, el CHIEF es el **auditor implacable de la plataforma**.

Su misión no es conversar ni motivar agentes; su misión es **garantizar la integridad matemática y procedimental** del broker. Es responsable del flujo de caja (entradas y salidas), la correcta distribución de leads, la validación legal (KYC) y el cumplimiento de los tiempos de respuesta (SLA).

---

## 2. Prompt del Sistema (IA Persona)

Para interactuar o programar agentes que asuman este rol o asistan en él, se debe utilizar el siguiente **Protocolo de Actuación**:

> **Prompt: System Persona - CHIEF (Operaciones & Control)**
> **Rol:** Eres "CHIEF", el Asistente de Operaciones Senior y brazo derecho del Head en un Broker Financiero de alto rendimiento. Tu función no es solo observar, sino garantizar que la maquinaria de ventas y finanzas funcione sin un solo error de centavo o de tiempo.
>
> **1. Mentalidad y Objetivo**
> - **Precisión Matemática:** Tu prioridad absoluta es la conciliación. Si un depósito no cuadra o un lead no ha sido llamado, es una falla crítica en el sistema.
> - **Enfoque en Resultados:** No te distraes con promesas. Solo confías en lo que dice el Dashboard: Leads inyectados, Leads contactados, Depósitos aprobados.
> - **Tono de Comunicación:** Profesional, ejecutivo, directo y orientado a métricas. Eres eficiente, no conversacional.
>
> **2. Pilares Operativos (Protocolos)**
> - **Control de Caja:** Cada entrada en la Tabla de Depósitos debe ser verificada 100% contra el procesador de pagos.
> - **Auditoría de Flujo:** Exiges contacto secuencial estricto para los leads. El orden de llegada es sagrado.
> - **Guardián del SLA:** Alertas rojas para leads sin contacto en >24h.
>
> **3. Restricciones de Seguridad**
> - Nunca alteras configuraciones globales del broker. Tu poder reside en la lectura masiva y validación, no en cambiar las reglas del juego.

---

## 3. Las 10 Tareas de Control (El Panel del Chief)

El frontend de la plataforma dota al CHIEF de 10 herramientas críticas específicas que diferencian su labor diaria:

### 1. Validación de Depósitos (Caja)
Audita las transacciones bancarias, depósitos en criptomonedas (USDT, BTC) y tarjetas de crédito. Compara la recepción real del dinero contra lo que reportó el agente (FTD o Retención) para **Aprobar** o **Rechazar** el fondeo.

### 2. Control de Retiros (Withdrawals)
Actúa como barrera de seguridad antes de la salida de capital. Aprueba retiros verificando que el cliente tenga margen libre suficiente, que el origen del retiro concuerde con el método de depósito, y que no haya violado políticas de Anti-Lavado de Dinero (AML).

### 3. Auditoría de SLA de Leads (Alertas >24h)
Vigila a todos los equipos de ventas (Mesas). Detecta leads "fríos" o estancados (que no han sido contactados en más de 24 horas) y fuerza reasignaciones a agentes con mejor rendimiento o los devuelve al pool general.

### 4. Revisión KYC / AML
Validación documental de clientes. Supervisa la revisión de pasaportes, identificaciones (DNI/ID), recibos de servicios públicos y liveness checks para habilitar cuentas reales de trading en cumplimiento con las regulaciones internacionales.

### 5. Inyección de Base (Gestión de Datos)
Importa archivos CSV y conecta APIs (ej. Facebook Ads, Google, afiliados) para ingresar nuevos prospectos al sistema. El Chief decide cómo se distribuye esta inyección equitativamente entre las diferentes mesas.

### 6. Auditoría de Comisiones
Cada viernes/cierre de ciclo, el Chief compila los FTDs y montos de retención generados por la fuerza de ventas. Calcula deducciones, bonos y aprueba la nómina que se enviará al Head para la liberación final de los pagos.

### 7. Reporte de Conciliación (EOD)
Genera el informe *End of Day*. Un reporte cifrado que resume depósitos vs. retiros, disputas, y margen neto operativo del día. Este es el resumen ejecutivo directo para el HEAD.

### 8. Tickets de Escalación
Administra conflictos operativos reportados por los Managers o Floor Managers: problemas con la plataforma de telefonía, disputas sobre "a quién pertenece un lead", o quejas formales de clientes de alto patrimonio (VIP).

### 9. Monitor de APIs (System Status)
Verifica la latencia y el estado operativo de la infraestructura crítica: base de datos (Supabase), pasarelas de pago (Stripe, Binance Pay), proveedores de cotizaciones en tiempo real y servicios de SMS/Mail (Twilio/SendGrid).

### 10. Log de Seguridad
Auditoría técnica preventiva. Vigila inicios de sesión anómalos de empleados, intentos de fuerza bruta, exportaciones masivas no autorizadas de bases de datos por parte de Managers, e IPs sospechosas.

---

## 4. Políticas de Acceso en Base de Datos (Supabase RLS)

A nivel de Base de Datos, el CHIEF opera bajo el principio de **"Lectura Omnipresente, Escritura Condicionada"**.

| Tabla | Permisos RLS (Role = 'chief') |
|---|---|
| `profiles` (Usuarios) | **Read:** Todo (empleados y clientes). **Update:** Bloqueado (solo el Head puede cambiar roles o salarios). |
| `leads` | **Read:** Todo el ecosistema. **Update:** Permite reasignar leads a otros agentes (auditoría SLA). |
| `deposits` | **Read:** Todos. **Update:** Exclusivo a cambiar estados (`status` = Aprobado, Rechazado). |
| `withdrawals` | **Read:** Todos. **Update:** Cambiar estados a Procesado/Rechazado. |
| `system_settings` | **Read:** Todo. **Update:** Totalmente bloqueado. |
| `trading_positions` | **Read:** Solo lectura global para auditoría financiera. **Update:** Bloqueado. |

---

## 5. Diferencia Estructural: HEAD vs. CHIEF

Para evitar redundancias organizacionales:
- El **HEAD** toma decisiones estratégicas (Ej. "Vamos a subir las comisiones al 10%").
- El **CHIEF** ejecuta y valida operaciones (Ej. "Cálculo matemático exacto del 10% para la nómina actual").
- El **HEAD** contrata o despide a un Floor Manager.
- El **CHIEF** detecta en los reportes que un Floor Manager está rindiendo mal y se lo reporta al Head.
- El **HEAD** establece las metas mensuales.
- El **CHIEF** vigila el progreso diario contra esa meta e impone disciplina si se desvían.
