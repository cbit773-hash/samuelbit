# 🚀 REQUISITOS PARA INICIAR — InvestPRO
## Lista Completa de lo que se Necesita para Lanzar la Operación

---

## RESUMEN: INVERSIÓN INICIAL TOTAL

| Concepto | Monto (COP) | Tipo |
|----------|-------------|------|
| Infraestructura técnica (Mes 1) | $683,000 | Mensual |
| Google Ads (Campaña 500 clientes) | $5,000,000 | Único (8 semanas) |
| Diseñador de pautas publicitarias | $800,000 | Único |
| 2 Desarrolladores Junior (Mes 1) | $4,000,000 | Mensual |
| Equipos y oficina (si aplica) | $2,000,000 - $5,000,000 | Único |
| Constitución legal | $1,500,000 - $3,000,000 | Único |
| Capital de trabajo (nómina agentes Mes 1) | $6,000,000 - $12,000,000 | Mensual |
| **INVERSIÓN MES 1 (Mínimo)** | **~$17,000,000** | |
| **INVERSIÓN MES 1 (Completo)** | **~$30,000,000** | |

---

## 1. INFRAESTRUCTURA TÉCNICA

### 1.1 Lo que YA está listo ✅

| Componente | Estado | Detalle |
|-----------|--------|---------|
| Plataforma Frontend (React/Vite) | ✅ Listo | 7 dashboards, 70+ módulos, UI completa |
| Base de datos Supabase | ✅ Configurada | PostgreSQL con schema, RLS, seeds |
| Sistema de autenticación | ✅ Funcional | Login real + simulación RBAC de 7 niveles |
| CRM de Leads | ✅ Conectado | CRUD en Supabase, asignación, estados |
| Módulo de Depósitos | ✅ Conectado | Crear, aprobar, rechazar desde BD |
| Dashboard HEAD | ✅ En vivo | KPIs, personal, leads, depósitos desde Supabase |
| Dashboard CHIEF | ✅ En vivo | Validación de caja + auditoría SLA |
| Landing page de captación | ✅ Lista | Ruta `/registro`, registro Auth + onboarding RPC + UTM tracking |
| Registro cliente (Auth + wallet) | ✅ Hecho (código) | — | `registerClient`, RPC `complete_client_onboarding` · `docs/guides/GUIA_REGISTRO_AUTH.md` |
| Recuperación de contraseña | ✅ Hecho (código) | — | `/auth/recuperar`, `/auth/restablecer` · ver `docs/guides/GUIA_REGISTRO_AUTH.md` |
| Sistema de Wallet | ✅ En vivo | Tablas `wallets`, `transactions` + RPCs atómicas + RLS fail-closed |
| Integración NOWPayments (código) | ✅ Implementado | Edge Functions: `create-deposit`, `nowpayments-webhook`, `approve-transaction` |
| UI Wallet ClientAccountPage | ✅ Conectada | Balance real, depósito crypto/manual, retiros, historial (`/dashboard/account?tab=...`) |
| Panel transacciones CHIEF | ✅ Conectado | Aprobar/rechazar depósitos manuales y retiros desde `transactions` |
| Arquitectura de pagos | ✅ Documentado | NOWPayments + Manual — ver `docs/guides/GUIA_NOWPAYMENTS.md` |
| Servicios de datos | ✅ Completos | 6 servicios: profiles, leads, deposits, positions, teams, wallet + `payment.service` |
| Hooks de Supabase | ✅ Listos | `useSupabaseQuery` + `useSupabaseMutation` genéricos |
| Tipos TypeScript | ✅ Listos | `database.types.ts` con todos los tipos del schema |
| Plan de mercadeo | ✅ Documentado | Google Ads $5M COP, 8 semanas (`docs/business/11_PLAN_MERCADEO_GOOGLE_ADS.md`) |
| Dashboard Agent → Supabase | ✅ Hecho | — | 10 herramientas Arsenal · migración `202605370001_agent_closer_ops.sql` · `docs/guides/GUIA_AGENT_CLOSER_E2E.md` |
| Dialer VoIP Twilio (código) | ✅ Hecho | — | `AgentDialerPanel` + `useTwilioDialer` · requiere secrets Twilio · `docs/guides/GUIA_TWILIO_VOIP.md` |
| Leads demo agente dev | ✅ Script | — | `supabase/scripts/seed_agent_demo_leads.sql` tras `seed:dev-users` |
| Dashboard Client → Trading | ✅ Hecho | — | `useClientPositions`, terminal abre/cierra en BD, portafolio y KPIs en ClientDashboard |
| Sistema de notificaciones | ✅ Hecho (código) | — | Resend + tabla `notifications` + Edge Functions · ver `docs/guides/19_GUIA_FUNCIONAMIENTO_SISTEMA.md` (falta API key Resend) |
| KYC / Verificación de identidad | ✅ Hecho (código) | — | Storage `kyc-documents`, 4 docs, RPC approve/reject, UI Cliente + CHIEF · SQL `202605230001_kyc.sql` |
| Reportes exportables (CSV/PDF) | ✅ Hecho | — | CHIEF → Reporte conciliación: CSV transacciones/depositos + PDF |
| WebSocket tiempo real | ✅ Hecho | — | Binance WS + reconexión + badge live; Realtime notificaciones + toast |
| Documentos legales (T&C, Privacidad, Riesgo) | ✅ Publicados | — | `/legal/terminos`, `/legal/privacidad`, `/legal/riesgos` + banner `RiskDisclaimer` · `docs/legal/LEGAL_PUBLICACION.md` |

