import { test } from 'node:test';
import assert from 'node:assert/strict';
import { compose, env, envFiles, gitignored, trackedByGit } from './lab.mjs';

const services = () => compose().services || {};
const api = () => services().api;
const dbName = () => Object.keys(services()).find((k) => /^postgres:/.test(String(services()[k]?.image || '')));
const db = () => services()[dbName()];
const buildContext = (s) => String(typeof s?.build === 'string' ? s.build : s?.build?.context || '').replace(/^\.\//, '').replace(/\/$/, '');
const INTERP = /^\$\{[A-Za-z_][A-Za-z0-9_]*(?::?\?[^}]*)?\}$/;

test('compose.yaml defines the api service built from ./backend and a postgres:18 db service', () => {
  assert.equal(buildContext(api()), 'backend', 'add a service named api with build: ./backend');
  assert.ok(dbName() && /^postgres:18(\b|-|$)/.test(String(db().image)), 'add a database service with image: postgres:18');
});

test('compose.yaml keeps database data in a declared named volume', () => {
  const declared = Object.keys(compose().volumes || {});
  const mounts = (db()?.volumes || []).map((v) => (typeof v === 'string' ? { source: v.split(':')[0], target: v.split(':')[1] } : v));
  const ok = mounts.some((m) => declared.includes(m.source) && /^\/var\/lib\/postgresql\/?$/.test(m.target || ''));
  assert.ok(ok, 'mount a named volume at /var/lib/postgresql on the database service and declare it under the top-level volumes key');
});

test('compose.yaml binds every published port to 127.0.0.1', () => {
  const entries = Object.values(services()).flatMap((s) => s?.ports || []);
  const local = (p) => (typeof p === 'object' ? ['127.0.0.1', '::1'].includes(String(p.host_ip)) : /^(127\.0\.0\.1|\[::1\]):\d+:\d+/.test(String(p)));
  assert.ok((api()?.ports || []).length > 0, 'publish the api port so a browser on this machine can reach it');
  assert.ok(entries.every(local), 'every ports entry must name the host address 127.0.0.1, for example "127.0.0.1:8080:8080"');
});

test('compose.yaml takes the database password from ${VAR} or an env_file, never a literal', () => {
  const check = (svc, key) => {
    const v = env(svc)[key];
    if (v === undefined) return envFiles(svc).length > 0;
    return INTERP.test(String(v));
  };
  assert.ok(check(db(), 'POSTGRES_PASSWORD'), 'set POSTGRES_PASSWORD as ${DB_PASSWORD} (or through env_file), never as a literal value');
  assert.ok(check(api(), 'SPRING_DATASOURCE_PASSWORD'), 'set SPRING_DATASOURCE_PASSWORD as ${DB_PASSWORD} (or through env_file), never as a literal value');
});

test('the local env file is ignored by Git and not tracked', () => {
  const files = ['.env', ...Object.values(services()).flatMap(envFiles)];
  for (const f of [...new Set(files)]) {
    assert.ok(gitignored(f), `list ${f} in .gitignore so the local password file is never committed`);
    assert.ok(!trackedByGit(f), `${f} is tracked by Git: remove it with git rm --cached ${f}`);
  }
});

test('api datasource URL uses the db service name, not localhost', () => {
  const url = String(env(api()).SPRING_DATASOURCE_URL || '');
  const host = (url.match(/^jdbc:postgresql:\/\/([^:/]+)/) || [])[1];
  assert.ok(host && host === dbName(), 'set SPRING_DATASOURCE_URL to jdbc:postgresql://<db service name>:5432/<database>, not localhost');
});

test('db has a pg_isready healthcheck and api waits for service_healthy', () => {
  const t = db()?.healthcheck?.test;
  assert.ok(/pg_isready/.test(Array.isArray(t) ? t.join(' ') : String(t || '')), 'give the database service a healthcheck whose test runs pg_isready');
  const dep = api()?.depends_on;
  assert.ok(dep && !Array.isArray(dep) && dep[dbName()]?.condition === 'service_healthy', 'make api depend on the database with condition: service_healthy');
});
