# 10 — Costos Operativos Técnicos: InvestPRO

> Análisis detallado de la infraestructura, servicios y costos mensuales para operar la plataforma InvestPRO en producción.
> **Moneda:** Pesos Colombianos (COP). Tasa de referencia: **1 USD = $3.700 COP**.

--

## 1. Resumen Ejecutivo

| Concepto | Costo Mensual (COP) |
|:---|---:|
| Infraestructura (Hosting + Base de Datos) | $0 – $1.554.120 |
| Servicios de terceros (APIs de datos) | $0 – $1.110.000 |
| Comunicaciones (Dialer VoIP + Email) | $0 – $1.377.240 |
| Dominio + Email corporativo | $8.880 – $159.840 |
| Herramientas de desarrollo | $0 – $177.600 |
| Talento Humano (2 Devs Junior) | $4.320.000 – $6.000.000 |
| **Total Demo/MVP** | **$13.320/mes** |
| **Total Producción Inicial (sin devs)** | **~$826.080/mes** |
| **Total Producción Inicial (con devs)** | **~$6.346.080/mes** |
| **Total Producción Escalada (con devs)** | **~$10.129.920/mes** |

---

## 2. Infraestructura Core

### 2.1 Supabase — Base de Datos + Autenticación + API

**¿Qué es?** Supabase es el "cerebro" de InvestPRO. Provee la base de datos PostgreSQL donde se guardan todos los datos (usuarios, leads, depósitos, logs), el sistema de autenticación (login/registro), almacenamiento de archivos y las APIs que conectan el frontend con los datos.

**¿Por qué se necesita?** Sin Supabase no hay datos. Cada vez que un agente ve un lead, un HEAD aprueba un depósito, o un cliente inicia sesión, la petición va a Supabase.

| Plan | Precio/mes (USD) | Precio/mes (COP) | ¿Qué incluye? | ¿Para quién? |
|:---|---:|---:|:---|:---|
| **Free** | $0 | $0 | 500MB de base de datos, 1GB de archivos, 50.000 usuarios registrados, 500.000 llamadas a funciones | Desarrollo, demos y pruebas internas |
| **Pro** | $25 | $111.000 | 8GB de base de datos, 100GB de archivos, 100.000 usuarios, 2 millones de llamadas a funciones, backups diarios | Operación real con hasta 200 clientes |
| **Team** | $599 | $2.659.560 | 16GB de base de datos, 200GB de archivos, soporte prioritario, certificación SOC2 para cumplimiento regulatorio | Operación regulada con más de 200 clientes |

**¿Qué pasa si superas los límites del plan Pro?**

| Recurso | Incluido en Pro | Costo por excedente |
|:---|:---|:---|
| Base de datos | 8GB | $554/GB adicional ($0.125 USD) |
| Almacenamiento de archivos | 100GB | $94/GB adicional ($0.021 USD) |
| Transferencia de datos (bandwidth) | 250GB | $400/GB adicional ($0.09 USD) |
| Funciones edge | 2 millones | $8.880 por millón adicional |
| Conexiones en tiempo real (WebSocket) | 500 simultáneas | $44.400 por cada 1.000 adicionales |

**Estimación real para InvestPRO:**
- **Demo (5 personas probando):** $0/mes — el plan Free es más que suficiente
- **50 clientes + 20 empleados:** $111.000/mes (Pro, sin excedentes)
- **500 clientes + 30 empleados:** $111.000 + ~$133.200 excedentes = **$244.200/mes**

---

### 2.2 Hosting del Frontend — Donde vive la página web

**¿Qué es?** El hosting es el servidor que sirve la aplicación web (lo que el usuario ve en el navegador). Como InvestPRO es una SPA (Single Page Application) construida con React + Vite, se despliega como archivos estáticos — no necesita un servidor potente.

**¿Por qué se necesita?** Sin hosting, nadie puede acceder a `investpro.com`. El hosting entrega los archivos HTML/CSS/JS al navegador del usuario.

| Proveedor | Plan | Precio/mes (COP) | ¿Qué incluye? |
|:---|:---|---:|:---|
| **Cloudflare Pages** | Free | $0 | Bandwidth ILIMITADO, builds ilimitados, CDN global, SSL automático |
| **Vercel** | Hobby | $0 | 100GB bandwidth, ideal para proyectos personales |
| **Vercel** | Pro | $88.800 | 1TB bandwidth, analytics, protección DDoS avanzada |
| **Netlify** | Free | $0 | 100GB bandwidth, 300 minutos de build/mes |

**Recomendación:** **Cloudflare Pages (GRATIS)** — ofrece bandwidth ilimitado y CDN global sin costo. Solo necesitas Vercel Pro ($88.800) si requieres analytics avanzados.

