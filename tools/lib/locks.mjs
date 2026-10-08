import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { exists, fileRecord, posix, readJson, relative, sha256, walk } from './common.mjs';

async function records(root, files) {
  const result = [];
  for (const file of [...files].sort()) result.push(await fileRecord(root, file));
  return result;
}

function jsonBindings(value) {
  const result = [];
  const visit = (item, field = '$') => {
    if (Array.isArray(item)) return item.forEach((entry, i) => visit(entry, `${field}[${i}]`));
    if (!item || typeof item !== 'object') return;
    for (const [key, child] of Object.entries(item)) {
      const here = field === '$' ? key : `${field}.${key}`;
      if ((key === 'reviewedSha256' || key === 'artifactSha256') && typeof child === 'string') result.push({ field: here, artifact: 'artifact.html', sha256: child });
      else if (key === 'artifactHashes' && child && typeof child === 'object' && !Array.isArray(child)) {
        for (const [artifact, hash] of Object.entries(child)) if (typeof hash === 'string') result.push({ field: `${here}.${artifact}`, artifact, sha256: hash });
      } else visit(child, here);
    }
  };
  visit(value);
  return result;
}

async function evidenceBindings(repoRoot, evidenceFiles, artifactRootFor) {
  const output = [];
  for (const evidenceFile of [...evidenceFiles].sort()) {
    if (path.extname(evidenceFile) !== '.json') continue;
    let value;
    try { value = await readJson(evidenceFile); } catch { continue; }
    for (const binding of jsonBindings(value)) {
      const base = artifactRootFor(evidenceFile);
      if (!base) continue;
      const artifactFile = path.resolve(base, binding.artifact);
      if (!artifactFile.startsWith(`${path.resolve(repoRoot)}${path.sep}`) || !await exists(artifactFile)) {
        throw new Error(`${relative(repoRoot, evidenceFile)}: binding ${binding.field} names missing artifact ${binding.artifact}`);
      }
      const current = sha256(await readFile(artifactFile));
      if (current !== binding.sha256) throw new Error(`${relative(repoRoot, evidenceFile)}: binding ${binding.field} is stale for ${relative(repoRoot, artifactFile)}`);
      output.push({ evidencePath: relative(repoRoot, evidenceFile), field: binding.field, artifactPath: relative(repoRoot, artifactFile), sha256: current });
    }
  }
  return output;
}

export async function createModuleLock(repoRoot, courseId, moduleId) {
  const moduleRoot = path.join(repoRoot, courseId, moduleId);
  const moduleWalk = await walk(moduleRoot);
  const moduleFiles = moduleWalk.files.filter(file => path.basename(file) !== 'module.lock.json');
  const evidenceRoot = path.join(repoRoot, 'evidence', courseId, moduleId);
  const evidenceWalk = await walk(evidenceRoot);
  const allFiles = [...moduleFiles, ...evidenceWalk.files];
  const bindings = await evidenceBindings(repoRoot, evidenceWalk.files, evidenceFile => {
    const rel = path.relative(evidenceRoot, evidenceFile).split(path.sep);
    if (rel.length < 2) return null;
    return path.join(moduleRoot, rel[0]);
  });
  return {
    schemaVersion: 1,
    course: courseId,
    module: moduleId,
    files: await records(repoRoot, allFiles),
    evidenceBindings: bindings.map(binding => ({ topic: path.relative(evidenceRoot, path.dirname(path.join(repoRoot, binding.evidencePath))).split(path.sep)[0], ...binding })).sort((a, b) => `${a.evidencePath}:${a.field}`.localeCompare(`${b.evidencePath}:${b.field}`))
  };
}

export async function createCourseLock(repoRoot, courseId) {
  const courseRoot = path.join(repoRoot, courseId);
  const courseManifest = await readJson(path.join(courseRoot, 'course.json'));
  const files = [path.join(courseRoot, 'course.json')];
  for (const name of ['assessments', 'coding-lab']) files.push(...(await walk(path.join(courseRoot, name))).files);
  const evidenceRoot = path.join(repoRoot, 'evidence', courseId);
  const evidenceWalk = await walk(evidenceRoot);
  const moduleIds = new Set(courseManifest.moduleOrder ?? []);
  const courseEvidence = evidenceWalk.files.filter(file => {
    const first = path.relative(evidenceRoot, file).split(path.sep)[0];
    return !moduleIds.has(first);
  });
  files.push(...courseEvidence);
  const bindings = await evidenceBindings(repoRoot, courseEvidence, () => courseRoot);
  return { schemaVersion: 1, course: courseId, files: await records(repoRoot, files), evidenceBindings: bindings.sort((a, b) => `${a.evidencePath}:${a.field}`.localeCompare(`${b.evidencePath}:${b.field}`)) };
}

export function sameLock(actual, expected) { return JSON.stringify(actual) === JSON.stringify(expected); }
