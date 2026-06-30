#!/usr/bin/env node
import { spawnSync } from 'child_process';
import { applyEnvToProcess, projectRoot } from './load-env.mjs';

applyEnvToProcess();
spawnSync('node', ['scripts/configure-prod-auth.mjs'], {
  cwd: projectRoot,
  stdio: 'inherit',
  shell: true,
});
