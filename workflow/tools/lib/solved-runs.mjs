import { readFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { error, posix, readJson, relative, sha256, walk } from "./common.mjs";

const RECORD_NAME_RE = /^(?:lab-run|[a-z0-9]+(?:-[a-z0-9]+)*-solved-run)\.json$/;
const HASH_RE = /^[a-f0-9]{64}$/;
const SAFE_PATH_RE = /^(?!\/)(?!.*\\)(?!.*(?:^|\/)\.{1,2}(?:\/|$))(?!.*\/\/)[A-Za-z0-9._-]+(?:\/[A-Za-z0-9._-]+)*$/;
const PRIVATE_PATH_RE = /(^|[-_.\/])(?:answer[-_ ]?key|rubric|(?:reference|instructor|private)[-_ ]?solution|hidden[-_ ]?tests?)([-_.\/]|$)/i;

function normalizedPath(value) {
  return typeof value === "string" && SAFE_PATH_RE.test(value) && path.posix.normalize(value) === value;
}

function bindings(record) {
  if (record?.artifactHashes && typeof record.artifactHashes === "object" && !Array.isArray(record.artifactHashes)) {
    return Object.entries(record.artifactHashes).map(([file, hash]) => ({
      file: normalizedPath(file) && normalizedPath(record.lab) ? `${record.lab}/${file}` : file,
      sourcePath: file,
      hash,
    }));
  }
  if (Array.isArray(record?.files)) {
    return record.files.map((entry) => ({
      file: entry?.file,
      sourcePath: entry?.file,
      hash: entry?.reviewedSha256,
    }));
  }
  return [];
}

function trackedFiles(repoRoot, lab) {
  const result = spawnSync("git", ["ls-files", "-z", "--cached", "--", lab], {
    cwd: repoRoot,
    encoding: "utf8",
  });
  if (result.status !== 0) {
    const detail = result.stderr.trim() || `git ls-files exited ${result.status}`;
    throw new Error(`cannot list tracked lab files: ${detail}`);
  }
  return result.stdout.split("\0").filter(Boolean).map(posix).sort();
}

export async function validateSolvedRunRecord(repoRoot, recordFile) {
  const display = relative(repoRoot, recordFile);
  const out = [];
  let record;
  try {
    record = await readJson(recordFile);
  } catch (cause) {
    return [error("T06", display, `invalid solved-run JSON: ${cause.message}`)];
  }
  if (!normalizedPath(record.lab) || !record.lab.endsWith("/coding-lab")) {
    return [error("T06", display, "lab must be a normalized repository-relative coding-lab path")];
  }

  const hasArtifactHashes =
    record.artifactHashes && typeof record.artifactHashes === "object" && !Array.isArray(record.artifactHashes);
  const hasFiles = Array.isArray(record.files);
  if (hasArtifactHashes === hasFiles) {
    return [error("T06", display, "solved-run record must have exactly one file-binding collection")];
  }

  const entries = bindings(record);
  const seen = new Set();
  for (const entry of entries) {
    if (!normalizedPath(entry.sourcePath) || !normalizedPath(entry.file)) {
      out.push(error("T06", display, `malformed lab-file binding path ${JSON.stringify(entry.sourcePath)}`));
      continue;
    }
    if (PRIVATE_PATH_RE.test(entry.file)) {
      out.push(error("T06", display, `private solution material cannot be bound: ${entry.file}`));
    }
    if (!entry.file.startsWith(`${record.lab}/`)) {
      out.push(error("T06", display, `lab-file binding is outside ${record.lab}: ${entry.file}`));
    }
    if (seen.has(entry.file)) {
      out.push(error("T06", display, `duplicate lab-file binding: ${entry.file}`));
    }
    seen.add(entry.file);
    if (!HASH_RE.test(entry.hash)) {
      out.push(error("T06", display, `binding for ${entry.file} must use a lowercase SHA-256`));
    }
  }

  let expected;
  try {
    expected = trackedFiles(repoRoot, record.lab);
  } catch (cause) {
    out.push(error("T06", display, cause.message));
    return out;
  }
  const expectedSet = new Set(expected);
  for (const file of expected) {
    if (!seen.has(file)) out.push(error("T06", display, `missing lab-file binding: ${file}`));
  }
  for (const file of [...seen].sort()) {
    if (!expectedSet.has(file)) out.push(error("T06", display, `extra lab-file binding: ${file}`));
  }

  for (const entry of entries) {
    if (!normalizedPath(entry.file) || !HASH_RE.test(entry.hash) || !expectedSet.has(entry.file)) continue;
    try {
      const actual = sha256(await readFile(path.join(repoRoot, ...entry.file.split("/"))));
      if (actual !== entry.hash) out.push(error("T06", display, `stale lab-file binding: ${entry.file}`));
    } catch (cause) {
      if (cause.code === "ENOENT") out.push(error("T06", display, `bound lab file is missing: ${entry.file}`));
      else throw cause;
    }
  }
  return out;
}

export async function validateSolvedRuns(repoRoot, evidenceRoot) {
  const out = [];
  for (const file of (await walk(evidenceRoot)).files) {
    if (RECORD_NAME_RE.test(path.basename(file))) {
      out.push(...(await validateSolvedRunRecord(repoRoot, file)));
    }
  }
  return out;
}
