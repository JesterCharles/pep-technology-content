// Behaviour runs behind tests 6, 7 and 24-26. Everything here stays on this machine:
// - the reviews service is loaded by tests/service_behavior.py with the lab's own Python
//   packages (in ../.venv, from setup), and every HTTPX request it makes is answered inside
//   that process by a stand-in for the shop api;
// - the workflow steps that can see a secret are run with bash, with made-up secret values,
//   a stand-in docker command first on PATH and a temporary HOME, so no real registry,
//   credential or Docker config is touched.
import { spawnSync } from 'node:child_process';
import { existsSync, mkdtempSync, mkdirSync, writeFileSync, readFileSync, readdirSync, rmSync, chmodSync } from 'node:fs';
import { randomBytes } from 'node:crypto';
import os from 'node:os';
import path from 'node:path';

const LAB = path.join(import.meta.dirname, '..');
const SETUP = 'run the setup command once, from the tests folder: npm run setup';

// ---------- the reviews service ----------

export function labPython() {
  if (process.env.LAB_PYTHON) return process.env.LAB_PYTHON;
  const venv = path.join(LAB, '.venv');
  return process.platform === 'win32' ? path.join(venv, 'Scripts', 'python.exe') : path.join(venv, 'bin', 'python');
}

const PROXY_VARS = /^(all|http|https|no)_proxy$/i;
const withoutProxies = (env) => Object.fromEntries(Object.entries(env).filter(([k]) => !PROXY_VARS.test(k)));

const serviceRuns = new Map();
export function serviceRun(dir) {
  if (serviceRuns.has(dir)) return serviceRuns.get(dir);
  let result;
  const python = labPython();
  const main = path.join(dir, 'reviews', 'app', 'main.py');
  if (!existsSync(python)) result = { problem: `the lab's Python environment is missing: ${SETUP}` };
  else if (!existsSync(main)) result = { problem: 'reviews/app/main.py is missing: restore it from Git' };
  else {
    const r = spawnSync(python, ['-B', '-W', 'ignore', path.join(import.meta.dirname, 'service_behavior.py'), main], {
      // Proxy settings are dropped: the stand-in answers in-process, and HTTPX would
      // otherwise try to set up a proxy transport (and fail for SOCKS without socksio).
      encoding: 'utf8', timeout: 60_000, env: { ...withoutProxies(process.env), PYTHONDONTWRITEBYTECODE: '1' },
    });
    if (r.error?.code === 'ETIMEDOUT') result = { problem: 'loading and calling reviews/app/main.py took longer than 60 seconds: look for a loop or a call that waits forever' };
    else if (r.error) result = { problem: `the lab's Python could not start (${r.error.code}): ${SETUP}` };
    else {
      try {
        result = JSON.parse(r.stdout.trim().split('\n').at(-1));
      } catch {
        const tail = (r.stderr || r.stdout || '').trim().split('\n').at(-1) ?? '';
        result = { problem: `the service check could not run (${tail.slice(0, 200)}): if this names a missing module, ${SETUP}` };
      }
      if (result && result.loaded === false) result = { problem: `reviews/app/main.py could not be loaded: ${result.error}` };
    }
  }
  serviceRuns.set(dir, result);
  return result;
}

// ---------- workflow steps that can see a secret ----------

export function findBash() {
  if (process.env.LAB_BASH) return process.env.LAB_BASH;
  if (process.platform !== 'win32') return existsSync('/bin/bash') ? '/bin/bash' : 'bash';
  // Git for Windows ships bash; find it next to the git that is on PATH.
  const g = spawnSync('git', ['--exec-path'], { encoding: 'utf8' });
  const candidates = [];
  if (!g.error && g.stdout) candidates.push(path.resolve(g.stdout.trim(), '..', '..', '..', 'bin', 'bash.exe'));
  candidates.push('C:\\Program Files\\Git\\bin\\bash.exe');
  return candidates.find((c) => existsSync(c)) ?? null;
}

const STUB_DOCKER = `#!/bin/sh
# Stand-in docker for the lab: records its arguments and, for login, what arrives on stdin.
n=$(ls "$LAB_DOCKER_CALLS" | wc -l | tr -d ' ')
printf '%s\\n' "$@" > "$LAB_DOCKER_CALLS/call-$n.args"
case " $* " in *" login "*) cat > "$LAB_DOCKER_CALLS/call-$n.stdin"; echo "Login Succeeded";; esac
exit 0
`;

