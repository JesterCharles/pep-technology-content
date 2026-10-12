import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { cp, mkdir, mkdtemp, readFile, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";
import { createCourseLock, createModuleLock } from "../tools/lib/locks.mjs";

const repo = path.resolve(import.meta.dirname, "../..");
const pep = path.join(repo, "authoring", "tools", "pep");
const target = "demo-course/demo-module/demo-topic/artifact.html";
const topicManifest = "demo-course/demo-module/demo-topic/topic.json";

function hash(bytes) {
  return createHash("sha256").update(bytes).digest("hex");
}

async function writeJson(file, value) {
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, `${JSON.stringify(value, null, 2)}\n`);
}

async function fixture() {
  const root = await mkdtemp(path.join(os.tmpdir(), "pep-critic-"));
  await cp(
    path.join(repo, "authoring/tests/fixtures/positive/demo-course"),
    path.join(root, "demo-course"),
    { recursive: true },
  );
  const bytes = await readFile(path.join(root, target));
  return { root, digest: hash(bytes) };
}

function report(role, digest, overrides = {}) {
  return {
    schemaVersion: 1,
    role,
    author: `${role}-critic`,
    reviewedPath: target,
    reviewedSha256: digest,
    findings: [],
    ...overrides,
  };
}

function reconciliation(digest, decisions, overrides = {}) {
  return {
    schemaVersion: 1,
    author: "artifact-author",
    decidedBy: "reconciler",
    reviewedPath: target,
    reviewedSha256: digest,
    decisions,
    ...overrides,
  };
}

async function writeTopicEvidence(root, education, sme, reconcile = null, rechecks = []) {
  const evidence = path.join(root, "authoring/evidence/demo-course/demo-module/demo-topic");
  if (education) await writeJson(path.join(evidence, "critic-education.json"), education);
  if (sme) await writeJson(path.join(evidence, "critic-sme.json"), sme);
  if (reconcile) await writeJson(path.join(evidence, "reconciliation.json"), reconcile);
  for (const [name, value] of rechecks) await writeJson(path.join(evidence, name), value);
}

function check(root, gate = "T25") {
  return spawnSync(process.execPath, [pep, "check", "--only", gate], {
    cwd: root,
    encoding: "utf8",
  });
}

const highFinding = (digest) => ({
  id: "finding-1",
  severity: "high",
  location: { file: target, line: 1 },
  claim: "A correction is required.",
  evidence: [],
  recommendation: "Correct it.",
  reviewedSha256: digest,
});

const decision = (kind) => ({
  findingId: "finding-1",
  decision: kind,
  rationale: "Grounded disposition.",
});

test("T25 reports a missing critic role", async () => {
  const { root, digest } = await fixture();
  await writeTopicEvidence(root, report("education", digest), null);
  const result = check(root);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /artifact\.html: missing current sme critic coverage/);
});

test("T25 rejects module critic evidence bound to old bytes", async () => {
  const { root, digest } = await fixture();
  await writeTopicEvidence(root, report("education", digest), report("sme", digest));
  await writeFile(path.join(root, target), "changed after module criticism\n");
  const result = check(root);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /artifact\.html: missing current education critic coverage/);
  assert.match(result.stderr, /artifact\.html: missing current sme critic coverage/);
});

test("T25 accepts historical removed-target criticism with a current replacement recheck", async () => {
  const { root, digest } = await fixture();
  const removedTarget = "demo-course/demo-module/demo-topic/removed-artifact.html";
  const original = report("education", "0".repeat(64), { reviewedPath: removedTarget });
  const recheck = report("education", digest, {
    recheck: {
      of: "authoring/evidence/demo-course/demo-module/demo-topic/critic-education.json",
      items: [],
    },
  });
  await writeTopicEvidence(
    root,
    original,
    report("sme", digest),
    null,
    [["critic-education-recheck.json", recheck]],
  );

  const result = check(root);
  assert.equal(result.status, 0, result.stderr);
});