**Estimación:**
- **Demo y producción inicial:** $0/mes (Cloudflare Pages)
- **Producción con analytics:** $88.800/mes (Vercel Pro)

---

### 2.3 CDN — Red de Distribución de Contenido

**¿Qué es?** Un CDN (Content Delivery Network) copia tu sitio web en servidores alrededor del mundo para que cargue rápido sin importar desde dónde se acceda (Colombia, México, Chile, etc.).

**¿Por qué se necesita?** Si el servidor está en USA y un cliente accede desde Argentina, sin CDN la página tarda 2–3 segundos. Con CDN, tarda menos de 0.5 segundos porque se sirve desde un servidor cercano.

| Proveedor | Precio/mes (COP) | ¿Qué incluye? |
|:---|---:|:---|
| **Cloudflare Free** | $0 | CDN global, DNS rápido, protección DDoS básica, SSL |
| **Cloudflare Pro** | $88.800 | Todo lo anterior + WAF (firewall de aplicación), optimización de imágenes |

**Recomendación:** Cloudflare Free es suficiente hasta 10.000 usuarios diarios.

---

## 3. Datos de Mercado en Tiempo Real

**¿Qué es?** Las APIs de datos de mercado proporcionan los precios de criptomonedas y divisas (Forex) que se muestran en los gráficos de trading, el ticker de precios y la página de mercados.

**¿Por qué se necesita?** Sin esto, los gráficos de velas y los precios en tiempo real no funcionan. Es lo que hace que la plataforma se vea "viva".

| Proveedor | Precio/mes (COP) | Datos que ofrece | Uso en InvestPRO |
|:---|---:|:---|:---|
| **Binance WebSocket** | $0 | Crypto: precios en vivo, velas, volumen | TickerTape (barra de precios), gráfico de velas |
| **CoinGecko Free** | $0 | Crypto: 30 calls/min, datos históricos | Página de Mercados, info de monedas |
| **CoinGecko Analyst** | $62.160 | Crypto: 500 calls/min, datos premium | Si necesitas más velocidad |
| **CoinGecko Pro** | $572.760 | Crypto: ilimitado, datos institucionales | Operación de alto volumen |
| **Twelve Data** | $0 – $350.760 | Forex + Stocks + Crypto | Si expandes a Forex (EUR/USD, GBP/USD) |

**Estimación:**
- **Solo Crypto:** $0/mes (Binance WS + CoinGecko Free dan todo lo necesario)
- **Crypto + Forex:** $217.560 – $350.760/mes (Twelve Data)

---

## 4. Comunicaciones — Dialer VoIP, SMS y Email

### 4.1 Dialer VoIP (Twilio) — Llamadas telefónicas de los agentes

**¿Qué es?** Twilio es el servicio que permite a los agentes hacer y recibir llamadas telefónicas directamente desde la plataforma web, sin necesidad de teléfonos físicos.

**¿Por qué se necesita?** Los agentes contactan leads por teléfono. Sin un dialer, tendrían que usar celulares personales — sin control, sin grabación, sin métricas.

| Concepto | Precio (COP) |
|:---|---:|
| Número telefónico (por mes) | $4.440/número |
| Llamada saliente (por minuto) | $58/minuto |
| Llamada entrante (por minuto) | $5/minuto |

**Cálculo para un equipo de 10 agentes:**
```
10 agentes × 10 llamadas/día × 5 min/llamada × 22 días hábiles = 11.000 minutos/mes
11.000 min × $58/min = $638.000/mes
+ 10 números telefónicos × $4.440 = $44.400/mes
Total: ~$682.400/mes
```

