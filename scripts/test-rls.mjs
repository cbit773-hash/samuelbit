#!/usr/bin/env node
/**
 * InvestPRO Lite — verificación RLS mínima (smoke estático de políticas en repo)
 */
import { readFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const migrationsDir = join(root, 'supabase', 'migrations');

const requiredPatterns = [
  'profiles_own_row',
  'audit_log',
  'staff_get_client_bundle',
  'chief_review_transaction',
  'evaluate_position_brackets',
  'deposit-receipts',
];

const files = readdirSync(migrationsDir).filter((f) => f.endsWith('.sql'));
const sql = files.map((f) => readFileSync(join(migrationsDir, f), 'utf8')).join('\n');

const missing = requiredPatterns.filter((p) => !sql.includes(p));

if (missing.length > 0) {
  console.error('[test:rls] Faltan artefactos en migraciones:', missing.join(', '));
  process.exit(1);
}

console.log('[test:rls] OK — artefactos RLS/lite presentes en', files.length, 'migraciones');
