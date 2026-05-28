# Guía de pagos — Perú

## Cuentas empresa (configurar en producción)

Editar `src/shared/constants/peru-company.ts` y tabla `company_bank_accounts` con CCI reales.

| ID | Banco | Moneda | Uso |
|----|-------|--------|-----|
| bcp-pen | BCP | PEN | Clientes que transfieren en soles |
| interbank-usd | Interbank | USD | FTD en dólares |

## Flujo depósito manual (cliente)

1. Monto USD + equivalente PEN (referencial `VITE_PEN_USD_RATE`)
2. Pantalla CCI InvestPRO (copiar)
3. Transferencia desde banco del cliente
4. Subida de voucher → bucket `deposit-receipts`
5. CHIEF aprueba en dashboard

## Flujo retiro bancario

- Perfil de retiro en **Mi perfil** (`/dashboard/account?tab=perfil`) — aprobación CHIEF obligatoria
- CCI destino + titular obligatorios (desde perfil `approved` o formulario de retiro)
- Mínimo $50 USD
- SLA: 24-48h hábiles (Lima)

Ver [`GUIA_CLIENTE_MI_PERFIL.md`](GUIA_CLIENTE_MI_PERFIL.md).

## Conciliación CHIEF

| Campo | Validar |
|-------|---------|
| amount_pen_declared | Coherente con voucher |
| client_bank | Coincide con origen |
| receipt_path | Abrir signed URL |
| amount USD | Acreditar net_amount |

## Crypto (NOWPayments)

Sin cambio: cuenta sigue en USD. Ver `GUIA_NOWPAYMENTS.md`.
