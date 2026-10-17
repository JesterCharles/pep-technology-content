import assert from "node:assert/strict";
import { mkdir, mkdtemp, writeFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { selectTopics } from "../tools/net/check-links.mjs";

const repo = path.resolve(import.meta.dirname, "../..");
const pep = path.join(repo, "workflow/tools/pep");

async function put(file, text) {
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, text);
}

test("default scans reject a course catalog below the repository catalog root", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "pep-nested-course-"));
  await put(
    path.join(root, "v2/workflow/catalog/demo-course/course.json"),
    `${JSON.stringify({ id: "demo-course", moduleOrder: [] }, null, 2)}\n`,
  );

  const result = spawnSync(process.execPath, [pep, "check", "--only", "T02"], {
    cwd: root,
    encoding: "utf8",
  });
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /course\.json: authoring metadata is outside a canonical course catalog/);
});

test("default scans reject every metadata class in a nested catalog", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "pep-nested-metadata-"));
  const files = [
    "v2/workflow/catalog/demo-course/course.json",
    "v2/workflow/catalog/demo-course/course.lock.json",
    "v2/workflow/catalog/demo-course/demo-module/module.json",
    "v2/workflow/catalog/demo-course/demo-module/module.lock.json",
    "v2/workflow/catalog/demo-course/demo-module/demo-topic/topic.json",
  ];
  for (const file of files) await put(path.join(root, file), "{}\n");
  const result = spawnSync(process.execPath, [pep, "check", "--only", "T02"], {
    cwd: root,
    encoding: "utf8",
  });
  assert.notEqual(result.status, 0);
  for (const file of files) {
    assert.match(result.stderr, new RegExp(`${file.replaceAll("/", "\\/")}: authoring metadata is outside`));
  }
});

test("T02 rejects non-slug, reserved, and id-mismatched catalog courses", async () => {
  for (const [directory, manifestId, message] of [
    ["Bad-Directory", "Bad-Directory", "catalog course directory must be a slug"],
    ["build", "build", "reserved root cannot be a catalog course"],
    ["demo-course", "other-course", "catalog course directory must equal id"],
  ]) {
    const root = await mkdtemp(path.join(os.tmpdir(), "pep-invalid-catalog-course-"));
    await put(
      path.join(root, "workflow/catalog", directory, "course.json"),
      `${JSON.stringify({ id: manifestId, moduleOrder: [] }, null, 2)}\n`,
    );
    const result = spawnSync(process.execPath, [pep, "check", "--only", "T02"], {
      cwd: root,
      encoding: "utf8",
    });
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, new RegExp(message));
  }
});

test("T02 rejects authoring metadata in a learner directory", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "pep-content-metadata-"));
  await put(
    path.join(root, "workflow/catalog/demo-course/course.json"),
    `${JSON.stringify({ id: "demo-course", moduleOrder: [] }, null, 2)}\n`,
  );
  await put(path.join(root, "foundational-track/demo-course/course.json"), "{}\n");

  const result = spawnSync(process.execPath, [pep, "check", "--only", "T02"], {
    cwd: root,
    encoding: "utf8",
  });
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /demo-course\/course\.json: authoring metadata is outside a canonical course catalog/);
});

test("explicit learner and catalog paths select the same course", () => {
  const fixture = path.join(repo, "workflow/tests/fixtures/positive");
  for (const target of [
    path.join(fixture, "foundational-track/demo-course/demo-module/demo-topic/artifact.html"),
    path.join(fixture, "workflow/catalog/demo-course/demo-module/demo-topic/topic.json"),
  ]) {
    const result = spawnSync(process.execPath, [pep, "check", "--only", "T02", target], {
      cwd: repo,
      encoding: "utf8",
    });
    assert.equal(result.status, 0, result.stderr);
  }
});

test("source-link selection validates inputs and supports catalog manifest scopes", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "pep-link-selection-"));
  const catalog = path.join(root, "workflow/catalog/demo-course");
  await put(
    path.join(catalog, "course.json"),
    '{"id":"demo-course","moduleOrder":["module-one","module-two"]}\n',
  );
  await put(
    path.join(catalog, "module-one/module.json"),
    '{"id":"module-one","topicOrder":["topic-one","topic-two"]}\n',
  );
  await put(path.join(catalog, "module-one/topic-one/topic.json"), '{"id":"topic-one"}\n');
  await put(path.join(catalog, "module-one/topic-two/topic.json"), '{"id":"topic-two"}\n');
  await put(
    path.join(catalog, "module-two/module.json"),
    '{"id":"module-two","topicOrder":["topic-three"]}\n',
  );
  await put(path.join(catalog, "module-two/topic-three/topic.json"), '{"id":"topic-three"}\n');
  await put(path.join(root, "foundational-track/demo-course/README.md"), "course notes\n");

  assert.equal((await selectTopics(root, [path.join(catalog, "course.json")])).length, 3);
  assert.equal((await selectTopics(root, [path.join(catalog, "module-one/module.json")])).length, 2);
  assert.equal(
    (await selectTopics(root, [path.join(catalog, "module-one/topic-one/topic.json")])).length,
    1,
  );
  await assert.rejects(selectTopics(root, [path.join(root, "does-not-exist")]), /path does not exist/);
  const unrelated = path.join(root, "foundational-track/demo-course/README.md");
  await assert.rejects(selectTopics(root, [unrelated]), /select no catalog topics/);
});