### 1.2 Lo que FALTA por implementar 🔧

| Componente | Prioridad | Esfuerzo | Detalle |
|-----------|-----------|----------|---------|
| Cuenta NOWPayments + API keys | 🔴 Crítica | 1-2 días | Registro, API key, wallet USDT TRC20, IPN secret → `docs/guides/GUIA_NOWPAYMENTS.md` Fase 1 |
| Deploy NOWPayments en producción | 🔴 Crítica | 1 día | Secrets, Edge Functions, `.env` frontend → `docs/guides/GUIA_NOWPAYMENTS.md` Fases 2-5 |
| Cuenta Twilio + deploy dialer VoIP | 🔴 Crítica | 1-2 días | Número, API Key, TwiML App, secrets, deploy → `docs/guides/GUIA_TWILIO_VOIP.md` |


### 1.3 Servicios a Contratar (Día 1)

| Servicio | Proveedor | Costo/mes (COP) | Para qué |
|---------|-----------|-----------------|----------|
| Base de datos | Supabase Pro | $92,500 | Datos de toda la operación |
| Hosting | Cloudflare Workers | $0 | Servir la app al mundo |
| CDN + SSL | Cloudflare Free | $0 | Velocidad y seguridad |
| Dominio `.com` | Namecheap/Cloudflare | $3,700/mes | `investpro.com` o similar |
| Email corporativo | Zoho Mail (5 cuentas) | $18,500 | head@, chief@, soporte@, etc. |
| Email transaccional | Resend Free | $0 | Emails automáticos a clientes |
| Datos de mercado | Binance WS + CoinGecko | $0 | Precios crypto en vivo |
| Monitoreo | Sentry Free + Uptime Robot | $0 | Alertas si algo falla |
| Repositorio de código | GitHub Free | $0 | Control de versiones |
| construccion de codigo | cursor | $278000 | Control de versiones |
| **TOTAL INFRA MES 1** | | **$398,000** | |

---

## 2. EQUIPO HUMANO MÍNIMO

### 2.1 Equipo Técnico

| Rol | Cantidad | Salario/mes (COP) | Modalidad | Función |
|-----|----------|-------------------|-----------|---------|
| **Dev Junior Full-Stack** | 2 | $2,000,000 c/u | Prest. de servicios | Mantenimiento, bugs, nuevas features |
| **TOTAL TÉCNICO** | 2 | **$4,000,000** | | |

### 2.2 Equipo Operativo (Mínimo Viable)

| Rol en InvestPRO | Persona | Salario/mes (COP) | Función Real |
|-----------------|---------|-------------------|-------------|
| **HEAD** | Fundador/Dueño | Variable | Decisiones estratégicas, aprobaciones |
| **CHIEF** | 1 persona | $2,000,000 - $3,000,000 | Auditoría de depósitos, conciliación |
| **FLOOR MANAGER** | 1 persona | $1,800,000 - $2,500,000 | Supervisión de mesas en vivo |
| **AGENTES** | 4-6 personas | $1,300,000 - $1,800,000 c/u | Llamadas, cierre de FTDs |
| **TOTAL OPERATIVO** | 7-9 personas | **$10,700,000 - $17,300,000** | |

> [!IMPORTANT]
> **Mínimo absoluto para arrancar:** 1 HEAD + 1 Chief + 4 Agentes = **6 personas** + 2 Devs = **8 personas total**.

### 2.3 Contratar Después (Fase 2, +100 clientes)

