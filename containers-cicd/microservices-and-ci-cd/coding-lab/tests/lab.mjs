// Shared readers and rule checks for the public lab tests. Most read files as
// text and YAML. Tests 24-26 run the reviews service against a stand-in shop api,
// and tests 6-7 run the workflow's secret-using steps with made-up secrets and a
// stand-in docker (see behavior.mjs). Nothing builds an image, starts a container
// or calls any network. Each rule returns null when the project satisfies it, or
// one stable message saying what is wrong.
import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { parse } from 'yaml';
import { serviceRun, secretSteps } from './behavior.mjs';

// The learner project: the starter folder, or LAB_PROJECT when set (for a copy elsewhere).
export const PROJECT = path.resolve(process.env.LAB_PROJECT || path.join(import.meta.dirname, '..', 'starter'));

const has = (dir, rel) => existsSync(path.join(dir, rel));
const read = (dir, rel) => (has(dir, rel) ? readFileSync(path.join(dir, rel), 'utf8') : '');

export const RULES = {};
// A rule that reads a YAML file first reports a parse error in that file, so a
// broken indent never shows up as "missing" content.
const rule = (id, yamlRel, fn) => {
  RULES[id] = (dir) => loadYaml(dir, yamlRel).error ?? fn(dir);
};

// ---------- shared YAML helpers ----------

function loadYaml(dir, rel) {
  if (!rel || !has(dir, rel)) return { doc: {}, error: null };
  try {
    const doc = parse(read(dir, rel));
    return { doc: doc && typeof doc === 'object' ? doc : {}, error: null };
  } catch (e) {
    const line = e?.linePos?.[0]?.line;
    return {
      doc: {},
      error: `${rel} is not valid YAML${line ? ` (the parser stops at line ${line})` : ''}: indent with spaces, never tabs, and when you uncomment a draft delete only the # at the start of each line`,
    };
  }
}
const yamlFile = (dir, rel) => loadYaml(dir, rel).doc;
export const compose = (dir) => yamlFile(dir, 'compose.yaml');
const services = (dir) => compose(dir).services || {};

export function env(service) {
  const e = service?.environment;
  if (Array.isArray(e)) {
    return Object.fromEntries(e.map((x) => { const t = String(x); const i = t.indexOf('='); return i < 0 ? [t, undefined] : [t.slice(0, i), t.slice(i + 1)]; }));
  }
  return e && typeof e === 'object' ? e : {};
}

