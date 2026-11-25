import { test } from 'node:test';
import assert from 'node:assert/strict';
import { check } from './lab.mjs';

test('the monolith, microservices and database-per-service questions match the brief', () => {
  const problem = check('decide-architecture');
  assert.equal(problem, null, problem ?? undefined);
});

test('each dataset gets the store its access pattern asks for', () => {
  const problem = check('decide-data-stores');
  assert.equal(problem, null, problem ?? undefined);
});

test('the three store types are contrasted on schema, querying and consistency', () => {
  const problem = check('decide-store-contrast');
  assert.equal(problem, null, problem ?? undefined);
});

test('the gateway and discovery questions match the brief', () => {
  const problem = check('decide-gateway-discovery');
  assert.equal(problem, null, problem ?? undefined);
});

test('the listen-address and timeout questions match the service pages', () => {
  const problem = check('decide-service-calls');
  assert.equal(problem, null, problem ?? undefined);
});

test('the image reference and registry questions match the reading', () => {
  const problem = check('decide-image-reference');
  assert.equal(problem, null, problem ?? undefined);
});

test('the secrets-in-logs questions match the secrets page', () => {
  const problem = check('decide-secrets-in-logs');
  assert.equal(problem, null, problem ?? undefined);
});

test('the pipeline, Kubernetes and release-policy questions match the taught distinctions', () => {
  const problem = check('decide-delivery');
  assert.equal(problem, null, problem ?? undefined);
});