| Rol | Cuándo | Por qué |
|-----|--------|---------|
| MANAGER | Al superar 10 agentes | Capacitación y QA de ventas |
| TEAM LEADER | Al tener 2+ mesas | Liderazgo de grupo |
| Diseñador (planta) | Al escalar ads | Creativos constantes |
| Dev Senior | Al tener +200 clientes | Arquitectura, seguridad |

---

## 3. CONSTITUCIÓN LEGAL

### 3.1 Documentos y Registros Necesarios

| Requisito | Costo Estimado (COP) | Tiempo | Detalle |
|-----------|----------------------|--------|---------|
| Registro de SAC (Sociedad Anónima Cerrada) | S/ 1,500 - 3,500 | 1-2 semanas | SUNARP + notaría |
| RUC (SUNAT) | $0 | 1-3 días | Tras inscripción societaria |
| Cuenta bancaria empresarial | $0 | 1-2 semanas | BCP, Interbank (CCI PEN y USD) |
| Facturación electrónica | S/ 200 - 600/mes | 3-5 días | Nubefact, Alegra PE, etc. |
| Registro de marca (opcional) | $800,000 - $1,200,000 | 4-6 meses | SIC — proteger nombre "InvestPRO" |
| Asesoría jurídica inicial | $500,000 - $1,500,000 | 1 semana | Revisión de T&C, disclaimers, contratos |
| **TOTAL LEGAL** | **$1,500,000 - $3,000,000** | | Inversión única |

### 3.2 Documentos Legales de la Plataforma

| Documento | Estado | Prioridad |
|-----------|--------|-----------|
| Términos y Condiciones | ✅ Publicado | — | `/legal/terminos` |
| Política de Privacidad (Ley 29733 — Perú) | ✅ Publicado | — | `/legal/privacidad` |
| Guías Perú (mercado, pagos, AML) | ✅ Publicado | — | `GUIA_PERU_*.md` |
| Disclaimer de Riesgo de Inversión | ✅ Publicado | — | `/legal/riesgos` + banner en landing, login y dashboards |
| Contrato de Prestación de Servicios (agentes) | 📝 Crear | 🟡 Antes de contratar |
| Política AML/KYC | 📝 Crear | 🟡 Antes de los primeros FTDs |

> [!WARNING]
> **Revisión jurídica externa recomendada** antes de campañas masivas (razón social, NIT, porcentajes de pérdida). Google Ads requiere T&C y disclaimer para servicios financieros — ya publicados en la web.

---

## 4. MARKETING Y CAPTACIÓN

### 4.1 Inversión en Google Ads

| Concepto | Monto (COP) |
|---------|-------------|
| Presupuesto Google Ads (8 semanas) | $3,500,000 |
| Diseñador de pautas (banners + videos) | $800,000 |
| Herramientas de tracking (GTM, Hotjar) | $200,000 |
| Landing page optimización | $200,000 |
| Reserva de contingencia | $300,000 |
| **TOTAL MERCADEO** | **$5,000,000** |

*(Detalle completo en `docs/business/11_PLAN_MERCADEO_GOOGLE_ADS.md`)*
*(Pasarela de pagos en `docs/business/13_PASARELA_DE_PAGOS.md`)*

### 4.2 Requisitos Previos para Google Ads

- [x ] Dominio comprado y apuntando al hosting
- [x] Landing page publicada con formulario funcional (`/registro`) ✅
- [x] Formulario Landing → Supabase (tabla leads) configurado ✅
- [x] UTM tracking integrado en landing ✅
- [x] Google Tag Manager instalado ✅ (GTM-XXXXXXX en `index.html` — reemplazar con ID real)
- [x] Pixel de conversión en el formulario ✅ (`trackLeadConversion()` en `/registro`)
- [x] Página de T&C y Privacidad en el footer ✅ (`/legal/terminos` + `/legal/privacidad`)
- [x] Página de Advertencia de Riesgo ✅ (`/legal/riesgos`)
- [x] Disclaimer de riesgo visible ✅ (Banner sticky + footer + formulario + dashboards)
- [ ] Verificación de Google Ads para servicios financieros
- [ ] Cuenta de Google Ads creada y configurada
- [ ] Método de pago (tarjeta de crédito o débito)

---

## 5. EQUIPOS FÍSICOS

### 5.1 Para Oficina (si aplica)

| Equipo | Cantidad | Precio Unit. (COP) | Total |
|--------|----------|-------------------|-------|
| PC/Laptop para agentes | 4-6 | $1,500,000 - $2,500,000 | $6,000,000 - $15,000,000 |
| Audífonos con micrófono (USB) | 6 | $80,000 - $150,000 | $480,000 - $900,000 |
| Internet empresarial (fibra) | 1 | $150,000/mes | $150,000/mes |
| Escritorios y sillas | 6 | $400,000 - $800,000 | $2,400,000 - $4,800,000 |
| Monitor adicional (para agentes) | 4 | $500,000 - $800,000 | $2,000,000 - $3,200,000 |

