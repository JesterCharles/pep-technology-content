import { test } from 'node:test';
import assert from 'node:assert/strict';
import { check } from './lab.mjs';

test('backend .dockerignore leaves out build output, version control and secrets', () => {
  const problem = check('ignore-backend');
  assert.equal(problem, null, problem ?? undefined);
});

test('frontend .dockerignore leaves out installed packages, build output, version control and secrets', () => {
  const problem = check('ignore-frontend');
  assert.equal(problem, null, problem ?? undefined);
});
