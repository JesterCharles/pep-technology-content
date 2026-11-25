// Shared readers and rule checks for the public lab tests. They read files as text and
// YAML; nothing here builds an image, starts a container or calls a daemon.
// Each rule returns null when the project satisfies it, or one stable message naming the file
// and the rule that is not met yet. The README phase 3 and phase 5 outcomes say how to meet it.
import { readFileSync, existsSync, readdirSync } from 'node:fs';
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
const copySources = (s) => copyWords(s).slice(0, -1).map((w) => posix.normalize(w).replace(/\/$/, ''));
const runHas = (s, re) => s.op === 'RUN' && re.test(s.args);
// The image tag: the part after the last colon of the image name, without a digest.
const tagOf = (image) => { const i = image.replace(/@.*$/, ''); const c = i.lastIndexOf(':'); return c > i.lastIndexOf('/') ? i.slice(c + 1) : ''; };
const majorIs = (image, major) => new RegExp(`^${major}(?![0-9])`).test(tagOf(image));
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
  if (s.length < 2) return 'backend/Dockerfile: build the jar in one stage and run it from a second, smaller stage';
  if (!s[0].name) return 'backend/Dockerfile: name the build stage, so the runtime stage can copy from it';
  if (!/jdk/.test(s[0].image) || !majorIs(s[0].image, 25)) return 'backend/Dockerfile: the build stage needs a Java 25 image that can compile Java (a JDK)';
  if (!/jre/.test(s.at(-1).image) || /jdk/.test(s.at(-1).image) || !majorIs(s.at(-1).image, 25)) return 'backend/Dockerfile: the last stage needs a Java 25 image that only runs Java (a JRE)';
  return null;
});

// Files the Maven wrapper needs before it can run; nothing else may be copied before the dependency step.
const WRAPPER = new Set(['mvnw', '.mvn', 'pom.xml']);
const wrapperRun = (s, re) => s.op === 'RUN' && /(^|[\s;&|/])mvnw\b/.test(s.args) && re.test(s.args);
const bareMaven = (s) => s.op === 'RUN' && /(^|[\s;&|])mvn(\s|$)/.test(s.args);

rule('backend-deps', (dir) => {
  const steps = dockerfile(dir, 'backend/Dockerfile')[0]?.steps ?? [];
  if (steps.some(bareMaven)) return 'backend/Dockerfile: build with the project\'s own Maven wrapper, not a Maven installed in the image';
  const offline = steps.findIndex((x) => wrapperRun(x, /\bdependency:go-offline\b/));
  if (offline < 0) return 'backend/Dockerfile: the build stage needs its own step that downloads every dependency with the Maven wrapper';
  const before = steps.slice(0, offline).filter((x) => isCopy(x) && !fromOf(x)).flatMap(copySources);
  if (before.some((w) => !WRAPPER.has(posix.basename(w)))) {
    return 'backend/Dockerfile: only the wrapper files and pom.xml may be copied before the dependency download; source copied earlier makes every source change download everything again';
  }
  if (![...WRAPPER].every((f) => before.some((w) => posix.basename(w) === f))) {
    return 'backend/Dockerfile: the wrapper can only run once its script, its .mvn folder and pom.xml are in the image';
  }
  const src = steps.findIndex((x, i) => i > offline && isCopy(x) && copySources(x).some((w) => w === 'src'));
  const pkg = steps.findIndex((x, i) => i > src && wrapperRun(x, /\bpackage\b/));
  return src > offline && pkg > src ? null : 'backend/Dockerfile: after the dependency download, copy the source and package the jar with the wrapper';
});

rule('backend-jar', (dir) => {
  const s = dockerfile(dir, 'backend/Dockerfile');
  const pkg = s[0]?.steps.find((x) => wrapperRun(x, /\bpackage\b/));
  const copies = s.length >= 2 ? s.at(-1).steps.filter(isCopy) : [];
  const target = pkg ? posix.join(pkg.cwd, 'target') : null;
  const ok = target && copies.length > 0 && copies.every((x) => {
    const w = copyWords(x);
    return fromOf(x) === s[0].name && w.length === 2 && posix.dirname(w[0]) === target && /\.jar$/.test(w[0]) && /\.jar$/.test(w[1]);
  });
  return ok ? null : 'backend/Dockerfile: the runtime stage must copy only the packaged jar, from the build stage\'s target folder, to a jar file name';
});