test("T25 does not count removed targets as current critic coverage", async () => {
  const { root, digest } = await fixture();
  const removedTarget = "demo-course/demo-module/demo-topic/removed-artifact.html";
  await writeTopicEvidence(
    root,
    report("education", "0".repeat(64), { reviewedPath: removedTarget }),
    report("sme", digest),
  );

  const result = check(root);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /artifact\.html: missing current education critic coverage/);
  assert.doesNotMatch(result.stderr, /names missing target/);
});

test("T25 leaves accepted high findings open without a resolved recheck", async () => {
  const { root, digest } = await fixture();
  await writeTopicEvidence(
    root,
    report("education", digest, { findings: [highFinding(digest)] }),
    report("sme", digest),
    reconciliation(digest, [decision("accept")]),
  );
  const result = check(root);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /high finding finding-1 remains open/);
});

test("T25 leaves an explicitly open high recheck open", async () => {
  const { root, digest } = await fixture();
  const original = report("education", digest, { findings: [highFinding(digest)] });
  const recheck = report("education", digest, {
    recheck: {
      of: "authoring/evidence/demo-course/demo-module/demo-topic/critic-education.json",
      items: [
        {
          findingId: "finding-1",
          status: "open",
          file: target,
          reviewedSha256: digest,
          note: "Still present.",
        },
      ],
    },
  });
  await writeTopicEvidence(
    root,
    original,
    report("sme", digest),
    reconciliation(digest, [decision("accept")]),
    [["critic-education-recheck.json", recheck]],
  );
  const result = check(root);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /high finding finding-1 remains open/);
});

test("T25 lets a later current resolved recheck supersede an earlier open one", async () => {
  const { root, digest } = await fixture();
  const oldDigest = "0".repeat(64);
  const original = report("education", oldDigest, { findings: [highFinding(oldDigest)] });
  const makeRecheck = (reviewedDigest, status, note) => report("education", reviewedDigest, {
    recheck: {
      of: "evidence/demo-course/demo-module/demo-topic/critic-education.json",
      items: [
        {
          findingId: "finding-1",
          status,
          file: target,
          reviewedSha256: reviewedDigest,
          note,
        },
      ],
    },
  });
  await writeTopicEvidence(
    root,
    original,
    report("sme", digest),
    reconciliation(digest, [decision("accept")]),
    [
      ["critic-education-recheck.json", makeRecheck(oldDigest, "open", "Still present.")],
      ["second-critic-education-recheck.json", makeRecheck(digest, "resolved", "Corrected.")],
    ],
  );
  const result = check(root);
  assert.equal(result.status, 0, result.stderr);
});

test("T25 ignores a later stale resolved recheck", async () => {
  const { root, digest } = await fixture();
  const oldDigest = "0".repeat(64);
  const original = report("education", digest, { findings: [highFinding(digest)] });
  const makeRecheck = (reviewedDigest, status, note) => report("education", reviewedDigest, {
    recheck: {
      of: "evidence/demo-course/demo-module/demo-topic/critic-education.json",
      items: [
        {
          findingId: "finding-1",
          status,
          file: target,
          reviewedSha256: reviewedDigest,
          note,
        },
      ],
    },
  });
  await writeTopicEvidence(
    root,
    original,
    report("sme", digest),
    reconciliation(digest, [decision("accept")]),
    [
      ["critic-education-recheck.json", makeRecheck(digest, "open", "Still present.")],
      ["second-critic-education-recheck.json", makeRecheck(oldDigest, "resolved", "Outdated correction.")],
    ],
  );
  const result = check(root);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /high finding finding-1 remains open/);
});

