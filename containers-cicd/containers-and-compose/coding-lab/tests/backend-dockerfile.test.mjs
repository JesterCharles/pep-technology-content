import { test } from 'node:test';
import assert from 'node:assert/strict';
import { check } from './lab.mjs';

test('backend Dockerfile has a named JDK build stage and a JRE runtime stage', () => {
  const problem = check('backend-stages');
  assert.equal(problem, null, problem ?? undefined);
});

test('backend Dockerfile downloads dependencies with go-offline before copying src, then packages', () => {
  const problem = check('backend-deps');
  assert.equal(problem, null, problem ?? undefined);
});

test('backend runtime stage copies only the packaged jar from the build stage', () => {
  const problem = check('backend-jar');
  assert.equal(problem, null, problem ?? undefined);
});

test('backend runtime stage starts the jar it copied', () => {
  const problem = check('backend-start');
  assert.equal(problem, null, problem ?? undefined);
});
