/**
 * Verifica si la migración InvestPRO Lite está aplicada en Supabase remoto.
 */
import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

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
const url = env.VITE_SUPABASE_URL;
const key = env.SUPABASE_SERVICE_ROLE_KEY || env.VITE_SUPABASE_ANON_KEY;

if (!url || !key) {
  console.error('Falta VITE_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const headers = {
  apikey: key,
  Authorization: `Bearer ${key}`,
  'Content-Type': 'application/json',
};

const LITE_RPCS = [
  'chief_review_transaction',
  'staff_get_client_bundle',
  'staff_list_leads',
  'evaluate_position_brackets',
  'close_position_at_price',
];

async function checkRpc(name) {
  const res = await fetch(`${url}/rest/v1/rpc/${name}`, {
    method: 'POST',
    headers,
    body: JSON.stringify({}),
  });
  return res.status !== 404;
}

async function checkAuditLog() {
  const res = await fetch(`${url}/rest/v1/audit_log?select=id&limit=1`, { headers });
  return res.status !== 404 && res.status !== 406;
}

async function main() {
  console.log('Verificando migración lite en', url);
  const auditOk = await checkAuditLog();
  console.log(auditOk ? '  OK' : '  MISSING', 'tabla audit_log');

  for (const rpc of LITE_RPCS) {
    const ok = await checkRpc(rpc);
    console.log(ok ? '  OK' : '  MISSING', `RPC ${rpc}`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
