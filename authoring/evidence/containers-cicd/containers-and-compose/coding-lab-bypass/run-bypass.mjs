// Maintainer regression evidence, not part of the learner bundle. After `npm ci` in the lab's tests folder, run
// `node authoring/evidence/containers-cicd/containers-and-compose/coding-lab-bypass/run-bypass.mjs` from the repository root.
// Each folder in cases/ holds a deliberately wrong project fragment and case.json naming
// the rule that must reject it and the rules on the same files that must still accept it.
// A file named dotenv is copied as .env into a temporary copy, because .env files are never committed.
import { readdirSync, readFileSync, cpSync, renameSync, existsSync, mkdtempSync, rmSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { RULES } from '../../../../../containers-cicd/containers-and-compose/coding-lab/tests/lab.mjs';

const root = path.join(import.meta.dirname, 'cases');
let failed = 0;
for (const name of readdirSync(root).sort()) {
  const dir = path.join(root, name);
  const c = JSON.parse(readFileSync(path.join(dir, 'case.json'), 'utf8'));
  const project = mkdtempSync(path.join(os.tmpdir(), 'lab-bypass-'));
  cpSync(path.join(dir, 'project'), project, { recursive: true });
  if (existsSync(path.join(project, 'dotenv'))) renameSync(path.join(project, 'dotenv'), path.join(project, '.env'));
  const rejected = RULES[c.rejects](project) !== null;
  const kept = (c.accepts || []).filter((id) => RULES[id](project) !== null);
  const ok = rejected && kept.length === 0;
  rmSync(project, { recursive: true, force: true });
  if (!ok) failed++;
  console.log(`${ok ? 'ok' : 'not ok'} - ${name}: ${c.rejects} ${rejected ? 'rejects' : 'ACCEPTS'} it${kept.length ? `; unexpectedly rejected by ${kept.join(', ')}` : ''}`);
}
console.log(failed ? `# ${failed} bypass case(s) not caught` : '# every bypass case is caught');
process.exitCode = failed ? 1 : 0;
