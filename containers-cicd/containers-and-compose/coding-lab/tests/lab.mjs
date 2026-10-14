// Shared readers for the public lab tests. They read files as text and YAML;
// nothing here builds an image, starts a container or calls a daemon.
import { readFileSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { parse } from 'yaml';

// The learner project: the starter folder, or LAB_PROJECT when set (for a copy elsewhere).
export const PROJECT = path.resolve(process.env.LAB_PROJECT || path.join(import.meta.dirname, '..', 'starter'));

export function read(rel) {
  const file = path.join(PROJECT, rel);
  return existsSync(file) ? readFileSync(file, 'utf8') : '';
}

// Dockerfile: join continuation lines, drop comments, split into stages at each FROM.
export function dockerfile(rel) {
  const lines = read(rel).replace(/\\\r?\n/g, ' ').split(/\r?\n/)
    .map((l) => l.trim()).filter((l) => l && !l.startsWith('#'));
  const stages = [];
  for (const line of lines) {
    const m = line.match(/^(\S+)\s*(.*)$/);
    const op = m[1].toUpperCase();
    const args = m[2];
    if (op === 'FROM') {
      const f = args.split(/\s+/).filter((w) => !w.startsWith('--'));
      stages.push({ image: (f[0] || '').toLowerCase(), name: /^as$/i.test(f[1] || '') ? (f[2] || '').toLowerCase() : null, steps: [] });
    } else if (stages.length) {
      stages.at(-1).steps.push({ op, args });
    }
  }
  return stages;
}

export const copyFrom = (step) => (step.args.match(/--from=(\S+)/) || [])[1]?.toLowerCase() ?? null;
export const copyArgs = (step) => step.args.split(/\s+/).filter((w) => !w.startsWith('--'));

// .dockerignore entries, normalised: no leading ./ or /, no trailing /, no leading **/.
export function ignoreEntries(rel) {
  return read(rel).split(/\r?\n/).map((l) => l.trim()).filter((l) => l && !l.startsWith('#'))
    .map((l) => l.replace(/^\.\//, '').replace(/^\/+/, '').replace(/^\*\*\//, '').replace(/\/+$/, ''));
}

export function compose() {
  try {
    return parse(read('compose.yaml')) || {};
  } catch {
    return {};
  }
}

// environment as a plain object, from map or list syntax.
export function env(service) {
  const e = service?.environment;
  if (Array.isArray(e)) {
    return Object.fromEntries(e.map((x) => { const i = String(x).indexOf('='); return i < 0 ? [String(x), undefined] : [String(x).slice(0, i), String(x).slice(i + 1)]; }));
  }
  return e && typeof e === 'object' ? e : {};
}

export function envFiles(service) {
  const f = service?.env_file;
  if (!f) return [];
  return (Array.isArray(f) ? f : [f]).map((x) => (typeof x === 'string' ? x : x.path)).filter(Boolean)
    .map((p) => p.replace(/^\.\//, ''));
}

export function gitignored(rel) {
  const patterns = read('.gitignore').split(/\r?\n/).map((l) => l.trim()).filter((l) => l && !l.startsWith('#'));
  const name = rel.replace(/^\.\//, '');
  return patterns.some((p) => {
    const q = p.replace(/^\//, '').replace(/^\*\*\//, '');
    return q === name || q === path.basename(name);
  });
}

// True when Git tracks the file. Outside a Git work tree, or without Git, nothing is tracked.
export function trackedByGit(rel) {
  try {
    execFileSync('git', ['ls-files', '--error-unmatch', '--', rel], { cwd: PROJECT, stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}
