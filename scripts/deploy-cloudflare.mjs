#!/usr/bin/env node
/**
 * Build + deploy InvestPRO a Cloudflare Pages (Wrangler).
 * Requiere: wrangler login (OAuth) o CLOUDFLARE_API_TOKEN.
 */
import { spawnSync } from 'child_process';
import { applyEnvToProcess, projectRoot } from './load-env.mjs';

const env = applyEnvToProcess();
const projectName = process.env.CF_PAGES_PROJECT ?? 'investpro';
const defaultProdUrl = `https://${projectName}.pages.dev`;
const prodUrl =
  process.env.VITE_APP_URL && !process.env.VITE_APP_URL.includes('localhost')
    ? process.env.VITE_APP_URL
    : process.env.PROD_URL ?? defaultProdUrl;

if (!env.VITE_SUPABASE_URL || !env.VITE_SUPABASE_ANON_KEY) {
  console.error('Faltan VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY en .env');
  process.exit(1);
}

if (!process.env.VITE_APP_URL || process.env.VITE_APP_URL.includes('localhost')) {
  process.env.VITE_APP_URL = prodUrl;
  console.log(`VITE_APP_URL prod → ${prodUrl}`);
}

console.log('=== InvestPRO — Deploy Cloudflare Pages ===\n');
console.log('Proyecto:', projectName);
console.log('URL esperada:', prodUrl);
console.log('Supabase:', env.VITE_SUPABASE_URL);
console.log('');

const build = spawnSync('npm', ['run', 'build'], {
  cwd: projectRoot,
  stdio: 'inherit',
  shell: true,
  env: { ...process.env },
});

if (build.status !== 0) {
  process.exit(build.status ?? 1);
}

const deploy = spawnSync(
  'npx',
  ['wrangler', 'pages', 'deploy', 'dist', '--project-name', projectName, '--commit-dirty=true'],
  {
    cwd: projectRoot,
    stdio: 'inherit',
    shell: true,
    env: { ...process.env },
  },
);

if (deploy.status !== 0) {
  process.exit(deploy.status ?? 1);
}

console.log('\n[deploy:cloudflare] OK');
console.log('PROD_URL:', prodUrl);
console.log('Siguiente: Auth Supabase Site URL + Redirect URLs con esa URL, luego re-deploy si cambió el dominio.');
