#!/usr/bin/env node
/**
 * Imprime (o aplica con SUPABASE_ACCESS_TOKEN) URLs de Auth para prod.
 */
import { applyEnvToProcess } from './load-env.mjs';

const env = applyEnvToProcess();
const prodUrl =
  process.env.PROD_URL ??
  (env.VITE_APP_URL && !env.VITE_APP_URL.includes('localhost')
    ? env.VITE_APP_URL
    : 'https://cbit773.cbit773.workers.dev');

const siteUrl = prodUrl.replace(/\/$/, '');
const redirects = [
  `${siteUrl}/**`,
  `${siteUrl}/auth/restablecer`,
];

console.log('=== InvestPRO — Auth URL Configuration ===\n');
console.log('Dashboard: https://supabase.com/dashboard/project/rierlbcvpvfxkffxnyup/auth/url-configuration\n');
console.log('| Campo | Valor |');
console.log('|-------|-------|');
console.log(`| Site URL | \`${siteUrl}\` |`);
console.log('| Redirect URLs |');
for (const u of redirects) {
  console.log(`| | \`${u}\` |`);
}
console.log('\nConfirm email: DESACTIVADO (login inmediato tras /registro)');
console.log('Ver: docs/SUPABASE_AUTH_CHECKLIST.md\n');

const token = env.SUPABASE_ACCESS_TOKEN ?? process.env.SUPABASE_ACCESS_TOKEN;
if (!token) {
  console.log('Sin SUPABASE_ACCESS_TOKEN — configura manualmente en el Dashboard.');
  process.exit(0);
}

const res = await fetch(
  'https://api.supabase.com/v1/projects/rierlbcvpvfxkffxnyup/config/auth',
  {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      site_url: siteUrl,
      uri_allow_list: redirects.join(','),
    }),
  },
);

if (!res.ok) {
  const body = await res.text();
  console.error('PATCH auth config falló:', res.status, body);
  process.exit(1);
}

console.log('[configure-prod-auth] Auth URLs actualizadas vía Management API.');
