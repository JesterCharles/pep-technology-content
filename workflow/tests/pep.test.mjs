import test from "node:test";
import assert from "node:assert/strict";
import {
  cp,
  mkdir,
  mkdtemp,
  readFile,
  readdir,
  unlink,
  writeFile,
} from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const repo = path.resolve(import.meta.dirname, "../..");
const pep = path.join(repo, "workflow/tools/pep");

function run(args, cwd = repo) {
  return spawnSync(process.execPath, [pep, ...args], { cwd, encoding: "utf8" });
}

const negatives = [
  ["T01", "t01-schema", "workflow/tests/fixtures/t01-schema/workflow/catalog/demo-course/demo-module/demo-topic/topic.json"],
  ["T02", "t02-tree", "workflow/tests/fixtures/t02-tree/topics"],
  ["T03", "t03-filenames", "workflow/tests/fixtures/t03-filenames/foundational-track/demo-course/demo-module/demo-topic/rogue.txt"],
  ["T04", "t04-placeholder", "workflow/tests/fixtures/t04-placeholder/foundational-track/demo-course/demo-module/demo-topic/artifact.html"],
  ["T05", "t05-manifest", "workflow/tests/fixtures/t05-manifest/foundational-track/demo-course/demo-module/demo-topic/artifact.md"],
  ["T07", "t07-forbidden", "workflow/tests/fixtures/t07-forbidden/config.txt"],
  ["T08", "t08-html", "workflow/tests/fixtures/t08-html/foundational-track/demo-course/demo-module/demo-topic/artifact.html"],
];

for (const [id, fixture, file] of negatives) {
  test(`${id} reports exact rule and file`, () => {
    const result = run(["check", "--only", id, `workflow/tests/fixtures/${fixture}`]);
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, new RegExp(`^${id} ${file.replaceAll("/", "\\/")}:`, "m"));
  });
}

for (const id of ["T01", "T02", "T03", "T04", "T05", "T07", "T08"]) {
  test(`${id} accepts positive fixture`, () => {
    const result = run(["check", "--only", id, "workflow/tests/fixtures/positive"]);
    assert.equal(result.status, 0, result.stderr);
  });
}

test("T06 stale-lock fixture reports its exact lock file", () => {
  const result = run(["check", "--only", "T06"], path.join(repo, "workflow/tests/fixtures/t06-lock"));
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /^T06 workflow\/catalog\/demo-course\/course\.lock\.json: course lock is stale/m);
});

test("T07 rejects solution filenames and allows formative GIFT", () => {
  let result = run(["check", "--only", "T07", "workflow/tests/fixtures/t07-solution"]);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /^T07 workflow\/tests\/fixtures\/t07-solution\/reference-solution\.txt:/m);
  result = run(["check", "--only", "T07", "workflow/tests/fixtures/t07-gift"]);
  assert.equal(result.status, 0, result.stderr);
});

test("default check excludes negative fixtures", async () => {
  const tmp = await mkdtemp(path.join(os.tmpdir(), "pep-default-skip-"));
  const fixture = path.join(tmp, "workflow/tests/fixtures/negative");
  await mkdir(fixture, { recursive: true });
  await writeFile(path.join(fixture, "reference-solution.txt"), "must remain test-only\n");

  let result = run(["check", "--only", "T07"], tmp);
  assert.equal(result.status, 0, result.stderr);
  result = run(["check", "--only", "T07", "workflow/tests/fixtures/negative"], tmp);
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
    ["npm test", "npm run check"],
  );
  assert.doesNotMatch(workflow, /^\s*continue-on-error:\s*true\s*$/mu);
});

test("check --changed gates deletion-only and mixed changes", async () => {
  const tmp = await mkdtemp(path.join(os.tmpdir(), "pep-changed-deletion-"));
  const topicRoot = path.join(tmp, "workflow/catalog/demo-course/demo-module/demo-topic");
  await mkdir(topicRoot, { recursive: true });
  await mkdir(path.join(tmp, "foundational-track/demo-course/demo-module/demo-topic"), { recursive: true });
  await writeFile(
    path.join(tmp, "workflow/catalog/demo-course/course.json"),
    '{"id":"demo-course","moduleOrder":["demo-module"]}\n',
  );
  await writeFile(
    path.join(tmp, "workflow/catalog/demo-course/demo-module/module.json"),
    '{"id":"demo-module","topicOrder":["demo-topic"]}\n',
  );
  await writeFile(
    path.join(topicRoot, "topic.json"),
    '{"id":"demo-topic","artifacts":{"html":{"status":"present"}}}\n',
  );
  const artifact = path.join(tmp, "foundational-track/demo-course/demo-module/demo-topic/artifact.html");
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
    path.join(repo, "workflow/tests/fixtures/positive/foundational-track/demo-course"),
    path.join(root, "foundational-track/demo-course"),
    { recursive: true },
  );
  await cp(
    path.join(repo, "workflow/tests/fixtures/positive/workflow/catalog"),
    path.join(root, "workflow/catalog"),
    { recursive: true },
  );
}