test("T25 accepts a current resolved same-role recheck", async () => {
  const { root, digest } = await fixture();
  const oldDigest = "0".repeat(64);
  const original = report("education", oldDigest, { findings: [highFinding(oldDigest)] });
  const recheck = report("education", digest, {
    recheck: {
      of: "authoring/evidence/demo-course/demo-module/demo-topic/critic-education.json",
      items: [
        {
          findingId: "finding-1",
          status: "resolved",
          file: target,
          reviewedSha256: digest,
          note: "Corrected on the final bytes.",
        },
      ],
    },
  });
  await writeTopicEvidence(
    root,
    original,
    report("sme", digest),
    reconciliation(digest, [decision("accept")]),
    [["critic-education-recheck.json", recheck]],
  );
  const result = check(root);
  assert.equal(result.status, 0, result.stderr);
});

test("T25 requires every finding to be reconciled", async () => {
  const { root, digest } = await fixture();
  const medium = { ...highFinding(digest), severity: "medium" };
  await writeTopicEvidence(
    root,
    report("education", digest, { findings: [medium] }),
    report("sme", digest),
  );
  const result = check(root);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /findings require a reconciliation/);
  assert.match(result.stderr, /finding finding-1 is not reconciled/);
});

test("T25 requires recheck.of to identify a same-role original report", async () => {
  const { root, digest } = await fixture();
  const recheck = report("education", digest, {
    recheck: {
      of: "authoring/evidence/demo-course/demo-module/demo-topic/critic-sme.json",
      items: [],
    },
  });
  await writeTopicEvidence(
    root,
    report("education", digest),
    report("sme", digest),
    null,
    [["critic-education-recheck.json", recheck]],
  );
  const result = check(root);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /existing education critic report in this scope/);
});

test("T25 treats reject-with-evidence as closed", async () => {
  const { root, digest } = await fixture();
  await writeTopicEvidence(
    root,
    report("education", digest, { findings: [highFinding(digest)] }),
    report("sme", digest),
    reconciliation(digest, [decision("reject-with-evidence")]),
  );
  const result = check(root);
  assert.equal(result.status, 0, result.stderr);
});

test("T25 leaves escalated high findings open", async () => {
  const { root, digest } = await fixture();
  await writeTopicEvidence(
    root,
    report("education", digest, { findings: [highFinding(digest)] }),
    report("sme", digest),
    reconciliation(digest, [decision("escalate")]),
  );
  const result = check(root);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /high finding finding-1 remains open/);
});

test("T25 rejects reconciliation by the artifact author", async () => {
  const { root, digest } = await fixture();
  await writeTopicEvidence(
    root,
    report("education", digest, { findings: [highFinding(digest)] }),
    report("sme", digest),
    reconciliation(digest, [decision("reject-with-evidence")], {
      decidedBy: "artifact-author",
    }),
  );
  const result = check(root);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /decidedBy must differ from author/);
});

test("T25 requires coverage for every topic artifact and lab file", async () => {
  const { root, digest } = await fixture();
  const topicRoot = path.join(root, "demo-course/demo-module/demo-topic");
  const companionPaths = [
    "artifact.gift",
    "video-artifact.md",
    "coding-lab/lab.json",
    "coding-lab/README.md",
  ];
  const artifactHashes = {};
  for (const name of companionPaths) {
    const file = path.join(topicRoot, name);
    await mkdir(path.dirname(file), { recursive: true });
    await writeFile(file, `fixture ${name}\n`);
    artifactHashes[name] = hash(await readFile(file));
  }
  await writeTopicEvidence(
    root,
    report("education", digest, { artifactHashes }),
    report("sme", digest, { artifactHashes }),
  );
  const result = check(root);
  assert.equal(result.status, 0, result.stderr);
});

test("T25 covers a course-level assessment blueprint with prefixed evidence", async () => {
  const { root, digest } = await fixture();
  await writeTopicEvidence(root, report("education", digest), report("sme", digest));
  const blueprintPath = "demo-course/assessments/intake/blueprint.json";
  await writeJson(path.join(root, blueprintPath), { fixture: true });
  const blueprintDigest = hash(await readFile(path.join(root, blueprintPath)));
  const evidence = path.join(root, "authoring/evidence/demo-course");
  await writeJson(
    path.join(evidence, "intake-critic-education.json"),
    report("education", blueprintDigest, { reviewedPath: blueprintPath }),
  );
  await writeJson(
    path.join(evidence, "intake-critic-sme.json"),
    report("sme", blueprintDigest, { reviewedPath: blueprintPath }),
  );
  const result = check(root);
  assert.equal(result.status, 0, result.stderr);
});

