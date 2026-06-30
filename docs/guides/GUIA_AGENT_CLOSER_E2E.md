# Guía E2E — Rol AGENT (Closer)

Checklist para validar el dashboard `/dashboard/agent` y las 10 herramientas del Arsenal.

---

## Prerrequisitos

1. Migraciones aplicadas: `202605210001`, `202605260001` (Twilio), `202605370001` (agent closer ops).
2. `npm run seed:dev-users` + `seed_dev_role_users_post.sql`.
3. `seed_agent_demo_leads.sql` (leads asignados al agente real).
4. Edge Functions desplegadas (incl. `create-deposit-for-client`, Twilio trio).
5. Login: `agent@investpro.com` / `Dev2026!Inv`.

---

## Mapa de tabs URL

| `?tab=` | Herramienta |
|---------|-------------|
| `dialer` | Auto-Dialer |
| `ventas` | Mis Ventas (FTD) |
| `leads` | Lista completa de leads |
| `callbacks` | Agenda |
| `scripting` | Teleprompter |
| `sos` | Botón SOS |
| `cobro` | Cobro rápido |
| `ranking` | Leaderboard mesa |
| `crm` | CRM notas |
| `kyc` | KYC y legal |
| `presencia` | Estado laboral |

---

## Checklist por herramienta

| # | Herramienta | Prueba |
|---|-------------|--------|
| 1 | Auto-Dialer | Contadores > 0; cola con lead; botones estado; **Llamar** si Twilio configurado |
| 2 | FTD | KPIs depósitos; comisión 8% proyectada |
| 3 | Callbacks | Programar datetime; aparece en lista |
| 4 | Scripting | Chips objeción + texto interpolado |
| 5 | SOS | Activar → Floor/TL ven alerta (Realtime) |
| 6 | Cobro | Lead con `client_user_id` → link NOWPayments |
| 7 | Ranking | Tabla mesa con posición |
| 8 | CRM | Guardar nota + estado |
| 9 | KYC/Legal | Copiar URL / mailto |
| 10 | Presencia | Cambiar a Ready/Break; visible en monitor TL |

---

## SQL útil

```sql
-- Leads del agente
SELECT id, first_name, phone, status FROM public.leads
WHERE assigned_to = (SELECT id FROM public.profiles WHERE email = 'agent@investpro.com');

-- SOS abiertos
SELECT * FROM public.sos_alerts WHERE status = 'open' ORDER BY created_at DESC;

-- Llamadas
SELECT * FROM public.call_logs ORDER BY started_at DESC LIMIT 5;
```

---

## Twilio

Ver [`GUIA_TWILIO_VOIP.md`](GUIA_TWILIO_VOIP.md). Sin Twilio: dialer manual (estados lead) sigue operativo.

---

## Supervisores

- **Team Leader** → `?tab=leads` reasignación real; `?tab=monitor` presencia.
- **Floor** → `?tab=monitor`, `?tab=reasignacion`, Alertas SOS con Realtime.