test("lock regeneration is byte-identical and stale bytes fail T06", async () => {
  const tmp = await mkdtemp(path.join(os.tmpdir(), "pep-lock-"));
  await copyPositive(tmp);
  let result = run(["lock"], tmp);
  assert.equal(result.status, 0, result.stderr);
  const courseLock = path.join(tmp, "workflow/catalog/demo-course/course.lock.json");
  const moduleLock = path.join(tmp, "workflow/catalog/demo-course/demo-module/module.lock.json");
  const before = [await readFile(courseLock), await readFile(moduleLock)];
  result = run(["lock"], tmp);
  assert.equal(result.status, 0, result.stderr);
  assert.deepEqual(await readFile(courseLock), before[0]);
  assert.deepEqual(await readFile(moduleLock), before[1]);
  await writeFile(path.join(tmp, "foundational-track/demo-course/demo-module/demo-topic/artifact.html"), "changed");
  result = run(["check", "--only", "T06"], tmp);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /^T06 workflow\/catalog\/demo-course\/demo-module\/module\.lock\.json: module lock is stale/m);
});

test("stale evidence bindings are recorded as non-current", async () => {
  const tmp = await mkdtemp(path.join(os.tmpdir(), "pep-binding-"));
  await copyPositive(tmp);
  const evidence = path.join(tmp, "workflow/evidence/demo-course/demo-module/demo-topic/critic-sme.json");
  await mkdir(path.dirname(evidence), { recursive: true });
  await writeFile(evidence, JSON.stringify({ reviewedSha256: "0".repeat(64) }));
  const result = run(["lock"], tmp);
  assert.equal(result.status, 0, result.stderr);
  const lock = JSON.parse(await readFile(path.join(tmp, "workflow/catalog/demo-course/demo-module/module.lock.json")));
  assert.equal(lock.evidenceBindings[0].current, false);
});

test("new-topic writes only an absent-artifact catalog manifest", async () => {
  const tmp = await mkdtemp(path.join(os.tmpdir(), "pep-new-"));
  await mkdir(path.join(tmp, "workflow/catalog/demo-course/demo-module"), { recursive: true });
  await writeFile(path.join(tmp, "workflow/catalog/demo-course/demo-module/module.json"), "{}");
  const result = run(["new-topic", "demo-course/demo-module/new-topic"], tmp);
  assert.equal(result.status, 0, result.stderr);
  const catalogTopic = path.join(tmp, "workflow/catalog/demo-course/demo-module/new-topic");
  assert.deepEqual(await readdir(catalogTopic), ["topic.json"]);
  const topic = JSON.parse(await readFile(path.join(catalogTopic, "topic.json")));
  assert.ok(Object.values(topic.artifacts).every((item) => item.status === "absent" && item.reason));
  assert.equal(topic.freshness.sourcesRef, "workflow/evidence/demo-course/demo-module/new-topic/sources.json");
  await assert.rejects(readdir(path.join(tmp, "foundational-track/demo-course/demo-module/new-topic")), { code: "ENOENT" });
});

test("export copies the content-only learner tree and omits catalog metadata", async () => {
  const tmp = await mkdtemp(path.join(os.tmpdir(), "pep-export-"));
  await copyPositive(tmp);
  const learner = {
    "foundational-track/demo-course/assessments/check/blueprint.json": "{}\n",
    "foundational-track/demo-course/coding-lab/lab.json": "{}\n",
    "foundational-track/demo-course/demo-module/coding-lab/README.md": "module lab\n",
    "foundational-track/demo-course/demo-module/demo-topic/coding-lab/README.md": "topic lab\n",
  };
  const excluded = {
    "foundational-track/demo-course/course.json": '{"id":"demo-course"}\n',
    "foundational-track/demo-course/demo-module/demo-topic/notes.txt": "tracked but not learner-facing\n",
    "foundational-track/demo-course/demo-module/demo-topic/platform-only/answer-key.md": "B\n",
    "foundational-track/demo-course/demo-module/demo-topic/.DS_Store": "finder\n",
    "foundational-track/demo-course/_work/draft.md": "ignored draft\n",
    "foundational-track/demo-course/demo-module/demo-topic/coding-lab/.env": "SECRET=1\n",
  };
  for (const [file, text] of Object.entries({ ...learner, ...excluded })) {
    await mkdir(path.dirname(path.join(tmp, file)), { recursive: true });
    await writeFile(path.join(tmp, file), text);
  }
  await writeFile(path.join(tmp, ".gitignore"), "_work/\n.env\n");
  assert.equal(spawnSync("git", ["init", "-b", "main"], { cwd: tmp }).status, 0);
  const tracked = [
    ".gitignore",
    "workflow",
    "foundational-track/demo-course/demo-module/demo-topic",
    ...Object.keys(learner),
    "foundational-track/demo-course/course.json",
  ];
  assert.equal(spawnSync("git", ["add", "--", ...tracked], { cwd: tmp }).status, 0);
  assert.equal(
    spawnSync("git", ["rm", "--cached", "-q", "--", "foundational-track/demo-course/demo-module/demo-topic/platform-only/answer-key.md", "foundational-track/demo-course/demo-module/demo-topic/.DS_Store"], { cwd: tmp }).status,
    0,
  );
  const result = run(["export", "demo-course"], tmp);
  assert.equal(result.status, 0, result.stderr);
  await readFile(path.join(tmp, "build/export/demo-course/demo-module/demo-topic/artifact.html"));
  for (const [file, text] of Object.entries(learner)) {
    const exported = file.replace(/^foundational-track\//, "");
    assert.equal(await readFile(path.join(tmp, "build/export", exported), "utf8"), text);
  }
  for (const file of Object.keys(excluded)) {
    const exported = file.replace(/^foundational-track\//, "");
    await assert.rejects(readFile(path.join(tmp, "build/export", exported)), { code: "ENOENT" }, file);
  }
});

test("every subcommand has help", () => {
  for (const command of ["check", "lock", "export", "export-lab", "new-topic"]) {
    const result = run([command, "--help"]);
    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /^Usage:/);
  }
});
