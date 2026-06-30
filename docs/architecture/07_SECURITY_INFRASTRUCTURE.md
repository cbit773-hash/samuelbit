# 07. Infraestructura de Seguridad — InvesPro (Nivel Broker)

> **Versión:** 1.0.0  
> **Fecha:** 2026-05-01  
> **Clasificación:** CONFIDENCIAL — Solo para equipo técnico autorizado  
> **Objetivo:** Convertir InvesPro en un sistema confiable grado broker, sin fugas de datos, con VPN obligatoria y seguridad multicapa.

---

## RESUMEN EJECUTIVO

Este documento define **todas las capas de seguridad** que InvesPro necesita para operar como un broker confiable. Cubre desde la infraestructura de red (VPN, firewalls) hasta la protección de datos en tránsito y en reposo, pasando por auditoría, cifrado y cumplimiento regulatorio.

---

## 1. Arquitectura de Seguridad por Capas

```
┌─────────────────────────────────────────────────────────┐
│  CAPA 7 — APLICACIÓN                                    │
│  • CSP Headers  • Input Sanitization  • RBAC            │
├─────────────────────────────────────────────────────────┤
│  CAPA 6 — AUTENTICACIÓN & SESIÓN                        │
│  • JWT httpOnly  • 2FA TOTP  • Session Pinning          │
├─────────────────────────────────────────────────────────┤
│  CAPA 5 — API GATEWAY                                   │
│  • Rate Limiting  • WAF  • IP Whitelisting              │
├─────────────────────────────────────────────────────────┤
│  CAPA 4 — BASE DE DATOS                                 │
│  • RLS (Row Level Security)  • Encryption at Rest       │
│  • Audit Logs  • Backups cifrados                       │
├─────────────────────────────────────────────────────────┤
│  CAPA 3 — RED & VPN                                     │
│  • WireGuard VPN  • Zero Trust Network                  │
│  • TLS 1.3 obligatorio  • mTLS entre servicios          │
├─────────────────────────────────────────────────────────┤
│  CAPA 2 — INFRAESTRUCTURA                               │
│  • Firewall (UFW/iptables)  • Fail2Ban                  │
│  • SSH solo por clave pública  • Puertos cerrados       │
├─────────────────────────────────────────────────────────┤
│  CAPA 1 — MONITOREO & RESPUESTA                         │
│  • SIEM  • Alertas tiempo real  • Incident Response     │
└─────────────────────────────────────────────────────────┘
```

---

## 2. VPN Obligatoria — WireGuard

### 2.1 ¿Por qué VPN?

| Amenaza sin VPN | Solución con VPN |
|---|---|
| Interceptación de tráfico (MITM) | Túnel cifrado punto a punto |
| Exposición de IP del servidor | Solo accesible vía red privada |
| Acceso no autorizado al panel admin | Admin solo disponible dentro de la VPN |
| Sniffing de credenciales en WiFi público | Todo el tráfico va cifrado por el túnel |

### 2.2 Implementación WireGuard

```ini
# /etc/wireguard/wg0.conf — SERVIDOR VPN
[Interface]
Address = 10.0.0.1/24
ListenPort = 51820
PrivateKey = <SERVER_PRIVATE_KEY>
# Firewall: solo permitir tráfico de la VPN al backend
PostUp = iptables -A FORWARD -i wg0 -j ACCEPT; iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE
PostDown = iptables -D FORWARD -i wg0 -j ACCEPT; iptables -t nat -D POSTROUTING -o eth0 -j MASQUERADE

# PEER: Administrador (Head/Chief)
[Peer]
PublicKey = <ADMIN_PUBLIC_KEY>
AllowedIPs = 10.0.0.2/32

# PEER: Desarrollador
[Peer]
PublicKey = <DEV_PUBLIC_KEY>
AllowedIPs = 10.0.0.3/32
```

```ini
# Cliente VPN — Cada miembro del equipo recibe esto
[Interface]
Address = 10.0.0.2/32
PrivateKey = <CLIENT_PRIVATE_KEY>
DNS = 1.1.1.1

[Peer]
PublicKey = <SERVER_PUBLIC_KEY>
Endpoint = vpn.invespro.com:51820
AllowedIPs = 10.0.0.0/24
PersistentKeepalive = 25
```

