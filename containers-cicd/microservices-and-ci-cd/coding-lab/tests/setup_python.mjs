// One-time setup, part 2 (npm run setup runs npm ci first): creates the lab's Python
// environment in ../.venv and installs the pinned packages from requirements.txt, so
// tests 24-26 can load the reviews service. Needs the network once; nothing else does.
import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import path from 'node:path';

const MIN = { major: 3, minor: 11 }; // the pinned starlette and annotated-doc need 3.11 or later
const venv = path.join(import.meta.dirname, '..', '.venv');
const venvPython = process.platform === 'win32' ? path.join(venv, 'Scripts', 'python.exe') : path.join(venv, 'bin', 'python');
const requirements = path.join(import.meta.dirname, 'requirements.txt');

function version(cmd, args) {
  const r = spawnSync(cmd, [...args, '-c', 'import sys; print("%d.%d" % sys.version_info[:2])'], { encoding: 'utf8' });
  if (r.error || r.status !== 0) return null;
  const [major, minor] = r.stdout.trim().split('.').map(Number);
  return { cmd, args, major, minor, text: r.stdout.trim() };
}
const recentEnough = (p) => p && p.major === MIN.major && p.minor >= MIN.minor;

const candidates = process.platform === 'win32'
  ? [['py', ['-3']], ['python', []], ['python3', []]]
  : [['python3', []], ['python', []]];
const found = candidates.map(([c, a]) => version(c, a)).filter(Boolean);
const python = found.find(recentEnough);
if (!python) {
  const seen = found.map((p) => `${p.cmd} ${p.text}`).join(', ') || 'none';
  console.error(`setup needs Python ${MIN.major}.${MIN.minor} or later (found: ${seen}). Install it from python.org, then run npm run setup again.`);
  process.exit(1);
}

// Reuse .venv only when its Python is recent enough and has pip; otherwise rebuild it
// (venv --clear empties that folder first; it touches nothing else).
const existing = existsSync(venvPython) ? version(venvPython, []) : null;
const hasPip = existing && spawnSync(venvPython, ['-m', 'pip', '--version'], { encoding: 'utf8' }).status === 0;
if (!recentEnough(existing) || !hasPip) {
  const why = !existing ? 'creating' : `rebuilding (it had ${hasPip ? `Python ${existing.text}` : 'no working pip'})`;
  console.log(`${why} the lab's Python environment with ${python.cmd} ${python.text} in .venv`);
  const r = spawnSync(python.cmd, [...python.args, '-m', 'venv', '--clear', venv], { stdio: 'inherit' });
  if (r.status !== 0) process.exit(r.status ?? 1);
}
// Prebuilt wheels only, exactly the pinned versions: nothing is compiled or run from a source package.
const pip = spawnSync(venvPython, ['-m', 'pip', 'install', '--disable-pip-version-check', '--quiet', '--only-binary=:all:', '-r', requirements], { stdio: 'inherit' });
if (pip.status !== 0) {
  console.error('installing the pinned Python packages failed: check the network, then run npm run setup again (if it keeps failing, delete the .venv folder next to tests and retry)');
  process.exit(pip.status ?? 1);
}
console.log('setup done: the tests now run offline');
