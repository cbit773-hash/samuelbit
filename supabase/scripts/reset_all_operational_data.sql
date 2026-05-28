-- ============================================================
-- INVESPRO — RESET TOTAL DE DATOS OPERATIVOS
-- ============================================================
-- Borra usuarios Auth, perfiles, leads, wallets, trading, KYC,
-- notificaciones, llamadas y archivos en Storage.
--
-- NO borra: esquema, migraciones, RPCs, company_bank_accounts
-- (cuentas bancarias Perú de la empresa).
--
-- DÓNDE EJECUTAR: Supabase Dashboard → SQL Editor → Run
-- PERMISOS: requiere rol postgres (editor SQL del proyecto).
--
-- ⚠️ IRREVERSIBLE. Haz backup/export antes si lo necesitas.
-- ⚠️ NO ejecutar seed_data.sql después si quieres solo usuarios reales.
-- ============================================================

BEGIN;

-- ─── 1. Romper referencias circulares ───────────────────────
UPDATE public.teams SET floor_manager_id = NULL WHERE floor_manager_id IS NOT NULL;

UPDATE public.profiles
SET team_id = NULL,
    kyc_reviewed_by = NULL
WHERE team_id IS NOT NULL OR kyc_reviewed_by IS NOT NULL;

-- ─── 2. Pagos y wallet ──────────────────────────────────────
DELETE FROM public.payment_events;

DELETE FROM public.transactions;

DELETE FROM public.crypto_addresses;

DELETE FROM public.wallets;

-- ─── 3. Leads web y CRM ─────────────────────────────────────
DELETE FROM public.lead_registration_files;

DELETE FROM public.call_logs;

DELETE FROM public.leads;

-- ─── 4. Trading ─────────────────────────────────────────────
DELETE FROM public.pending_orders;

DELETE FROM public.positions;

-- ─── 5. Depósitos CRM (FTD manual, distinto de transactions) ─
DELETE FROM public.deposits;

-- ─── 6. KYC y notificaciones ────────────────────────────────
DELETE FROM public.kyc_documents;

DELETE FROM public.notifications;

-- ─── 7. Perfiles y mesas ────────────────────────────────────
DELETE FROM public.profiles;

DELETE FROM public.teams;

-- ─── 8. Storage (requiere flag interno; no usar DELETE directo sin esto) ─
SELECT set_config('storage.allow_delete_query', 'true', true);

DELETE FROM storage.objects
WHERE bucket_id IN (
  'kyc-documents',
  'lead-registrations',
  'deposit-receipts'
);

-- ─── 9. Supabase Auth (usuarios reales) ─────────────────────
-- Cascadeará sesiones/identities según configuración del proyecto.
DELETE FROM auth.identities;
DELETE FROM auth.users;

COMMIT;

-- ─── Verificación (debe devolver 0 en todo) ─────────────────
SELECT 'auth.users' AS tabla, COUNT(*)::int AS filas FROM auth.users
UNION ALL SELECT 'profiles', COUNT(*)::int FROM public.profiles
UNION ALL SELECT 'leads', COUNT(*)::int FROM public.leads
UNION ALL SELECT 'wallets', COUNT(*)::int FROM public.wallets
UNION ALL SELECT 'transactions', COUNT(*)::int FROM public.transactions
UNION ALL SELECT 'positions', COUNT(*)::int FROM public.positions
UNION ALL SELECT 'notifications', COUNT(*)::int FROM public.notifications
UNION ALL SELECT 'teams', COUNT(*)::int FROM public.teams
UNION ALL SELECT 'storage.objects', COUNT(*)::int FROM storage.objects
WHERE bucket_id IN ('kyc-documents', 'lead-registrations', 'deposit-receipts');

-- Siguiente paso: crear clientes en /registro o staff en Dashboard → Auth.
-- Ver docs/VERIFICACION_CLIENTE_REAL.md y docs/GUIA_STAFF_AUTH.md