### 5.2 Para Remoto (sin oficina)

| Requisito | Detalle |
|-----------|---------|
| Cada agente necesita | PC con Chrome, Internet estable (>10 Mbps), audífonos |
| Software | Solo navegador web — todo es cloud |
| VPN | Recomendado para seguridad (WireGuard) |

> [!TIP]
> **Recomendación:** Iniciar en **modo remoto** para ahorrar la inversión en oficina ($10M+ COP). Los agentes solo necesitan PC + Internet + audífonos. La plataforma es 100% web.

---

## 6. CRONOGRAMA DE LANZAMIENTO

### Semana 1-2: PREPARACIÓN LEGAL + TÉCNICA

| Día | Acción | Responsable |
|-----|--------|------------|
| 1 | Constituir SAS en Cámara de Comercio | HEAD + Abogado |
| 1 | Comprar dominio `.com` | HEAD |
| 2 | Abrir cuenta bancaria empresarial | HEAD |
| 2 | Contratar Supabase Pro ($25 USD/mes) | Dev |
| 3 | Configurar email corporativo (Zoho/Google) | Dev |
| 3 | Ejecutar `schema.sql` + `seed_data.sql` en Supabase | Dev |
| 4-5 | Deploy pasarela NOWPayments (Fases 1-5 de `docs/guides/GUIA_NOWPAYMENTS.md`) | Dev |
| 5-7 | Crear Landing Page de captación | Dev + Diseñador |
| 7-10 | Documentos legales (T&C, Privacidad, Disclaimers) | Abogado |
| 10-14 | Configurar Google Ads + Google Tag Manager | Chief/Media Buyer |

### Semana 3-4: RECLUTAMIENTO + TESTING

| Día | Acción | Responsable |
|-----|--------|------------|
| 15-17 | Reclutar 4-6 agentes (LinkedIn, referidos) | HEAD + Floor Manager |
| 17-19 | Capacitación de agentes (plataforma + script de ventas) | Manager/Floor |
| 19-21 | Testing interno: flujo completo Lead → Llamada → FTD | Todos |
| 21-24 | Corregir bugs encontrados en testing | Devs |
| 24-28 | Simulacro operativo con datos reales de prueba | Todos |

### Semana 5: LANZAMIENTO 🚀

| Día | Acción | Responsable |
|-----|--------|------------|
| 29 | **Activar Google Ads** — Campañas de testing | Chief |
| 29 | Monitorear primer flujo: Clic → Landing → Lead → CRM | Devs + Chief |
| 30 | Primeras llamadas reales a leads | Agentes |
| 30-35 | Optimización diaria de campañas | Chief |
| 35 | **Meta:** Primeros 5-10 FTDs | Todos |

---

## 7. CHECKLIST FINAL — ¿ESTÁS LISTO?

### Legal ⚖️
- [ ] SAS constituida y RUT activo
- [ ] Cuenta bancaria empresarial abierta
- [x] Términos y Condiciones publicados en la web (`/legal/terminos`) ✅
- [x] Política de Privacidad publicada (`/legal/privacidad`) ✅
- [x] Disclaimer de riesgo en landing y plataforma (`/legal/riesgos` + `RiskDisclaimer`) ✅
- [ ] Contratos de prestación de servicios para agentes

### Técnico 💻
- [ ] Dominio comprado y DNS configurado
- [ ] Supabase Pro activado y schema ejecutado
- [ ] Frontend desplegado en Cloudflare Workers (`cbit773`)
- [x] Landing page con formulario → Supabase (`/registro`) ✅
- [x] Schema de wallet y transacciones creado ✅
- [x] Servicios de wallet implementados (depositar, retirar, aprobar) ✅
- [x] Código NOWPayments: Edge Functions + RPCs + UI cliente/CHIEF ✅
- [x] Migraciones SQL aplicadas en Supabase ✅
- [ ] Cuenta NOWPayments + API key + USDT TRC20 + IPN (`GUIA_NOWPAYMENTS.md` Fase 1)
- [ ] Secrets Supabase + Edge Functions deploy (Fases 2-3)
- [ ] IPN URL en NOWPayments Dashboard
- [ ] Prueba E2E: depósito crypto $10 → wallet acreditada (Fase 5)
- [ ] Email corporativo configurado (5 cuentas mín.)
- [x] Google Tag Manager + pixel de conversión ✅
- [ ] SSL activo (HTTPS)

