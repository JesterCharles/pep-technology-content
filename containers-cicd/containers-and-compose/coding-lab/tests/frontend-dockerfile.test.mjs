import { test } from 'node:test';
import assert from 'node:assert/strict';
import { dockerfile, copyFrom, copyArgs } from './lab.mjs';

const stages = () => dockerfile('frontend/Dockerfile');

test('frontend Dockerfile builds with Node and serves with nginx', () => {
  const s = stages();
  assert.ok(s.length >= 2 && s[0].name, 'frontend/Dockerfile needs a named Node build stage and an nginx stage');
  assert.ok(/^node:/.test(s[0].image), 'the build stage must start FROM a Node image, such as node:24-alpine');
  assert.ok(/^nginx:/.test(s.at(-1).image), 'the last stage must start FROM an nginx image, such as nginx:alpine');
  assert.ok(s[0].steps.some((x) => x.op === 'RUN' && /npm run build/.test(x.args)), 'the build stage must RUN npm run build');
});

test('frontend Dockerfile installs dependencies before copying the source', () => {
  const steps = stages()[0]?.steps ?? [];
  const pkg = steps.findIndex((x) => x.op === 'COPY' && /\bpackage\.json\b/.test(x.args) && /\bpackage-lock\.json\b/.test(x.args));
  const ci = steps.findIndex((x) => x.op === 'RUN' && /npm ci\b/.test(x.args));
  const all = steps.findIndex((x) => x.op === 'COPY' && /^\.\s/.test(copyArgs(x).join(' ')));
  assert.ok(pkg >= 0 && ci > pkg && all > ci, 'COPY package.json package-lock.json, RUN npm ci, then COPY . . in that order');
});

test('frontend nginx stage copies only dist from the build stage', () => {
  const s = stages();
  const copies = s.at(-1)?.steps.filter((x) => x.op === 'COPY' || x.op === 'ADD') ?? [];
  const ok = s.length >= 2 && copies.length > 0 && copies.every((x) => copyFrom(x) === s[0].name
    && /\/dist\/?$/.test(copyArgs(x)[0] ?? '') && /^\/usr\/share\/nginx\/html\/?$/.test(copyArgs(x)[1] ?? ''));
  assert.ok(ok, 'the nginx stage must copy only the build output: COPY --from=<build stage> /app/dist /usr/share/nginx/html');
});
