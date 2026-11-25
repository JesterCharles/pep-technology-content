import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { check } from '../../../../containers-cicd/containers-and-compose/coding-lab/tests/lab.mjs';

const validRunbook = {
  'start-stack': 'docker compose up -d',
  'list-all-containers': 'docker compose ps -a',
  'why-did-api-exit': 'docker compose logs api',
  'follow-api-output': 'docker compose logs --follow api',
  'print-one-api-setting': 'docker compose exec api printenv SPRING_DATASOURCE_URL',
  'stop-keep-data': 'docker compose down',
  'stop-delete-data': 'docker compose down --volumes',
  'down-v-also-deletes': ['db-data'],
  'run-db-alone': 'docker run -d --env-file .env postgres:18',
};

function projectWith(overrides = {}) {
  const dir = mkdtempSync(path.join(os.tmpdir(), 'runbook-check-'));
  mkdirSync(path.join(dir, 'backend'));
  mkdirSync(path.join(dir, 'frontend'));
  writeFileSync(path.join(dir, 'backend/Dockerfile'), 'FROM scratch\n');
  writeFileSync(path.join(dir, 'frontend/Dockerfile'), 'FROM scratch\n');
  writeFileSync(path.join(dir, '.gitignore'), '.env\n');
  writeFileSync(path.join(dir, '.env'), 'POSTGRES_PASSWORD=local-only\n');
  writeFileSync(path.join(dir, 'compose.yaml'), 'services:\n  api:\n    environment:\n      SPRING_DATASOURCE_URL: jdbc:postgresql://db:5432/app\nvolumes:\n  db-data:\n');
  writeFileSync(path.join(dir, 'runbook.yaml'), Object.entries({ ...validRunbook, ...overrides })
    .map(([key, value]) => `${key}: ${JSON.stringify(value)}`).join('\n'));
  return dir;
}

function rejects(rule, key, commands) {
  for (const command of commands) {
    const dir = projectWith({ [key]: command });
    try { assert.notEqual(check(rule, dir), null, `${key} accepted: ${command}`); }
    finally { rmSync(dir, { recursive: true, force: true }); }
  }
}

rejects('runbook-lifecycle', 'start-stack', [
  'docker compose up -d --no-start',
  'docker compose --dry-run up -d',
  'docker compose up -d --exit-code-from api',
  'docker compose up -d --abort-on-container-exit',
  'docker compose up -d --abort-on-container-failure',
  'docker compose up -d --menu',
  'docker compose up -d --help',
  'docker compose up -d -h',
  'docker compose --help up -d',
]);
rejects('runbook-lifecycle', 'list-all-containers', [
  "docker compose ps -a --format '{{.Name}}'",
  'docker compose ps -a --filter status=exited',
  'docker compose --dry-run ps -a',
]);
rejects('runbook-lifecycle', 'list-all-containers', ['docker compose ps -a --help']);
rejects('runbook-lifecycle', 'stop-keep-data', ['docker compose --dry-run down', 'docker compose down --help']);
rejects('runbook-lifecycle', 'stop-delete-data', ['docker compose --dry-run down -v', 'docker compose down -v --help']);
rejects('runbook-logs', 'why-did-api-exit', [
  'docker compose logs --tail 0 api',
  'docker compose --dry-run logs api',
  'docker compose logs --help api',
]);
rejects('runbook-logs', 'follow-api-output', ['docker compose logs -f --help api']);
rejects('runbook-logs', 'follow-api-output', ['docker compose logs --tail=0 --follow api']);
rejects('runbook-exec', 'print-one-api-setting', ['docker compose --dry-run exec api printenv SPRING_DATASOURCE_URL', 'docker compose exec --help api printenv SPRING_DATASOURCE_URL']);
rejects('runbook-run-env', 'run-db-alone', [
  'docker run -d --env-file .env postgres:18 true',
  'docker run -d --env-file .env --entrypoint true postgres:18',
  'docker run -d --env-file .env --entrypoint false postgres:18',
  'docker run --help -d --env-file .env postgres:18',
  'docker run -d --env-file .env -e POSTGRES_PASSWORD postgres:18',
  'docker run -d --env-file .env --env=POSTGRES_PASSWORD=x postgres:18',
  'docker run -d --env-file .env -e POSTGRES_PASSWORD_FILE=/x postgres:18',
]);
{
  // Last --env-file wins: an earlier valid file must not hide a later file that overrides the password.
  const dir = projectWith({ 'run-db-alone': 'docker run -d --env-file .env --env-file late.env postgres:18' });
  writeFileSync(path.join(dir, 'late.env'), 'POSTGRES_PASSWORD=${FROM_HOST}\n');
  writeFileSync(path.join(dir, '.gitignore'), '.env\nlate.env\n');
  try { assert.notEqual(check('runbook-run-env', dir), null, 'later env file overriding the password was accepted'); }
  finally { rmSync(dir, { recursive: true, force: true }); }
}

const valid = projectWith({
  'list-all-containers': "podman compose ps --all --format 'table {{.Name}} {{.State}}'",
  'why-did-api-exit': 'podman compose logs --tail all api',
  'run-db-alone': 'podman container run --detach --env-file=.env docker.io/library/postgres:18-alpine',
});
try {
  for (const rule of ['runbook-lifecycle', 'runbook-logs', 'runbook-exec', 'runbook-run-env']) {
    assert.equal(check(rule, valid), null, rule);
  }
} finally {
  rmSync(valid, { recursive: true, force: true });
}

console.log('runbook command regressions passed');
