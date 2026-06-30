#!/usr/bin/env node
/**
 * supabase db push vía pooler — evita 403 de Management API si falta acceso CLI.
 * Requiere SUPABASE_DB_PASSWORD en .env (Dashboard → Settings → Database).
 */
import { spawnSync } from 'child_process';
import { applyEnvToProcess, projectRoot } from './load-env.mjs';

const env = applyEnvToProcess();

if (!env.SUPABASE_DB_PASSWORD) {
  console.error(
    'Falta SUPABASE_DB_PASSWORD en .env\n' +
      'Obtener en: Supabase Dashboard → Project Settings → Database → Database password',
  );
  process.exit(1);
}

process.env.SUPABASE_DB_PASSWORD = env.SUPABASE_DB_PASSWORD;

const poolerUrl =
  env.SUPABASE_DB_URL ??
  'postgresql://postgres.rierlbcvpvfxkffxnyup@aws-1-us-east-2.pooler.supabase.com:5432/postgres';

console.log('=== InvestPRO — db push (pooler) ===\n');

const result = spawnSync(
  'npx',
  ['supabase', 'db', 'push', '--linked', '--password', env.SUPABASE_DB_PASSWORD],
  {
    cwd: projectRoot,
    stdio: 'inherit',
    shell: true,
    env: { ...process.env },
  },
);

if (result.status !== 0) {
  console.error('\nSi falla con 403, añade SUPABASE_ACCESS_TOKEN (cuenta dueña del proyecto) y ejecuta: npm run supabase:db-push');
  process.exit(result.status ?? 1);
}

console.log('\n[db:push:pooler] OK — ejecuta: node scripts/verify-lite-rpcs.mjs');
