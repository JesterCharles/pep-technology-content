import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { cp, mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import os from "node:os";
import path from "node:path";
import test from "node:test";

const repo = path.resolve(import.meta.dirname, "../..");
const pep = path.join(repo, "workflow/tools/pep");
const lab = "demo-course/demo-module/coding-lab";
const evidence = "workflow/evidence/demo-course/demo-module/coding-lab-solved-run.json";

function hash(bytes) {
  return createHash("sha256").update(bytes).digest("hex");
}

async function put(root, file, contents) {
  const target = path.join(root, file);
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, contents);
}

function run(root, ...args) {
  return spawnSync(process.execPath, [pep, ...args], { cwd: root, encoding: "utf8" });
}

function git(root, ...args) {
  const result = spawnSync("git", args, { cwd: root, encoding: "utf8" });
  assert.equal(result.status, 0, result.stderr);
}

function filesRecord(bindings, overrides = {}) {
  return {
    schemaVersion: 1,
    lab,
    record: "solved at 0123456789abcdef0123456789abcdef01234567 by run local-1",
    ranAt: "2026-10-14",
    toolchain: { node: "v24.2.0", os: "linux", engine: "none" },
    runs: [{ what: "private staged completion", summary: "pass" }],
    privateStaging: "Uncommitted private staging was retired; no private bytes or hashes are recorded.",
    files: bindings,
    ...overrides,
  };
}

async function fixture() {
  const root = await mkdtemp(path.join(os.tmpdir(), "pep-solved-run-"));
  await cp(
    path.join(repo, "workflow/tests/fixtures/positive"),
    root,
    { recursive: true },
  );
  await cp(path.join(repo, "workflow/schemas"), path.join(root, "workflow/schemas"), {
    recursive: true,
  });
  const publicFiles = {
    [`${lab}/README.md`]: "Complete the lab.\n",
    [`${lab}/lab.json`]: "{}\n",
    [`${lab}/starter/app.js`]: "export const answer = 0;\n",
    [`${lab}/tests/app.test.js`]: "// public test\n",
  };
  for (const [file, contents] of Object.entries(publicFiles)) await put(root, file, contents);
  const bindings = [];
  for (const [file, contents] of Object.entries(publicFiles)) {
    bindings.push({ file, reviewedSha256: hash(contents) });
  }
  await put(root, evidence, `${JSON.stringify(filesRecord(bindings), null, 2)}\n`);
  git(root, "init", "-q", "-b", "main");
  git(root, "add", ".");
  const locked = run(root, "lock");
  assert.equal(locked.status, 0, locked.stderr);
  return { root, bindings, publicFiles };
}

async function updateRecord(root, mutate) {
  const file = path.join(root, evidence);
  const record = JSON.parse(await readFile(file, "utf8"));
  mutate(record);
  await writeFile(file, `${JSON.stringify(record, null, 2)}\n`);
}

async function relock(root) {
  const result = run(root, "lock");
  assert.equal(result.status, 0, result.stderr);
}

function assertT06Rejects(root, pattern) {
  const result = run(root, "check", "--only", "T06");
  assert.notEqual(result.status, 0, result.stdout);
  assert.match(result.stderr, pattern);
}

async function schemaRoot(name, record) {
  const root = await mkdtemp(path.join(os.tmpdir(), `pep-${name.replaceAll("/", "-")}-schema-`));
  await cp(path.join(repo, "workflow/schemas"), path.join(root, "workflow/schemas"), {
    recursive: true,
  });
  await put(root, `workflow/evidence/demo-course/${name}.json`, `${JSON.stringify(record, null, 2)}\n`);
  return root;
}

const representativeBindings = {
  "README.md": "0".repeat(64),
  "lab.json": "1".repeat(64),
};

for (const [name, record] of [
  [
    "lab-run",
    {
      schemaVersion: 1,
      lab: "java-foundations/java-basics/coding-lab",
      record: "solved at 0123456789abcdef0123456789abcdef01234567 by run local-java",
      commit: "0123456789abcdef0123456789abcdef01234567",
      runId: "local-java",
      ranAt: "2026-10-13T19:26:03Z",
      environment: { os: "Linux", jdk: "Temurin 25", maven: "Maven 3.9" },
      procedure: ["Ran the public tests against uncommitted private staging."],
      result: "Six tests passed.",
      starterRun: "Six tests failed.",
      cleanup: "Removed generated target files.",
      otherSystems: "Other systems not recorded.",
      artifactHashes: representativeBindings,
      testScope: "Public behavior only.",
    },
  ],
  [
    "sql/lab-run",
    {
      schemaVersion: 1,
      lab: "sql-jdbc-foundations/relational-design/coding-lab",
      record: "solved at 0123456789abcdef0123456789abcdef01234567 by run local-sql",
      commit: "0123456789abcdef0123456789abcdef01234567",
      runId: "local-sql",
      ranAt: "2026-10-14T21:12:11Z",
      environment: { os: "Linux", jdk: "Temurin 25", maven: "Maven 3.9", postgresql: "PostgreSQL 18" },
      procedure: ["Ran the public tests against uncommitted private staging."],
      result: "Five tests passed.",
      starterRun: "Five tests failed.",
      cleanup: "Dropped the temporary database.",
      otherSystems: "Other systems not recorded.",
      artifactHashes: representativeBindings,
      testScope: "Public schema behavior only.",
      variantRuns: "An alternative valid schema passed.",
      collisionSafety: "An unrelated database survived.",
    },
  ],
  [
    "coding-lab-solved-run",
    filesRecord([
      { file: `${lab}/README.md`, reviewedSha256: "0".repeat(64) },
      { file: `${lab}/lab.json`, reviewedSha256: "1".repeat(64) },
    ]),
  ],
]) {
  test(`T01 accepts the representative ${name} evidence shape`, async () => {
    const root = await schemaRoot(name, record);
    const result = run(root, "check", "--only", "T01", path.join(root, `workflow/evidence/demo-course/${name}.json`));
    assert.equal(result.status, 0, result.stderr);
  });
}

