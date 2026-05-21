# 10 — Costos Operativos Técnicos: InvestPRO

> Análisis detallado de la infraestructura, servicios y costos mensuales para operar la plataforma InvestPRO en producción.
> **Moneda:** Pesos Colombianos (COP). Tasa de referencia: **1 USD = $3.700 COP**.

---

## 1. Resumen Ejecutivo

| Concepto | Costo Mensual (COP) |
|:---|---:|
| Infraestructura (Hosting + Base de Datos) | $0 – $1.295.100 |
| Servicios de terceros (APIs de datos) | $0 – $925.000 |
| Comunicaciones (Dialer VoIP + Email) | $0 – $1.147.700 |
| Dominio + Email corporativo | $7.400 – $133.200 |
| Herramientas de desarrollo | $0 – $148.000 |
| Talento Humano (2 Devs Junior) | $3.600.000 – $5.000.000 |
| **Total Demo/MVP** | **$11.100/mes** |
| **Total Producción Inicial (sin devs)** | **~$688.400/mes** |
| **Total Producción Inicial (con devs)** | **~$5.288.400/mes** |
| **Total Producción Escalada (con devs)** | **~$8.441.600/mes** |

---

## 2. Infraestructura Core

### 2.1 Supabase — Base de Datos + Autenticación + API

**¿Qué es?** Supabase es el "cerebro" de InvestPRO. Provee la base de datos PostgreSQL donde se guardan todos los datos (usuarios, leads, depósitos, logs), el sistema de autenticación (login/registro), almacenamiento de archivos y las APIs que conectan el frontend con los datos.

**¿Por qué se necesita?** Sin Supabase no hay datos. Cada vez que un agente ve un lead, un HEAD aprueba un depósito, o un cliente inicia sesión, la petición va a Supabase.

| Plan | Precio/mes (USD) | Precio/mes (COP) | ¿Qué incluye? | ¿Para quién? |
|:---|---:|---:|:---|:---|
| **Free** | $0 | $0 | 500MB de base de datos, 1GB de archivos, 50.000 usuarios registrados, 500.000 llamadas a funciones | Desarrollo, demos y pruebas internas |
| **Pro** | $25 | $92.500 | 8GB de base de datos, 100GB de archivos, 100.000 usuarios, 2 millones de llamadas a funciones, backups diarios | Operación real con hasta 200 clientes |
| **Team** | $599 | $2.216.300 | 16GB de base de datos, 200GB de archivos, soporte prioritario, certificación SOC2 para cumplimiento regulatorio | Operación regulada con más de 200 clientes |

**¿Qué pasa si superas los límites del plan Pro?**

| Recurso | Incluido en Pro | Costo por excedente |
|:---|:---|:---|
| Base de datos | 8GB | $462/GB adicional ($0.125 USD) |
| Almacenamiento de archivos | 100GB | $78/GB adicional ($0.021 USD) |
| Transferencia de datos (bandwidth) | 250GB | $333/GB adicional ($0.09 USD) |
| Funciones edge | 2 millones | $7.400 por millón adicional |
| Conexiones en tiempo real (WebSocket) | 500 simultáneas | $37.000 por cada 1.000 adicionales |

**Estimación real para InvestPRO:**
- **Demo (5 personas probando):** $0/mes — el plan Free es más que suficiente
- **50 clientes + 20 empleados:** $92.500/mes (Pro, sin excedentes)
- **500 clientes + 30 empleados:** $92.500 + ~$111.000 excedentes = **$203.500/mes**

---

### 2.2 Hosting del Frontend — Donde vive la página web

**¿Qué es?** El hosting es el servidor que sirve la aplicación web (lo que el usuario ve en el navegador). Como InvestPRO es una SPA (Single Page Application) construida con React + Vite, se despliega como archivos estáticos — no necesita un servidor potente.

**¿Por qué se necesita?** Sin hosting, nadie puede acceder a `investpro.com`. El hosting entrega los archivos HTML/CSS/JS al navegador del usuario.

| Proveedor | Plan | Precio/mes (COP) | ¿Qué incluye? |
|:---|:---|---:|:---|
| **Cloudflare Pages** | Free | $0 | Bandwidth ILIMITADO, builds ilimitados, CDN global, SSL automático |
| **Vercel** | Hobby | $0 | 100GB bandwidth, ideal para proyectos personales |
| **Vercel** | Pro | $74.000 | 1TB bandwidth, analytics, protección DDoS avanzada |
| **Netlify** | Free | $0 | 100GB bandwidth, 300 minutos de build/mes |

