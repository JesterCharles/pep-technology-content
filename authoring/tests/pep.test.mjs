import test from "node:test";
import assert from "node:assert/strict";
import {
  cp,
  lstat,
  mkdir,
  mkdtemp,
  readFile,
  readdir,
  symlink,
  unlink,
  writeFile,
} from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const repo = path.resolve(import.meta.dirname, "../..");
const pep = path.join(repo, "authoring/tools/pep");

function run(args, cwd = repo) {
  return spawnSync(process.execPath, [pep, ...args], { cwd, encoding: "utf8" });
}

const negatives = [
  ["T01", "t01-schema", "authoring/tests/fixtures/t01-schema/authoring/catalog/demo-course/demo-module/demo-topic/topic.json"],
  ["T02", "t02-tree", "authoring/tests/fixtures/t02-tree/topics"],
  ["T03", "t03-filenames", "authoring/tests/fixtures/t03-filenames/demo-course/demo-module/demo-topic/rogue.txt"],
  ["T04", "t04-placeholder", "authoring/tests/fixtures/t04-placeholder/demo-course/demo-module/demo-topic/artifact.html"],
  ["T05", "t05-manifest", "authoring/tests/fixtures/t05-manifest/demo-course/demo-module/demo-topic/artifact.md"],
  ["T07", "t07-forbidden", "authoring/tests/fixtures/t07-forbidden/config.txt"],
  ["T08", "t08-html", "authoring/tests/fixtures/t08-html/demo-course/demo-module/demo-topic/artifact.html"],
];

for (const [id, fixture, file] of negatives) {
  test(`${id} reports exact rule and file`, () => {
    const result = run(["check", "--only", id, `authoring/tests/fixtures/${fixture}`]);
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, new RegExp(`^${id} ${file.replaceAll("/", "\\/")}:`, "m"));
  });
}

for (const id of ["T01", "T02", "T03", "T04", "T05", "T07", "T08"]) {
  test(`${id} accepts positive fixture`, () => {
    const result = run(["check", "--only", id, "authoring/tests/fixtures/positive"]);
    assert.equal(result.status, 0, result.stderr);
  });
}

test("T06 stale-lock fixture reports its exact lock file", () => {
  const result = run(["check", "--only", "T06"], path.join(repo, "authoring/tests/fixtures/t06-lock"));
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /^T06 authoring\/catalog\/demo-course\/course\.lock\.json: course lock is stale/m);
});

test("T07 rejects solution filenames and allows formative GIFT", () => {
  let result = run(["check", "--only", "T07", "authoring/tests/fixtures/t07-solution"]);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /^T07 authoring\/tests\/fixtures\/t07-solution\/reference-solution\.txt:/m);
  result = run(["check", "--only", "T07", "authoring/tests/fixtures/t07-gift"]);
  assert.equal(result.status, 0, result.stderr);
});

test("default check excludes negative fixtures", async () => {
  const tmp = await mkdtemp(path.join(os.tmpdir(), "pep-default-skip-"));
  const fixture = path.join(tmp, "authoring/tests/fixtures/negative");
  await mkdir(fixture, { recursive: true });
  await writeFile(path.join(fixture, "reference-solution.txt"), "must remain test-only\n");

  let result = run(["check", "--only", "T07"], tmp);
  assert.equal(result.status, 0, result.stderr);
  result = run(["check", "--only", "T07", "authoring/tests/fixtures/negative"], tmp);
  assert.notEqual(result.status, 0);
});

test("CI retains the complete gate sequence and timeout budget", async () => {
  const workflow = await readFile(path.join(repo, ".github/workflows/ci.yml"), "utf8");
  const timeout = workflow.match(/^    timeout-minutes: (\d+)$/mu);
  assert.ok(timeout, "gates must declare an explicit timeout");
  assert.ok(Number(timeout[1]) >= 30, "gates must retain the measured timeout budget");

  const step = workflow.match(
    /^      - name: Run repository gates\n        run: \|\n((?:          [^\n]+\n)+)/mu,
  );
  assert.ok(step, "workflow must retain the repository gate step");
  assert.deepEqual(
    step[1].trim().split("\n").map((line) => line.trim()),
    ["npm test", "authoring/tools/pep migrate-catalog --check", "npm run check"],
  );
  assert.doesNotMatch(workflow, /^\s*continue-on-error:\s*true\s*$/mu);
});