// KEY=VALUE lines of an env file; comments and blank lines skipped, surrounding quotes removed.
export function envFileValues(dir, rel) {
  if (!has(dir, rel)) return null;
  const out = {};
  for (const line of read(dir, rel).split(/\r?\n/)) {
    const m = line.match(/^\s*(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*?)\s*$/);
    if (m) out[m[1]] = m[2].replace(/^(['"])(.*)\1$/, '$2');
  }
  return out;
}

// ${VAR} inside a longer string, resolved from .env; a literal passes through.
const INTERP = /^\$\{([A-Za-z_][A-Za-z0-9_]*)(?::?\?[^}]*)?\}$/;
function resolvedPart(dir, value) {
  const m = String(value ?? '').match(INTERP);
  if (!m) return /\$/.test(String(value ?? '')) ? { ok: false, why: 'interp' } : { ok: true, literal: true, value: String(value ?? '') };
  const dot = envFileValues(dir, '.env');
  return dot && dot[m[1]] ? { ok: true, value: dot[m[1]], name: m[1], from: '.env' } : { ok: false, why: 'missing-var', name: m[1] };
}

const buildContext = (s) => String(typeof s?.build === 'string' ? s.build : s?.build?.context || '').replace(/^\.\//, '').replace(/\/$/, '');
// The reviews service's own database: a postgres service other than the shop's db.
const reviewsDbName = (dir) => Object.keys(services(dir))
  .find((k) => k !== 'db' && /^postgres:/.test(String(services(dir)[k]?.image || '')));

// ---------- compose.yaml ----------

rule('compose-reviews-service', 'compose.yaml', (dir) => {
  const sv = services(dir);
  return buildContext(sv.reviews) === 'reviews'
    ? null : 'add a service named reviews with build: ./reviews, next to the provided api and db services';
});

rule('compose-reviews-db', 'compose.yaml', (dir) => {
  const name = reviewsDbName(dir);
  const sv = services(dir);
  if (!name || !/^postgres:18(\b|-|$)/.test(String(sv[name].image))) {
    return 'give reviews its own database: a second service from the postgres:18 image, separate from the shop\'s db';
  }
  const declared = Object.keys(compose(dir).volumes || {});
  const mounts = (sv[name]?.volumes || []).map((v) => (typeof v === 'string' ? { source: v.split(':')[0], target: v.split(':')[1] } : v));
  const dbMounts = (sv.db?.volumes || []).map((v) => (typeof v === 'string' ? v.split(':')[0] : v?.source));
  const own = mounts.find((m) => declared.includes(m.source) && /^\/var\/lib\/postgresql\/?$/.test(m.target || ''));
  return own && !dbMounts.includes(own.source)
    ? null : 'mount a named volume of its own at /var/lib/postgresql on the reviews database service and declare it under the top-level volumes key';
});

rule('compose-reviews-env', 'compose.yaml', (dir) => {
  const name = reviewsDbName(dir);
  const sv = services(dir);
  const url = String(env(sv.reviews).DATABASE_URL || '');
  const m = url.match(/^postgresql:\/\/([^:/@]+):([^@]+)@([^:/@]+)(?::(\d+))?\/([^?\s]+)$/);
  if (!m) return 'give reviews a DATABASE_URL of the form postgresql://USER:${...}@<its own db service>:5432/DBNAME';
  if (!name || m[3] !== name || m[3] === 'db') return 'the DATABASE_URL host must be the reviews database\'s own service name, never the shop\'s db and never localhost';
  if ((m[4] ?? '5432') !== '5432') return 'the DATABASE_URL port is the container port 5432, not a published host port';
  const pw = resolvedPart(dir, m[2]);
  if (pw.literal) return 'the password inside DATABASE_URL is a literal: use ${REVIEWS_DB_PASSWORD} filled from the local .env file';
  if (!pw.ok) return pw.why === 'missing-var' ? `DATABASE_URL uses \${${pw.name}}, but no .env file in the project sets ${pw.name}` : 'the password inside DATABASE_URL must be exactly one ${NAME} reference filled from .env';
  const shopPw = String(env(sv.db).POSTGRES_PASSWORD ?? '').match(INTERP)?.[1];
  if (shopPw && pw.name === shopPw) return `the reviews database reuses the shop's ${shopPw}: database-per-service gives it its own password variable, REVIEWS_DB_PASSWORD`;
  const dbPw = resolvedPart(dir, env(sv[name]).POSTGRES_PASSWORD);
  if (dbPw.literal) return 'POSTGRES_PASSWORD on the reviews database is a literal: use the same ${...} reference as DATABASE_URL';
  if (!dbPw.ok || dbPw.value !== pw.value) return 'the reviews database must receive the same password value that DATABASE_URL carries';
  const user = resolvedPart(dir, env(sv[name]).POSTGRES_USER ?? 'postgres');
  // The postgres image names the database after the user when POSTGRES_DB is not set.
  const dbName = env(sv[name]).POSTGRES_DB === undefined ? user : resolvedPart(dir, env(sv[name]).POSTGRES_DB);
  return dbName.ok && m[5] === dbName.value && user.ok && m[1] === user.value
    ? null : 'the DATABASE_URL user and database name must match the user and database the reviews database service creates';
});

rule('compose-reviews-depends', 'compose.yaml', (dir) => {
  const name = reviewsDbName(dir);
  const sv = services(dir);
  const t = name && sv[name]?.healthcheck?.test;
  const list = Array.isArray(t) ? t.map(String) : (t ? ['CMD-SHELL', String(t)] : []);
  const command = list.slice(1).join(' ');
  if (!['CMD', 'CMD-SHELL'].includes(list[0]) || !command.includes('pg_isready')) {
    return 'give the reviews database a healthcheck whose test runs pg_isready, as the db service already shows';
  }
  if (/(^|[^$])\$\{?POSTGRES_/.test(command)) {
    return 'in the healthcheck, write $${POSTGRES_USER} with two dollar signs: $$ lets the container expand the variable, while a single $ makes Compose substitute it from your shell or .env first';
  }
  const dep = sv.reviews?.depends_on;
  return dep && !Array.isArray(dep) && dep[name]?.condition === 'service_healthy'
    ? null : 'make reviews wait for its own database with depends_on and condition: service_healthy';
});

rule('compose-api-base-url', 'compose.yaml', (dir) => {
  return String(env(services(dir).reviews).API_BASE_URL || '') === 'http://api:8080'
    ? null : 'set API_BASE_URL on reviews to the api service name and its container port, never localhost or a published host port';
});

function portParts(p) {
  if (p && typeof p === 'object') return { host: String(p.host_ip ?? ''), target: String(p.target ?? '') };
  const parts = String(p).replace(/\/(tcp|udp)$/, '').split(':');
  if (parts.length === 3) return { host: parts[0], target: parts[2] };
  if (parts.length === 4 && parts[0].startsWith('[')) return { host: '[::1]', target: parts[3] };
  return { host: '', target: parts.at(-1) };
}
rule('compose-reviews-ports', 'compose.yaml', (dir) => {
  const sv = services(dir);
  const reviewsPorts = (sv.reviews?.ports || []).map(portParts);
  if (!reviewsPorts.length) return 'publish the reviews port so a browser on this machine can reach it';
  if (!reviewsPorts.some((p) => p.target === '8000')) return 'publish the reviews container port 8000, the port the service listens on inside its container';
  const added = [...reviewsPorts, ...(reviewsDbName(dir) ? (sv[reviewsDbName(dir)]?.ports || []).map(portParts) : [])];
  return added.every((p) => ['127.0.0.1', '::1', '[::1]'].includes(p.host))
    ? null : 'every ports entry you add must name the host address 127.0.0.1, for example "127.0.0.1:8000:8000"';
});

// ---------- reviews/Dockerfile ----------

function dockerfile(dir, rel) {
  const lines = read(dir, rel).replace(/\\\r?\n/g, ' ').split(/\r?\n/)
    .map((l) => l.trim()).filter((l) => l && !l.startsWith('#'));
  const stages = [];
  for (const line of lines) {
    const m = line.match(/^(\S+)\s*(.*)$/);
    const op = m[1].toUpperCase();
    if (op === 'FROM') { stages.push({ steps: [] }); continue; }
    if (stages.at(-1)) stages.at(-1).steps.push({ op, args: m[2] });
  }
  return stages;
}
function words(args) {
  const a = args.trim();
  if (a.startsWith('[')) {
    try { return { exec: true, list: JSON.parse(a).map(String) }; } catch { return { exec: true, list: [] }; }
  }
  return { exec: false, list: a.split(/\s+/).filter(Boolean) };
}
function hostOf(list) {
  for (let i = 0; i < list.length; i += 1) {
    if (list[i] === '--host') return list[i + 1] ?? '';
    if (list[i].startsWith('--host=')) return list[i].slice('--host='.length);
  }
  return null;
}

rule('reviews-listen', null, (dir) => {
  const s = dockerfile(dir, 'reviews/Dockerfile');
  const steps = s.length ? s.at(-1).steps : [];
  const entry = [...steps].reverse().find((x) => x.op === 'ENTRYPOINT');
  const cmd = [...steps].reverse().find((x) => x.op === 'CMD');
  if (!entry && !cmd) return 'start the server with a CMD or ENTRYPOINT instruction';
  // An exec-form ENTRYPOINT takes the CMD words as its arguments.
  const e = entry ? words(entry.args) : null;
  const w = e ? (e.exec && cmd ? [...e.list, ...words(cmd.args).list] : e.list) : words(cmd.args).list;
  const host = hostOf(w);
  if (w.includes('fastapi')) {
    if (w.includes('dev')) return 'the server still starts with fastapi dev: reread the adding-FastAPI page for the command an image should use, and why';
    if (!w.includes('run')) return 'start the FastAPI app with the fastapi command an image should use';
    return host === null || host === '0.0.0.0'
      ? null : `the server is told to listen on ${host}: reread the adding-FastAPI page on the address a server in a container must listen on`;
  }
  if (w.some((x) => /uvicorn/.test(x))) {
    if (host === '0.0.0.0') return null;
    return host === null
      ? 'uvicorn without --host uses its default address: reread the adding-FastAPI page on the address a server in a container must listen on'
      : `the server is told to listen on ${host}: reread the adding-FastAPI page on the address a server in a container must listen on`;
  }
  return 'start the FastAPI app with the fastapi command an image should use (or uvicorn with an explicit --host)';
});

// ---------- reviews/app/main.py (run, against a stand-in shop api) ----------

// Tests 24-26 load the service and send it requests (tests/service_behavior.py): a request
// with a token, one without, and three where the stand-in api fails. They judge what the
// service does, not how the code is written.
const FAILURES = {
  read_timeout: 'the shop api accepted the connection and then sent nothing (a read timeout)',
  connect_timeout: 'the shop api did not accept the connection in time (a connect timeout)',
  refused: 'the shop api refused the connection (HTTPX raises httpx.ConnectError)',
};
const seconds = (v) => (v === null || v === undefined ? 'no' : `a ${v}-second`);
// The service's requests to the shop api (its API_BASE_URL) in a scenario; other
// HTTPX requests it makes are answered too, but do not count as the call.
const shopCalls = (run, s) => (s?.outgoing ?? []).filter((o) => String(o.url).startsWith(run.api_base_url));
const firstCall = (run, s) => shopCalls(run, s)[0] ?? null;
const statusText = (s) => (s?.unhandled ? `500 (an exception escaped unhandled${s.error ? `: ${String(s.error).slice(0, 200)}` : ''})` : String(s?.status));
// Why no call reached the shop api, in this order: a request sent somewhere else, an
// exception the handler raised before any call, or no call at all (the fallback).
function noCall(run, s, when, fallback) {
  const other = (s?.outgoing ?? []).find((o) => !String(o.url).startsWith(run.api_base_url));
  if (other) return `${when}, the service sent its request to ${String(other.url).slice(0, 120)}, not to the shop api: build the URL from API_BASE_URL`;
  if (s?.unhandled && s.error) return `${when}, the handler raised ${String(s.error).slice(0, 200)} before calling the shop api: fix that error`;
  return `${when}, ${fallback}`;
}
const CASES = { read_timeout: 'read-timeout', connect_timeout: 'connect-timeout', refused: 'refused-connection' };

rule('reviews-timeouts', null, (dir) => {
  const run = serviceRun(dir);
  if (run.problem) return run.problem;
  const call = firstCall(run, run.with_token);
  if (!call) return noCall(run, run.with_token, 'for a request with an Authorization header', `the service answered ${statusText(run.with_token)} and made no HTTPX call to the shop api, so its limits could not be checked: call the api with httpx, as the starter does`);
  const t = call.timeout ?? {};
  if (t.connect === 2 && t.read === 3) return null;
  const all = ['connect', 'read', 'write', 'pool'];
  // No limits at all, or HTTPX's default: one message for both, so it answers no worksheet question.
  const unset = all.every((k) => t[k] === null || t[k] === undefined) || all.every((k) => t[k] === 5);
  if (unset) return 'the call to the shop api did not run with a 2-second connect limit and a 3-second read limit: reread the service-to-service page, then pass an httpx.Timeout with those limits as the call\'s timeout';
  return `the call to the shop api ran with ${seconds(t.connect)} connect limit and ${seconds(t.read)} read limit: pass an httpx.Timeout with a 2-second connect limit and a 3-second read limit`;
});

rule('reviews-auth-forward', null, (dir) => {
  const run = serviceRun(dir);
  if (run.problem) return run.problem;
  const call = firstCall(run, run.with_token);
  if (!call) return noCall(run, run.with_token, 'for a request with an Authorization header', `the service answered ${statusText(run.with_token)} and never called the shop api: make the call and send the caller's token on it`);
  if (call.authorization === null || call.authorization === undefined) return 'a request with an Authorization header reached the shop api with no Authorization header: send the caller\'s value on as the outgoing Authorization header';
  if (call.authorization !== run.token) return 'a request with an Authorization header reached the shop api with a different Authorization value: send the caller\'s own value on, not a fixed one';
  // A token written into the code travels with every request, whichever header carries it.
  for (const o of run.with_token.outgoing) {
    const fixed = Object.entries(o.headers ?? {}).find(([, v]) => /\bBearer\s+\S/i.test(String(v)) && !String(v).includes(run.token.slice(7)));
    if (fixed) return `a request also carries a fixed bearer token in its ${fixed[0]} header, which means a token is written into the code: delete it and send only the caller's token`;
  }
  const none = run.without_token;
  if (none.outgoing.length) return `a request with no Authorization header still reached the shop api (and got ${statusText(none)}): answer 401 before calling the api when no token arrived`;
  if (none.status === 422) return 'a request with no Authorization header got 422 (FastAPI\'s answer when a required header is missing), not 401: keep the header optional and answer 401 yourself when no token arrived';
  if (none.status !== 401) return `a request with no Authorization header got ${statusText(none)}, not 401: answer 401 when no token arrived`;
  return null;
});

rule('reviews-error-mapping', null, (dir) => {
  const run = serviceRun(dir);
  if (run.problem) return run.problem;
  const want = { read_timeout: ['504'], connect_timeout: ['504'], refused: ['502', '503'] };
  for (const [key, ok] of Object.entries(want)) {
    const s = run[key];
    const call = firstCall(run, s);
    if (!call) return noCall(run, s, `in test 26's ${CASES[key]} case`, `the service answered ${statusText(s)} and never called the shop api, so this case could not be checked: make the call to the shop api with httpx`);
    if (ok.includes(String(s.status))) continue;
    // A timeout case is only reported in detail for a call with the limits test 24 asks for set
    // (no limit for that phase, or HTTPX's default for all four, gets one neutral line instead).
    const lim = call.timeout ?? {};
    const phase = key === 'read_timeout' ? 'read' : 'connect';
    const defaults = ['connect', 'read', 'write', 'pool'].every((k) => lim[k] === 5);
    if (key !== 'refused' && (lim[phase] === null || lim[phase] === undefined || defaults)) return 'test 26 reports the detail of its timeout cases only for a call that carries the connect and read limits test 24 asks for: finish test 24, then run again';
    const page = key === 'refused' ? 'a status the service-to-service page allows for a refused connection' : 'the status the service-to-service page gives when no timely response arrived';
    // A timeout answered with a refused-connection status: either the codes are swapped or a broader handler ran first.
    const order = key !== 'refused' && ['502', '503'].includes(String(s.status))
      ? ' (Python runs the first except clause that matches, so check which handler caught it)' : '';
    return `when ${FAILURES[key]}, the service answered ${statusText(s)}: answer ${page}${order}`;
  }
  return null;
});

// ---------- .github/workflows/ci.yml ----------

const CI = '.github/workflows/ci.yml';
const workflow = (dir) => yamlFile(dir, CI);
const jobs = (dir) => workflow(dir).jobs || {};
const steps = (job) => (Array.isArray(job?.steps) ? job.steps : []);
const allSteps = (dir) => Object.values(jobs(dir)).flatMap((j) => steps(j).map((s) => ({ job: j, step: s })));

// A tiny evaluator for GitHub expressions over github.event_name / github.ref.
const RUNS = {
  'a pull request': { event_name: 'pull_request', ref: 'refs/pull/7/merge', ref_name: '7/merge' },
  'a push to main': { event_name: 'push', ref: 'refs/heads/main', ref_name: 'main' },
};
function evaluate(expr, ctx) {
  const src = String(expr).trim().replace(/^\$\{\{([\s\S]*)\}\}$/, '$1');
  const tokens = src.match(/'(?:[^']|'')*'|&&|\|\||==|!=|[!(),]|[A-Za-z_][\w.-]*|\S/g) || [];
  let k = 0;
  const peek = () => tokens[k];
  const take = (t) => { if (t && tokens[k] !== t) throw new Error('syntax'); return tokens[k++]; };
  function primary() {
    const t = take();
    if (t === undefined) throw new Error('syntax');
    if (t === '!') return !truthy(primary());
    if (t === '(') { const v = orExpr(); take(')'); return v; }
    if (t.startsWith("'")) return t.slice(1, -1).replace(/''/g, "'");
    if (t === 'true') return true;
    if (t === 'false') return false;
    if (/^(startsWith|endsWith|contains)$/i.test(t)) {
      take('('); const a = String(orExpr()); take(','); const b = String(orExpr()); take(')');
      const [x, y] = [a.toLowerCase(), b.toLowerCase()];
      return /^startsWith$/i.test(t) ? x.startsWith(y) : /^endsWith$/i.test(t) ? x.endsWith(y) : x.includes(y);
    }
    const m = t.match(/^github\.(event_name|ref|ref_name)$/);
    if (m) return ctx[m[1]];
    throw new Error(`unknown ${t}`);
  }
  const truthy = (v) => v !== false && v !== '' && v !== null && v !== undefined;
  function cmp() {
    let v = primary();
    while (peek() === '==' || peek() === '!=') {
      const op = take(); const r = primary();
      v = op === '==' ? String(v).toLowerCase() === String(r).toLowerCase() : String(v).toLowerCase() !== String(r).toLowerCase();
    }
    return v;
  }
  function andExpr() { let v = cmp(); while (peek() === '&&') { take(); const r = cmp(); v = truthy(v) ? r : v; } return v; }
  function orExpr() { let v = andExpr(); while (peek() === '||') { take(); const r = andExpr(); v = truthy(v) ? v : r; } return v; }
  const v = orExpr();
  if (k !== tokens.length) throw new Error('syntax');
  return truthy(v);
}
const runs = (cond, ctx) => (cond === undefined || cond === null ? true : typeof cond === 'boolean' ? cond : evaluate(cond, ctx));

function triggers(dir) {
  const on = workflow(dir).on;
  return typeof on === 'string' ? [on] : Array.isArray(on) ? on.map(String) : on && typeof on === 'object' ? Object.keys(on) : [];
}
rule('ci-trigger', CI, (dir) => {
  const t = triggers(dir);
  return t.includes('push') && t.includes('pull_request')
    ? null : 'the workflow must run for every pushed commit and for every pull request: reread the GitHub Actions pipeline page\'s on: block';
});

const isTestRun = (s) => /\bmvnw?\b[^\n]*\btest\b|\bnpm\b[^\n]*\btest\b|\bpytest\b/.test(String(s?.run ?? ''));
rule('ci-test-job', CI, (dir) => {
  const job = jobs(dir).test;
  if (!job || job['runs-on'] !== 'ubuntu-latest') return 'keep a test job with runs-on: ubuntu-latest';
  const list = steps(job);
  const checkout = list.findIndex((s) => /^actions\/checkout@\S+$/.test(String(s?.uses ?? '')));
  const tests = list.findIndex(isTestRun);
  if (tests < 0) return 'the test job must run the tests';
  if (checkout < 0) return 'the runner starts empty: the test job must get the repository\'s code before it can run the tests';
  return checkout < tests ? null : 'the checkout step comes after the test step, so the tests run on an empty runner: check out first';
});

rule('ci-needs', CI, (dir) => {
  const needs = jobs(dir).build?.needs;
  const list = Array.isArray(needs) ? needs.map(String) : needs ? [String(needs)] : [];
  return list.includes('test')
    ? null : 'the build job must run only after the test job succeeds: reread how the GitHub Actions pipeline page orders jobs';
});

rule('ci-build-push', CI, (dir) => {
  const job = jobs(dir).build;
  const step = steps(job).find((s) => /^docker\/build-push-action@\S+$/.test(String(s?.uses ?? '')));
  if (!step || !step.with) return 'build the image with a docker/build-push-action step in the build job';
  const context = String(step.with.context ?? '').replace(/^\.\//, '').replace(/\/$/, '');
  if (context !== 'reviews') return 'the build context must be the folder that holds the reviews Dockerfile, so the image the step tags is the reviews service';
  const result = {};
  try {
    for (const [name, ctx] of Object.entries(RUNS)) {
      const push = step.with.push;
      const pushes = push === undefined ? false : typeof push === 'boolean' ? push : String(push).trim() === 'true' ? true : String(push).trim() === 'false' ? false : evaluate(push, ctx);
      result[name] = runs(job.if, ctx) && runs(step.if, ctx) && pushes;
    }
  } catch {
    return 'write the push condition as an expression on github.event_name or github.ref, for example the one on the GitHub Actions pipeline page';
  }
  if (result['a pull request']) {
    return triggers(dir).includes('pull_request')
      ? 'as written, a pull request run would push an image: push must be off for pull requests'
      : 'once the workflow also runs on pull requests (test 1), this push setting would push their images too: push must be off for pull requests';
  }
  return result['a push to main']
    ? null : 'as written, a push to main never publishes the image: push must be on for a push to main';
});

// Tests 6 and 7 run the workflow's secret-using steps and every docker login step
// (tests/behavior.mjs) with made-up secret values and a stand-in docker, then judge what
// docker received and what reached the run log.
const loginSteps = (dir) => allSteps(dir).filter(({ step }) => /\bdocker\b[\s\S]*\blogin\b/.test(String(step?.run ?? '')) || /^docker\/login-action@/.test(String(step?.uses ?? '')));
const ARG_PASSWORD = /^(-p|--password)(=|$)|^-p./;
function optionValue(args, short, long) {
  for (let i = 0; i < args.length; i += 1) {
    if (args[i] === short || args[i] === long) return args[i + 1] ?? '';
    if (args[i].startsWith(`${long}=`)) return args[i].slice(long.length + 1);
    // -uNAME and -u=NAME both work for docker's short options.
    if (args[i].startsWith(short) && args[i].length > short.length && !args[i].startsWith('--')) return args[i].slice(short.length).replace(/^=/, '');
  }
  return null;
}

rule('ci-secret-refs', CI, (dir) => {
  const logins = loginSteps(dir);
  if (!logins.length) return 'keep a registry login step in the build job, signed in with the REGISTRY_USERNAME and REGISTRY_PASSWORD repository secrets';
  for (const { step } of logins.filter(({ step }) => step.uses)) {
    const ok = /secrets\.REGISTRY_USERNAME/.test(String(step.with?.username ?? '')) && /secrets\.REGISTRY_PASSWORD/.test(String(step.with?.password ?? ''));
    if (!ok) return 'the login action\'s username and password must come from the REGISTRY_USERNAME and REGISTRY_PASSWORD repository secrets: Docker Hub is not GitHub, so GITHUB_TOKEN cannot sign in there';
  }
  for (const { job, step } of logins.filter(({ step }) => step.run !== undefined)) {
    // ${{ env.NAME }} of a secret-mapped variable is filled in before the shell runs, just like ${{ secrets.NAME }}.
    const secretEnv = [workflow(dir).env, job?.env, step.env].flatMap((s) => Object.entries(s && typeof s === 'object' ? s : {}))
      .filter(([, v]) => /\$\{\{[^}]*\bsecrets\b/.test(String(v))).map(([k]) => k);
    const envExpr = secretEnv.some((k) => new RegExp(`\\$\\{\\{\\s*env\\s*(\\.\\s*${k}\\b|\\[\\s*'${k}'\\s*\\])`).test(String(step.run)));
    if (envExpr || /\$\{\{[^}]*\bsecrets\b/.test(String(step.run))) return 'the login command writes a ${{ ... }} expression for a secret into the script text, which puts the secret itself into the script: map each secret into the step\'s env and use the shell variable, as the secrets page shows';
  }
  const ran = secretSteps(dir, workflow(dir));
  if (ran.problem) return ran.problem;
  for (const s of ran.steps.filter((x) => x.login)) {
    if (s.problem) return s.problem;
    const call = s.docker.find((d) => d.args.includes('login'));
    if (!call) {
      const last = s.log.trim().split('\n').at(-1) ?? '';
      return s.status === 0
        ? `the step "${s.name}" ran but never called docker login`
        : `the step "${s.name}" stopped (exit status ${s.status}) before docker login ran${last ? `: ${last.slice(0, 160)}` : ''}`;
    }
    if (call.args.some((a) => ARG_PASSWORD.test(a))) return 'a password is given on the docker login command line (-p or --password), where it lands in process lists and the log: pipe it to --password-stdin from a repository secret';
    if (!call.args.includes('--password-stdin')) return 'feed the password to docker login through --password-stdin';
    const user = optionValue(call.args, '-u', '--username');
    if (user !== ran.secrets.REGISTRY_USERNAME) return `docker login was given ${user ? 'a username that is not' : 'no username, not'} the value of secrets.REGISTRY_USERNAME: map that secret into the step's env and pass it with -u`;
    const stdin = (call.stdin ?? '').replace(/\r?\n$/, '');
    if (stdin !== ran.secrets.REGISTRY_PASSWORD) return stdin === '' ? 'docker login received nothing on its standard input: pipe the REGISTRY_PASSWORD secret into it' : 'docker login received a password on its standard input that is not the value of secrets.REGISTRY_PASSWORD: pipe that secret, from the step\'s env, into it';
    if (s.status !== 0) {
      const last = s.log.trim().split('\n').at(-1) ?? '';
      return `the step "${s.name}" exited with status ${s.status} (bash -e stops the step at the first failing command)${last ? `; its last output line: ${last.slice(0, 160)}` : ''}`;
    }
  }
  return null;
});

rule('ci-pinned-actions', CI, (dir) => {
  const all = allSteps(dir).map(({ step }) => String(step?.uses ?? '')).filter(Boolean);
  if (!all.length) return 'the workflow has no uses: steps yet; add them, each pinned to a full commit SHA';
  for (const uses of all) {
    if (uses.startsWith('./')) continue;
    if (!/^[^@]+@[0-9a-f]{40}$/.test(uses)) {
      return `${uses.split('@')[0]} is not pinned: a branch or version tag can change under you, so pin every action to its full 40-character commit SHA and keep the release tag in a trailing comment`;
    }
  }
  return null;
});

// The hex digits of a dump, line by line: an optional offset column ("00000010:") is
// dropped, and so is a text column after a double space (xxd's default layout).
function hexStream(text) {
  return text.split('\n').map((l) => {
    const m = l.match(/^\s*(?:[0-9a-fA-F]+:\s+)?((?:[0-9a-fA-F]{2,} ?)+)/);
    return m ? m[1].replace(/ /g, '') : '';
  }).join('').toLowerCase();
}
// What a run log would show of each made-up secret: as is, or base64 or hex encoded,
// also when the encoded form is wrapped over several lines.
function leaks(log, secrets) {
  // A line that starts with ::add-mask:: registers a value for masking (the secrets page's
  // way to hide a derived value); the runner does not print it.
  const text = log.split('\n').filter((l) => !/^\s*::add-mask::/.test(l)).join('\n');
  const joined = text.replace(/\s+/g, '');
  const hex = hexStream(text);
  for (const [name, value] of Object.entries(secrets)) {
    if (text.includes(value) || joined.includes(value)) return { name, how: '' };
    const encoded = (enc) => [value, `${value}\n`].map((v) => Buffer.from(v).toString(enc));
    if (encoded('base64').some((f) => joined.includes(f))) return { name, how: ' base64-encoded' };
    if (encoded('hex').some((f) => hex.includes(f) || joined.toLowerCase().includes(f))) return { name, how: ' hex-encoded' };
  }
  return null;
}
rule('ci-no-secret-prints', CI, (dir) => {
  const ran = secretSteps(dir, workflow(dir));
  if (ran.problem) return ran.problem;
  for (const s of ran.steps) {
    if (s.problem) return s.problem;
    const leak = leaks(s.log, ran.secrets);
    if (leak) return `the step "${s.name}" wrote the value of secrets.${leak.name}${leak.how} to the run log: reread the secrets page on why a workflow never prints one, and delete that output`;
  }
  return null;
});

function leastAccess(p) {
  if (typeof p === 'string') return `permissions: ${p} is not least access: list each permission the workflow needs as key: value, starting with contents`;
  if (!p || typeof p !== 'object') return 'add a permissions block so GITHUB_TOKEN gets the least access this workflow needs';
  if (p.contents !== 'read') return 'this workflow only reads the repository\'s code: give GITHUB_TOKEN that read access, as the secrets page\'s least-access rule says';
  return Object.entries(p).every(([k, v]) => k === 'contents' || v === 'none')
    ? null : 'grant GITHUB_TOKEN nothing beyond reading the code: the Docker Hub login uses stored secrets, not GITHUB_TOKEN, and anything you do not list becomes none';
}
rule('ci-permissions', CI, (dir) => {
  const top = workflow(dir).permissions;
  const all = Object.values(jobs(dir));
  const has = (p) => p !== undefined && p !== null;
  if (has(top)) {
    // A job-level block replaces the top-level one for that job, so each must also be least access.
    for (const p of [top, ...all.map((j) => j?.permissions).filter(has)]) {
      const problem = leastAccess(p);
      if (problem) return problem;
    }
    return null;
  }
  // Without a top-level block, every job must carry its own.
  if (!all.length || all.some((j) => !has(j?.permissions))) {
    return 'add a top-level permissions block, as the secrets page shows, so GITHUB_TOKEN gets the least access this workflow needs';
  }
  for (const j of all) {
    const problem = leastAccess(j.permissions);
    if (problem) return problem;
  }
  return null;
});

// ---------- decisions.yaml ----------

const DECISIONS = 'decisions.yaml';
const decisions = (dir) => yamlFile(dir, DECISIONS);
const whyOk = (section) => String(section?.why ?? '').trim().length >= 20;
// The first field whose value differs from the expected one, as a reread hint.
function firstWrong(section, expected, hints) {
  for (const [field, value] of Object.entries(expected)) {
    if (String(section?.[field] ?? '').trim() !== value) return `${field}: ${hints[field]}`;
  }
  return null;
}

rule('decide-architecture', DECISIONS, (dir) => {
  const d = decisions(dir).architecture || {};
  return firstWrong(d, {
    redeploys_everything_for_one_change: 'monolith',
    keeps_a_reviews_crash_away_from_checkout: 'microservices',
    scales_only_the_busy_part: 'microservices',
    cost_in_the_brief: 'operational-overhead',
    reviews_reading_shop_tables_directly: 'forbidden',
  }, {
    redeploys_everything_for_one_change: 'reread incident 2 in the brief and the monolith page\'s deployment question',
    keeps_a_reviews_crash_away_from_checkout: 'reread incident 1 and what the page says fails together',
    scales_only_the_busy_part: 'reread incident 3 and what the page says can be scaled alone',
    cost_in_the_brief: 'reread the two first-week problems and match them to one of the page\'s three costs',
    reviews_reading_shop_tables_directly: 'reread the database-per-service rule on the monolith page',
  }) ?? (whyOk(d) ? null : 'write at least a sentence of your own reasoning in architecture.why');
});

rule('decide-data-stores', DECISIONS, (dir) => {
  const d = decisions(dir).data_stores || {};
  return firstWrong(d, {
    request_counters: 'key-value',
    order_history: 'relational',
    review_bodies: 'document',
    different_store_types_are_enabled_by: 'database-per-service',
  }, {
    request_counters: 'reread how the brief says these are read and written, then the SQL vs NoSQL page',
    order_history: 'reread how the brief says these are read and written, then the SQL vs NoSQL page',
    review_bodies: 'reread how the brief says these are read and written, then the SQL vs NoSQL page',
    different_store_types_are_enabled_by: 'reread the SQL vs NoSQL page\'s side effect of one taught pattern',
  }) ?? (whyOk(d) ? null : 'write at least a sentence of your own reasoning in data_stores.why');
});

rule('decide-store-contrast', DECISIONS, (dir) => {
  const d = decisions(dir).store_contrast || {};
  const want = {
    schema: { relational: 'declared-up-front', document: 'flexible-per-record', key_value: 'none-for-the-value' },
    querying: { relational: 'rich-sql-with-joins', document: 'by-fields-inside-a-record', key_value: 'get-and-put-by-key' },
    consistency: { relational: 'acid-across-rows', document: 'often-narrower-transaction-scope', key_value: 'varies-with-simple-operations' },
  };
  for (const [question, stores] of Object.entries(want)) {
    for (const [store, value] of Object.entries(stores)) {
      if (String(d[question]?.[store] ?? '').trim() !== value) return `store_contrast.${question}.${store}: reread the SQL vs NoSQL page's comparison of the three store types on ${question}`;
    }
  }
  return null;
});

rule('decide-gateway-discovery', DECISIONS, (dir) => {
  const d = decisions(dir).gateway_and_discovery || {};
  return firstWrong(d, {
    shared_concern_at_gateway: 'authentication',
    discovery_setup_a: 'client-side-discovery',
    discovery_setup_b: 'server-side-discovery',
    compose_service_names_are: 'a-simple-form-of-service-discovery',
  }, {
    shared_concern_at_gateway: 'reread what the brief wants done once, before any service is reached',
    discovery_setup_a: 'reread setup A and ask who talks to the registry',
    discovery_setup_b: 'reread setup B and ask who talks to the registry',
    compose_service_names_are: 'a stable name resolved by DNS to a changing address: reread the last part of the gateways page',
  }) ?? (whyOk(d) ? null : 'write at least a sentence of your own reasoning in gateway_and_discovery.why');
});

rule('decide-service-calls', DECISIONS, (dir) => {
  const d = decisions(dir).service_calls || {};
  return firstWrong(d, {
    listening_on_127_0_0_1: 'only-processes-in-the-same-container',
    httpx_with_no_timeout_argument: 'stops-after-about-five-seconds',
    httpx_with_timeout_none: 'waits-with-no-limit',
    restclient_with_nothing_set: 'waits-with-no-limit',
    restclient_read_limit_is_set_on: 'the-request-factory',
  }, {
    listening_on_127_0_0_1: 'reread the adding-FastAPI page on the two listen addresses',
    httpx_with_no_timeout_argument: 'reread the service-to-service page on HTTPX\'s documented default',
    httpx_with_timeout_none: 'reread what timeout=None does on the service-to-service page',
    restclient_with_nothing_set: 'reread the service-to-service page on a JDK-backed RestClient with nothing set',
    restclient_read_limit_is_set_on: 'reread the RestClient example on the service-to-service page',
  });
});

rule('decide-image-reference', DECISIONS, (dir) => {
  const d = decisions(dir).image_reference || {};
  return firstWrong(d, {
    registry: 'docker.io',
    repository: 'pepshop/reviews',
    tag: '1.4.2',
    short_reference_registry: 'docker.io',
    short_reference_tag: 'latest',
    a_registry_stores: 'images-in-repositories',
  }, {
    registry: 'split the pushed reference in fixtures/briefs/image-reference.txt as the Jenkins, registries, CD and Kubernetes reading shows',
    repository: 'split the pushed reference in fixtures/briefs/image-reference.txt as the reading shows',
    tag: 'split the pushed reference in fixtures/briefs/image-reference.txt as the reading shows',
    short_reference_registry: 'reread what Docker assumes when a reference leaves out the registry',
    short_reference_tag: 'reread what Docker assumes when a reference leaves out the tag',
    a_registry_stores: 'reread the reading\'s first sentence about registries',
  });
});

rule('decide-secrets-in-logs', DECISIONS, (dir) => {
  const d = decisions(dir).secrets_in_logs || {};
  return firstWrong(d, {
    log_redaction_is: 'best-effort',
    hide_a_derived_value_by: 'register-it-with-add-mask',
    fork_pull_request_run_receives: 'only-github-token',
  }, {
    log_redaction_is: 'reread how the secrets page describes GitHub\'s redaction',
    hide_a_derived_value_by: 'reread how the secrets page hides a value derived from a secret',
    fork_pull_request_run_receives: 'reread the secrets page on runs triggered from a fork',
  });
});

rule('decide-delivery', DECISIONS, (dir) => {
  const d = decisions(dir).delivery || {};
  return firstWrong(d, {
    github_actions_jobs_run: 'in-parallel-unless-needs',
    jenkinsfile_stages_run: 'in-listed-order',
    gives_pods_one_stable_address: 'service',
    keeps_three_replicas_running: 'deployment',
    release_policy_in_the_brief_is: 'continuous-deployment',
  }, {
    github_actions_jobs_run: 'reread how the GitHub Actions pipeline page orders jobs',
    jenkinsfile_stages_run: 'the reading names the one ordering difference between stages and jobs',
    gives_pods_one_stable_address: 'which Kubernetes object fronts changing Pods with one stable way in?',
    keeps_three_replicas_running: 'which Kubernetes object declares a desired replica count?',
    release_policy_in_the_brief_is: 'reread the brief\'s release policy and the reading\'s difference between the two practices',
  }) ?? (whyOk(d) ? null : 'write at least a sentence of your own reasoning in delivery.why');
});

// Assert helper for the public tests: message is the rule's own stable text.
export const check = (id, dir = PROJECT) => RULES[id](dir);