**Recomendación:** **Cloudflare Pages (GRATIS)** — ofrece bandwidth ilimitado y CDN global sin costo. Solo necesitas Vercel Pro ($74.000) si requieres analytics avanzados.

**Estimación:**
- **Demo y producción inicial:** $0/mes (Cloudflare Pages)
- **Producción con analytics:** $74.000/mes (Vercel Pro)

---

### 2.3 CDN — Red de Distribución de Contenido

**¿Qué es?** Un CDN (Content Delivery Network) copia tu sitio web en servidores alrededor del mundo para que cargue rápido sin importar desde dónde se acceda (Colombia, México, Chile, etc.).

**¿Por qué se necesita?** Si el servidor está en USA y un cliente accede desde Argentina, sin CDN la página tarda 2–3 segundos. Con CDN, tarda menos de 0.5 segundos porque se sirve desde un servidor cercano.

| Proveedor | Precio/mes (COP) | ¿Qué incluye? |
|:---|---:|:---|
| **Cloudflare Free** | $0 | CDN global, DNS rápido, protección DDoS básica, SSL |
| **Cloudflare Pro** | $74.000 | Todo lo anterior + WAF (firewall de aplicación), optimización de imágenes |

**Recomendación:** Cloudflare Free es suficiente hasta 10.000 usuarios diarios.

---

## 3. Datos de Mercado en Tiempo Real

**¿Qué es?** Las APIs de datos de mercado proporcionan los precios de criptomonedas y divisas (Forex) que se muestran en los gráficos de trading, el ticker de precios y la página de mercados.

**¿Por qué se necesita?** Sin esto, los gráficos de velas y los precios en tiempo real no funcionan. Es lo que hace que la plataforma se vea "viva".

| Proveedor | Precio/mes (COP) | Datos que ofrece | Uso en InvestPRO |
|:---|---:|:---|:---|
| **Binance WebSocket** | $0 | Crypto: precios en vivo, velas, volumen | TickerTape (barra de precios), gráfico de velas |
| **CoinGecko Free** | $0 | Crypto: 30 calls/min, datos históricos | Página de Mercados, info de monedas |
| **CoinGecko Analyst** | $51.800 | Crypto: 500 calls/min, datos premium | Si necesitas más velocidad |
| **CoinGecko Pro** | $477.300 | Crypto: ilimitado, datos institucionales | Operación de alto volumen |
| **Twelve Data** | $0 – $292.300 | Forex + Stocks + Crypto | Si expandes a Forex (EUR/USD, GBP/USD) |

**Estimación:**
- **Solo Crypto:** $0/mes (Binance WS + CoinGecko Free dan todo lo necesario)
- **Crypto + Forex:** $181.300 – $292.300/mes (Twelve Data)

---

## 4. Comunicaciones — Dialer VoIP, SMS y Email

### 4.1 Dialer VoIP (Twilio) — Llamadas telefónicas de los agentes

**¿Qué es?** Twilio es el servicio que permite a los agentes hacer y recibir llamadas telefónicas directamente desde la plataforma web, sin necesidad de teléfonos físicos.

**¿Por qué se necesita?** Los agentes contactan leads por teléfono. Sin un dialer, tendrían que usar celulares personales — sin control, sin grabación, sin métricas.

| Concepto | Precio (COP) |
|:---|---:|
| Número telefónico (por mes) | $3.700/número |
| Llamada saliente (por minuto) | $48/minuto |
| Llamada entrante (por minuto) | $4/minuto |

**Cálculo para un equipo de 10 agentes:**
```
10 agentes × 10 llamadas/día × 5 min/llamada × 22 días hábiles = 11.000 minutos/mes
11.000 min × $48/min = $528.000/mes
+ 10 números telefónicos × $3.700 = $37.000/mes
Total: ~$565.000/mes
```

**Cálculo para 30 agentes:**
```
30 agentes × 10 llamadas/día × 5 min/llamada × 22 días = 33.000 minutos/mes
33.000 min × $48/min = $1.584.000/mes
+ 30 números × $3.700 = $111.000/mes
Total: ~$1.695.000/mes
```

