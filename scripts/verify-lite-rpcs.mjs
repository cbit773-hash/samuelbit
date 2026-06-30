/**
 * Verifica si la migración InvestPRO Lite está aplicada en Supabase remoto.
 * 404 = RPC no expuesta; 400/401/403 = existe (params o auth).
 */
import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

const NIL_UUID = '00000000-0000-0000-0000-000000000001';

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

/** Cuerpos mínimos con nombres de parámetro SQL (p_*) */
const LITE_RPCS = [
  { name: 'chief_review_transaction', body: { p_tx_id: NIL_UUID, p_action: 'approve' } },
  { name: 'staff_get_client_bundle', body: { p_client_id: NIL_UUID } },
  { name: 'staff_list_leads', body: {} },
  { name: 'evaluate_position_brackets', body: { p_symbol: 'BTCUSDT', p_price: 1 } },
  { name: 'close_position_at_price', body: { p_position_id: NIL_UUID, p_close_price: 1 } },
];

async function checkRpc(name, body) {
  const res = await fetch(`${url}/rest/v1/rpc/${name}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
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

  let allOk = auditOk;
  for (const { name, body } of LITE_RPCS) {
    const ok = await checkRpc(name, body);
    console.log(ok ? '  OK' : '  MISSING', `RPC ${name}`);
    if (!ok) allOk = false;
  }

  if (!allOk) process.exit(1);
  console.log('\n[verify-lite-rpcs] Migración lite verificada.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