test("check --changed gates deletion-only and mixed changes", async () => {
  const tmp = await mkdtemp(path.join(os.tmpdir(), "pep-changed-deletion-"));
  const topicRoot = path.join(tmp, "authoring/catalog/demo-course/demo-module/demo-topic");
  await mkdir(topicRoot, { recursive: true });
  await mkdir(path.join(tmp, "demo-course/demo-module/demo-topic"), { recursive: true });
  await writeFile(
    path.join(tmp, "authoring/catalog/demo-course/course.json"),
    '{"id":"demo-course","moduleOrder":["demo-module"]}\n',
  );
  await writeFile(
    path.join(tmp, "authoring/catalog/demo-course/demo-module/module.json"),
    '{"id":"demo-module","topicOrder":["demo-topic"]}\n',
  );
  await writeFile(
    path.join(topicRoot, "topic.json"),
    '{"id":"demo-topic","artifacts":{"html":{"status":"present"}}}\n',
  );
  const artifact = path.join(tmp, "demo-course/demo-module/demo-topic/artifact.html");
  await writeFile(artifact, "learner content\n");
  assert.equal(spawnSync("git", ["init", "-b", "main"], { cwd: tmp }).status, 0);
  assert.equal(spawnSync("git", ["add", "."], { cwd: tmp }).status, 0);
  assert.equal(
    spawnSync(
      "git",
      ["-c", "user.name=Test", "-c", "user.email=test@example.com", "commit", "-m", "fixture"],
      { cwd: tmp },
    ).status,
    0,
  );
  assert.equal(spawnSync("git", ["update-ref", "refs/remotes/origin/main", "HEAD"], { cwd: tmp }).status, 0);
  await unlink(artifact);
  let result = run(["check", "--changed", "--only", "T05"], tmp);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /declared present but missing/);
  await writeFile(path.join(tmp, "README.md"), "mixed surviving change\n");
  result = run(["check", "--changed", "--only", "T05"], tmp);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /declared present but missing/);
});

async function copyPositive(root) {
  await cp(
    path.join(repo, "authoring/tests/fixtures/positive/demo-course"),
    path.join(root, "demo-course"),
    { recursive: true },
  );
  await cp(
    path.join(repo, "authoring/tests/fixtures/positive/authoring/catalog"),
    path.join(root, "authoring/catalog"),
    { recursive: true },
  );
}

test("lock regeneration is byte-identical and stale bytes fail T06", async () => {
  const tmp = await mkdtemp(path.join(os.tmpdir(), "pep-lock-"));
  await copyPositive(tmp);
  let result = run(["lock"], tmp);
  assert.equal(result.status, 0, result.stderr);
  const courseLock = path.join(tmp, "authoring/catalog/demo-course/course.lock.json");
  const moduleLock = path.join(tmp, "authoring/catalog/demo-course/demo-module/module.lock.json");
  const before = [await readFile(courseLock), await readFile(moduleLock)];
  result = run(["lock"], tmp);
  assert.equal(result.status, 0, result.stderr);
  assert.deepEqual(await readFile(courseLock), before[0]);
  assert.deepEqual(await readFile(moduleLock), before[1]);
  await writeFile(path.join(tmp, "demo-course/demo-module/demo-topic/artifact.html"), "changed");
  result = run(["check", "--only", "T06"], tmp);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /^T06 authoring\/catalog\/demo-course\/demo-module\/module\.lock\.json: module lock is stale/m);
});

