import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ignoreEntries } from './lab.mjs';

const missing = (rel, need) => { const have = new Set(ignoreEntries(rel)); return need.filter((n) => !have.has(n)); };

test('backend .dockerignore leaves out build output, version control and secrets', () => {
  const m = missing('backend/.dockerignore', ['target', '.git', '.env']);
  assert.deepEqual(m, [], 'backend/.dockerignore must list target, .git and .env');
});

test('frontend .dockerignore leaves out installed packages, build output, version control and secrets', () => {
  const m = missing('frontend/.dockerignore', ['node_modules', 'dist', '.git', '.env']);
  assert.deepEqual(m, [], 'frontend/.dockerignore must list node_modules, dist, .git and .env');
});
