# 💳 PLAN DE PASARELA DE PAGOS — InvestPRO
## Billetera Real + Depósitos + Retiros

---

## 1. ARQUITECTURA DEL SISTEMA DE PAGOS

```
┌──────────────────────────────────────────────────────┐
│                     CLIENTE                           │
│  Dashboard → Wallet → "Depositar" / "Retirar"        │
└─────────────────────┬────────────────────────────────┘
                      │
          ┌───────────┼───────────┐
          ▼           ▼           ▼
   ┌──────────┐ ┌──────────┐ ┌────────────┐
   │  STRIPE  │ │NOWPAYMENTS│ │  MANUAL    │
   │ (Tarjeta)│ │  (Crypto) │ │(Transfer.) │
   └────┬─────┘ └─────┬────┘ └─────┬──────┘
        │             │            │
        ▼             ▼            ▼
┌──────────────────────────────────────────────────────┐
│  SUPABASE: tabla "transactions"                       │
│  status: pending → processing → completed             │
│  El CHIEF aprueba manualmente (o webhook automático) │
└─────────────────────┬────────────────────────────────┘
                      ▼
┌──────────────────────────────────────────────────────┐
│  SUPABASE: tabla "wallets"                            │
│  balance += net_amount (al aprobar)                   │
│  El cliente ve su saldo real en tiempo real            │
└──────────────────────────────────────────────────────┘
```

---

## 2. OPCIONES DE PASARELA

### 2.1 Opción A: Stripe (Tarjetas + Transferencias)

| Aspecto | Detalle |
|---------|---------|
| **Qué es** | Pasarela de pago líder mundial para tarjetas de crédito/débito |
| **Comisión** | 2.9% + $0.30 USD por transacción |
| **Monedas** | USD, EUR, MXN, COP, CLP, PEN |
| **Métodos** | Visa, Mastercard, AMEX, Apple Pay, Google Pay |
| **Integración** | Stripe Checkout (hosted) o Stripe Elements (embebido) |
| **Tiempo de setup** | 3-5 días (requiere verificación de negocio) |
| **Retiros** | Stripe envía a tu cuenta bancaria cada 2-7 días |
| **KYC requerido** | Sí — datos del negocio, ID del representante legal |

**Flujo Stripe:**
```
1. Cliente clica "Depositar con Tarjeta"
2. Frontend crea un Checkout Session via API
3. Cliente es redirigido a Stripe Checkout (página de pago segura)
4. Paga con tarjeta → Stripe procesa
5. Webhook de Stripe notifica a Supabase: "pago exitoso"
6. Se crea registro en "transactions" con status: completed
7. Wallet del cliente se actualiza automáticamente
```

### 2.2 Opción B: NOWPayments (Criptomonedas)

| Aspecto | Detalle |
|---------|---------|
| **Qué es** | Pasarela de pago crypto que acepta 150+ criptomonedas |
| **Comisión** | 0.5% por transacción |
| **Monedas** | BTC, ETH, USDT (TRC20/ERC20), USDC, SOL, BNB, etc. |
| **Integración** | API REST + Invoice URL (redirección) |
| **Tiempo de setup** | 1-2 días (registro + API key) |
| **Retiros** | A tu wallet crypto directamente (instantáneo) |
| **KYC requerido** | Mínimo — solo email y datos básicos |

**Flujo NOWPayments:**
```
1. Cliente clica "Depositar con Crypto"
2. Frontend crea un Invoice via NOWPayments API
3. NOWPayments genera dirección de pago + QR code
4. Cliente envía crypto a esa dirección
5. NOWPayments detecta el pago (confirmaciones blockchain)
6. Webhook notifica a Supabase: "pago confirmado"
7. Se actualiza transaction → completed → wallet balance++
```

### 2.3 Opción C: Depósito Manual (Transferencia Bancaria)

| Aspecto | Detalle |
|---------|---------|
| **Qué es** | El cliente transfiere a la cuenta bancaria de la empresa |
| **Comisión** | $0 (solo comisiones bancarias normales) |
| **Flujo** | Cliente transfiere → sube comprobante → CHIEF aprueba |
| **Tiempo** | 1-24 horas (depende de la aprobación manual) |
| **Integración** | Solo formulario + upload de comprobante |

