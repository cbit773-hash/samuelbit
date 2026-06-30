import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

export function loadEnv() {
  const envPath = resolve(root, '.env');
  if (!existsSync(envPath)) return {};
  const out = {};
  for (const line of readFileSync(envPath, 'utf8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const m = trimmed.match(/^([^#=]+)=(.*)$/);
    if (m) out[m[1].trim()] = m[2].trim();
  }
  return out;
}

export function applyEnvToProcess(env = loadEnv()) {
  for (const [key, value] of Object.entries(env)) {
    if (value && process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
  return env;
}

export const projectRoot = root;
