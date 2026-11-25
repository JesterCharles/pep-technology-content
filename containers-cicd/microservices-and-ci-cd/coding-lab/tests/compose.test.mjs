import { test } from 'node:test';
import assert from 'node:assert/strict';
import { check } from './lab.mjs';

test('compose.yaml adds the reviews service built from ./reviews', () => {
  const problem = check('compose-reviews-service');
  assert.equal(problem, null, problem ?? undefined);
});

test('reviews gets its own postgres:18 database with its own named volume', () => {
  const problem = check('compose-reviews-db');
  assert.equal(problem, null, problem ?? undefined);
});

test('reviews DATABASE_URL names its own database service, port and database, with its own password from .env', () => {
  const problem = check('compose-reviews-env');
  assert.equal(problem, null, problem ?? undefined);
});

test('reviews waits for its healthy database, which has a pg_isready healthcheck', () => {
  const problem = check('compose-reviews-depends');
  assert.equal(problem, null, problem ?? undefined);
});

test('reviews reaches the shop api by its service name through API_BASE_URL', () => {
  const problem = check('compose-api-base-url');
  assert.equal(problem, null, problem ?? undefined);
});

test('reviews publishes container port 8000 and every added port binds to 127.0.0.1', () => {
  const problem = check('compose-reviews-ports');
  assert.equal(problem, null, problem ?? undefined);
});