### 2.3 Reglas de Acceso por VPN

| Recurso | Acceso Público | Acceso VPN |
|---|---|---|
| Landing Page / Marketing | ✅ | ✅ |
| Login / Registro clientes | ✅ | ✅ |
| Terminal de Trading (Client) | ✅ (con 2FA) | ✅ |
| Panel Admin (Head/Chief) | ❌ BLOQUEADO | ✅ Obligatorio |
| Supabase Dashboard | ❌ BLOQUEADO | ✅ Obligatorio |
| SSH a servidores | ❌ BLOQUEADO | ✅ Obligatorio |
| Base de datos directa | ❌ BLOQUEADO | ✅ Obligatorio |

---

## 3. Protección contra Fugas de Datos

### 3.1 Datos en Tránsito (Cifrado)

```
REGLA ABSOLUTA: Todo el tráfico debe usar TLS 1.3 mínimo.
Nunca HTTP plano. Nunca TLS 1.0/1.1.
```

**Configuración Nginx recomendada:**
```nginx
server {
    listen 443 ssl http2;
    server_name app.invespro.com;

    ssl_certificate     /etc/letsencrypt/live/invespro.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/invespro.com/privkey.pem;

    # Solo TLS 1.3 (máxima seguridad)
    ssl_protocols TLSv1.3;
    ssl_prefer_server_ciphers off;

    # Headers de seguridad críticos
    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "DENY" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' fonts.googleapis.com; font-src fonts.gstatic.com; connect-src 'self' wss://app.invespro.com https://*.supabase.co; img-src 'self' data:;" always;

    # Redirigir HTTP a HTTPS
    if ($scheme != "https") {
        return 301 https://$server_name$request_uri;
    }
}
```

### 3.2 Datos en Reposo (Base de Datos)

| Dato | Clasificación | Protección |
|---|---|---|
| Contraseñas | 🔴 CRÍTICO | bcrypt (cost 12) — Supabase Auth lo maneja |
| Tokens JWT | 🔴 CRÍTICO | httpOnly + Secure + SameSite=Strict cookies |
| Datos KYC (documentos) | 🔴 CRÍTICO | Cifrado AES-256 en Supabase Storage + acceso por signed URL |
| Datos de tarjetas | 🔴 CRÍTICO | NUNCA almacenar — Tokenización vía proveedor de pagos (Stripe/Checkout.com) |
| Balances y posiciones | 🟡 SENSIBLE | RLS + cifrado de disco PostgreSQL (Supabase lo incluye) |
| Emails y teléfonos | 🟡 SENSIBLE | RLS estricto — solo visible por el dueño y alta dirección |
| Logs de actividad | 🟢 INTERNO | Retención 90 días, acceso solo Head/Chief |

### 3.3 Variables de Entorno (`.env`)

```bash
# REGLAS DE ORO para .env:
# 1. NUNCA commitear .env a Git (ya tienes .gitignore ✅)
# 2. Usar un gestor de secretos en producción (Vault, AWS Secrets Manager)
# 3. Rotar las claves cada 90 días
# 4. La ANON KEY de Supabase es pública, pero la SERVICE_ROLE_KEY es SECRETA

# ⚠️ ACCIÓN REQUERIDA: Tu .env actual expone la anon key en el repo.
# Aunque es "pública", es mejor práctica no tenerla hardcodeada.
```

---

## 4. Autenticación Blindada

### 4.1 Flujo de Login Seguro

```
Usuario → [TLS 1.3] → Nginx → Supabase Auth
                                    │
                                    ▼
                          ┌─────────────────┐
                          │ 1. Email/Password│
                          │    (bcrypt)      │
                          └────────┬────────┘
                                   │ ✅ Credenciales válidas
                                   ▼
                          ┌─────────────────┐
                          │ 2. Verificar 2FA │
                          │    (TOTP Code)   │
                          └────────┬────────┘
                                   │ ✅ Código válido
                                   ▼
                          ┌─────────────────┐
                          │ 3. Generar JWT   │
                          │  Access: 15 min  │
                          │  Refresh: 7 días │
                          └────────┬────────┘
                                   │
                                   ▼
                          ┌─────────────────┐
                          │ 4. Session Pin   │
                          │  IP + UserAgent  │
                          │  fingerprinting  │
                          └─────────────────┘
```

