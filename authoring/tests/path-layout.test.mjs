import assert from "node:assert/strict";
import { cp, mkdir, mkdtemp, writeFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { resolveRepositoryPath } from "../tools/lib/common.mjs";
import { lockedFilePath } from "../tools/checks/T19-curriculum.mjs";

const repo = path.resolve(import.meta.dirname, "../..");
const pep = path.join(repo, "authoring/tools/pep");

async function put(file, text) {
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, text);
}

test("legacy evidence references resolve to authoring when root evidence is absent", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "pep-evidence-legacy-"));
  const physical = path.join(root, "authoring/evidence/course/sources.json");
  await put(physical, "{}\n");

  assert.equal(
    await resolveRepositoryPath(root, "evidence/course/sources.json"),
    physical,
  );
});

test("authoring evidence references resolve directly", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "pep-evidence-current-"));
  const physical = path.join(root, "authoring/evidence/course/sources.json");
  await put(physical, "{}\n");

  assert.equal(
    await resolveRepositoryPath(root, "authoring/evidence/course/sources.json"),
    physical,
  );
});

test("a reference present at the root evidence path resolves directly", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "pep-evidence-root-"));
  const rootFile = path.join(root, "evidence/course/sources.json");
  await put(rootFile, "root\n");
  await put(path.join(root, "authoring/evidence/course/sources.json"), "authoring\n");

  assert.equal(
    await resolveRepositoryPath(root, "evidence/course/sources.json"),
    rootFile,
  );
});

test("an untracked root evidence leftover does not disable the legacy alias", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "pep-evidence-leftover-"));
  await put(path.join(root, "evidence/course/video-receipt.json"), "leftover\n");
  const physical = path.join(root, "authoring/evidence/course/sources.json");
  await put(physical, "authoring\n");

  assert.equal(
    await resolveRepositoryPath(root, "evidence/course/sources.json"),
    physical,
  );
});

test("curriculum lock resolves only its historical extraction-tool path", async () => {
  assert.equal(
    await lockedFilePath(repo, "tools/curriculum/extract-calendar.mjs"),
    path.join(repo, "authoring/tools/curriculum/extract-calendar.mjs"),
  );
  assert.equal(
    await lockedFilePath(repo, "tools/other.mjs"),
    path.join(repo, "tools/other.mjs"),
  );
});

test("default scans reject a course catalog below the repository catalog root", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "pep-nested-course-"));
  await put(
    path.join(root, "v2/authoring/catalog/demo-course/course.json"),
    `${JSON.stringify({ id: "demo-course", moduleOrder: [] }, null, 2)}\n`,
  );

  const result = spawnSync(process.execPath, [pep, "check", "--only", "T02"], {
    cwd: root,
    encoding: "utf8",
  });
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /course catalog must be directly under authoring\/catalog/);
});

test("T02 rejects authoring metadata in a learner directory", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "pep-content-metadata-"));
  await put(
    path.join(root, "authoring/catalog/demo-course/course.json"),
    `${JSON.stringify({ id: "demo-course", moduleOrder: [] }, null, 2)}\n`,
  );
  await put(path.join(root, "demo-course/course.json"), "{}\n");

  const result = spawnSync(process.execPath, [pep, "check", "--only", "T02"], {
    cwd: root,
    encoding: "utf8",
  });
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /demo-course\/course\.json: authoring metadata is forbidden outside the catalog/);
});

test("explicit learner and catalog paths select the same course", () => {
  const fixture = path.join(repo, "authoring/tests/fixtures/positive");
  for (const target of [
    path.join(fixture, "demo-course/demo-module/demo-topic/artifact.html"),
    path.join(fixture, "authoring/catalog/demo-course/demo-module/demo-topic/topic.json"),
  ]) {
    const result = spawnSync(process.execPath, [pep, "check", "--only", "T02", target], {
      cwd: repo,
      encoding: "utf8",
    });
    assert.equal(result.status, 0, result.stderr);
  }
});

test("moved metadata references resolve narrowly to the catalog", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "pep-catalog-alias-"));
  const physical = path.join(root, "authoring/catalog/course/module/topic/topic.json");
  await put(physical, "{}\n");
  assert.equal(await resolveRepositoryPath(root, "course/module/topic/topic.json"), physical);
  assert.equal(
    await resolveRepositoryPath(root, "course/module/topic/artifact.html"),
    path.join(root, "course/module/topic/artifact.html"),
  );
});

test("an existing learner metadata path takes precedence over the catalog alias", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "pep-catalog-precedence-"));
  const direct = path.join(root, "course/course.json");
  await put(direct, "direct\n");
  await put(path.join(root, "authoring/catalog/course/course.json"), "catalog\n");
  assert.equal(await resolveRepositoryPath(root, "course/course.json"), direct);
});
