import { test } from 'node:test';
import assert from 'node:assert/strict';
import { check } from './lab.mjs';

test('frontend Dockerfile builds with Node and serves with nginx', () => {
  const problem = check('frontend-stages');
  assert.equal(problem, null, problem ?? undefined);
});

test('frontend Dockerfile installs dependencies before copying the source', () => {
  const problem = check('frontend-deps');
  assert.equal(problem, null, problem ?? undefined);
});

test('frontend nginx stage copies only the built dist folder', () => {
  const problem = check('frontend-dist');
  assert.equal(problem, null, problem ?? undefined);
});
