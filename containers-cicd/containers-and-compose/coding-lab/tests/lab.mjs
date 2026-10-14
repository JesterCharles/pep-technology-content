// Shared readers and rule checks for the public lab tests. They read files as text and
// YAML; nothing here builds an image, starts a container or calls a daemon.
// Each rule returns null when the project satisfies it, or one stable message saying what is wrong.
import { readFileSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { parse } from 'yaml';

// The learner project: the starter folder, or LAB_PROJECT when set (for a copy elsewhere).
export const PROJECT = path.resolve(process.env.LAB_PROJECT || path.join(import.meta.dirname, '..', 'starter'));

const posix = path.posix;
const has = (dir, rel) => existsSync(path.join(dir, rel));
const read = (dir, rel) => (has(dir, rel) ? readFileSync(path.join(dir, rel), 'utf8') : '');

// ---------- Dockerfile ----------

// Split shell or JSON (exec) form arguments into words.
function words(args) {
  const a = args.trim();
  if (a.startsWith('[')) {
    try { return JSON.parse(a).map(String); } catch { return []; }
  }
  return a.split(/\s+/).filter(Boolean);
}

// Stages with their steps; each step records the working directory in force when it runs.
export function dockerfile(dir, rel) {
  const lines = read(dir, rel).replace(/\\\r?\n/g, ' ').split(/\r?\n/)
    .map((l) => l.trim()).filter((l) => l && !l.startsWith('#'));
  const stages = [];
  for (const line of lines) {
    const m = line.match(/^(\S+)\s*(.*)$/);
    const op = m[1].toUpperCase();
    const args = m[2];
    if (op === 'FROM') {
      const f = args.split(/\s+/).filter((w) => !w.startsWith('--'));
      stages.push({ image: (f[0] || '').toLowerCase(), name: /^as$/i.test(f[1] || '') ? (f[2] || '').toLowerCase() : null, cwd: '/', steps: [] });
      continue;
    }
    const st = stages.at(-1);
    if (!st) continue;
    if (op === 'WORKDIR') st.cwd = posix.resolve(st.cwd, args.trim());
    st.steps.push({ op, args, cwd: st.cwd });
  }
  return stages;
}

const isCopy = (s) => s.op === 'COPY' || s.op === 'ADD';
const fromOf = (s) => (s.args.match(/--from=(\S+)/) || [])[1]?.toLowerCase() ?? null;
const copyWords = (s) => words(s.args.replace(/--\S+/g, ''));
const runHas = (s, re) => s.op === 'RUN' && re.test(s.args);
// The file a COPY writes: an explicit file destination, resolved against the stage's working directory.
const copyDest = (s) => { const w = copyWords(s); const d = w.at(-1) || ''; return d.endsWith('/') ? null : posix.resolve(s.cwd, d); };
// The jar a start command runs, resolved against the stage's final working directory.
function startJar(stage) {
  const start = [...stage.steps].reverse().find((s) => s.op === 'ENTRYPOINT' || s.op === 'CMD');
  if (!start) return null;
  const w = words(start.args);
  const i = w.indexOf('-jar');
  return w[0] === 'java' && i > 0 && w[i + 1] ? posix.resolve(stage.cwd, w[i + 1]) : null;
}

export const RULES = {};
const rule = (id, fn) => { RULES[id] = fn; };

rule('backend-stages', (dir) => {
  const s = dockerfile(dir, 'backend/Dockerfile');
  if (s.length < 2) return 'backend/Dockerfile needs two stages: a JDK build stage and a JRE runtime stage';
  if (!s[0].name) return 'name the build stage, for example FROM eclipse-temurin:25-jdk AS build';
  if (!/jdk/.test(s[0].image)) return 'the build stage must start FROM a JDK image, such as eclipse-temurin:25-jdk';
  if (!/jre/.test(s.at(-1).image) || /jdk/.test(s.at(-1).image)) return 'the last stage must start FROM a JRE image, such as eclipse-temurin:25-jre';
  return null;
});

rule('backend-deps', (dir) => {
  const steps = dockerfile(dir, 'backend/Dockerfile')[0]?.steps ?? [];
  const pom = steps.findIndex((x) => isCopy(x) && copyWords(x).slice(0, -1).some((w) => posix.basename(w) === 'pom.xml'));
  const src = steps.findIndex((x) => isCopy(x) && copyWords(x).slice(0, -1).some((w) => /^(\.\/)?src\/?$/.test(w)));
  const offline = steps.findIndex((x, i) => i > pom && runHas(x, /\bmvnw?\b.*\bdependency:go-offline\b/));
  const pkg = steps.findIndex((x, i) => i > src && runHas(x, /\bmvnw?\b.*\bpackage\b/));
  if (pom < 0 || offline < 0 || src < offline || pkg < 0) {
    return 'in the build stage: COPY pom.xml, RUN the Maven wrapper with dependency:go-offline, COPY src, then RUN the wrapper with package';
  }
  return null;
});

rule('backend-jar', (dir) => {
  const s = dockerfile(dir, 'backend/Dockerfile');
  const pkg = s[0]?.steps.find((x) => runHas(x, /\bmvnw?\b.*\bpackage\b/));
  const copies = s.length >= 2 ? s.at(-1).steps.filter(isCopy) : [];
  const target = pkg ? posix.join(pkg.cwd, 'target') : null;
  const ok = target && copies.length > 0 && copies.every((x) => {
    const w = copyWords(x);
    return fromOf(x) === s[0].name && w.length === 2 && posix.dirname(w[0]) === target && /\.jar$/.test(w[0]) && /\.jar$/.test(w[1]);
  });
  return ok ? null : 'the runtime stage must copy only the packaged jar from the build stage\'s target folder, for example COPY --from=<build stage> <build workdir>/target/*.jar app.jar';
});

rule('backend-start', (dir) => {
  const s = dockerfile(dir, 'backend/Dockerfile');
  const last = s.at(-1);
  const jar = last?.steps.filter(isCopy).map(copyDest).find((d) => d && d.endsWith('.jar'));
  const run = last && startJar(last);
  return jar && run === jar ? null : 'start the copied jar in the runtime stage with ENTRYPOINT or CMD java -jar <the jar path you copied>';
});

rule('frontend-stages', (dir) => {
  const s = dockerfile(dir, 'frontend/Dockerfile');
  if (s.length < 2 || !s[0].name) return 'frontend/Dockerfile needs a named Node build stage and an nginx stage';
  if (!/^node:/.test(s[0].image)) return 'the build stage must start FROM a Node image, such as node:24-alpine';
  if (!/^nginx:/.test(s.at(-1).image)) return 'the last stage must start FROM an nginx image, such as nginx:alpine';
  if (!s[0].steps.some((x) => runHas(x, /\bnpm run build\b/))) return 'the build stage must RUN npm run build';
  return null;
});

rule('frontend-deps', (dir) => {
  const steps = dockerfile(dir, 'frontend/Dockerfile')[0]?.steps ?? [];
  const pkg = steps.findIndex((x) => isCopy(x) && copyWords(x).includes('package.json') && copyWords(x).includes('package-lock.json'));
  const ci = steps.findIndex((x, i) => i > pkg && runHas(x, /\bnpm ci\b/));
  const all = steps.findIndex((x, i) => i > ci && isCopy(x) && !fromOf(x) && copyWords(x)[0] === '.');
  return pkg >= 0 && ci > pkg && all > ci ? null : 'COPY package.json package-lock.json, RUN npm ci, then COPY . . in that order';
});

rule('frontend-dist', (dir) => {
  const s = dockerfile(dir, 'frontend/Dockerfile');
  const build = s[0]?.steps.find((x) => runHas(x, /\bnpm run build\b/));
  const copies = s.length >= 2 ? s.at(-1).steps.filter(isCopy) : [];
  const dist = build ? posix.join(build.cwd, 'dist') : null;
  const ok = dist && copies.length > 0 && copies.every((x) => {
    const w = copyWords(x);
    return fromOf(x) === s[0].name && w.length === 2 && w[0].replace(/\/$/, '') === dist && /^\/usr\/share\/nginx\/html\/?$/.test(w[1]);
  });
  return ok ? null : 'the nginx stage must copy only the build output: COPY --from=<build stage> <build workdir>/dist /usr/share/nginx/html';
});

// ---------- .dockerignore ----------

export function ignoreEntries(dir, rel) {
  return read(dir, rel).split(/\r?\n/).map((l) => l.trim()).filter((l) => l && !l.startsWith('#'))
    .map((l) => l.replace(/^\.\//, '').replace(/^\/+/, '').replace(/^\*\*\//, '').replace(/\/+$/, ''));
}
const missingIgnores = (dir, rel, need) => { const have = new Set(ignoreEntries(dir, rel)); return need.filter((n) => !have.has(n)); };

rule('ignore-backend', (dir) => (missingIgnores(dir, 'backend/.dockerignore', ['target', '.git', '.env']).length
  ? 'backend/.dockerignore must list target, .git and .env' : null));
rule('ignore-frontend', (dir) => (missingIgnores(dir, 'frontend/.dockerignore', ['node_modules', 'dist', '.git', '.env']).length
  ? 'frontend/.dockerignore must list node_modules, dist, .git and .env' : null));

// ---------- compose.yaml ----------

export function compose(dir) {
  try { return parse(read(dir, 'compose.yaml')) || {}; } catch { return {}; }
}
export function env(service) {
  const e = service?.environment;
  if (Array.isArray(e)) {
    return Object.fromEntries(e.map((x) => { const t = String(x); const i = t.indexOf('='); return i < 0 ? [t, undefined] : [t.slice(0, i), t.slice(i + 1)]; }));
  }
  return e && typeof e === 'object' ? e : {};
}
export function envFiles(service) {
  const f = service?.env_file;
  if (!f) return [];
  return (Array.isArray(f) ? f : [f]).map((x) => (typeof x === 'string' ? x : x?.path)).filter(Boolean).map((p) => p.replace(/^\.\//, ''));
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

const services = (dir) => compose(dir).services || {};
const dbName = (dir) => Object.keys(services(dir)).find((k) => /^postgres:/.test(String(services(dir)[k]?.image || '')));
const buildContext = (s) => String(typeof s?.build === 'string' ? s.build : s?.build?.context || '').replace(/^\.\//, '').replace(/\/$/, '');
const INTERP = /^\$\{([A-Za-z_][A-Za-z0-9_]*)(?::?\?[^}]*)?\}$/;

// The value a service receives for a key: from environment (with ${VAR} resolved from .env) or from an env_file.
// Returns { ok, value } or { ok: false, why }.
function resolved(dir, svc, key) {
  const e = env(svc);
  if (key in e) {
    const v = e[key];
    if (v === undefined || v === null) return { ok: false, why: 'empty' };
    const m = String(v).match(INTERP);
    if (!m) return /\$/.test(String(v)) ? { ok: false, why: 'interp' } : { ok: true, literal: true, value: String(v) };
    const dot = envFileValues(dir, '.env');
    return dot && dot[m[1]] ? { ok: true, value: dot[m[1]], from: '.env' } : { ok: false, why: 'missing-var', name: m[1] };
  }
  for (const f of envFiles(svc)) {
    const vals = envFileValues(dir, f);
    if (vals && vals[key]) return { ok: true, value: vals[key], from: f };
  }
  return { ok: false, why: 'absent' };
}

rule('compose-services', (dir) => {
  const sv = services(dir);
  if (buildContext(sv.api) !== 'backend') return 'add a service named api with build: ./backend';
  const db = dbName(dir);
  if (!db || !/^postgres:18(\b|-|$)/.test(String(sv[db].image))) return 'add a database service with image: postgres:18';
  return null;
});

rule('compose-volume', (dir) => {
  const db = services(dir)[dbName(dir)];
  const declared = Object.keys(compose(dir).volumes || {});
  const mounts = (db?.volumes || []).map((v) => (typeof v === 'string' ? { source: v.split(':')[0], target: v.split(':')[1] } : v));
  return mounts.some((m) => declared.includes(m.source) && /^\/var\/lib\/postgresql\/?$/.test(m.target || ''))
    ? null : 'mount a named volume at /var/lib/postgresql on the database service and declare it under the top-level volumes key';
});

rule('compose-ports', (dir) => {
  const sv = services(dir);
  const local = (p) => (typeof p === 'object' ? ['127.0.0.1', '::1'].includes(String(p.host_ip)) : /^(127\.0\.0\.1|\[::1\]):\d+:\d+/.test(String(p)));
  if (!(sv.api?.ports || []).length) return 'publish the api port so a browser on this machine can reach it';
  return Object.values(sv).flatMap((s) => s?.ports || []).every(local)
    ? null : 'every ports entry must name the host address 127.0.0.1, for example "127.0.0.1:8080:8080"';
});

rule('compose-password', (dir) => {
  const sv = services(dir);
  for (const [svc, key, label] of [[sv[dbName(dir)], 'POSTGRES_PASSWORD', 'the database service'], [sv.api, 'SPRING_DATASOURCE_PASSWORD', 'the api service']]) {
    const r = resolved(dir, svc, key);
    if (r.ok && r.literal) return `${key} on ${label} is a literal value: use \${DB_PASSWORD} with a .env file, or an env_file`;
    if (r.ok) continue;
    if (r.why === 'missing-var') return `${key} on ${label} uses \${${r.name}}, but no .env file in the project sets ${r.name}`;
    if (r.why === 'interp') return `${key} on ${label} must be exactly \${NAME}, filled from .env`;
    return `give ${label} ${key} through \${DB_PASSWORD} and a .env file, or through an env_file that sets ${key}`;
  }
  const a = resolved(dir, sv.api, 'SPRING_DATASOURCE_PASSWORD');
  const d = resolved(dir, sv[dbName(dir)], 'POSTGRES_PASSWORD');
  return a.value === d.value ? null : 'the api and database services must receive the same password value';
});

export function gitignored(dir, rel) {
  const patterns = read(dir, '.gitignore').split(/\r?\n/).map((l) => l.trim()).filter((l) => l && !l.startsWith('#'));
  const name = rel.replace(/^\.\//, '');
  return patterns.some((p) => { const q = p.replace(/^\//, '').replace(/^\*\*\//, ''); return q === name || q === path.basename(name); });
}
// True when Git tracks the file. Outside a Git work tree, or without Git, nothing is tracked.
export function trackedByGit(dir, rel) {
  try {
    execFileSync('git', ['ls-files', '--error-unmatch', '--', rel], { cwd: dir, stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

rule('compose-envfiles', (dir) => {
  const files = [...new Set(['.env', ...Object.values(services(dir)).flatMap(envFiles)])];
  for (const f of files) {
    if (!gitignored(dir, f)) return `list ${f} in .gitignore so the local password file is never committed`;
    if (trackedByGit(dir, f)) return `${f} is tracked by Git: remove it with git rm --cached ${f}`;
  }
  return null;
});

rule('compose-url', (dir) => {
  const db = dbName(dir);
  const url = String(env(services(dir).api).SPRING_DATASOURCE_URL || '');
  const m = url.match(/^jdbc:postgresql:\/\/([^:/]+)(?::(\d+))?\/([^?]+)/);
  const dbEnv = (k) => resolved(dir, services(dir)[db], k);
  const name = dbEnv('POSTGRES_DB');
  return m && db && m[1] === db && (m[2] ?? '5432') === '5432' && name.ok && m[3] === name.value
    ? null : 'set SPRING_DATASOURCE_URL to jdbc:postgresql://<db service name>:5432/<the POSTGRES_DB name>, never localhost';
});

// One pg_isready option value is wired when it names the container's own variable with Compose's $$ escape
// (CMD-SHELL), or is the same literal the database service is given.
function wired(value, varName, expected, shell) {
  if (value === undefined) return false;
  if (shell && (value === `$\${${varName}}` || value === `$$${varName}`)) return expected.ok;
  return !/\$/.test(value) && expected.ok && value === expected.value;
}

rule('compose-health', (dir) => {
  const sv = services(dir);
  const db = dbName(dir);
  const t = sv[db]?.healthcheck?.test;
  const list = Array.isArray(t) ? t.map(String) : (t ? ['CMD-SHELL', String(t)] : []);
  const shell = list[0] === 'CMD-SHELL';
  const argv = shell ? words(list.slice(1).join(' ')) : list.slice(1);
  const at = argv.indexOf('pg_isready');
  if (!['CMD', 'CMD-SHELL'].includes(list[0]) || at < 0) return 'give the database service a healthcheck whose test runs pg_isready';
  const opt = (flag) => { const i = argv.indexOf(flag, at); return i < 0 ? undefined : argv[i + 1]; };
  if (!wired(opt('-U'), 'POSTGRES_USER', resolved(dir, sv[db], 'POSTGRES_USER'), shell)
    || !wired(opt('-d'), 'POSTGRES_DB', resolved(dir, sv[db], 'POSTGRES_DB'), shell)) {
    return 'pass pg_isready -U and -d the database user and name: $${POSTGRES_USER} and $${POSTGRES_DB} in CMD-SHELL (two dollar signs, so the container expands them), or the same literal values';
  }
  const dep = sv.api?.depends_on;
  return dep && !Array.isArray(dep) && dep[db]?.condition === 'service_healthy'
    ? null : 'make api depend on the database with condition: service_healthy';
});

// Assert helper for the public tests: message is the rule's own stable text.
export const check = (id, dir = PROJECT) => RULES[id](dir);