**Cálculo para 30 agentes:**
```
30 agentes × 10 llamadas/día × 5 min/llamada × 22 días = 33.000 minutos/mes
33.000 min × $58/min = $1.914.000/mes
+ 30 números × $4.440 = $133.200/mes
Total: ~$2.047.200/mes
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
| SMS a Colombia | $13/mensaje |
| SMS a México | $26/mensaje |
| SMS a Argentina | $36/mensaje |

**Estimación (500 SMS/mes):** $6.600 – $18.000/mes

### 4.3 Email Transaccional — Correos automáticos

**¿Qué es?** Emails que la plataforma envía automáticamente: verificación de cuenta, recuperación de contraseña, notificaciones de depósito, alertas al HEAD.

| Proveedor | Precio/mes (COP) | Límite |
|:---|---:|:---|
| **Resend Free** | $0 | 100 emails/día (3.000/mes) |
| **Resend Pro** | $88.800 | 50.000 emails/mes |
| **SendGrid Free** | $0 | 100 emails/día |

**Estimación:** $0/mes — el plan free de Resend cubre las necesidades hasta 100+ clientes activos.

---

## 5. Dominio y Email Corporativo

### 5.1 Dominio — La dirección web

**¿Qué es?** El dominio es la dirección que los usuarios escriben en el navegador: `investpro.com`. Sin dominio, solo se accede por IP numérica.

| Concepto | Precio/año (COP) | Proveedor |
|:---|---:|:---|
| Dominio `.com` | $53.280 – $66.600 | Namecheap, Cloudflare, Google |
| Dominio `.co` | $133.200 – $177.600 | Más caro por ser Colombia |
| SSL (candado verde) | $0 | Incluido gratis en Cloudflare/Vercel |

**Estimación prorrateada:** $4.440 – $14.760/mes

### 5.2 Email Corporativo — Correos @investpro.com

**¿Qué es?** Cuentas de email con tu dominio personalizado: `head@investpro.com`, `soporte@investpro.com`. Da imagen profesional y credibilidad.

| Proveedor | Precio/usuario/mes (COP) | ¿Qué incluye? |
|:---|---:|:---|
| **Google Workspace** | $31.968 | Gmail + Drive + Meet + 30GB |
| **Zoho Mail** | $4.440 | Email + 5GB almacenamiento |
| **Titan (Namecheap)** | $8.436 | Email + calendario |

**Estimación (5 cuentas corporativas):**
- Google Workspace: 5 × $31.968 = **$159.840/mes**
- Zoho Mail: 5 × $4.440 = **$22.200/mes**

---

## 6. Herramientas de Desarrollo y Monitoreo

| Herramienta | ¿Qué hace? | Precio/mes (COP) |
|:---|:---|---:|
| **GitHub Free** | Almacena el código fuente, control de versiones | $0 |
| **GitHub Team** | Repositorios privados con más funciones para equipos | $17.760/desarrollador |
| **Sentry Free** | Detecta y reporta errores en producción automáticamente | $0 |
| **Sentry Team** | Más eventos, alertas avanzadas | $115.440 |
| **PostHog** | Analytics de producto (qué hacen los usuarios en la app) | $0 (10K eventos/mes) |
| **Uptime Robot** | Te avisa por email/SMS si la plataforma se cae | $0 (50 monitores) |

**Estimación:** $0 – $177.600/mes

---

## 7. Talento Humano — Equipo de Mantenimiento Técnico

> [!IMPORTANT]
> Este es el **costo fijo más significativo** de la operación. Sin desarrolladores dedicados, la plataforma no recibe actualizaciones de seguridad, corrección de bugs ni nuevas funcionalidades. Las cifras incluyen el **+20% de margen técnico** acordado para el programador principal.

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
| **Salario base mensual** | $2.160.000 | $2.160.000 |
| Prestaciones sociales (~52%) | $1.123.200 | $1.123.200 |
| **Costo total empleador/mes** | **$3.283.200** | **$3.283.200** |

> **Total 2 Juniors (contrato laboral):** **$6.566.400/mes**

**Alternativa: Contratación por prestación de servicios (freelance):**

| Modalidad | Dev Junior #1 | Dev Junior #2 | Total |
|:---|---:|---:|---:|
| **Prestación de servicios** | $2.400.000 | $2.400.000 | **$4.800.000/mes** |
| **Medio tiempo (4h/día)** | $1.440.000 | $1.440.000 | **$2.880.000/mes** |

> [!TIP]
> **Recomendación:** Iniciar con 2 juniors por prestación de servicios ($4.800.000/mes total) y migrar a contrato laboral cuando la operación supere los 200 clientes.

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
| Dominio | `.com` prorrateado | $4.440 |
| Email | Zoho Mail (2 cuentas) | $8.880 |
| Dialer | No necesario en demo | $0 |
| SSL | Gratis (Cloudflare) | $0 |
| Desarrolladores | No necesario en demo | $0 |
| **TOTAL** | | **$13.320/mes** |

---

### 🟡 Escenario B: Producción Inicial (50 clientes, 10 agentes)

Primera operación real con equipo pequeño.

| Servicio | Detalle | COP/mes |
|:---|:---|---:|
| Supabase | Plan Pro | $111.000 |
| Hosting | Cloudflare Pages | $0 |
| CDN | Cloudflare Free | $0 |
| Datos de mercado | Binance WS + CoinGecko Free | $0 |
| Dialer VoIP | Twilio (10 agentes, ~11K min) | $682.400 |
| SMS | ~300 mensajes | $3.960 |
| Email transaccional | Resend Free | $0 |
| Dominio | `.com` | $4.440 |
| Email corporativo | Zoho Mail (5 cuentas) | $22.200 |
| GitHub | Free | $0 |
| Monitoreo | Sentry Free + Uptime Robot | $0 |
| **Subtotal Infraestructura** | | **$819.600/mes** |
| 2 Devs Junior (Prest. Servicios) | Mantenimiento y soporte | $4.800.000 |
| **TOTAL CON EQUIPO** | | **$5.619.600/mes** |

---

### 🔴 Escenario C: Producción Escalada (500 clientes, 30 agentes)

Operación completa con múltiples mesas, Forex incluido.

| Servicio | Detalle | COP/mes |
|:---|:---|---:|
| Supabase | Pro + excedentes (~$55 USD) | $244.200 |
| Hosting | Vercel Pro (analytics) | $88.800 |
| CDN | Cloudflare Pro (WAF) | $88.800 |
| Datos de mercado | Twelve Data (Forex + Crypto) | $350.760 |
| Dialer VoIP | Twilio (30 agentes, ~33K min) | $2.047.200 |
| SMS | ~1.500 mensajes | $19.800 |
| Email transaccional | Resend Pro | $88.800 |
| Dominio | `.com` | $4.440 |
| Email corporativo | Google Workspace (15 cuentas) | $479.520 |
| GitHub Team | 3 desarrolladores | $53.280 |
| Monitoreo | Sentry Team | $115.440 |
| **Subtotal Infraestructura** | | **$3.567.840/mes** |
| 2 Devs Junior (Contrato laboral) | Mantenimiento, nuevas features | $6.566.400 |
| **TOTAL CON EQUIPO** | | **$10.134.240/mes** |

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

Las pasarelas de pago cobran un porcentaje por cada depósito procesado. Este costo normalmente se traslada al cliente o se descuenta de la operación — no es un costo fijo mensual. Las comisiones de ejemplo incluyen **+20%** de margen técnico.

| Pasarela | Comisión | Mejor para |
|:---|:---|:---|
| **Stripe** | 2.9% + $1.332 por transacción | Tarjetas internacionales (Visa, MC) |
| **PayRetailers** | 3.5% – 5% | Transferencias locales en LATAM (PSE, SPEI, PIX) |
| **Coinbase Commerce** | 1% | Depósitos en criptomonedas |
| **NOWPayments** | 0.5% | Crypto (más opciones de monedas) |

**Ejemplo:** Si un cliente deposita $1.000.000 COP vía Stripe:
- Comisión base: $1.000.000 × 2.9% + $1.110 = $30.110 COP
- Con margen técnico (+20%): **$36.132 COP**

---

## 11. Resumen Comparativo Final (COP/mes)

| Rubro | 🟢 Demo | 🟡 Producción (50 clientes) | 🔴 Escalado (500 clientes) |
|:---|---:|---:|---:|
| Supabase | $0 | $111.000 | $244.200 |
| Hosting + CDN | $0 | $0 | $177.600 |
| Datos de mercado | $0 | $0 | $350.760 |
| Dialer VoIP | $0 | $682.400 | $2.047.200 |
| SMS + Email | $0 | $3.960 | $108.600 |
| Dominio + Email Corp. | $13.320 | $26.640 | $483.960 |
| Dev Tools (GitHub, Sentry) | $0 | $0 | $168.720 |
| **Subtotal Tech** | **$13.320** | **$819.600** | **$3.567.840** |
| 2 Devs Junior | $0 | $4.800.000 | $6.566.400 |
| **GRAN TOTAL** | **$13.320** | **$5.619.600** | **$10.134.240** |

> [!CAUTION]
> **El VoIP y los desarrolladores representan el 97% del costo operativo.** La infraestructura técnica pura (servidores, bases de datos, hosting) es sorprendentemente barata gracias al modelo serverless. La decisión más importante de costos no es tecnológica — es cuántos agentes contratas y cuántos minutos hablan al día.

> [!TIP]
> **Para arrancar en producción real:** Supabase Pro ($111.000) + dominio .com ($53.280/año) + 2 Devs Junior por prestación ($4.800.000) = **~$4.915.440 COP/mes**. Todo lo demás puede empezar en planes gratuitos.

---

## 12. Desglose del margen +20% (referencia)

| Escenario | Costo base (antes) | Con +20% margen | Margen aprox. (tu ganancia técnica) |
|:---|---:|---:|---:|
| Demo / MVP | $11.100 | $13.320 | $2.220 |
| Producción inicial (con equipo) | $4.683.000 | $5.619.600 | $936.600 |
| Producción escalada (con equipo) | $8.445.200 | $10.134.240 | $1.689.040 |

*El margen se aplica de forma uniforme sobre cada partida para reflejar honorarios de arquitectura, despliegue, soporte y evolución del producto a cargo del programador principal.*
