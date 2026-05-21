# Credenciales de Acceso - InvestPRO

## Modo 1: Simulación RBAC (Instantánea - Sin Supabase)

Haz clic en **"Mostrar Accesos de Simulación RBAC (7 Niveles)"** en la pantalla de login para desplegar los botones de acceso rápido. Este modo **no requiere conexión a Supabase** — establece el rol directamente en la aplicación.

| Rol | Botón | Dashboard |
| :--- | :--- | :--- |
| **HEAD** | Head (Súper Admin) | Centro de Comando Global |
| **CHIEF** | Chief | Monitoreo de Depósitos y Leads |
| **MANAGER** | Manager | Metas y Capacitación |
| **FLOOR_MANAGER** | Floor Manager | Supervisión de Mesas |
| **TEAM_LEADER** | Team Leader | Gestión de Agentes |
| **AGENT** | Agente | Dialer y Ventas |
| **CLIENT** | Cliente (Inversor) | Terminal de Trading |

---

## Modo 2: Login Real (Requiere Supabase)

Para usar el formulario de correo/contraseña, el usuario debe estar registrado en Supabase Auth.

**Contraseña de cuentas demo:** `InvestPRO2026!`

| Correo | Rol |
| :--- | :--- |
| `client@investpro.com` | CLIENT |
| `agent@investpro.com` | AGENT |
| `teamleader@investpro.com` | TEAM_LEADER |
| `floormanager@investpro.com` | FLOOR_MANAGER |
| `manager@investpro.com` | MANAGER |
| `chief@investpro.com` | CHIEF |
| `head@investpro.com` | HEAD |

> [!IMPORTANT]
> Estos usuarios deben existir en Supabase Auth. Si no existen, usa primero el Modo 1 (Simulación) para navegar la app. Para registrar usuarios reales, usa la función `signUp` del store de autenticación.