> [!IMPORTANT]
> El dialer VoIP es el **costo variable más alto** de toda la plataforma. Escala directamente con la cantidad de agentes y la duración promedio de las llamadas. Es el primer lugar donde buscar optimización si los costos crecen.

**Alternativas más económicas:**

| Alternativa | Ahorro vs. Twilio | Notas |
|:---|:---|:---|
| **Plivo** | 20–40% más barato | Buena cobertura LATAM |
| **Vonage** | 10–25% más barato | Mejor para alto volumen |
| **VoIP propio (Asterisk/FreePBX)** | Hasta 70% ahorro | Requiere servidor dedicado y mantenimiento |

### 4.2 SMS — Mensajes de texto a clientes

**¿Qué es?** Envío de SMS para notificaciones: confirmación de depósito, alertas de seguridad, códigos 2FA.

| Concepto | Precio (COP) |
|:---|---:|
| SMS a Colombia | $11/mensaje |
| SMS a México | $22/mensaje |
| SMS a Argentina | $30/mensaje |

**Estimación (500 SMS/mes):** $5.500 – $15.000/mes

### 4.3 Email Transaccional — Correos automáticos

**¿Qué es?** Emails que la plataforma envía automáticamente: verificación de cuenta, recuperación de contraseña, notificaciones de depósito, alertas al HEAD.

| Proveedor | Precio/mes (COP) | Límite |
|:---|---:|:---|
| **Resend Free** | $0 | 100 emails/día (3.000/mes) |
| **Resend Pro** | $74.000 | 50.000 emails/mes |
| **SendGrid Free** | $0 | 100 emails/día |

**Estimación:** $0/mes — el plan free de Resend cubre las necesidades hasta 100+ clientes activos.

---

## 5. Dominio y Email Corporativo

### 5.1 Dominio — La dirección web

**¿Qué es?** El dominio es la dirección que los usuarios escriben en el navegador: `investpro.com`. Sin dominio, solo se accede por IP numérica.

| Concepto | Precio/año (COP) | Proveedor |
|:---|---:|:---|
| Dominio `.com` | $44.400 – $55.500 | Namecheap, Cloudflare, Google |
| Dominio `.co` | $111.000 – $148.000 | Más caro por ser Colombia |
| SSL (candado verde) | $0 | Incluido gratis en Cloudflare/Vercel |

**Estimación prorrateada:** $3.700 – $12.300/mes

### 5.2 Email Corporativo — Correos @investpro.com

**¿Qué es?** Cuentas de email con tu dominio personalizado: `head@investpro.com`, `soporte@investpro.com`. Da imagen profesional y credibilidad.

| Proveedor | Precio/usuario/mes (COP) | ¿Qué incluye? |
|:---|---:|:---|
| **Google Workspace** | $26.640 | Gmail + Drive + Meet + 30GB |
| **Zoho Mail** | $3.700 | Email + 5GB almacenamiento |
| **Titan (Namecheap)** | $7.030 | Email + calendario |

**Estimación (5 cuentas corporativas):**
- Google Workspace: 5 × $26.640 = **$133.200/mes**
- Zoho Mail: 5 × $3.700 = **$18.500/mes**

---

## 6. Herramientas de Desarrollo y Monitoreo

| Herramienta | ¿Qué hace? | Precio/mes (COP) |
|:---|:---|---:|
| **GitHub Free** | Almacena el código fuente, control de versiones | $0 |
| **GitHub Team** | Repositorios privados con más funciones para equipos | $14.800/desarrollador |
| **Sentry Free** | Detecta y reporta errores en producción automáticamente | $0 |
| **Sentry Team** | Más eventos, alertas avanzadas | $96.200 |
| **PostHog** | Analytics de producto (qué hacen los usuarios en la app) | $0 (10K eventos/mes) |
| **Uptime Robot** | Te avisa por email/SMS si la plataforma se cae | $0 (50 monitores) |

**Estimación:** $0 – $148.000/mes

---

## 7. Talento Humano — Equipo de Mantenimiento Técnico

> [!IMPORTANT]
> Este es el **costo fijo más significativo** de la operación. Sin desarrolladores dedicados, la plataforma no recibe actualizaciones de seguridad, corrección de bugs ni nuevas funcionalidades.

