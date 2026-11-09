import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { cp, mkdir, mkdtemp, readFile, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";
import { reorderBank } from "../tools/gift/answer-order.mjs";
import { parseGift } from "../tools/gift/validate.mjs";
import { createCourseLock, createModuleLock } from "../tools/lib/locks.mjs";

const repo = path.resolve(import.meta.dirname, "../..");
const pep = path.join(repo, "authoring", "tools", "pep");
const target = "demo-course/demo-module/demo-topic/artifact.html";
const topicManifest = "authoring/catalog/demo-course/demo-module/demo-topic/topic.json";

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
  await cp(
    path.join(repo, "authoring/tests/fixtures/positive/authoring/catalog"),
    path.join(root, "authoring/catalog"),
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

test("T02 and T25 preserve a topic recheck chain and close from its current report", async () => {
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
      ["focused-final-critic-education-recheck.json", makeRecheck(digest, "resolved", "Corrected.")],
    ],
  );

  const treeResult = check(root, "T02");
  assert.equal(treeResult.status, 0, treeResult.stderr);

  const lock = await createModuleLock(root, "demo-course", "demo-module");
  const lockedEvidence = new Set(lock.evidenceBindings.map((binding) => binding.evidencePath));
  assert.ok(lockedEvidence.has(
    "authoring/evidence/demo-course/demo-module/demo-topic/critic-education-recheck.json",
  ));
  assert.ok(lockedEvidence.has(
    "authoring/evidence/demo-course/demo-module/demo-topic/focused-final-critic-education-recheck.json",
  ));

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

test("T25 requires prefixed recheck.of to identify a same-role original report", async () => {
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
    [["focused-critic-education-recheck.json", recheck]],
  );
  const result = check(root);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /existing education critic report in this scope/);
});