rule('backend-start', (dir) => {
  const s = dockerfile(dir, 'backend/Dockerfile');
  const last = s.at(-1);
  const jar = last?.steps.filter(isCopy).map(copyDest).find((d) => d && d.endsWith('.jar'));
  const run = last && startJar(last);
  return jar && run === jar ? null : 'backend/Dockerfile: the runtime stage must start, with java -jar, exactly the jar file it copied';
});

rule('frontend-stages', (dir) => {
  const s = dockerfile(dir, 'frontend/Dockerfile');
  if (s.length < 2 || !s[0].name) return 'frontend/Dockerfile: build the site in a named stage and serve it from a second stage';
  if (!/^node:/.test(s[0].image) || !majorIs(s[0].image, 24)) return 'frontend/Dockerfile: the build stage needs a Node 24 image';
  if (!/^nginx(:|$)/.test(s.at(-1).image)) return 'frontend/Dockerfile: the last stage needs an nginx image to serve the site';
  if (!s[0].steps.some((x) => runHas(x, /\bnpm run build\b/))) return 'frontend/Dockerfile: the build stage must build the site with the project\'s build script';
  return null;
});

const MANIFESTS = new Set(['package.json', 'package-lock.json']);
// The top-level files of a build folder that one COPY source word names: a plain name, or a glob such as package*.json.
function matches(dir, folder, word) {
  const name = posix.basename(word);
  if (!/[*?[]/.test(name)) return [name];
  const pattern = name.replace(/[.+^$(){}|\\]/g, '\\$&').replace(/\*/g, '.*').replace(/\?/g, '.');
  const re = new RegExp('^' + pattern + '$');
  let names = [];
  try { names = readdirSync(path.join(dir, folder)); } catch { names = []; }
  return names.filter((n) => re.test(n));
}
rule('frontend-deps', (dir) => {
  const steps = dockerfile(dir, 'frontend/Dockerfile')[0]?.steps ?? [];
  const msg = 'frontend/Dockerfile: install the dependencies with npm ci after copying only the two package files, then copy the rest of the source and build';
  const ci = steps.findIndex((x) => runHas(x, /\bnpm ci\b/));
  if (ci < 0) return msg;
  const before = steps.slice(0, ci).filter((x) => isCopy(x) && !fromOf(x)).flatMap(copySources)
    .flatMap((w) => { const m = matches(dir, 'frontend', w); return m.length ? m : [posix.basename(w)]; });
  if (before.some((w) => !MANIFESTS.has(w))) {
    return 'frontend/Dockerfile: only package.json and package-lock.json may be copied before npm ci; source copied earlier makes every source change install everything again';
  }
  if (![...MANIFESTS].every((f) => before.includes(f))) return msg;
  const rest = steps.findIndex((x, i) => i > ci && isCopy(x) && !fromOf(x) && copySources(x).some((w) => !MANIFESTS.has(posix.basename(w))));
  const build = steps.findIndex((x, i) => i > rest && runHas(x, /\bnpm run build\b/));
  return rest > ci && build > rest ? null : msg;
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
  return ok ? null : 'frontend/Dockerfile: the nginx stage must copy only the built site, from the build stage, into the folder nginx serves';
});

// ---------- .dockerignore ----------

export function ignoreEntries(dir, rel) {
  return read(dir, rel).split(/\r?\n/).map((l) => l.trim()).filter((l) => l && !l.startsWith('#'))
    .map((l) => l.replace(/^\.\//, '').replace(/^\/+/, '').replace(/^\*\*\//, '').replace(/\/+$/, ''));
}
const missingIgnores = (dir, rel, need) => { const have = new Set(ignoreEntries(dir, rel)); return need.filter((n) => !have.has(n)); };
const ignoreMessage = (rel, missing) => `${rel}: the build context still sends ${missing.length} kind(s) of file it must leave out (build output, installed packages, version control, local secrets)`;

rule('ignore-backend', (dir) => {
  const m = missingIgnores(dir, 'backend/.dockerignore', ['target', '.git', '.env']);
  return m.length ? ignoreMessage('backend/.dockerignore', m) : null;
});
rule('ignore-frontend', (dir) => {
  const m = missingIgnores(dir, 'frontend/.dockerignore', ['node_modules', 'dist', '.git', '.env']);
  return m.length ? ignoreMessage('frontend/.dockerignore', m) : null;
});

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
  if (buildContext(sv.api) !== 'backend') return 'compose.yaml: needs a service named api, built from the backend folder';
  const db = dbName(dir);
  if (!db || !/^postgres:18(\b|-|$)/.test(String(sv[db].image))) return 'compose.yaml: needs a database service on the PostgreSQL 18 image';
  return null;
});

rule('compose-volume', (dir) => {
  const db = services(dir)[dbName(dir)];
  const declared = Object.keys(compose(dir).volumes || {});
  const mounts = (db?.volumes || []).map((v) => (typeof v === 'string' ? { source: v.split(':')[0], target: v.split(':')[1] } : v));
  return mounts.some((m) => declared.includes(m.source) && /^\/var\/lib\/postgresql\/?$/.test(m.target || ''))
    ? null : 'compose.yaml: the database must keep its data in a named volume, declared at the top level and mounted where PostgreSQL 18 images keep data';
});

rule('compose-ports', (dir) => {
  const sv = services(dir);
  const local = (p) => (typeof p === 'object' ? ['127.0.0.1', '::1'].includes(String(p.host_ip)) : /^(127\.0\.0\.1|\[::1\]):\d+:\d+/.test(String(p)));
  if (!(sv.api?.ports || []).length) return 'compose.yaml: the api must publish a port, so a browser on this machine can reach it';
  if (Object.values(sv).some((s) => String(s?.network_mode || '') === 'host')) return 'compose.yaml: every published port must be reachable from this machine only, not from the network';
  return Object.values(sv).flatMap((s) => s?.ports || []).every(local)
    ? null : 'compose.yaml: every published port must be reachable from this machine only, not from the network';
});

rule('compose-password', (dir) => {
  const sv = services(dir);
  for (const [svc, key, label] of [[sv[dbName(dir)], 'POSTGRES_PASSWORD', 'the database service'], [sv.api, 'SPRING_DATASOURCE_PASSWORD', 'the api service']]) {
    const r = resolved(dir, svc, key);
    if (r.ok && r.literal) return `compose.yaml: ${key} on ${label} is written into the file; it must come from .env or from an env_file`;
    if (r.ok) continue;
    if (r.why === 'missing-var') return `compose.yaml: ${key} on ${label} uses \${${r.name}}, but no .env file in the project sets ${r.name}`;
    if (r.why === 'interp') return `compose.yaml: ${key} on ${label} must be exactly one \${...} variable, filled from .env`;
    return `compose.yaml: ${label} does not receive ${key} yet, from .env interpolation or from an env_file`;
  }
  const a = resolved(dir, sv.api, 'SPRING_DATASOURCE_PASSWORD');
  const d = resolved(dir, sv[dbName(dir)], 'POSTGRES_PASSWORD');
  return a.value === d.value ? null : 'compose.yaml: the api and database services must receive the same password value';
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
    if (!gitignored(dir, f)) return `.gitignore: list ${f}, so the local password file is never committed`;
    if (trackedByGit(dir, f)) return `${f} is tracked by Git: stop tracking it and keep the file (see Troubleshooting)`;
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
    ? null : 'compose.yaml: the api datasource URL must reach the database by its service name and container port, and name the database the database service creates';
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
  const args = shell ? words(list.slice(1).join(' ')) : list.slice(1);
  const at = args.indexOf('pg_isready');
  if (!['CMD', 'CMD-SHELL'].includes(list[0]) || at < 0) return 'compose.yaml: the database needs a healthcheck that runs pg_isready';
  const opt = (flag) => { const i = args.indexOf(flag, at); return i < 0 ? undefined : args[i + 1]; };
  if (!wired(opt('-U'), 'POSTGRES_USER', resolved(dir, sv[db], 'POSTGRES_USER'), shell)
    || !wired(opt('-d'), 'POSTGRES_DB', resolved(dir, sv[db], 'POSTGRES_DB'), shell)) {
    return 'compose.yaml: pg_isready must check the same user and database the database service is configured with, expanded inside the container (see the phase 3 hints)';
  }
  const dep = sv.api?.depends_on;
  return dep && !Array.isArray(dep) && dep[db]?.condition === 'service_healthy'
    ? null : 'compose.yaml: the api must wait until the database healthcheck passes, not only until it starts';
});

// ---------- runbook.yaml ----------
// The commands you would type to operate the stack. Nothing here runs them: each rule checks one
// command line against the stated rule and against your own compose.yaml and env files.

export function runbook(dir) {
  try { return parse(read(dir, 'runbook.yaml')) || {}; } catch { return {}; }
}
// Split one command line into words, honouring single and double quotes.
export function argv(line) {
  const out = [];
  let word = '';
  let quote = null;
  let started = false;
  for (const ch of String(line ?? '').trim()) {
    if (quote) { if (ch === quote) quote = null; else word += ch; continue; }
    if (ch === '"' || ch === "'") { quote = ch; started = true; continue; }
    if (/\s/.test(ch)) { if (started || word) out.push(word); word = ''; started = false; continue; }
    word += ch;
    started = true;
  }
  if (started || word) out.push(word);
  return out;
}
// One command only: a pipe, list, redirection or substitution would run or hide something else.
const SHELL_OPERATORS = /[;&|<>`]|\$\(/;
const ENGINES = ['docker', 'podman'];
// Options that take a value, so the value is not mistaken for a service name, image or command.
const COMPOSE_GLOBAL_VALUES = new Set(['-f', '--file', '-p', '--project-name', '--profile', '--env-file',
  '--project-directory', '--ansi', '--progress', '--parallel']);
const VALUE_OPTIONS = new Set(['-e', '--env', '--env-file', '-p', '--publish', '-v', '--volume', '--name', '--network', '--net',
  '-u', '--user', '-w', '--workdir', '--index', '-n', '--tail', '--since', '--until', '--timeout',
  '--mount', '--label', '-l', '--hostname', '-h', '--entrypoint', '--restart', '--memory', '-m', '--cpus',
  '--platform', '--pull', '--health-cmd', '--health-interval', '--health-retries', '--health-timeout',
  '--add-host', '--dns', '--expose', '--ip', '--log-driver', '--log-opt', '--shm-size', '--stop-signal',
  '--stop-timeout', '--ulimit', '--cidfile', '--rmi', '--scale', '--wait-timeout', '--format', '--filter',
  '--status', '--attach', '--no-attach', '--exit-code-from']);
// Parse options the way the engine CLIs do: --name=value, --name value, -xVALUE, grouped flags (-dit).
// With anywhere set, options may also follow positional words; otherwise the first positional word ends them.
// Returns { options: [[name, value]], rest: [positional words] }.
function parseArgs(list, valueOptions, anywhere) {
  const options = [];
  const rest = [];
  for (let i = 0; i < list.length; i += 1) {
    const w = list[i];
    if (!w.startsWith('-') || w === '-' || (!anywhere && rest.length)) { rest.push(w); continue; }
    if (w === '--') { rest.push(...list.slice(i + 1)); break; }
    if (w.startsWith('--')) {
      const eq = w.indexOf('=');
      if (eq > 0) options.push([w.slice(0, eq), w.slice(eq + 1)]);
      else if (valueOptions.has(w)) { options.push([w, list[i + 1]]); i += 1; } else options.push([w, null]);
      continue;
    }
    const letters = w.slice(1);
    for (let k = 0; k < letters.length; k += 1) {
      const name = `-${letters[k]}`;
      if (valueOptions.has(name)) {
        const attached = letters.slice(k + 1).replace(/^=/, '');
        if (attached) options.push([name, attached]);
        else { options.push([name, list[i + 1]]); i += 1; }
        break;
      }
      options.push([name, null]);
    }
  }
  return { options, rest };
}
const FALSE = /^(false|0|no)$/i;
// True when one of the named options is set and not switched off with =false.
const on = (cmd, ...names) => cmd.options.some(([n, v]) => names.includes(n) && !(v !== null && v !== undefined && FALSE.test(v)));
const values = (cmd, ...names) => cmd.options.filter(([n]) => names.includes(n)).map(([, v]) => String(v ?? ''));
// A Compose command: { sub, options, rest } for "docker compose [global options] <sub> ...", or null.
function composeCommand(line) {
  if (SHELL_OPERATORS.test(line)) return null;
  const w = argv(line);
  if (w.length < 3 || !ENGINES.includes(w[0]) || w[1] !== 'compose') return null;
  const global = parseArgs(w.slice(2), COMPOSE_GLOBAL_VALUES, false);
  const [sub, ...after] = global.rest;
  if (!sub) return null;
  // exec takes options, then the service, then a command whose own words are not exec options.
  // In Compose, -v (down) and -h (help) are plain flags; only docker run reads them as volume and hostname.
  const composeValues = new Set([...VALUE_OPTIONS].filter((o) => o !== '-v' && o !== '-h'));
  const command = parseArgs(after, composeValues, sub !== 'exec');
  const options = [...global.options, ...command.options];
  // Help and version modes print text and run nothing, so they never perform the operation asked for.
  if (options.some(([name]) => ['--help', '-h', '--version'].includes(name))) return null;
  return { sub, options, rest: command.rest };
}
const entry = (dir, key) => (typeof runbook(dir)[key] === 'string' ? runbook(dir)[key] : '');
// One format message for any entry that is more than one command, whatever rule reads it.
const notSingle = (dir, ...keys) => {
  const key = keys.find((k) => SHELL_OPERATORS.test(entry(dir, k)));
  return key ? `${key}: write exactly one command, with no ;, &&, pipes, redirection or $(...)` : null;
};
const dryRun = (cmd) => on(cmd, '--dry-run');
const psShowsState = (cmd) => values(cmd, '--format').every((format) => ['json', 'table'].includes(format) || /\.(State|Status)\b/.test(format));
const logsHaveOutput = (cmd) => values(cmd, '-n', '--tail')
  .every((tail) => tail === 'all' || (Number.isInteger(Number(tail)) && Number(tail) !== 0));

rule('runbook-lifecycle', (dir) => {
  const format = notSingle(dir, 'start-stack', 'list-all-containers', 'stop-keep-data', 'stop-delete-data');
  if (format) return format;
  const up = composeCommand(entry(dir, 'start-stack'));
  const incompatible = up && (up.options.some(([name]) => name === '--exit-code-from')
    || on(up, '--abort-on-container-exit', '--abort-on-container-failure', '--menu'));
  if (!up || up.sub !== 'up' || !on(up, '-d', '--detach') || on(up, '--no-start')
    || incompatible || dryRun(up) || up.rest.length) return 'start-stack: the whole stack must start and keep running in the background after the command returns';
  const ps = composeCommand(entry(dir, 'list-all-containers'));
  if (!ps || ps.sub !== 'ps' || !on(ps, '-a', '--all') || on(ps, '-q', '--quiet', '--services')
    || dryRun(ps) || values(ps, '--filter', '--status').length || !psShowsState(ps) || ps.rest.length) {
    return 'list-all-containers: list every container of the stack with its state, including the ones that have exited';
  }
  const keep = composeCommand(entry(dir, 'stop-keep-data'));
  if (!keep || keep.sub !== 'down' || on(keep, '-v', '--volumes') || dryRun(keep) || keep.rest.length) return 'stop-keep-data: stop the stack and remove its containers and network, and keep the database data';
  const wipe = composeCommand(entry(dir, 'stop-delete-data'));
  if (!wipe || wipe.sub !== 'down' || !on(wipe, '-v', '--volumes') || dryRun(wipe) || wipe.rest.length) return 'stop-delete-data: stop the stack and also delete the data it keeps in volumes';
  const listed = runbook(dir)['down-v-also-deletes'];
  const declared = Object.entries(compose(dir).volumes || {}).filter(([, v]) => !v?.external).map(([k]) => k).sort();
  const named = Array.isArray(listed) ? listed.map(String).sort() : [];
  return declared.length && JSON.stringify(named) === JSON.stringify(declared)
    ? null : 'down-v-also-deletes: list exactly the named volumes your compose.yaml declares (external volumes are never removed): the data the last command deletes and the plain stop keeps';
});

rule('runbook-logs', (dir) => {
  const format = notSingle(dir, 'why-did-api-exit', 'follow-api-output');
  if (format) return format;
  const once = composeCommand(entry(dir, 'why-did-api-exit'));
  if (!once || once.sub !== 'logs' || on(once, '-f', '--follow') || dryRun(once) || !logsHaveOutput(once) || once.rest.join(' ') !== 'api') {
    return 'why-did-api-exit: print what the api service alone has written so far, then return';
  }
  const follow = composeCommand(entry(dir, 'follow-api-output'));
  return follow && follow.sub === 'logs' && on(follow, '-f', '--follow') && !dryRun(follow)
    && logsHaveOutput(follow) && follow.rest.join(' ') === 'api'
    ? null : 'follow-api-output: keep printing new lines from the api service alone as they arrive';
});

rule('runbook-exec', (dir) => {
  const format = notSingle(dir, 'print-one-api-setting');
  if (format) return format;
  const cmd = composeCommand(entry(dir, 'print-one-api-setting'));
  const settings = Object.keys(env(services(dir).api));
  const [service, program, ...args] = cmd?.rest ?? [];
  // printenv NAME, or a shell that prints exactly one variable: sh -c 'echo $NAME' or sh -c 'printenv NAME'.
  const script = ['sh', 'bash'].includes(program) && args[0] === '-c' && args.length === 2 ? args[1].trim() : '';
  const echoed = (script.match(/^echo\s+"?\$\{?([A-Za-z_][A-Za-z0-9_]*)\}?"?$/) || script.match(/^printenv\s+([A-Za-z_][A-Za-z0-9_]*)$/) || [])[1];
  const name = program === 'printenv' && args.length === 1 ? args[0] : echoed;
  if (!cmd || cmd.sub !== 'exec' || dryRun(cmd) || service !== 'api') return 'print-one-api-setting: run the command inside the running api container, not in a new one';
  if (cmd.options.some(([n]) => ['-e', '--env'].includes(n))) return 'print-one-api-setting: read the setting the container already has; do not pass a new value in the same command';
  if (!name) return 'print-one-api-setting: print exactly one named variable, never the whole environment';
  if (/PASS|SECRET|TOKEN|KEY|CREDENTIAL/i.test(name)) return 'print-one-api-setting: check a setting that is not a secret, so no password lands on your screen';
  return settings.includes(name) ? null : 'print-one-api-setting: print one variable your compose.yaml gives the api service';
});

// Every KEY=VALUE pair an ENV or ARG instruction writes, including several pairs per line and
// the older "ENV KEY value" form; continuation lines are already joined by dockerfile().
function bakedPairs(dir, file) {
  const pairs = [];
  for (const stage of dockerfile(dir, file)) {
    for (const s of stage.steps.filter((x) => x.op === 'ENV' || x.op === 'ARG')) {
      const w = argv(s.args);
      if (s.op === 'ENV' && w.length && !w[0].includes('=')) { pairs.push([w[0], w.slice(1).join(' ')]); continue; }
      for (const t of w) { const i = t.indexOf('='); pairs.push(i < 0 ? [t, ''] : [t.slice(0, i), t.slice(i + 1)]); }
    }
  }
  return pairs;
}
// Every password-like value the project's local env files hold.
function localValues(dir) {
  const files = new Set(['.env', ...Object.values(services(dir)).flatMap(envFiles)]);
  return [...files].flatMap((f) => Object.entries(envFileValues(dir, f) || {}))
    .filter(([k, v]) => /PASS|SECRET|TOKEN|KEY/i.test(k) && v).map(([, v]) => v);
}

rule('runbook-run-env', (dir) => {
  const local = localValues(dir);
  for (const file of ['backend/Dockerfile', 'frontend/Dockerfile']) {
    for (const [key, value] of bakedPairs(dir, file)) {
      if (/PASS|SECRET|TOKEN|DATASOURCE|CREDENTIAL/i.test(key) || local.includes(value)) {
        return `${file} writes ${key} into the image: configuration belongs to the container when it starts, never to the image`;
      }
    }
  }
  const format = notSingle(dir, 'run-db-alone');
  if (format) return format;
  const line = entry(dir, 'run-db-alone');
  const w = argv(line);
  const runAt = w[1] === 'run' ? 2 : (w[1] === 'container' && w[2] === 'run' ? 3 : -1);
  if (SHELL_OPERATORS.test(line) || !ENGINES.includes(w[0]) || runAt < 0) return 'run-db-alone: start the database image on its own, as one command, without Compose';
  const cmd = parseArgs(w.slice(runAt), VALUE_OPTIONS, false);
  if (!/^(docker\.io\/(library\/)?)?postgres:18(\b|-|$)/.test(cmd.rest[0] || '')) return 'run-db-alone: run the same PostgreSQL 18 image your compose.yaml uses';
  if (cmd.options.some(([name]) => name === '--entrypoint') || cmd.rest.length !== 1) return 'run-db-alone: start the database image with its normal entrypoint and command';
  if (cmd.options.some(([name]) => name === '--help')) return 'run-db-alone: start the database image on its own, as one command, without Compose';
  if (!on(cmd, '-d', '--detach')) return 'run-db-alone: the database must keep running in the background after the command returns';
  if (values(cmd, '-e', '--env').some((v) => /^POSTGRES_PASSWORD(_FILE)?(=|$)/.test(v))) return 'run-db-alone: never type the password into the command; the container must read it from your local env file';
  if (on(cmd, '-P', '--publish-all') || values(cmd, '--network', '--net').includes('host')
    || values(cmd, '-p', '--publish').some((v) => !/^(127\.0\.0\.1|\[::1\]):\d+:\d+/.test(v))) {
    return 'run-db-alone: any port you publish must be reachable from this machine only, not from the network';
  }
  const files = values(cmd, '--env-file').map((v) => v.replace(/^\.\//, ''));
  if (!files.length) return 'run-db-alone: give the container its password when it starts, from your local env file';
  for (const f of files) {
    const vals = envFileValues(dir, f);
    if (!vals) return `run-db-alone: the env file ${f} does not exist in the project`;
    if (!gitignored(dir, f) || trackedByGit(dir, f)) return `run-db-alone: ${f} must be listed in .gitignore and not tracked by Git`;
  }
  // Docker applies --env-file options in order, so the last file that sets the variable decides.
  let password;
  for (const f of files) {
    const vals = envFileValues(dir, f);
    if ('POSTGRES_PASSWORD' in vals) password = vals.POSTGRES_PASSWORD;
  }
  if (!password) return 'run-db-alone: the env file you pass must set the variable the postgres image reads for its password';
  return /\$\{/.test(password)
    ? 'run-db-alone: write the plain value in the env file; docker run does not fill in ${...} variables there' : null;
});

// Assert helper for the public tests: message is the rule's own stable text.
export const check = (id, dir = PROJECT) => RULES[id](dir);