test("T25 keeps course intake rechecks historical after module changes", async () => {
  const { root, digest } = await fixture();
  await writeTopicEvidence(root, report("education", digest), report("sme", digest));
  const manifestFile = path.join(root, topicManifest);
  const intakeDigest = hash(await readFile(manifestFile));
  const evidence = path.join(root, "authoring/evidence/demo-course");
  const finding = {
    ...highFinding(intakeDigest),
    location: { file: topicManifest, line: 1 },
  };
  await writeJson(
    path.join(evidence, "intake-critic-sme.json"),
    report("sme", intakeDigest, {
      reviewedPath: topicManifest,
      findings: [finding],
    }),
  );
  await writeJson(
    path.join(evidence, "intake-critic-sme-recheck.json"),
    report("sme", intakeDigest, {
      reviewedPath: topicManifest,
      recheck: {
        of: "authoring/evidence/demo-course/intake-critic-sme.json",
        items: [
          {
            findingId: "finding-1",
            status: "resolved",
            file: topicManifest,
            reviewedSha256: intakeDigest,
            note: "Resolved on the final intake bytes.",
          },
        ],
      },
    }),
  );
  await writeJson(
    path.join(evidence, "intake-reconciliation.json"),
    reconciliation(intakeDigest, [decision("accept")], { reviewedPath: topicManifest }),
  );
  const manifest = JSON.parse(await readFile(manifestFile, "utf8"));
  manifest.title = "Changed during module authoring";
  await writeJson(manifestFile, manifest);

  const result = check(root);
  assert.equal(result.status, 0, result.stderr);
});

test("lock bindings use location.file and preserve stale hashes", async () => {
  const { root, digest } = await fixture();
  const evidence = path.join(
    root,
    "authoring/evidence/demo-course/demo-module/demo-topic/location.json",
  );
  await writeJson(evidence, {
    findings: [{ location: { file: target }, reviewedSha256: digest }],
  });
  let lock = await createModuleLock(root, "demo-course", "demo-module");
  let binding = lock.evidenceBindings.find((entry) => entry.evidencePath.endsWith("location.json"));
  assert.equal(binding.artifactPath, target);
  assert.equal(binding.current, true);

  await writeJson(evidence, {
    findings: [{ location: { file: target }, reviewedSha256: "0".repeat(64) }],
  });
  lock = await createModuleLock(root, "demo-course", "demo-module");
  binding = lock.evidenceBindings.find((entry) => entry.evidencePath.endsWith("location.json"));
  assert.equal(binding.sha256, "0".repeat(64));
  assert.equal(binding.current, false);
});

test("reviewedPath takes precedence over file and location.file", async () => {
  const { root, digest } = await fixture();
  const evidence = path.join(
    root,
    "authoring/evidence/demo-course/demo-module/demo-topic/precedence.json",
  );
  await writeJson(evidence, {
    reviewedPath: target,
    file: "missing-file",
    location: { file: "also-missing" },
    reviewedSha256: digest,
  });
  const lock = await createModuleLock(root, "demo-course", "demo-module");
  const binding = lock.evidenceBindings.find((entry) => entry.evidencePath.endsWith("precedence.json"));
  assert.equal(binding.artifactPath, target);
  assert.equal(binding.current, true);
});

test("course-level binding without a target fails", async () => {
  const { root } = await fixture();
  await writeJson(path.join(root, "authoring/evidence/demo-course/unbound.json"), {
    reviewedSha256: "0".repeat(64),
  });
  await assert.rejects(
    createCourseLock(root, "demo-course"),
    /binding has no target at reviewedSha256/,
  );
});