test("stale evidence bindings are recorded as non-current", async () => {
  const tmp = await mkdtemp(path.join(os.tmpdir(), "pep-binding-"));
  await copyPositive(tmp);
  const evidence = path.join(tmp, "authoring/evidence/demo-course/demo-module/demo-topic/critic-sme.json");
  await mkdir(path.dirname(evidence), { recursive: true });
  await writeFile(evidence, JSON.stringify({ reviewedSha256: "0".repeat(64) }));
  const result = run(["lock"], tmp);
  assert.equal(result.status, 0, result.stderr);
  const lock = JSON.parse(await readFile(path.join(tmp, "authoring/catalog/demo-course/demo-module/module.lock.json")));
  assert.equal(lock.evidenceBindings[0].current, false);
});

test("new-topic writes only an absent-artifact catalog manifest", async () => {
  const tmp = await mkdtemp(path.join(os.tmpdir(), "pep-new-"));
  await mkdir(path.join(tmp, "authoring/catalog/demo-course/demo-module"), { recursive: true });
  await writeFile(path.join(tmp, "authoring/catalog/demo-course/demo-module/module.json"), "{}");
  const result = run(["new-topic", "demo-course/demo-module/new-topic"], tmp);
  assert.equal(result.status, 0, result.stderr);
  const catalogTopic = path.join(tmp, "authoring/catalog/demo-course/demo-module/new-topic");
  assert.deepEqual(await readdir(catalogTopic), ["topic.json"]);
  const topic = JSON.parse(await readFile(path.join(catalogTopic, "topic.json")));
  assert.ok(Object.values(topic.artifacts).every((item) => item.status === "absent" && item.reason));
  assert.equal(topic.freshness.sourcesRef, "authoring/evidence/demo-course/demo-module/new-topic/sources.json");
  await assert.rejects(readdir(path.join(tmp, "demo-course/demo-module/new-topic")), { code: "ENOENT" });
});

test("export copies the content-only learner tree and omits catalog metadata", async () => {
  const tmp = await mkdtemp(path.join(os.tmpdir(), "pep-export-"));
  await copyPositive(tmp);
  const learner = {
    "demo-course/assessments/check/blueprint.json": "{}\n",
    "demo-course/coding-lab/lab.json": "{}\n",
    "demo-course/demo-module/coding-lab/README.md": "module lab\n",
    "demo-course/demo-module/demo-topic/coding-lab/README.md": "topic lab\n",
  };
  const excluded = {
    "demo-course/course.json": '{"id":"demo-course"}\n',
    "demo-course/demo-module/demo-topic/notes.txt": "tracked but not learner-facing\n",
    "demo-course/demo-module/demo-topic/platform-only/answer-key.md": "B\n",
    "demo-course/demo-module/demo-topic/.DS_Store": "finder\n",
    "demo-course/_work/draft.md": "ignored draft\n",
    "demo-course/demo-module/demo-topic/coding-lab/.env": "SECRET=1\n",
  };
  for (const [file, text] of Object.entries({ ...learner, ...excluded })) {
    await mkdir(path.dirname(path.join(tmp, file)), { recursive: true });
    await writeFile(path.join(tmp, file), text);
  }
  await writeFile(path.join(tmp, ".gitignore"), "_work/\n.env\n");
  assert.equal(spawnSync("git", ["init", "-b", "main"], { cwd: tmp }).status, 0);
  const tracked = [
    ".gitignore",
    "authoring",
    "demo-course/demo-module/demo-topic",
    ...Object.keys(learner),
    "demo-course/course.json",
  ];
  assert.equal(spawnSync("git", ["add", "--", ...tracked], { cwd: tmp }).status, 0);
  assert.equal(
    spawnSync("git", ["rm", "--cached", "-q", "--", "demo-course/demo-module/demo-topic/platform-only/answer-key.md", "demo-course/demo-module/demo-topic/.DS_Store"], { cwd: tmp }).status,
    0,
  );
  const result = run(["export", "demo-course"], tmp);
  assert.equal(result.status, 0, result.stderr);
  await readFile(path.join(tmp, "build/export/demo-course/demo-module/demo-topic/artifact.html"));
  for (const [file, text] of Object.entries(learner))
    assert.equal(await readFile(path.join(tmp, "build/export", file), "utf8"), text);
  for (const file of Object.keys(excluded))
    await assert.rejects(readFile(path.join(tmp, "build/export", file)), { code: "ENOENT" }, file);
});