const EXPR = /\$\{\{\s*([\s\S]*?)\s*\}\}/g;
const CONTEXT_REF = /^(secrets|env|github)\s*(?:\.\s*([A-Za-z_][A-Za-z0-9_]*)|\[\s*'([^']+)'\s*\])$/;
// The steps run as on a push to main.
const GITHUB = { event_name: 'push', ref: 'refs/heads/main', ref_name: 'main' };
// Fill in ${{ secrets.NAME }}, ${{ env.NAME }} and ${{ github.event_name / ref / ref_name }};
// any other expression gets a fixed placeholder, because only those are modelled.
function fill(text, secretValue, envValues) {
  return String(text ?? '').replace(EXPR, (_, inner) => {
    const m = inner.trim().match(CONTEXT_REF);
    if (!m) return 'lab-expression-not-evaluated';
    const name = m[2] ?? m[3];
    if (m[1] === 'secrets') return secretValue(name);
    if (m[1] === 'github') return GITHUB[name] ?? 'lab-expression-not-evaluated';
    return envValues[name] ?? '';
  });
}

// GitHub's command for each shell (workflow syntax reference, jobs.<job_id>.steps[*].shell):
// unspecified on Linux: bash -e {0}; bash: bash --noprofile --norc -eo pipefail {0}; sh: sh -e {0};
// a custom template such as "bash -x {0}" runs as written. Returns [command, args before the file, args after] or null.
function shellCommand(shell, bash) {
  const sh = process.platform === 'win32' && existsSync(path.join(path.dirname(bash), 'sh.exe')) ? path.join(path.dirname(bash), 'sh.exe') : 'sh';
  const program = (name) => (name === 'bash' ? bash : sh);
  if (!shell) return [bash, ['-e'], []];
  const s = String(shell).trim();
  if (s === 'bash') return [bash, ['--noprofile', '--norc', '-eo', 'pipefail'], []];
  if (s === 'sh') return [sh, ['-e'], []];
  const words = s.split(/\s+/);
  const at = words.indexOf('{0}');
  if (!/^(bash|sh)$/.test(words[0]) || at < 1) return null;
  return [program(words[0]), words.slice(1, at), words.slice(at + 1)];
}