### 4.2 Políticas de Contraseñas

```typescript
// Implementar en auth.service.ts
const PASSWORD_POLICY = {
  minLength: 12,           // Mínimo 12 caracteres
  requireUppercase: true,  // Al menos 1 mayúscula
  requireLowercase: true,  // Al menos 1 minúscula
  requireNumber: true,     // Al menos 1 número
  requireSpecial: true,    // Al menos 1 símbolo (!@#$%^&*)
  maxAge: 90,              // Forzar cambio cada 90 días
  preventReuse: 5,         // No reutilizar últimas 5 contraseñas
  lockoutAttempts: 5,      // Bloquear cuenta tras 5 intentos fallidos
  lockoutDuration: 30,     // Bloqueo de 30 minutos
};
```

### 4.3 2FA Obligatorio (TOTP)

| Rol | 2FA Requerido para |
|---|---|
| CLIENT | Retiros, cambio de contraseña |
| AGENT | Login siempre |
| TEAM_LEADER+ | Login siempre + cualquier acción administrativa |
| HEAD | Login + todas las operaciones sensibles |

---

## 5. RLS Reforzado (Supabase)

Tu `fix_rls.sql` actual es un buen punto de partida. Aquí están las mejoras necesarias:

```sql
-- ============================================================
-- SECURITY HARDENING: Políticas RLS Nivel Broker
-- ============================================================

-- 1. AUDIT LOG: Registrar TODA actividad sensible
CREATE TABLE public.audit_log (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID REFERENCES auth.users(id),
  action      TEXT NOT NULL,          -- 'LOGIN', 'DEPOSIT', 'WITHDRAWAL', 'ROLE_CHANGE', etc.
  resource    TEXT NOT NULL,          -- Tabla afectada
  resource_id UUID,                  -- ID del registro afectado
  old_data    JSONB,                 -- Estado anterior (para rollback)
  new_data    JSONB,                 -- Estado nuevo
  ip_address  INET,
  user_agent  TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- RLS en audit_log: NADIE puede modificar, solo HEAD puede leer
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "solo_head_lee_auditoria"
  ON public.audit_log FOR SELECT
  USING (public.get_my_role() = 'HEAD');

-- Bloquear UPDATE/DELETE en audit_log (inmutable)
CREATE POLICY "audit_inmutable"
  ON public.audit_log FOR UPDATE
  USING (false);

CREATE POLICY "audit_no_borrar"
  ON public.audit_log FOR DELETE
  USING (false);

-- 2. FUNCIÓN: Registrar automáticamente cambios en deposits
CREATE OR REPLACE FUNCTION public.log_deposit_changes()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.audit_log (user_id, action, resource, resource_id, old_data, new_data)
  VALUES (
    auth.uid(),
    CASE WHEN TG_OP = 'INSERT' THEN 'DEPOSIT_CREATED'
         WHEN TG_OP = 'UPDATE' THEN 'DEPOSIT_UPDATED'
         ELSE 'DEPOSIT_DELETED' END,
    'deposits',
    COALESCE(NEW.id, OLD.id),
    CASE WHEN TG_OP != 'INSERT' THEN to_jsonb(OLD) END,
    CASE WHEN TG_OP != 'DELETE' THEN to_jsonb(NEW) END
  );
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER audit_deposits
  AFTER INSERT OR UPDATE OR DELETE ON public.deposits
  FOR EACH ROW EXECUTE FUNCTION public.log_deposit_changes();

-- 3. FUNCIÓN: Registrar cambios de rol (prevenir escalación)
CREATE OR REPLACE FUNCTION public.log_role_changes()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.role IS DISTINCT FROM NEW.role THEN
    INSERT INTO public.audit_log (user_id, action, resource, resource_id, old_data, new_data)
    VALUES (
      auth.uid(),
      'ROLE_CHANGED',
      'profiles',
      NEW.id,
      jsonb_build_object('role', OLD.role::text),
      jsonb_build_object('role', NEW.role::text)
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER audit_role_changes
  AFTER UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.log_role_changes();

-- 4. BLOQUEAR auto-escalación de roles
CREATE OR REPLACE FUNCTION public.prevent_self_role_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.role IS DISTINCT FROM NEW.role AND auth.uid() = NEW.id THEN
    RAISE EXCEPTION 'No puedes cambiar tu propio rol';
  END IF;
  IF OLD.role IS DISTINCT FROM NEW.role AND public.get_my_role() != 'HEAD' THEN
    RAISE EXCEPTION 'Solo HEAD puede cambiar roles';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER block_self_role_escalation
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.prevent_self_role_change();
```