test("a removed binding is explicit, historical, and accepted by T06", async () => {
  const { root } = await fixture();
  const evidence = path.join(
    root,
    "authoring/evidence/demo-course/demo-module/demo-topic/removed.json",
  );
  const removedTarget = "demo-course/demo-module/demo-topic/removed-artifact.html";
  await writeJson(evidence, {
    reviewedPath: removedTarget,
    reviewedSha256: "0".repeat(64),
  });

  const moduleLock = await createModuleLock(root, "demo-course", "demo-module");
  const binding = moduleLock.evidenceBindings.find((entry) =>
    entry.evidencePath.endsWith("removed.json"),
  );
  assert.equal(binding.artifactPath, removedTarget);
  assert.equal(binding.current, false);
  assert.equal(binding.historical, true);
  assert.equal(binding.missing, true);

  await writeJson(
    path.join(root, "demo-course/course.lock.json"),
    await createCourseLock(root, "demo-course"),
  );
  await writeJson(
    path.join(root, "demo-course/demo-module/module.lock.json"),
    moduleLock,
  );
  await cp(path.join(repo, "authoring/schemas"), path.join(root, "authoring/schemas"), { recursive: true });
  const schemaResult = check(root, "T01");
  assert.equal(schemaResult.status, 0, schemaResult.stderr);
  const result = check(root, "T06");
  assert.equal(result.status, 0, result.stderr);
});

test("lock regeneration with stale evidence is stable", async () => {
  const { root } = await fixture();
  await writeJson(
    path.join(root, "authoring/evidence/demo-course/demo-module/demo-topic/stale.json"),
    { reviewedSha256: "0".repeat(64) },
  );
  const first = await createModuleLock(root, "demo-course", "demo-module");
  const second = await createModuleLock(root, "demo-course", "demo-module");
  assert.deepEqual(second, first);
  assert.ok(first.evidenceBindings.some((binding) => binding.current === false));
});

async function lockFixtureWithHistoricalCourseBinding() {
  const { root } = await fixture();
  const manifestFile = path.join(root, topicManifest);
  await writeJson(path.join(root, "authoring/evidence/demo-course/intake-history.json"), {
    reviewedPath: topicManifest,
    reviewedSha256: hash(await readFile(manifestFile)),
  });
  const courseLock = await createCourseLock(root, "demo-course");
  const moduleLock = await createModuleLock(root, "demo-course", "demo-module");
  await writeJson(path.join(root, "demo-course/course.lock.json"), courseLock);
  await writeJson(
    path.join(root, "demo-course/demo-module/module.lock.json"),
    moduleLock,
  );
  return { root, manifestFile, courseLock };
}

async function changeTopicManifest(manifestFile) {
  const manifest = JSON.parse(await readFile(manifestFile, "utf8"));
  manifest.title = "Changed during module authoring";
  await writeJson(manifestFile, manifest);
}

test("editing module topic.json leaves the course lock current", async () => {
  const { root, manifestFile, courseLock } =
    await lockFixtureWithHistoricalCourseBinding();
  await changeTopicManifest(manifestFile);
  assert.deepEqual(await createCourseLock(root, "demo-course"), courseLock);
  await writeJson(
    path.join(root, "demo-course/demo-module/module.lock.json"),
    await createModuleLock(root, "demo-course", "demo-module"),
  );

  const result = check(root, "T06");
  assert.equal(result.status, 0, result.stderr);
});

test("T06 still rejects a stale module lock without staling the course lock", async () => {
  const { root, manifestFile } = await lockFixtureWithHistoricalCourseBinding();
  await changeTopicManifest(manifestFile);

  const result = check(root, "T06");
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /module\.lock\.json: module lock is stale/);
  assert.doesNotMatch(result.stderr, /course\.lock\.json: course lock is stale/);
});
