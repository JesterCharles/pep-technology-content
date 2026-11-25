import { test } from 'node:test';
import assert from 'node:assert/strict';
import { check } from './lab.mjs';

test('the workflow runs on pushes and pull requests', () => {
  const problem = check('ci-trigger');
  assert.equal(problem, null, problem ?? undefined);
});

test('the test job checks out the repository before it runs the tests', () => {
  const problem = check('ci-test-job');
  assert.equal(problem, null, problem ?? undefined);
});

test('the build job runs only after the test job succeeds', () => {
  const problem = check('ci-needs');
  assert.equal(problem, null, problem ?? undefined);
});

test('the image is built from the reviews folder and pushed only outside pull requests', () => {
  const problem = check('ci-build-push');
  assert.equal(problem, null, problem ?? undefined);
});

test('every action is pinned to a full commit SHA', () => {
  const problem = check('ci-pinned-actions');
  assert.equal(problem, null, problem ?? undefined);
});

test('the registry login takes both credentials from repository secrets, never literals', () => {
  const problem = check('ci-secret-refs');
  assert.equal(problem, null, problem ?? undefined);
});

test('no step prints a secret to the run log', () => {
  const problem = check('ci-no-secret-prints');
  assert.equal(problem, null, problem ?? undefined);
});

test('a permissions block gives GITHUB_TOKEN least access', () => {
  const problem = check('ci-permissions');
  assert.equal(problem, null, problem ?? undefined);
});