**Flujo Manual:**
```
1. Cliente clica "Depositar por Transferencia"
2. Se le muestran los datos bancarios de la empresa
3. Realiza la transferencia desde su banco
4. Sube el comprobante (screenshot/PDF) en la plataforma
5. CHIEF recibe notificación → revisa → aprueba/rechaza
6. Al aprobar: wallet balance++ | Al rechazar: notificación al cliente
```

---

## 3. RECOMENDACIÓN: ESTRATEGIA DUAL (Crypto + Manual)

> [!IMPORTANT]
> **Para lanzar rápido sin complicaciones legales:**
> 1. **NOWPayments (Crypto)** — Setup en 1-2 días, sin KYC pesado, comisión mínima
> 2. **Transferencia Manual** — $0 de comisión, el CHIEF aprueba manualmente
>
> Agregar Stripe después cuando tengas la SAS constituida y cuenta bancaria empresarial.

### ¿Por qué Crypto primero?

| Ventaja | Detalle |
|---------|---------|
| Velocidad de setup | 1-2 días vs. 5-10 días de Stripe |
| Sin KYC del negocio | No necesitas SAS lista para empezar |
| Comisión bajísima | 0.5% vs 2.9% de Stripe |
| Pagos internacionales | Sin límites geográficos |
| Disponibilidad | 24/7/365 |
| LATAM-friendly | Muchos clientes en LATAM ya usan USDT |

---

## 4. SETUP DE NOWPAYMENTS (PASO A PASO)

### Paso 1: Crear Cuenta
1. Ir a [nowpayments.io](https://nowpayments.io)
2. Registrarse con email
3. Verificar email

### Paso 2: Obtener API Key
1. Dashboard → **API Keys** → Create New
2. Copiar la API Key
3. Agregarla al `.env` del proyecto:
```env
VITE_NOWPAYMENTS_API_KEY=tu_api_key_aqui
```

### Paso 3: Configurar Wallet de Recepción
1. Dashboard → **Store Settings** → Payout Wallet
2. Agregar tu dirección de USDT (TRC20) como wallet principal
3. Activar auto-conversion a USDT si quieres recibir todo en stablecoin

### Paso 4: Configurar Webhook (IPN)
1. Dashboard → **IPN** → Set URL
2. URL: `https://tu-dominio.com/api/webhooks/nowpayments`
3. O usar una Edge Function en Supabase

### Paso 5: Monedas Aceptadas (recomendadas)
- ✅ USDT (TRC20) — La más usada en LATAM
- ✅ Bitcoin (BTC) — La más conocida
- ✅ Ethereum (ETH) — Segunda más popular
- ✅ USDC — Stablecoin regulada

---

## 5. LO QUE YA ESTÁ IMPLEMENTADO ✅

### Base de Datos
- ✅ `supabase/wallet_schema.sql` — Tablas de wallets, transactions, crypto_addresses
- ✅ Trigger automático: al crear perfil CLIENT → se crea wallet
- ✅ RLS configurado por roles

### Servicios (TypeScript)
- ✅ `wallet.service.ts` — Todas las funciones CRUD:
  - `getMyWallet()` — Balance del cliente
  - `getMyTransactions()` — Historial
  - `createDepositRequest()` — Iniciar depósito
  - `createWithdrawalRequest()` — Solicitar retiro
  - `approveTransaction()` — CHIEF aprueba y acredita
  - `rejectTransaction()` — CHIEF rechaza

### Lo que FALTA por hacer
- 🔧 Componente UI de Wallet en ClientDashboard
- 🔧 Integración API de NOWPayments (crear invoices)
- 🔧 Webhook handler para confirmaciones automáticas
- 🔧 Formulario de retiro con validación de saldo
- 🔧 Panel de aprobación de transacciones para CHIEF

---

## 6. COSTOS OPERATIVOS

| Pasarela | Costo Fijo/mes | Comisión por Tx | Ejemplo: $500 USD |
|---------|---------------|----------------|-------------------|
| **NOWPayments** | $0 | 0.5% | $2.50 USD |
| **Stripe** | $0 | 2.9% + $0.30 | $14.80 USD |
| **Manual** | $0 | $0 | $0 |

### Proyección con 100 FTDs de $250 USD/mes
| Pasarela | Revenue | Comisiones | Neto |
|---------|---------|-----------|------|
| NOWPayments | $25,000 | $125 | $24,875 |
| Stripe | $25,000 | $1,480 | $23,520 |
| Manual | $25,000 | $0 | $25,000 |

---

*Documento de arquitectura de pagos — InvestPRO — Mayo 2026*
