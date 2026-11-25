// Maintainer regression evidence, not part of the learner bundle. After `npm ci` in the lab's tests folder, run
// `node authoring/evidence/containers-cicd/containers-and-compose/coding-lab-bypass/run-bypass.mjs <cases-dir>`
// from the repository root. The cases live in private staging, never in the repository, because each case
// project is a near-complete solution with one deliberate mistake.
// Each folder in <cases-dir> holds a project and case.json naming the rule that must reject it (or null for a
// valid variant every rule must accept) and the rules that must still accept it.
// A file named dotenv is copied as .env into a temporary copy, because .env files are never committed.
import { readdirSync, readFileSync, cpSync, renameSync, existsSync, mkdtempSync, rmSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { RULES } from '../../../../../containers-cicd/containers-and-compose/coding-lab/tests/lab.mjs';

const root = process.argv[2] ? path.resolve(process.argv[2]) : null;
if (!root || !existsSync(root)) {
  console.error('usage: node run-bypass.mjs <private cases directory>');
  process.exit(2);
}
let failed = 0;
let total = 0;
for (const name of readdirSync(root).sort()) {
  const dir = path.join(root, name);
  const c = JSON.parse(readFileSync(path.join(dir, 'case.json'), 'utf8'));
  const project = mkdtempSync(path.join(os.tmpdir(), 'lab-bypass-'));
  cpSync(path.join(dir, 'project'), project, { recursive: true });
  if (existsSync(path.join(project, 'dotenv'))) renameSync(path.join(project, 'dotenv'), path.join(project, '.env'));
  const rejected = c.rejects === null || RULES[c.rejects](project) !== null;
  const kept = (c.accepts || []).filter((id) => RULES[id](project) !== null);
  const ok = rejected && kept.length === 0;
  rmSync(project, { recursive: true, force: true });
  total += 1;
  if (!ok) failed += 1;
  const what = c.rejects === null ? 'valid variant' : `${c.rejects} ${rejected ? 'rejects' : 'ACCEPTS'} it`;
  console.log(`${ok ? 'ok' : 'not ok'} - case ${total}: ${what}${kept.length ? `; unexpectedly rejected by ${kept.join(', ')}` : ''}`);
}
console.log(failed ? `# ${failed} of ${total} bypass case(s) not caught` : `# all ${total} bypass cases are caught`);
process.exitCode = failed ? 1 : 0;