test("migrate-catalog uses git moves and is idempotent", async () => {
  const tmp = await mkdtemp(path.join(os.tmpdir(), "pep-migrate-"));
  await mkdir(path.join(tmp, "demo-course/demo-module/demo-topic"), { recursive: true });
  await writeFile(path.join(tmp, "demo-course/course.json"), '{"id":"demo-course","moduleOrder":["demo-module"]}\n');
  await writeFile(path.join(tmp, "demo-course/demo-module/module.json"), '{"id":"demo-module","topicOrder":["demo-topic"]}\n');
  await writeFile(path.join(tmp, "demo-course/demo-module/demo-topic/topic.json"), '{"id":"demo-topic"}\n');
  assert.equal(spawnSync("git", ["init", "-b", "main"], { cwd: tmp }).status, 0);
  assert.equal(spawnSync("git", ["add", "."], { cwd: tmp }).status, 0);
  let result = run(["migrate-catalog"], tmp);
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /moved 3 file\(s\)/);
  result = run(["migrate-catalog", "--check"], tmp);
  assert.equal(result.status, 0, result.stderr);
  result = run(["migrate-catalog"], tmp);
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /moved 0 file\(s\)/);
});

test("migrate-catalog collision preflight leaves the whole worktree unchanged", async () => {
  const tmp = await mkdtemp(path.join(os.tmpdir(), "pep-migrate-collision-"));
  await mkdir(path.join(tmp, "demo-course/demo-module"), { recursive: true });
  await mkdir(path.join(tmp, "authoring/catalog/demo-course/demo-module"), { recursive: true });
  await writeFile(path.join(tmp, "demo-course/course.json"), '{"id":"demo-course","moduleOrder":["demo-module"]}\n');
  await writeFile(path.join(tmp, "demo-course/demo-module/module.json"), '{"id":"legacy-module"}\n');
  const destination = path.join(tmp, "authoring/catalog/demo-course/demo-module/module.json");
  await writeFile(destination, '{"id":"catalog-module"}\n');
  assert.equal(spawnSync("git", ["init", "-b", "main"], { cwd: tmp }).status, 0);
  assert.equal(spawnSync("git", ["add", "."], { cwd: tmp }).status, 0);
  const beforeStatus = spawnSync("git", ["status", "--porcelain=v1"], { cwd: tmp, encoding: "utf8" }).stdout;
  const beforeDestination = await readFile(destination);
  const result = run(["migrate-catalog"], tmp);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /collision/);
  assert.equal(
    spawnSync("git", ["status", "--porcelain=v1"], { cwd: tmp, encoding: "utf8" }).stdout,
    beforeStatus,
  );
  assert.equal(await readFile(path.join(tmp, "demo-course/course.json"), "utf8"), '{"id":"demo-course","moduleOrder":["demo-module"]}\n');
  assert.equal(await readFile(path.join(tmp, "demo-course/demo-module/module.json"), "utf8"), '{"id":"legacy-module"}\n');
  assert.deepEqual(await readFile(destination), beforeDestination);
  await assert.rejects(readFile(path.join(tmp, "authoring/catalog/demo-course/course.json")), { code: "ENOENT" });
});

