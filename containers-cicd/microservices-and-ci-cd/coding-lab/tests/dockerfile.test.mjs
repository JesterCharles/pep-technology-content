import { test } from 'node:test';
import assert from 'node:assert/strict';
import { check } from './lab.mjs';

test('reviews Dockerfile starts the server the way the adding-FastAPI page says an image should', () => {
  const problem = check('reviews-listen');
  assert.equal(problem, null, problem ?? undefined);
});