test("T25 rejects a role-mismatched prefixed topic recheck", async () => {
  const { root, digest } = await fixture();
  const recheck = report("sme", digest, {
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
    [["focused-critic-education-recheck.json", recheck]],
  );
  const result = check(root);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /filename role education differs from role sme/);
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

test("T25 discovers learner-safe assessments and labs at course and module scope", async () => {
  const { root, digest } = await fixture();
  await writeTopicEvidence(root, report("education", digest), report("sme", digest));
  const scopes = [
    {
      content: "demo-course",
      evidence: "authoring/evidence/demo-course",
      prefix: "course-work",
      files: ["coding-lab/lab.json", "coding-lab/README.md", "assessments/check/blueprint.json"],
    },
    {
      content: "demo-course/demo-module",
      evidence: "authoring/evidence/demo-course/demo-module",
      prefix: "module-work",
      files: ["coding-lab/lab.json", "coding-lab/README.md", "assessments/check/blueprint.json"],
    },
  ];
  for (const scope of scopes) {
    const artifactHashes = {};
    for (const relativeFile of scope.files) {
      const file = path.join(root, scope.content, relativeFile);
      await mkdir(path.dirname(file), { recursive: true });
      await writeFile(file, `fixture ${relativeFile}\n`);
      artifactHashes[relativeFile] = hash(await readFile(file));
    }
    for (const role of ["education", "sme"]) {
      await writeJson(
        path.join(root, scope.evidence, `${scope.prefix}-critic-${role}.json`),
        report(role, artifactHashes[scope.files[0]], {
          reviewedPath: `${scope.content}/${scope.files[0]}`,
          artifactHashes,
        }),
      );
    }
  }
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
    path.join(root, "authoring/catalog/demo-course/course.lock.json"),
    await createCourseLock(root, "demo-course"),
  );
  await writeJson(
    path.join(root, "authoring/catalog/demo-course/demo-module/module.lock.json"),
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
  await writeJson(path.join(root, "authoring/catalog/demo-course/course.lock.json"), courseLock);
  await writeJson(
    path.join(root, "authoring/catalog/demo-course/demo-module/module.lock.json"),
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
    path.join(root, "authoring/catalog/demo-course/demo-module/module.lock.json"),
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

function ownerRecord(digest, overrides = {}) {
  return {
    schemaVersion: 1,
    acceptanceProfile: "minimum",
    owner: "artifact-author",
    provenance: "Implementation owner's essential pass on the final bytes.",
    independentCriticApproval: "not-required-not-performed",
    statement: "Independent education and SME critic approval was not required or performed under the minimum profile.",
    checkedAt: "2026-11-08T00:00:00Z",
    checks: ["correctness", "privacy and answer safety", "working-file validity"],
    artifacts: [{ reviewedPath: target, reviewedSha256: digest }],
    ...overrides,
  };
}

async function writeOwner(root, value) {
  await writeJson(
    path.join(root, "authoring/evidence/demo-course/demo-module/demo-topic/owner-essential-qa.json"),
    value,
  );
}

test("T25 without an owner record still requires both critic roles", async () => {
  const { root } = await fixture();
  const result = check(root);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /artifact\.html: missing current education critic coverage/);
  assert.match(result.stderr, /artifact\.html: missing current sme critic coverage/);
  assert.doesNotMatch(result.stderr, /owner essential QA/);
});

test("T25 accepts current minimum-profile owner essential QA in place of critic coverage", async () => {
  const { root, digest } = await fixture();
  await writeOwner(root, ownerRecord(digest));
  const result = check(root);
  assert.equal(result.status, 0, result.stderr);
});

test("T25 rejects stale minimum-profile owner essential QA", async () => {
  const { root, digest } = await fixture();
  await writeOwner(root, ownerRecord(digest));
  await writeFile(path.join(root, target), "changed after the owner pass\n");
  const result = check(root);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /owner essential QA binding .* is stale/);
  assert.match(result.stderr, /artifact\.html: missing current owner essential QA coverage/);
});

test("T25 rejects owner essential QA that does not bind the reviewable file", async () => {
  const { root } = await fixture();
  const other = "demo-course/demo-module/demo-topic/other.html";
  await writeFile(path.join(root, other), "other\n");
  await writeOwner(root, ownerRecord(hash(Buffer.from("other\n")), {
    artifacts: [{ reviewedPath: other, reviewedSha256: hash(Buffer.from("other\n")) }],
  }));
  const result = check(root);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /artifact\.html: missing current owner essential QA coverage/);
});

test("T25 rejects owner essential QA that claims critic approval or a full profile", async () => {
  for (const overrides of [
    { independentCriticApproval: "approved" },
    { acceptanceProfile: "full" },
    { checks: [] },
  ]) {
    const { root, digest } = await fixture();
    await writeOwner(root, ownerRecord(digest, overrides));
    const result = check(root);
    assert.notEqual(result.status, 0, JSON.stringify(overrides));
    assert.match(result.stderr, /owner essential QA requires|owner essential QA must state/);
  }
});

test("T25 still enforces open critic findings beside owner essential QA", async () => {
  const { root, digest } = await fixture();
  await writeOwner(root, ownerRecord(digest));
  await writeTopicEvidence(root, report("education", digest, { findings: [highFinding(digest)] }), null);
  const result = check(root);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /findings require a reconciliation/);
});

const topicLab = "demo-course/demo-module/demo-topic/coding-lab/README.md";
const moduleLab = "demo-course/demo-module/coding-lab/README.md";
const deferralFile = "authoring/evidence/demo-course/demo-module/deferred-reviewable.json";

function deferralRecord(files, overrides = {}) {
  return {
    schemaVersion: 1,
    acceptanceProfile: "minimum",
    status: "deferred-excluded-not-counted",
    independentCriticApproval: "not-performed",
    ownerReleaseApproval: "not-granted",
    owner: "artifact-author",
    statement: "These pre-existing lab files are outside this minimum-profile release; they are deferred, excluded and not counted, with no critic or owner release approval.",
    recordedAt: "2026-11-08T00:00:00Z",
    files,
    ...overrides,
  };
}

async function labFixture() {
  const fx = await fixture();
  await writeOwner(fx.root, ownerRecord(fx.digest));
  const labs = {};
  for (const file of [topicLab, moduleLab]) {
    const bytes = Buffer.from(`# pre-existing lab ${file}\n`);
    await mkdir(path.dirname(path.join(fx.root, file)), { recursive: true });
    await writeFile(path.join(fx.root, file), bytes);
    labs[file] = hash(bytes);
  }
  const entries = Object.entries(labs).map(([deferredPath, deferredSha256]) => ({
    deferredPath,
    deferredSha256,
    reason: "Pre-existing lab outside tonight's release.",
  }));
  return { ...fx, labs, entries };
}

test("T25 without a deferral record still requires coverage for lab files", async () => {
  const { root } = await labFixture();
  const result = check(root);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /demo-topic\/coding-lab\/README\.md: missing current owner essential QA coverage/);
  assert.match(result.stderr, /demo-module\/coding-lab\/README\.md: missing current education critic coverage/);
  assert.match(result.stderr, /demo-module\/coding-lab\/README\.md: missing current sme critic coverage/);
});