test("migrate-catalog preflights dangling-symlink collisions", async () => {
  const tmp = await mkdtemp(path.join(os.tmpdir(), "pep-migrate-symlink-collision-"));
  await mkdir(path.join(tmp, "demo-course/demo-module"), { recursive: true });
  await mkdir(path.join(tmp, "authoring/catalog/demo-course/demo-module"), { recursive: true });
  await writeFile(path.join(tmp, "demo-course/course.json"), '{"id":"demo-course","moduleOrder":["demo-module"]}\n');
  await writeFile(path.join(tmp, "demo-course/demo-module/module.json"), '{"id":"demo-module"}\n');
  const destination = path.join(tmp, "authoring/catalog/demo-course/demo-module/module.json");
  await symlink("missing-module.json", destination);
  assert.equal(spawnSync("git", ["init", "-b", "main"], { cwd: tmp }).status, 0);
  assert.equal(spawnSync("git", ["add", "."], { cwd: tmp }).status, 0);
  assert.equal(
    spawnSync(
      "git",
      ["-c", "user.name=Test", "-c", "user.email=test@example.com", "commit", "-m", "fixture"],
      { cwd: tmp },
    ).status,
    0,
  );
  assert.equal(spawnSync("git", ["status", "--porcelain=v1"], { cwd: tmp, encoding: "utf8" }).stdout, "");
  const result = run(["migrate-catalog"], tmp);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /collision/);
  assert.equal(spawnSync("git", ["status", "--porcelain=v1"], { cwd: tmp, encoding: "utf8" }).stdout, "");
  assert.equal(await readFile(path.join(tmp, "demo-course/course.json"), "utf8"), '{"id":"demo-course","moduleOrder":["demo-module"]}\n');
  assert.equal(await readFile(path.join(tmp, "demo-course/demo-module/module.json"), "utf8"), '{"id":"demo-module"}\n');
  assert.equal((await lstat(destination)).isSymbolicLink(), true);
  await assert.rejects(readFile(path.join(tmp, "authoring/catalog/demo-course/course.json")), { code: "ENOENT" });
});

test("migrate-catalog preflights symlinked destination parents", async () => {
  const tmp = await mkdtemp(path.join(os.tmpdir(), "pep-migrate-symlink-parent-"));
  await mkdir(path.join(tmp, "demo-course/demo-module"), { recursive: true });
  await mkdir(path.join(tmp, "authoring/catalog/demo-course"), { recursive: true });
  await mkdir(path.join(tmp, "sink"), { recursive: true });
  await writeFile(path.join(tmp, "demo-course/course.json"), '{"id":"demo-course","moduleOrder":["demo-module"]}\n');
  await writeFile(path.join(tmp, "demo-course/demo-module/module.json"), '{"id":"demo-module"}\n');
  await writeFile(path.join(tmp, "sink/.keep"), "tracked sink\n");
  const parent = path.join(tmp, "authoring/catalog/demo-course/demo-module");
  await symlink("../../../sink", parent);
  assert.equal(spawnSync("git", ["init", "-b", "main"], { cwd: tmp }).status, 0);
  assert.equal(spawnSync("git", ["add", "."], { cwd: tmp }).status, 0);
  assert.equal(
    spawnSync(
      "git",
      ["-c", "user.name=Test", "-c", "user.email=test@example.com", "commit", "-m", "fixture"],
      { cwd: tmp },
    ).status,
    0,
  );
  const beforeIndex = spawnSync("git", ["ls-files", "--stage"], { cwd: tmp, encoding: "utf8" }).stdout;
  assert.equal(spawnSync("git", ["status", "--porcelain=v1"], { cwd: tmp, encoding: "utf8" }).stdout, "");
  const result = run(["migrate-catalog"], tmp);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /destination parent is not a real directory/);
  assert.equal(spawnSync("git", ["status", "--porcelain=v1"], { cwd: tmp, encoding: "utf8" }).stdout, "");
  assert.equal(spawnSync("git", ["ls-files", "--stage"], { cwd: tmp, encoding: "utf8" }).stdout, beforeIndex);
  assert.equal(await readFile(path.join(tmp, "demo-course/course.json"), "utf8"), '{"id":"demo-course","moduleOrder":["demo-module"]}\n');
  assert.equal(await readFile(path.join(tmp, "demo-course/demo-module/module.json"), "utf8"), '{"id":"demo-module"}\n');
  assert.equal((await lstat(parent)).isSymbolicLink(), true);
  await assert.rejects(readFile(path.join(tmp, "authoring/catalog/demo-course/course.json")), { code: "ENOENT" });
  await assert.rejects(readFile(path.join(tmp, "sink/module.json")), { code: "ENOENT" });
});

test("every subcommand has help", () => {
  for (const command of ["check", "lock", "export", "export-lab", "new-topic", "migrate-catalog"]) {
    const result = run([command, "--help"]);
    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /^Usage:/);
  }
});