const usesSecrets = (text) => /\$\{\{[^}]*\bsecrets\b/.test(String(text ?? ''));
const isLoginStep = (step) => /\bdocker\b[\s\S]*\blogin\b/.test(String(step?.run ?? ''));

const secretRuns = new Map();
// Runs every run: step that can see a secret, and every docker login step.
// Returns { problem } or { secrets, steps: [{ job, name, login, status, log, docker: [{args, stdin}] }] }.
export function secretSteps(dir, workflow) {
  if (secretRuns.has(dir)) return secretRuns.get(dir);
  const result = runSecretSteps(workflow);
  secretRuns.set(dir, result);
  return result;
}

function runSecretSteps(workflow) {
  const bash = findBash();
  if (!bash) return { problem: 'bash was not found: this lab runs the workflow\'s secret-using steps with bash (on Windows it comes with Git for Windows)' };
  const tag = randomBytes(6).toString('hex');
  const secrets = {};
  const secretValue = (name) => (secrets[name] ??= `lab-${String(name).toLowerCase().replace(/_/g, '-')}-${tag}`);
  secretValue('REGISTRY_USERNAME');
  secretValue('REGISTRY_PASSWORD');
  const out = [];
  const jobs = workflow?.jobs && typeof workflow.jobs === 'object' ? workflow.jobs : {};
  for (const [jobId, job] of Object.entries(jobs)) {
    const steps = Array.isArray(job?.steps) ? job.steps : [];
    steps.forEach((step, index) => {
      if (!step || step.run === undefined) return;
      const scopes = [workflow.env, job.env, step.env].filter((s) => s && typeof s === 'object');
      const seesSecret = scopes.some((s) => Object.values(s).some(usesSecrets)) || usesSecrets(step.run);
      if (!seesSecret && !isLoginStep(step)) return;
      const name = step.name ? String(step.name) : `${jobId} step ${index + 1}`;
      const shell = step.shell ?? job.defaults?.run?.shell ?? workflow.defaults?.run?.shell;
      const how = shellCommand(shell, bash);
      if (!how) {
        out.push({ job: jobId, name, login: isLoginStep(step), problem: `the step "${name}" sets shell: ${shell}; this lab runs secret-using steps only with bash or sh (or a "bash ... {0}" template)` });
        return;
      }
      const envValues = {};
      for (const scope of scopes) for (const [k, v] of Object.entries(scope)) envValues[k] = fill(v, secretValue, envValues);
      out.push({ job: jobId, name, login: isLoginStep(step), ...runStep(bash, how, fill(step.run, secretValue, envValues), envValues) });
    });
  }
  return { secrets, steps: out };
}

function runStep(bash, [shellCmd, shellArgs, shellTail], script, envValues) {
  const tmp = mkdtempSync(path.join(os.tmpdir(), 'lab-step-'));
  try {
    const stub = path.join(tmp, 'stub-bin');
    const calls = path.join(tmp, 'docker-calls');
    const work = path.join(tmp, 'work');
    const runner = path.join(tmp, 'runner');
    for (const d of [stub, calls, work, runner, path.join(tmp, 'home'), path.join(tmp, 'docker-config')]) mkdirSync(d);
    // The files a runner gives every step for outputs, env, PATH and the job summary.
    const runnerFiles = Object.fromEntries(['GITHUB_ENV', 'GITHUB_OUTPUT', 'GITHUB_PATH', 'GITHUB_STEP_SUMMARY'].map((k) => {
      const f = path.join(runner, k.toLowerCase());
      writeFileSync(f, '');
      return [k, f];
    }));
    writeFileSync(path.join(stub, 'docker'), STUB_DOCKER);
    chmodSync(path.join(stub, 'docker'), 0o755);
    const env = {
      ...Object.fromEntries(['SYSTEMROOT', 'WINDIR', 'TEMP', 'TMP', 'COMSPEC'].filter((k) => process.env[k]).map((k) => [k, process.env[k]])),
      PATH: `${stub}${path.delimiter}${process.env.PATH ?? ''}`,
      HOME: path.join(tmp, 'home'),
      DOCKER_CONFIG: path.join(tmp, 'docker-config'),
      LANG: 'C',
      GITHUB_ACTIONS: 'true',
      CI: 'true',
      GITHUB_EVENT_NAME: GITHUB.event_name,
      GITHUB_REF: GITHUB.ref,
      GITHUB_REF_NAME: GITHUB.ref_name,
      GITHUB_WORKSPACE: work,
      ...runnerFiles,
      ...envValues,
      LAB_DOCKER_CALLS: calls,
    };
    // Make sure the stand-in, not a real docker, is the one the step will run.
    const which = spawnSync(bash, ['--noprofile', '--norc', '-c', 'command -v docker'], { encoding: 'utf8', env, cwd: work, stdio: ['ignore', 'pipe', 'pipe'] });
    if (!String(which.stdout).includes(path.basename(tmp))) return { problem: 'the stand-in docker could not be put first on PATH, so the secret-using steps were not run' };
    const file = path.join(tmp, 'step.sh');
    writeFileSync(file, script);
    const r = spawnSync(shellCmd, [...shellArgs, file, ...shellTail], { encoding: 'utf8', env, cwd: work, stdio: ['ignore', 'pipe', 'pipe'], timeout: 20_000, killSignal: 'SIGKILL' });
    const docker = readdirSync(calls).filter((f) => f.endsWith('.args')).sort().map((f) => {
      const stdinFile = path.join(calls, f.replace(/\.args$/, '.stdin'));
      return {
        args: readFileSync(path.join(calls, f), 'utf8').replace(/\n$/, '').split('\n'),
        stdin: existsSync(stdinFile) ? readFileSync(stdinFile, 'utf8') : null,
      };
    });
    return {
      status: r.error?.code === 'ETIMEDOUT' ? 'timeout' : r.status,
      log: `${r.stdout ?? ''}${r.stderr ?? ''}`,
      docker,
    };
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
}
