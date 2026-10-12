#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { evidencePath } from "../lib/common.mjs";

function fail(message) {
  console.error(`verify-import: ${message}`);
  process.exit(1);
}

function git(args, options = {}) {
  try {
    return execFileSync("git", args, { ...options });
  } catch (cause) {
    const detail = cause.stderr?.toString().trim() || cause.message;
    fail(detail);
  }
}

function digest(bytes) {
  return createHash("sha256").update(bytes).digest("hex");
}

const [commitArg, moduleArg, ...extra] = process.argv.slice(2);
if (!commitArg || !moduleArg || extra.length) {
  fail("usage: verify-import.mjs <commit> <course>/<module>");
}
const parts = moduleArg.split("/");
if (parts.length !== 2 || parts.some((part) => !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(part))) {
  fail("module must be <course>/<module> using slug ids");
}
const [course, moduleId] = parts;
const root = process.cwd();
const indexPath = evidencePath(root, "legacy", "course-1-packages.json");
let index;
try {
  index = JSON.parse(await readFile(indexPath, "utf8"));
} catch (cause) {
  fail(`cannot read ${path.relative(root, indexPath)}: ${cause.message}`);
}
const legacyPackage = index.packages?.find(
  (item) => item.name === index.authoritativePackage && item.authoritative === true,
);
if (!legacyPackage) fail("authoritative package is missing from the legacy index");
const expected = legacyPackage.files.filter(
  (file) => file.role === "learner-page" && file.path.startsWith(`${moduleId}/`),
);
if (!expected.length) fail(`legacy index has no learner pages for ${moduleId}`);

const commit = git(["rev-parse", "--verify", `${commitArg}^{commit}`], { encoding: "utf8" }).trim();
const added = git(
  ["diff-tree", "--root", "--no-commit-id", "--name-only", "--diff-filter=A", "-r", commit],
  { encoding: "utf8" },
)
  .split("\n")
  .filter(Boolean)
  .filter((file) => file.startsWith(`${course}/${moduleId}/`) && file.endsWith("/artifact.html"));
if (!added.length) fail(`commit ${commit} adds no artifact.html files under ${course}/${moduleId}`);

const expectedByHash = new Map();
for (const file of expected) {
  const list = expectedByHash.get(file.sha256) ?? [];
  list.push(file);
  expectedByHash.set(file.sha256, list);
}
const matches = [];
const problems = [];
for (const targetPath of added.sort()) {
  const bytes = git(["show", `${commit}:${targetPath}`]);
  const sha256 = digest(bytes);
  const candidates = expectedByHash.get(sha256) ?? [];
  const source = candidates.shift();
  if (!source) {
    problems.push(`${targetPath} has unindexed sha256 ${sha256}`);
    continue;
  }
  matches.push({ targetPath, sourcePath: source.path, sha256, bytes: bytes.length });
}
const missing = [];
for (const files of expectedByHash.values()) {
  for (const file of files) missing.push(file.path);
}
if (added.length !== expected.length) {
  problems.push(`expected ${expected.length} imported pages but commit adds ${added.length}`);
}
if (missing.length) problems.push(`missing authoritative pages: ${missing.sort().join(", ")}`);
if (problems.length) fail(problems.join("; "));

const receiptPath = evidencePath(root, course, moduleId, "import-fidelity.txt");
const lines = [
  "PEP course-1 import fidelity receipt",
  `commit: ${commit}`,
  `module: ${course}/${moduleId}`,
  `authoritative package: ${legacyPackage.name}`,
  `result: pass (${matches.length} learner pages byte-identical)`,
  "files:",
];
for (const match of matches) {
  lines.push(
    `- ${match.targetPath} <- ${match.sourcePath} | sha256 ${match.sha256} | bytes ${match.bytes}`,
  );
}
await mkdir(path.dirname(receiptPath), { recursive: true });
await writeFile(receiptPath, `${lines.join("\n")}\n`);
console.log(path.relative(root, receiptPath));
