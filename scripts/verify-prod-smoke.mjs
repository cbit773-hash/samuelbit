#!/usr/bin/env node
/**
 * InvestPRO Lite — smoke prod (checklist estático + health opcional)
 * Uso: PROD_URL=https://... npm run verify:prod-smoke
 */
const prodUrl = process.env.PROD_URL ?? process.env.VITE_APP_URL ?? '';

const scenarios = [
  'Registro → onboarding RPC',
  'Depósito manual → aprobación CHIEF',
  'Primera operación live + margin call visible',
];

console.log('=== InvestPRO Lite — Smoke Prod ===\n');

if (!prodUrl) {
  console.log('PROD_URL no configurada. Checklist manual:');
  scenarios.forEach((s, i) => console.log(`  ${i + 1}. [ ] ${s}`));
  console.log('\nConfigura PROD_URL y repite para verificación HTTP básica.');
  process.exit(0);
}

try {
  const res = await fetch(prodUrl, { method: 'HEAD', redirect: 'follow' });
  console.log(`Frontend ${prodUrl} → HTTP ${res.status}`);
  if (!res.ok) {
    console.error('Smoke fallido: frontend no responde OK');
    process.exit(1);
  }
} catch (e) {
  console.error('Smoke fallido:', e instanceof Error ? e.message : e);
  process.exit(1);
}

console.log('\nChecklist manual en prod:');
scenarios.forEach((s, i) => console.log(`  ${i + 1}. [ ] ${s}`));
console.log('\n[verify:prod-smoke] Frontend accesible. Completa checklist operativo.');
