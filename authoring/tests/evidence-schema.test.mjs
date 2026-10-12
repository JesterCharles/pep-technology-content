import assert from "node:assert/strict";
import { cp, mkdtemp, readFile, writeFile, mkdir } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";

const repo = path.resolve(import.meta.dirname, "../..");
const pep = path.join(repo, "authoring", "tools", "pep");
const objective = "demo-course/demo-module/demo-topic#o1";

async function writeJson(file, value) {
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, `${JSON.stringify(value, null, 2)}\n`);
}

async function schemaFixture() {
  const root = await mkdtemp(path.join(os.tmpdir(), "pep-schema-"));
  await cp(
    path.join(repo, "authoring", "schemas"),
    path.join(root, "authoring", "schemas"),
    { recursive: true },
  );
  await cp(
    path.join(repo, "authoring/tests/fixtures/positive/demo-course"),
    path.join(root, "demo-course"),
    { recursive: true },
  );
  const topicFile = path.join(root, "demo-course/demo-module/demo-topic/topic.json");
  const topic = JSON.parse(await readFile(topicFile, "utf8"));
  topic.objectives = [{ id: "o1", text: "Demonstrate the objective." }];
  await writeJson(topicFile, topic);
  return root;
}

function blueprint(overrides = {}) {
  return {
    schemaVersion: 1,
    id: "intake",
    dayId: "F3",
    kind: "module-check",
    formats: ["mcq", "written"],
    passMark: 70,
    weights: { mcq: 100 },
    objectives: [objective],
    objectiveFormats: { [objective]: ["mcq"] },
    itemCounts: { mcq: 1 },
    durationMinutes: 10,
    allowedResources: [],
    instructions: "Complete the check.",
    ...overrides,
  };
}

function check(root, gate = "T01") {
  return spawnSync(process.execPath, [pep, "check", "--only", gate], {
    cwd: root,
    encoding: "utf8",
  });
}

test("T01 accepts objectiveFormats and prefixed recheck evidence", async () => {
  const root = await schemaFixture();
  await writeJson(
    path.join(root, "demo-course/assessments/intake/blueprint.json"),
    blueprint(),
  );
  const hash = "0".repeat(64);
  await writeJson(
    path.join(root, "authoring/evidence/demo-course/intake-critic-education-recheck.json"),
    {
      schemaVersion: 1,
      role: "education",
      author: "critic",
      reviewedPath: "demo-course/assessments/intake/blueprint.json",
      reviewedSha256: hash,
      findings: [],
      recheck: {
        of: "authoring/evidence/demo-course/intake-critic-education.json",
        items: [
          {
            findingId: "finding-1",
            status: "resolved",
            file: "demo-course/assessments/intake/blueprint.json",
            reviewedSha256: hash,
            note: "Resolved.",
          },
        ],
      },
    },
  );
  await writeJson(path.join(root, "authoring/evidence/demo-course/intake-reconciliation.json"), {
    schemaVersion: 1,
    author: "author",
    decidedBy: "reconciler",
    reviewedPath: "demo-course/assessments/intake/blueprint.json",
    reviewedSha256: hash,
    decisions: [
      {
        findingId: "finding-1",
        decision: "accept",
        rationale: "Apply it.",
        file: "demo-course/assessments/intake/blueprint.json",
      },
    ],
  });
  let result = check(root);
  assert.equal(result.status, 0, result.stderr);
  result = check(root, "T02");
  assert.equal(result.status, 0, result.stderr);
});

test("T02 rejects malformed review evidence filenames", async () => {
  const root = await schemaFixture();
  await writeJson(
    path.join(
      root,
      "authoring/evidence/demo-course/demo-module/demo-topic/critic-education-final.json",
    ),
    {},
  );
  const result = check(root, "T02");
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /invalid review evidence filename or location/);
});

test("T01 rejects an unresolved blueprint objective", async () => {
  const root = await schemaFixture();
  const invalid = "demo-course/demo-module/demo-topic#o2";
  await writeJson(
    path.join(root, "demo-course/assessments/intake/blueprint.json"),
    blueprint({ objectives: [invalid], objectiveFormats: { [invalid]: ["mcq"] } }),
  );
  const result = check(root);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /objective .*#o2 does not resolve/);
});

test("T01 rejects objectiveFormats keys outside objectives", async () => {
  const root = await schemaFixture();
  await writeJson(
    path.join(root, "demo-course/assessments/intake/blueprint.json"),
    blueprint({
      objectiveFormats: {
        "demo-course/demo-module/demo-topic#o2": ["mcq"],
      },
    }),
  );
  const result = check(root);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /objectiveFormats key .*#o2 is not in objectives/);
});

test("T01 rejects objectiveFormats values outside formats", async () => {
  const root = await schemaFixture();
  await writeJson(
    path.join(root, "demo-course/assessments/intake/blueprint.json"),
    blueprint({ objectiveFormats: { [objective]: ["coding"] } }),
  );
  const result = check(root);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /objectiveFormats value coding is not in formats/);
});
