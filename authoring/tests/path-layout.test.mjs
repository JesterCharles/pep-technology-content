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

test("default scans reject a valid course below the repository root", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "pep-nested-course-"));
  await cp(
    path.join(repo, "authoring/tests/fixtures/positive/demo-course"),
    path.join(root, "v2/demo-course"),
    { recursive: true },
  );

  const result = spawnSync(process.execPath, [pep, "check", "--only", "T02"], {
    cwd: root,
    encoding: "utf8",
  });
  assert.notEqual(result.status, 0);
  assert.match(
    result.stderr,
    /v2\/demo-course\/course\.json: course directory must be a direct child/,
  );
});

test("default scans reject reserved roots as courses", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "pep-reserved-course-"));
  for (const id of ["authoring", "components", "curriculum", "evidence"]) {
    await put(
      path.join(root, id, "course.json"),
      `${JSON.stringify({ id, moduleOrder: [] }, null, 2)}\n`,
    );
  }

  const result = spawnSync(process.execPath, [pep, "check", "--only", "T02"], {
    cwd: root,
    encoding: "utf8",
  });
  assert.notEqual(result.status, 0);
  for (const id of ["authoring", "components", "curriculum", "evidence"]) {
    assert.match(
      result.stderr,
      new RegExp(`${id}/course\\.json: reserved root cannot be a course directory`),
    );
  }
});