test("T25 excludes exact-hash deferred lab files under a minimum module", async () => {
  const { root, entries } = await labFixture();
  await writeJson(path.join(root, deferralFile), deferralRecord(entries));
  const result = check(root);
  assert.equal(result.status, 0, result.stderr);
  await cp(path.join(repo, "authoring/schemas"), path.join(root, "authoring/schemas"), { recursive: true });
  const schema = check(root, "T01");
  assert.equal(schema.status, 0, schema.stderr);
});

test("T25 rejects a stale deferral and keeps the lab file counted", async () => {
  const { root, entries } = await labFixture();
  await writeJson(path.join(root, deferralFile), deferralRecord(entries));
  await writeFile(path.join(root, topicLab), "changed after deferral\n");
  const result = check(root);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /deferred hash is stale for .*demo-topic\/coding-lab\/README\.md/);
  assert.match(result.stderr, /demo-topic\/coding-lab\/README\.md: missing current owner essential QA coverage/);
});

test("T25 rejects a deferral that omits a lab file", async () => {
  const { root, entries } = await labFixture();
  await writeJson(path.join(root, deferralFile), deferralRecord(entries.slice(0, 1)));
  const result = check(root);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /demo-module\/coding-lab\/README\.md: missing current education critic coverage/);
});

test("T25 rejects deferral of non-lab files, full profiles or approval claims", async () => {
  const cases = [
    [(e) => [{ deferredPath: target, deferredSha256: e.digest, reason: "x" }], {}, /must name a coding-lab/],
    [(e) => e.entries, { acceptanceProfile: "full" }, /requires acceptanceProfile minimum/],
    [(e) => e.entries, { independentCriticApproval: "approved" }, /requires independentCriticApproval not-performed/],
    [(e) => e.entries, { ownerReleaseApproval: "approved" }, /requires ownerReleaseApproval not-granted/],
    [(e) => e.entries, { status: "approved" }, /requires status deferred-excluded-not-counted/],
  ];
  for (const [files, overrides, message] of cases) {
    const fx = await labFixture();
    await writeJson(path.join(fx.root, deferralFile), deferralRecord(files(fx), overrides));
    const result = check(fx.root);
    assert.notEqual(result.status, 0, JSON.stringify(overrides));
    assert.match(result.stderr, message);
    assert.match(result.stderr, /coding-lab\/README\.md: missing current/);
  }
});

test("T25 rejects a deferral naming a missing lab file", async () => {
  const { root, entries } = await labFixture();
  const missing = "demo-course/demo-module/other-topic/coding-lab/lab.json";
  await writeJson(path.join(root, deferralFile), deferralRecord([
    ...entries,
    { deferredPath: missing, deferredSha256: "0".repeat(64), reason: "x" },
  ]));
  const result = check(root);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /deferred file .*other-topic\/coding-lab\/lab\.json is missing/);
  assert.match(result.stderr, /coding-lab\/README\.md: missing current/);
});

// Narrow T25 exception: a topic artifact.gift that is only an answer-order
// permutation of the exact Git-history blob its evidence binds.
const giftPath = "demo-course/demo-module/demo-topic/artifact.gift";
const baseGift = [
  "$CATEGORY: demo-course/demo-module/demo-topic",
  "",
  "::q1 escapes::Which value is x\\=1? {",
  "=The safe \\= option \\{ok\\}#Correct. Uses \\~ safely\\: yes.",
  "~Risky one#Not quite. First distractor.",
  "~Risky two#Not quite. Second distractor.",
  "~Risky three#Not quite. Third distractor.",
  "}",
  "",
  "::q2 plain::Which is right? {",
  "=Right#Correct. Yes.",
  "~Wrong a#Not quite. A.",
  "~Wrong b#Not quite. B.",
  "~Wrong c#Not quite. C.",
  "}",
  "",
].join("\n");

function gitIn(root, ...args) {
  const result = spawnSync(
    "git",
    ["-c", "user.name=fixture", "-c", "user.email=fixture@example.invalid", "-c", "commit.gpgsign=false", ...args],
    { cwd: root, encoding: "utf8" },
  );
  assert.equal(result.status, 0, result.stderr);
}

