import { test } from 'node:test';
import assert from 'node:assert/strict';
import { check } from './lab.mjs';

test('runbook starts, lists and stops the stack, and names the volumes down -v also deletes', () => {
  const problem = check('runbook-lifecycle');
  assert.equal(problem, null, problem ?? undefined);
});

test('runbook reads the api service logs once and follows them', () => {
  const problem = check('runbook-logs');
  assert.equal(problem, null, problem ?? undefined);
});

test('runbook prints one non-secret api setting inside the running container', () => {
  const problem = check('runbook-exec');
  assert.equal(problem, null, problem ?? undefined);
});

test('runbook runs the database alone with its password from an env file, and no image holds it', () => {
  const problem = check('runbook-run-env');
  assert.equal(problem, null, problem ?? undefined);
});