test("T06 accepts a complete current solved-run record", async () => {
  const { root } = await fixture();
  const result = run(root, "check", "--only", "T06");
  assert.equal(result.status, 0, result.stderr);
});

test("T06 rejects an edited bound public lab file after lock regeneration", async () => {
  const { root } = await fixture();
  await writeFile(path.join(root, lab, "README.md"), "Edited after the solved run.\n");
  await relock(root);
  assertT06Rejects(root, /stale lab-file binding: .*README\.md/);
});

test("T06 rejects a deleted bound public lab file after lock regeneration", async () => {
  const { root } = await fixture();
  await rm(path.join(root, lab, "starter/app.js"));
  await relock(root);
  assertT06Rejects(root, /bound lab file is missing: .*starter\/app\.js/);
});

test("T06 rejects an added tracked public lab file with no binding", async () => {
  const { root } = await fixture();
  await put(root, `${lab}/tests/new.test.js`, "// newly tracked public test\n");
  git(root, "add", `${lab}/tests/new.test.js`);
  await relock(root);
  assertT06Rejects(root, /missing lab-file binding: .*tests\/new\.test\.js/);
});

test("T06 rejects an extra binding outside the claimed public lab", async () => {
  const { root } = await fixture();
  await put(root, "demo-course/README.md", "not part of the lab\n");
  git(root, "add", "demo-course/README.md");
  await updateRecord(root, (record) => {
    record.files.push({
      file: "demo-course/README.md",
      reviewedSha256: hash("not part of the lab\n"),
    });
  });
  await relock(root);
  assertT06Rejects(root, /extra lab-file binding: demo-course\/README\.md/);
});

test("T06 rejects duplicate bound paths", async () => {
  const { root } = await fixture();
  await updateRecord(root, (record) => record.files.push({ ...record.files[0] }));
  await relock(root);
  assertT06Rejects(root, /duplicate lab-file binding: .*README\.md/);
});

test("T01 and T06 reject a malformed SHA-256", async () => {
  const { root } = await fixture();
  await updateRecord(root, (record) => {
    record.files[0].reviewedSha256 = "ABC";
  });
  await relock(root);
  const schema = run(root, "check", "--only", "T01", path.join(root, evidence));
  assert.notEqual(schema.status, 0);
  assert.match(schema.stderr, /must match pattern/);
  assertT06Rejects(root, /must use a lowercase SHA-256/);
});

for (const invalid of ["../private.txt", "/tmp/private.txt", `${lab}/../private.txt`]) {
  test(`T06 rejects malformed or escaping path ${invalid}`, async () => {
    const { root } = await fixture();
    await updateRecord(root, (record) => {
      record.files[0].file = invalid;
    });
    const schema = run(root, "check", "--only", "T01", path.join(root, evidence));
    assert.notEqual(schema.status, 0);
    assert.match(schema.stderr, /must match pattern/);
    const result = run(root, "check", "--only", "T06");
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /malformed lab-file binding path/);
  });
}

test("T01 and T06 reject a binding to private solution material", async () => {
  const { root } = await fixture();
  const privateFile = `${lab}/private-solution/app.js`;
  await put(root, privateFile, "private completion bytes\n");
  git(root, "add", "-f", privateFile);
  await updateRecord(root, (record) => {
    record.files.push({ file: privateFile, reviewedSha256: hash("private completion bytes\n") });
  });
  await relock(root);
  assertT06Rejects(root, /private solution material cannot be bound/);
});

test("T01 rejects fields that try to preserve a private solution hash", async () => {
  const record = filesRecord([
    { file: `${lab}/README.md`, reviewedSha256: "0".repeat(64) },
  ], { solutionHash: "0".repeat(64) });
  const root = await schemaRoot("coding-lab-solved-run", record);
  const result = run(root, "check", "--only", "T01", path.join(root, "workflow/evidence/demo-course/coding-lab-solved-run.json"));
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /must NOT have additional properties|forbidden key/);
});
