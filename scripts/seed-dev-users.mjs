/**
 * Crea usuarios de desarrollo @investpro.com (un usuario por rol RBAC).
 * Uso: npm run seed:dev-users
 * Requiere: VITE_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY en .env
 */
import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

const DEV_PASSWORD = 'Dev2026!Inv';

const DEV_USERS = [
  { email: 'head@investpro.com', role: 'HEAD', full_name: 'Samuel Director' },
  { email: 'chief@investpro.com', role: 'CHIEF', full_name: 'Ana Ríos' },
  { email: 'manager@investpro.com', role: 'MANAGER', full_name: 'Roberto Mendoza' },
  { email: 'floormanager@investpro.com', role: 'FLOOR_MANAGER', full_name: 'Carlos Navarro' },
  { email: 'teamleader@investpro.com', role: 'TEAM_LEADER', full_name: 'Laura Gómez' },
  { email: 'agent@investpro.com', role: 'AGENT', full_name: 'Pedro Ruiz' },
  { email: 'client@investpro.com', role: 'CLIENT', full_name: 'Fernando Guzmán' },
];

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

async function findUserByEmail(admin, email) {
  let page = 1;
  const perPage = 200;
  while (true) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage });
    if (error) throw error;
    const users = data?.users ?? [];
    const found = users.find((u) => u.email?.toLowerCase() === email.toLowerCase());
    if (found) return found;
    if (users.length < perPage) return null;
    page += 1;
  }
}

/** Los perfiles se sincronizan vía trigger + SQL post-seed (service_role no tiene GRANT en profiles). */

async function seedUser(admin, { email, role, full_name }) {
  const metadata = { role, full_name };

  const { data: created, error: createError } = await admin.auth.admin.createUser({
    email,
    password: DEV_PASSWORD,
    email_confirm: true,
    user_metadata: metadata,
  });

  if (!createError) {
    return { status: 'created', email };
  }

  const msg = createError.message ?? '';
  const exists =
    createError.status === 422 ||
    msg.toLowerCase().includes('already') ||
    msg.toLowerCase().includes('registered');

  if (!exists) {
    return { status: 'error', email, message: msg };
  }

  const existing = await findUserByEmail(admin, email);
  if (!existing) {
    return { status: 'error', email, message: 'Usuario duplicado pero no encontrado en listUsers' };
  }

  const { error: updateError } = await admin.auth.admin.updateUserById(existing.id, {
    password: DEV_PASSWORD,
    email_confirm: true,
    user_metadata: { ...existing.user_metadata, ...metadata },
  });

  if (updateError) {
    return { status: 'error', email, message: updateError.message };
  }

  return { status: 'updated', email };
}

async function main() {
  const env = { ...loadEnv(), ...process.env };
  const url = env.VITE_SUPABASE_URL;
  const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    console.error('Falta VITE_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en .env');
    console.error('Ver docs/USUARIOS_PRUEBA_INVESTPRO.md');
    process.exit(1);
  }

  const admin = createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  console.log('Seed usuarios dev @investpro.com');
  console.log('Supabase:', url);
  console.log('Contraseña:', DEV_PASSWORD);
  console.log('');

  let ok = 0;
  let fail = 0;

  for (const user of DEV_USERS) {
    try {
      const result = await seedUser(admin, user);
      if (result.status === 'error') {
        console.log('  FAIL', user.email, '—', result.message);
        fail += 1;
      } else {
        console.log('  OK  ', user.email, `(${result.status}, rol ${user.role})`);
        ok += 1;
      }
    } catch (e) {
      console.log('  FAIL', user.email, '—', e.message ?? e);
      fail += 1;
    }
  }

  console.log('');
  console.log(`Listo: ${ok} OK, ${fail} errores`);
  console.log('Siguiente paso: npx supabase db query -f supabase/scripts/seed_dev_role_users_post.sql --linked');
  console.log('Documentación: docs/USUARIOS_PRUEBA_INVESTPRO.md');

  if (fail > 0) process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