async function giftFixture({ commit = true } = {}) {
  const { root, digest } = await fixture();
  await writeFile(path.join(root, giftPath), baseGift);
  const artifactHashes = { "artifact.gift": hash(Buffer.from(baseGift)) };
  await writeTopicEvidence(
    root,
    report("education", digest, { artifactHashes }),
    report("sme", digest, { artifactHashes }),
  );
  if (commit) {
    gitIn(root, "init", "-q");
    gitIn(root, "add", "-A");
    gitIn(root, "commit", "-q", "-m", "fixture");
  }
  return root;
}

const permutedGift = reorderBank(baseGift, "CB");

test("T25 accepts a gift that only permutes whole option blocks of its bound history blob", async () => {
  const root = await giftFixture();
  assert.equal(check(root).status, 0);
  await writeFile(path.join(root, giftPath), permutedGift);
  const result = check(root);
  assert.equal(result.status, 0, result.stderr);
});

test("T25 rejects gift drift that is not a pure answer-order permutation", async () => {
  const [header, q1, q2] = permutedGift.trimEnd().split("\n\n");
  const bank = (...blocks) => `${blocks.join("\n\n")}\n`;
  const cases = {
    "marker switch": permutedGift
      .replace("=Right#Correct. Yes.", "~Right#Not quite. Yes.")
      .replace("~Wrong a#Not quite. A.", "=Wrong a#Correct. A."),
    "feedback drift": permutedGift.replace("Second distractor.", "Another distractor."),
    "option text drift": permutedGift.replace("~Risky one#", "~Risky uno#"),
    "escape drift": permutedGift.replace("safely\\: yes", "safely: yes"),
    "stem drift": permutedGift.replace("Which is right?", "Which one is right?"),
    "question reorder": bank(header, q2, q1),
    "question deleted": bank(header, q1),
    "question added": bank(header, q1, q2, q2.replace("::q2 plain::", "::q3 plain::")),
    "layout drift": permutedGift.replace("~Wrong b#Not quite. B.\n", "~Wrong b#Not quite. B. "),
    "parse failure": permutedGift.replace("=Right#Correct. Yes.", "~Right#Correct. Yes."),
    "unsupported CRLF": permutedGift.replaceAll("\n", "\r\n"),
  };
  const parseFailures = new Set(["parse failure", "unsupported CRLF"]);
  for (const [label, bytes] of Object.entries(cases)) {
    assert.notEqual(bytes, permutedGift, label);
    // Every other case is valid GIFT, so only the permutation rule rejects it.
    if (!parseFailures.has(label)) assert.doesNotThrow(() => parseGift(Buffer.from(bytes)), label);
    const root = await giftFixture();
    await writeFile(path.join(root, giftPath), bytes);
    const result = check(root);
    assert.notEqual(result.status, 0, label);
    assert.match(result.stderr, /artifact\.gift: missing current education critic coverage/, label);
  }
});

test("T25 rejects a permuted gift when the bound blob is not in Git history", async () => {
  const root = await giftFixture({ commit: false });
  await writeFile(path.join(root, giftPath), permutedGift);
  const result = check(root);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /artifact\.gift: missing current sme critic coverage/);
});

test("T25 keeps exact binding for non-GIFT artifacts even in a Git checkout", async () => {
  const root = await giftFixture();
  await writeFile(path.join(root, target), "changed after criticism\n");
  const result = check(root);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /artifact\.html: missing current education critic coverage/);
});

test("T25 accepts owner essential QA whose gift binding is only answer-order permuted", async () => {
  const root = await giftFixture();
  const html = hash(await readFile(path.join(root, target)));
  await writeOwner(root, ownerRecord(html, {
    artifacts: [
      { reviewedPath: target, reviewedSha256: html },
      { reviewedPath: giftPath, reviewedSha256: hash(Buffer.from(baseGift)) },
    ],
  }));
  gitIn(root, "add", "-A");
  gitIn(root, "commit", "-q", "-m", "owner");
  await writeFile(path.join(root, giftPath), permutedGift);
  assert.equal(check(root).status, 0, check(root).stderr);
  await writeFile(path.join(root, giftPath), permutedGift.replace("Second distractor.", "Changed."));
  const result = check(root);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /owner essential QA binding artifacts\[1\]\.reviewedSha256 is stale/);
});