---

## 6. Protección del Frontend

### 6.1 Headers de Seguridad (Vite + Producción)

```typescript
// vite.config.ts — headers para desarrollo
export default defineConfig({
  server: {
    headers: {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
    }
  }
});
```

### 6.2 Sanitización de Inputs

```typescript
// shared/utils/sanitize.ts
import DOMPurify from 'dompurify';

export function sanitizeInput(input: string): string {
  return DOMPurify.sanitize(input, { ALLOWED_TAGS: [] });
}

// Usar en TODOS los formularios antes de enviar al backend
// Previene XSS, SQL Injection vía frontend
```

### 6.3 Protección Anti-Scraping y Bot

```typescript
// shared/utils/security.ts

// Detectar herramientas de desarrollo abiertas
export function detectDevTools(): boolean {
  const threshold = 160;
  return (
    window.outerWidth - window.innerWidth > threshold ||
    window.outerHeight - window.innerHeight > threshold
  );
}

// Rate limiting en el cliente (complementa el del servidor)
export class ClientRateLimiter {
  private attempts: Map<string, number[]> = new Map();

  canProceed(action: string, maxAttempts: number, windowMs: number): boolean {
    const now = Date.now();
    const history = this.attempts.get(action) || [];
    const recent = history.filter(t => now - t < windowMs);

    if (recent.length >= maxAttempts) return false;

    recent.push(now);
    this.attempts.set(action, recent);
    return true;
  }
}
```

---

## 7. API Security (Backend)

### 7.1 Rate Limiting por Endpoint

```typescript
// Configuración Fastify con @fastify/rate-limit
const rateLimits = {
  '/api/auth/login':        { max: 5,   timeWindow: '15 min' },
  '/api/auth/register':     { max: 3,   timeWindow: '1 hour' },
  '/api/trading/execute':   { max: 100, timeWindow: '1 min'  },
  '/api/wallet/withdraw':   { max: 3,   timeWindow: '1 hour' },
  '/api/admin/*':           { max: 50,  timeWindow: '1 min'  },
};
```

### 7.2 Validación de JWT en cada Request

```typescript
// middleware/auth.middleware.ts
async function verifyRequest(req: FastifyRequest) {
  const token = req.cookies['access_token']; // httpOnly cookie

  // 1. Verificar firma JWT
  const payload = jwt.verify(token, process.env.JWT_SECRET);

  // 2. Session Pinning: verificar que IP y UserAgent coincidan
  if (payload.ip !== req.ip || payload.ua !== req.headers['user-agent']) {
    throw new Error('SESSION_HIJACK_DETECTED');
  }

  // 3. Verificar que el usuario sigue activo (no suspendido)
  const profile = await supabase
    .from('profiles')
    .select('status')
    .eq('id', payload.sub)
    .single();

  if (profile.data?.status !== 'ACTIVE') {
    throw new Error('ACCOUNT_SUSPENDED');
  }
}
```

---

## 8. Monitoreo y Respuesta a Incidentes

### 8.1 Alertas en Tiempo Real

| Evento | Severidad | Acción Automática |
|---|---|---|
| 5 intentos de login fallidos | 🟡 MEDIA | Bloquear IP 30 min + notificar |
| Login desde país nuevo | 🟡 MEDIA | Email de verificación al usuario |
| Cambio de rol en DB | 🔴 ALTA | Notificar a HEAD inmediatamente |
| Retiro > $10,000 USD | 🔴 ALTA | Requiere aprobación manual del Head |
| Acceso al admin sin VPN | 🔴 CRÍTICA | Bloquear + alertar a todo el equipo |
| Múltiples sesiones simultáneas | 🟡 MEDIA | Cerrar sesión más antigua |
| Modificación de audit_log | 🔴 CRÍTICA | Imposible (RLS lo bloquea) |

