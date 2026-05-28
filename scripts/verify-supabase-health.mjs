/**
 * Verifica conexión Supabase y existencia de tablas/RPC críticos para registro cliente.
 * Uso: node scripts/verify-supabase-health.mjs
 * Requiere VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY en .env (cargados vía dotenv si está instalado)
 */
import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

function loadEnv() {
  const envPath = resolve(root, '.env');
  if (!existsSync(envPath)) return {};
  const text = readFileSync(envPath, 'utf8');
  const out = {};
  for (const line of text.split('\n')) {
    const m = line.match(/^([^#=]+)=(.*)$/);
    if (m) out[m[1].trim()] = m[2].trim();
  }
  return out;
}

const env = loadEnv();
const url = env.VITE_SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const key = env.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!url || !key) {
  console.error('Falta VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY en .env');
  process.exit(1);
}

const headers = {
  apikey: key,
  Authorization: `Bearer ${key}`,
  'Content-Type': 'application/json',
};

async function rest(path, opts = {}) {
  const res = await fetch(`${url}/rest/v1${path}`, { ...opts, headers: { ...headers, ...opts.headers } });
  return { ok: res.ok, status: res.status, body: await res.text() };
}

async function main() {
  console.log('Supabase:', url);

  const tables = ['profiles', 'wallets', 'leads', 'transactions', 'positions'];
  for (const t of tables) {
    const { status } = await rest(`/${t}?select=id&limit=1`);
    // 401/400 sin sesión JWT es normal con anon key
    const reachable = status !== 404;
    console.log(reachable ? '  OK' : '  FAIL', `tabla ${t}`, `(HTTP ${status}, requiere login para SELECT)`);
  }

  const rpcBodies = {
    complete_client_onboarding: { p_payload: {} },
    ensure_my_profile: {},
    get_auth_role: {},
  };
  for (const rpc of Object.keys(rpcBodies)) {
    const { status, body } = await fetch(`${url}/rest/v1/rpc/${rpc}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(rpcBodies[rpc]),
    }).then(async (res) => ({ status: res.status, body: await res.text() }));

    const exists = status !== 404;
    console.log(exists ? '  OK' : '  FAIL', `RPC ${rpc}`, exists ? `(callable: ${status})` : '(no encontrada)');
    if (!exists && body) console.log('    ', body.slice(0, 120));
  }

  if (!env.VITE_APP_URL) {
    console.warn('  WARN: VITE_APP_URL no definido en .env (necesario para reset password)');
  } else {
    console.log('  OK  VITE_APP_URL =', env.VITE_APP_URL);
  }

  console.log('\nDashboard manual: docs/SUPABASE_AUTH_CHECKLIST.md');
  console.log('Primer cliente: docs/VERIFICACION_CLIENTE_REAL.md');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
