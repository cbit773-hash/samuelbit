#!/usr/bin/env node
/**
 * Build + deploy InvestPRO a Cloudflare Workers (cbit773.cbit773.workers.dev).
 * Config: wrangler.jsonc + @cloudflare/vite-plugin
 */
import { spawnSync } from 'child_process';
import { applyEnvToProcess, projectRoot } from './load-env.mjs';

const env = applyEnvToProcess();
const prodUrl = process.env.PROD_URL ?? 'https://cbit773.cbit773.workers.dev';

if (!env.VITE_SUPABASE_URL || !env.VITE_SUPABASE_ANON_KEY) {
  console.error('Faltan VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY en .env');
  process.exit(1);
}

if (!process.env.VITE_APP_URL || process.env.VITE_APP_URL.includes('localhost')) {
  process.env.VITE_APP_URL = prodUrl;
}

console.log('=== InvestPRO — Deploy Cloudflare Workers ===\n');
console.log('Worker: cbit773');
console.log('URL:', prodUrl);
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

const deploy = spawnSync('npx', ['wrangler', 'deploy'], {
  cwd: projectRoot,
  stdio: 'inherit',
  shell: true,
  env: { ...process.env },
});

if (deploy.status !== 0) {
  process.exit(deploy.status ?? 1);
}

console.log('\n[deploy] OK →', prodUrl);