### 8.2 Herramientas de Monitoreo Recomendadas

```
STACK DE SEGURIDAD:
─────────────────────────────────────────────
• Fail2Ban         → Bloqueo automático de IPs maliciosas
• CrowdSec         → WAF colaborativo (alternativa open-source a Cloudflare WAF)
• Grafana + Loki   → Dashboards de logs en tiempo real
• Sentry           → Errores de aplicación con contexto completo
• Uptime Kuma      → Monitoreo de disponibilidad (self-hosted)
• Supabase Logs    → Auditoría nativa de queries y auth events
```

---

## 9. Checklist de Seguridad — Implementación

### Fase 1: Inmediato (Esta semana)

- [ ] Configurar `.gitignore` para excluir TODOS los archivos sensibles
- [ ] Rotar la `SUPABASE_ANON_KEY` si fue expuesta en algún commit público
- [ ] Ejecutar el SQL de `audit_log` y triggers en Supabase
- [ ] Implementar `sanitizeInput()` en todos los formularios
- [ ] Activar 2FA para las cuentas de Supabase Dashboard del equipo
- [ ] Configurar HSTS y CSP headers en el despliegue

### Fase 2: Corto plazo (2 semanas)

- [ ] Configurar servidor WireGuard VPN
- [ ] Generar claves VPN para cada miembro del equipo
- [ ] Bloquear acceso al admin panel sin VPN (firewall rules)
- [ ] Implementar políticas de contraseñas en el frontend
- [ ] Configurar Fail2Ban en el servidor de producción
- [ ] Implementar rate limiting en todos los endpoints

### Fase 3: Medio plazo (1 mes)

- [ ] Configurar Grafana + Loki para monitoreo centralizado
- [ ] Implementar alertas automáticas (Telegram/Slack bot)
- [ ] Realizar primer penetration test (usar OWASP ZAP)
- [ ] Documentar plan de respuesta a incidentes
- [ ] Configurar backups cifrados automáticos (diarios)
- [ ] Implementar session pinning (IP + UserAgent)

### Fase 4: Continuo

- [ ] Auditoría de seguridad trimestral
- [ ] Rotación de secretos cada 90 días
- [ ] Revisión de logs de auditoría semanal (Head)
- [ ] Actualización de dependencias (Dependabot/Renovate)
- [ ] Simulacros de breach response cada 6 meses

---

## 10. Configuración de Firewall (Producción)

```bash
#!/bin/bash
# firewall_setup.sh — Ejecutar en el servidor de producción

# Resetear reglas
sudo ufw reset

# Política por defecto: DENEGAR TODO
sudo ufw default deny incoming
sudo ufw default allow outgoing

# Solo permitir lo esencial
sudo ufw allow 443/tcp    # HTTPS (TLS 1.3)
sudo ufw allow 51820/udp  # WireGuard VPN
sudo ufw allow from 10.0.0.0/24 to any port 22  # SSH SOLO desde VPN

# BLOQUEAR acceso directo a Postgres
sudo ufw deny 5432/tcp

# Activar
sudo ufw enable

echo "✅ Firewall configurado — Solo HTTPS + VPN + SSH(VPN)"
```

---

## 11. Gestión de Secretos en Producción

```
❌ NUNCA HACER:
  • Hardcodear API keys en el código fuente
  • Commitear .env a Git
  • Compartir secretos por WhatsApp/Telegram/Email
  • Usar la misma contraseña en múltiples servicios
  • Dar acceso SERVICE_ROLE_KEY a desarrolladores junior

✅ SIEMPRE HACER:
  • Usar variables de entorno del hosting (Vercel/Railway)
  • Rotar claves comprometidas INMEDIATAMENTE
  • Usar un password manager (1Password/Bitwarden) para el equipo
  • Principio de mínimo privilegio: cada persona solo accede a lo que necesita
  • Documentar quién tiene acceso a qué (Access Control Matrix)
```

---

*Documento de seguridad InvesPro v1.0 — Cumplimiento con estándares OWASP Top 10, GDPR Art. 32 y mejores prácticas de la industria fintech.*
