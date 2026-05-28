/**
 * Vacía buckets de Storage vía API (alternativa si falla el SQL).
 * Requiere SUPABASE_SERVICE_ROLE_KEY en .env (no VITE_*).
 *
 * Uso: node scripts/purge-storage-buckets.mjs
 */
import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

function loadEnv() {
  const envPath = resolve(root, '.env');
  if (!existsSync(envPath)) return {};
  const out = {};
  for (const line of readFileSync(envPath, 'utf8').split('\n')) {
    const m = line.match(/^([^#=]+)=(.*)$/);
    if (m) out[m[1].trim()] = m[2].trim();
  }
  return out;
}

const env = loadEnv();
const url = env.VITE_SUPABASE_URL || env.SUPABASE_URL;
const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error('Falta VITE_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY en .env');
  console.error('Obtén service_role en: Supabase → Project Settings → API');
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const BUCKETS = ['kyc-documents', 'lead-registrations', 'deposit-receipts'];

async function listAllPaths(bucket) {
  const paths = [];
  const queue = [''];

  while (queue.length) {
    const prefix = queue.shift();
    const { data, error } = await supabase.storage.from(bucket).list(prefix || undefined, {
      limit: 1000,
    });
    if (error) throw new Error(`${bucket}/${prefix}: ${error.message}`);

    for (const item of data ?? []) {
      const full = prefix ? `${prefix}/${item.name}` : item.name;
      if (item.id === null) {
        queue.push(full);
      } else {
        paths.push(full);
      }
    }
  }
  return paths;
}

async function removeInChunks(bucket, paths) {
  const CHUNK = 1000;
  for (let i = 0; i < paths.length; i += CHUNK) {
    const slice = paths.slice(i, i + CHUNK);
    const { error } = await supabase.storage.from(bucket).remove(slice);
    if (error) throw new Error(`${bucket} remove: ${error.message}`);
    console.log(`  ${bucket}: borrados ${slice.length} archivos`);
  }
}

async function main() {
  for (const bucket of BUCKETS) {
    const paths = await listAllPaths(bucket);
    if (!paths.length) {
      console.log(`  ${bucket}: vacío`);
      continue;
    }
    await removeInChunks(bucket, paths);
  }
  console.log('Storage purgado.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
