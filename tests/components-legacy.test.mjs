import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdtemp, mkdir, readFile, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const repo = path.resolve(import.meta.dirname, "..");
const pep = path.join(repo, "tools", "pep");
const verifyImport = path.join(repo, "tools", "legacy", "verify-import.mjs");

function runNode(script, args, cwd = repo) {
  return spawnSync(process.execPath, [script, ...args], { cwd, encoding: "utf8" });
}

function runGit(cwd, args) {
  const result = spawnSync("git", args, { cwd, encoding: "utf8" });
  assert.equal(result.status, 0, result.stderr);
  return result.stdout.trim();
}

function sha256(text) {
  return createHash("sha256").update(text).digest("hex");
}

for (const name of ["matching", "plain"]) {
  test(`T24 accepts ${name} component fixture`, () => {
    const fixture = path.join(repo, "tests", "fixtures", "components", name);
    const result = runNode(pep, ["check", "--only", "T24", fixture]);
    assert.equal(result.status, 0, result.stderr);
  });
}

for (const [name, message] of [
  ["drifted", "block has drifted"],
  ["undeclared", "is not declared"],
  ["version-mismatch", "does not match topic.json"],
]) {
  test(`T24 rejects ${name} component fixture`, () => {
    const fixture = path.join(repo, "tests", "fixtures", "components", name);
    const result = runNode(pep, ["check", "--only", "T24", fixture]);
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, new RegExp(message.replaceAll(".", "\\.")));
  });
}

test("legacy course package schema rejects an invalid index", () => {
  const fixture = path.join(repo, "tests", "fixtures", "legacy-schema-course");
  const result = runNode(pep, ["check", "--only", "T01", fixture]);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /legacy-schema-course\/evidence\/legacy\/course-1-packages\.json/);
});

test("legacy tournament schema rejects an invalid index", () => {
  const fixture = path.join(repo, "tests", "fixtures", "legacy-schema-tournament");
  const result = runNode(pep, ["check", "--only", "T01", fixture]);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /legacy-schema-tournament\/evidence\/legacy\/tournament\.json/);
});

async function syntheticImportRepository(drift = false) {
  const root = await mkdtemp(path.join(os.tmpdir(), "pep-import-"));
  runGit(root, ["init", "-b", "main"]);
  runGit(root, ["config", "user.email", "tests@pep.local"]);
  runGit(root, ["config", "user.name", "PEP Tests"]);
  const pages = ["first legacy page\n", "second legacy page\n"];
  const files = pages.map((text, index) => ({
    path: `demo-module/0${index + 1}-page.html`,
    sha256: sha256(text),
    bytes: Buffer.byteLength(text),
    role: "learner-page",
  }));
  const legacy = {
    schemaVersion: 1,
    authoritativePackage: "authoritative",
    packages: [
      {
        name: "authoritative",
        rootPath: "/read-only/authoritative",
        authoritative: true,
        files,
      },
    ],
  };
  await mkdir(path.join(root, "evidence", "legacy"), { recursive: true });
  await writeFile(
    path.join(root, "evidence", "legacy", "course-1-packages.json"),
    `${JSON.stringify(legacy, null, 2)}\n`,
  );
  runGit(root, ["add", "."]);
  runGit(root, ["commit", "-m", "chore: add legacy index"]);
  for (let index = 0; index < pages.length; index++) {
    const target = path.join(
      root,
      "demo-course",
      "demo-module",
      `topic-${index + 1}`,
      "artifact.html",
    );
    await mkdir(path.dirname(target), { recursive: true });
    const text = drift && index === 1 ? "drifted page\n" : pages[index];
    await writeFile(target, text);
  }
  runGit(root, ["add", "."]);
  runGit(root, ["commit", "-m", "feat: import module pages"]);
  return { root, commit: runGit(root, ["rev-parse", "HEAD"]) };
}

test("verify-import writes a receipt for byte-identical synthetic imports", async () => {
  const { root, commit } = await syntheticImportRepository();
  const result = runNode(verifyImport, [commit, "demo-course/demo-module"], root);
  assert.equal(result.status, 0, result.stderr);
  const receipt = await readFile(
    path.join(root, "evidence", "demo-course", "demo-module", "import-fidelity.txt"),
    "utf8",
  );
  assert.match(receipt, /result: pass \(2 learner pages byte-identical\)/);
  assert.match(receipt, new RegExp(`commit: ${commit}`));
});

test("verify-import fails when a synthetic import drifts", async () => {
  const { root, commit } = await syntheticImportRepository(true);
  const result = runNode(verifyImport, [commit, "demo-course/demo-module"], root);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /unindexed sha256/);
});
