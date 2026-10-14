import { test } from 'node:test';
import assert from 'node:assert/strict';
import { check } from './lab.mjs';

test('compose.yaml defines the api service built from ./backend and a postgres:18 db service', () => {
  const problem = check('compose-services');
  assert.equal(problem, null, problem ?? undefined);
});

test('compose.yaml keeps database data in a declared named volume', () => {
  const problem = check('compose-volume');
  assert.equal(problem, null, problem ?? undefined);
});

test('compose.yaml binds every published port to 127.0.0.1', () => {
  const problem = check('compose-ports');
  assert.equal(problem, null, problem ?? undefined);
});

test('both services get the database password from an existing local env file, never a literal', () => {
  const problem = check('compose-password');
  assert.equal(problem, null, problem ?? undefined);
});

test('local env files are ignored by Git and not tracked', () => {
  const problem = check('compose-envfiles');
  assert.equal(problem, null, problem ?? undefined);
});

test('api datasource URL uses the db service name, container port and database name', () => {
  const problem = check('compose-url');
  assert.equal(problem, null, problem ?? undefined);
});

test('db healthcheck runs pg_isready with the wired user and database, and api waits for service_healthy', () => {
  const problem = check('compose-health');
  assert.equal(problem, null, problem ?? undefined);
});