### 7.1 ¿Por qué se necesitan 2 Desarrolladores Junior?

La plataforma InvestPRO tiene 7 dashboards con más de 70 módulos interactivos, integración con WebSockets, VoIP, pasarelas de pago y una jerarquía RBAC de 7 niveles. Mantener esto requiere:

| Responsabilidad | Frecuencia |
|:---|:---|
| Corrección de bugs reportados por agentes/clientes | Diaria |
| Actualizaciones de seguridad (dependencias npm, Supabase) | Semanal |
| Nuevas funcionalidades solicitadas por el HEAD/Manager | Quincenal |
| Optimización de rendimiento (queries, cache, UI) | Mensual |
| Backup y auditoría de base de datos | Semanal |
| Soporte técnico al equipo operativo | Diaria |

### 7.2 Costos de Contratación (Colombia, 2026)

| Concepto | Dev Junior #1 (COP) | Dev Junior #2 (COP) |
|:---|---:|---:|
| **Salario base mensual** | $1.800.000 | $1.800.000 |
| Prestaciones sociales (~52%) | $936.000 | $936.000 |
| **Costo total empleador/mes** | **$2.736.000** | **$2.736.000** |

> **Total 2 Juniors (contrato laboral):** **$5.472.000/mes**

**Alternativa: Contratación por prestación de servicios (freelance):**

| Modalidad | Dev Junior #1 | Dev Junior #2 | Total |
|:---|---:|---:|---:|
| **Prestación de servicios** | $2.000.000 | $2.000.000 | **$4.000.000/mes** |
| **Medio tiempo (4h/día)** | $1.200.000 | $1.200.000 | **$2.400.000/mes** |

> [!TIP]
> **Recomendación:** Iniciar con 2 juniors por prestación de servicios ($4.000.000/mes total) y migrar a contrato laboral cuando la operación supere los 200 clientes.

### 7.3 Perfil Técnico Requerido

| Habilidad | Nivel |
|:---|:---|
| React + TypeScript | Intermedio |
| Supabase (PostgreSQL, RLS, Auth) | Básico-Intermedio |
| TailwindCSS | Básico |
| Git / GitHub | Básico |
| Resolución de errores (Sentry, logs) | Básico |

---

## 8. Escenarios Detallados

### 🟢 Escenario A: Demo / MVP (1–10 usuarios)

Para desarrollo, pruebas internas y presentaciones a inversionistas.

| Servicio | Detalle | COP/mes |
|:---|:---|---:|
| Supabase | Plan Free | $0 |
| Hosting | Cloudflare Pages (gratis) | $0 |
| Datos de mercado | Binance WS + CoinGecko Free | $0 |
| Dominio | `.com` prorrateado | $3.700 |
| Email | Zoho Mail (2 cuentas) | $7.400 |
| Dialer | No necesario en demo | $0 |
| SSL | Gratis (Cloudflare) | $0 |
| Desarrolladores | No necesario en demo | $0 |
| **TOTAL** | | **$11.100/mes** |

---

### 🟡 Escenario B: Producción Inicial (50 clientes, 10 agentes)

Primera operación real con equipo pequeño.

| Servicio | Detalle | COP/mes |
|:---|:---|---:|
| Supabase | Plan Pro | $92.500 |
| Hosting | Cloudflare Pages | $0 |
| CDN | Cloudflare Free | $0 |
| Datos de mercado | Binance WS + CoinGecko Free | $0 |
| Dialer VoIP | Twilio (10 agentes, ~11K min) | $565.000 |
| SMS | ~300 mensajes | $3.300 |
| Email transaccional | Resend Free | $0 |
| Dominio | `.com` | $3.700 |
| Email corporativo | Zoho Mail (5 cuentas) | $18.500 |
| GitHub | Free | $0 |
| Monitoreo | Sentry Free + Uptime Robot | $0 |
| **Subtotal Infraestructura** | | **$683.000/mes** |
| 2 Devs Junior (Prest. Servicios) | Mantenimiento y soporte | $4.000.000 |
| **TOTAL CON EQUIPO** | | **$4.683.000/mes** |

---

### 🔴 Escenario C: Producción Escalada (500 clientes, 30 agentes)

Operación completa con múltiples mesas, Forex incluido.