### Marketing 📣
- [ ] Cuenta Google Ads creada y verificada
- [ ] Creativos del diseñador recibidos (banners + videos)
- [ ] 3 campañas configuradas (Search A, B, C)
- [ ] UTM tracking configurado
- [ ] Presupuesto diario definido ($40,000-$60,000/día)

### Equipo 👥
- [ ] 2 Devs Junior contratados
- [ ] 1 Chief contratado (o HEAD asume temporalmente)
- [ ] 4-6 Agentes reclutados y capacitados
- [ ] Script de ventas escrito y ensayado
- [ ] Horarios operativos definidos (turnos)
- [ ] Canal de comunicación interno (WhatsApp Business / Slack)

### Operativo 🎯
- [x] CRM probado: crear lead, asignar, cambiar estado, cerrar FTD ✅
- [x] Flujo depósito CRM legacy: crear → verificar → aprobar (tabla `deposits`) ✅
- [x] Flujo wallet: depósito manual → CHIEF aprueba → balance acreditado ✅
- [ ] Flujo wallet crypto: depósito NOWPayments → webhook IPN → balance acreditado (requiere deploy)
- [ ] Reportes de conciliación funcionando
- [ ] Plan de comisiones definido para agentes
- [ ] Protocolo de escalación (agente → floor → chief → head)

---

## 8. RIESGOS Y MITIGACIÓN

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|-------------|---------|------------|
| Google rechaza los anuncios | Alta | Alto | Cumplir 100% con políticas de servicios financieros |
| Pocos leads se convierten en FTD | Media | Alto | Mejorar script, capacitación agresiva, A/B test landing |
| Falla técnica en producción | Media | Alto | 2 devs en standby, monitoreo 24/7 con Sentry |
| Agentes no cierran ventas | Media | Alto | Floor Manager supervisa en vivo, coaching diario |
| Problemas con pasarela de pago | Baja | Crítico | NOWPayments crypto + depósito manual como backup; Stripe en Fase 2 |
| Webhook IPN no acredita saldo | Media | Crítico | Ver `docs/guides/GUIA_NOWPAYMENTS.md` Fase 6 — HMAC, secrets, logs webhook |
| Base de datos comprometida | Baja | Crítico | RLS activo, backups diarios, VPN para acceso admin |

---

## 9. RESUMEN DE INVERSIÓN POR ETAPA

| Etapa | Inversión (COP) | Duración | Resultado Esperado |
|-------|----------------|----------|-------------------|
| **Legal + Setup** | $2,000,000 - $4,000,000 | Semanas 1-2 | SAS, dominio, infra lista |
| **Reclutamiento** | $0 - $500,000 | Semanas 2-3 | 6-8 personas contratadas |
| **Marketing (Ads)** | $5,000,000 | Semanas 5-12 | 50-200 FTDs |
| **Operación Mes 1** | $10,700,000 - $17,300,000 | Mes 1 | Nómina + infra |
| **TOTAL PARA ARRANCAR** | **$17,700,000 - $26,800,000** | 4-5 semanas | Operación funcionando |

> [!CAUTION]
> **Mínimo absoluto para lanzar:** ~$17M COP cubre legal básico + infra + 4 agentes + ads + 2 devs. Esto asume modo remoto (sin oficina) y contratos por prestación de servicios.

---

## 10. PASARELA DE PAGOS — NOWPayments

| Estado | Detalle |
|--------|---------|
| Código + UI | ✅ Implementado en el repo |
| SQL en Supabase | ✅ Migraciones aplicadas |
| Cuenta NOWPayments + deploy | 🔧 Pendiente |

**Guía paso a paso (empezar aquí):** [`docs/guides/GUIA_NOWPAYMENTS.md`](../guides/GUIA_NOWPAYMENTS.md)

| Fase | Contenido |
|------|-----------|
| 0 | SQL / verificación |
| 1 | Cuenta NOWPayments + API + USDT + IPN |
| 2 | Secrets Supabase |
| 3 | Deploy Edge Functions |
| 4 | `.env` frontend |
| 5 | Prueba E2E |
| 6 | Troubleshooting |

**Referencia técnica:** [`operations/DEVOPS.md`](DEVOPS.md)  
**Arquitectura:** [`docs/business/13_PASARELA_DE_PAGOS.md`](../business/13_PASARELA_DE_PAGOS.md)

---

*Documento de requisitos — InvestPRO — Actualizado 20 de Mayo 2026*
*Basado en: 10_COSTOS, 11_MERCADEO, 13_PASARELA, GUIA_NOWPAYMENTS*
