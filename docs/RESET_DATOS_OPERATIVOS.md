# Reset total de datos (empezar de cero)

## Cuándo usarlo

- Quieres **borrar todos los usuarios, leads, wallets y operaciones** para crear cuentas una por una desde `/registro` o el Dashboard de Auth.
- Entorno de prueba que quedó con datos demo o registros fallidos.

## Qué se borra

| Área | Tablas / recursos |
|------|-------------------|
| Auth | `auth.users`, `auth.identities` |
| Perfiles | `profiles`, `teams` |
| CRM | `leads`, `lead_registration_files`, `call_logs` |
| Wallet | `wallets`, `transactions`, `payment_events`, `crypto_addresses` |
| Trading | `positions`, `pending_orders` |
| CRM depósitos | `deposits` |
| KYC / alertas | `kyc_documents`, `notifications` |
| Storage | buckets `kyc-documents`, `lead-registrations`, `deposit-receipts` |

## Qué NO se borra

- Esquema, migraciones y RPCs (`complete_client_onboarding`, etc.)
- **`company_bank_accounts`** (cuentas bancarias de la empresa en Perú)

## Cómo ejecutar

1. Supabase Dashboard → **SQL Editor** → New query
2. Pegar y ejecutar el contenido de:
   [`supabase/scripts/reset_all_operational_data.sql`](../supabase/scripts/reset_all_operational_data.sql)
3. Revisar el resultado de verificación al final (todas las filas deben ser **0**)

### Si falla Storage con error 42501

Supabase bloquea `DELETE` directo en `storage.objects`. El script SQL ya incluye:

```sql
SELECT set_config('storage.allow_delete_query', 'true', true);
```

Si aún falla, vacía Storage con la API (añade `SUPABASE_SERVICE_ROLE_KEY` en `.env`):

```bash
node scripts/purge-storage-buckets.mjs
```

Luego vuelve a ejecutar el SQL **sin** el bloque 8 (Storage), o bórralo manualmente en Dashboard → Storage.

## Después del reset

1. Confirmar Auth: **Confirm email** desactivado ([`SUPABASE_AUTH_CHECKLIST.md`](SUPABASE_AUTH_CHECKLIST.md))
2. Primer cliente: **`/registro`**
3. Staff: Dashboard → Authentication → Add user + SQL de rol en [`GUIA_STAFF_AUTH.md`](GUIA_STAFF_AUTH.md)

## Advertencias

- **Irreversible** sin backup.
- **No ejecutar** [`supabase/seed_data.sql`](../supabase/seed_data.sql) si buscas solo datos reales; ese script inserta perfiles demo sin Auth.
- Si el script falla por FK, copia el mensaje de error: puede faltar una tabla nueva en el script (avísanos para actualizarlo).