| Servicio | Detalle | COP/mes |
|:---|:---|---:|
| Supabase | Pro + excedentes (~$55 USD) | $203.500 |
| Hosting | Vercel Pro (analytics) | $74.000 |
| CDN | Cloudflare Pro (WAF) | $74.000 |
| Datos de mercado | Twelve Data (Forex + Crypto) | $292.300 |
| Dialer VoIP | Twilio (30 agentes, ~33K min) | $1.695.000 |
| SMS | ~1.500 mensajes | $16.500 |
| Email transaccional | Resend Pro | $74.000 |
| Dominio | `.com` | $3.700 |
| Email corporativo | Google Workspace (15 cuentas) | $399.600 |
| GitHub Team | 3 desarrolladores | $44.400 |
| Monitoreo | Sentry Team | $96.200 |
| **Subtotal Infraestructura** | | **$2.973.200/mes** |
| 2 Devs Junior (Contrato laboral) | Mantenimiento, nuevas features | $5.472.000 |
| **TOTAL CON EQUIPO** | | **$8.445.200/mes** |

---

## 9. ¿Qué NO cuesta dinero? (Open Source)

Todo el código de la plataforma está construido con tecnologías gratuitas y de código abierto:

| Tecnología | Función | Costo |
|:---|:---|:---|
| **React** | Framework de interfaz de usuario | $0 para siempre |
| **Vite** | Compilador y servidor de desarrollo | $0 para siempre |
| **TailwindCSS** | Sistema de estilos CSS | $0 para siempre |
| **Zustand** | Manejo de estado (sesiones, datos) | $0 para siempre |
| **React Router** | Navegación entre páginas | $0 para siempre |
| **Lucide React** | Íconos de la interfaz | $0 para siempre |
| **TypeScript** | Lenguaje de programación tipado | $0 para siempre |

---

## 10. Pasarelas de Pago (PSP) — Comisiones por Transacción

Las pasarelas de pago cobran un porcentaje por cada depósito procesado. Este costo normalmente se traslada al cliente o se descuenta de la operación — no es un costo fijo mensual.

| Pasarela | Comisión | Mejor para |
|:---|:---|:---|
| **Stripe** | 2.9% + $1.110 por transacción | Tarjetas internacionales (Visa, MC) |
| **PayRetailers** | 3.5% – 5% | Transferencias locales en LATAM (PSE, SPEI, PIX) |
| **Coinbase Commerce** | 1% | Depósitos en criptomonedas |
| **NOWPayments** | 0.5% | Crypto (más opciones de monedas) |

**Ejemplo:** Si un cliente deposita $1.000.000 COP vía Stripe:
- Comisión: $1.000.000 × 2.9% + $1.110 = **$30.110 COP**

---

## 11. Resumen Comparativo Final (COP/mes)

| Rubro | 🟢 Demo | 🟡 Producción (50 clientes) | 🔴 Escalado (500 clientes) |
|:---|---:|---:|---:|
| Supabase | $0 | $92.500 | $203.500 |
| Hosting + CDN | $0 | $0 | $148.000 |
| Datos de mercado | $0 | $0 | $292.300 |
| Dialer VoIP | $0 | $565.000 | $1.695.000 |
| SMS + Email | $0 | $3.300 | $90.500 |
| Dominio + Email Corp. | $11.100 | $22.200 | $403.300 |
| Dev Tools (GitHub, Sentry) | $0 | $0 | $140.600 |
| **Subtotal Tech** | **$11.100** | **$683.000** | **$2.973.200** |
| 2 Devs Junior | $0 | $4.000.000 | $5.472.000 |
| **GRAN TOTAL** | **$11.100** | **$4.683.000** | **$8.445.200** |

> [!CAUTION]
> **El VoIP y los desarrolladores representan el 97% del costo operativo.** La infraestructura técnica pura (servidores, bases de datos, hosting) es sorprendentemente barata gracias al modelo serverless. La decisión más importante de costos no es tecnológica — es cuántos agentes contratas y cuántos minutos hablan al día.

> [!TIP]
> **Para arrancar en producción real:** Supabase Pro ($92.500) + dominio .com ($44.400/año) + 2 Devs Junior por prestación ($4.000.000) = **~$4.096.200 COP/mes**. Todo lo demás puede empezar en planes gratuitos.
