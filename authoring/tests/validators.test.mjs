import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import path from "node:path";
import test from "node:test";
import {
  canonicalJson,
  extractCalendar,
} from "../tools/curriculum/extract-calendar.mjs";
import { validateGift } from "../tools/gift/validate.mjs";

const repo = path.resolve(import.meta.dirname, "../..");
const pep = path.join(repo, "authoring", "tools", "pep");
const expectedCategory = "demo-course/demo-module/demo-topic";

function runCheck(id, target, cwd = repo) {
  const argumentsList = [pep, "check", "--only", id];
  if (target) {
    argumentsList.push(target);
  }
  return spawnSync(process.execPath, argumentsList, { cwd, encoding: "utf8" });
}

function digest(bytes) {
  return createHash("sha256").update(bytes).digest("hex");
}

test("frozen estimator remains byte-identical to its provenance hash", async () => {
  const bytes = await readFile(path.join(repo, "authoring/tools/timing/estimate_reading.py"));
  assert.equal(
    digest(bytes),
    "0deca96bf5e367aeae51a82abdbd4b6ce0d0289ecc9868c9eff3701016edf96f",
  );
});

test("calendar extraction is deterministic and T19 validates all 105 days", async () => {
  const snapshot = await readFile(
    path.join(repo, "curriculum/snapshot/pep-calendar.json"),
    "utf8",
  );
  const source = await readFile(
    "/Users/jestercharles/pep-workspace/pep-calendar.html",
    "utf8",
  ).catch(() => null);
  if (source) {
    assert.equal(canonicalJson(extractCalendar(source)), snapshot);
  }
  const result = runCheck("T19");
  assert.equal(result.status, 0, result.stderr);
});

test("T19 rejects a snapshot that disagrees with its lock", () => {
  const result = runCheck("T19", "authoring/tests/fixtures/snapshot-stale");
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /locked bytes disagree for curriculum\/snapshot\/pep-calendar\.json/);
});

test("GIFT validator accepts the supported Moodle paths", async () => {
  const bytes = await readFile(path.join(repo, "authoring/tests/fixtures/gift/valid.gift"));
  const questions = validateGift(bytes, expectedCategory);
  assert.equal(questions.length, 1);
  assert.equal(questions[0].options.filter((option) => option.correct).length, 1);
  assert.equal(questions[0].options[0].answer, "The safe = option");
});

const giftFailures = [
  ["non-ascii.gift", /ASCII/],
  ["two-correct.gift", /exactly one correct/],
  ["missing-feedback.gift", /no # feedback/],
  ["bad-feedback.gift", /feedback must open/],
  ["html.gift", /must not contain < or >/],
  ["wrong-category.gift", /category .* must equal/],
  ["bad-escape.gift", /unsupported or dangling escape/],
];

for (const [fixture, message] of giftFailures) {
  test(`GIFT validator rejects ${fixture}`, async () => {
    const bytes = await readFile(path.join(repo, "authoring/tests/fixtures/gift", fixture));
    assert.throws(() => validateGift(bytes, expectedCategory), message);
  });
}

test("T14 accepts a recorded worst path independently of estimator P90", () => {
  const result = runCheck("T14", "authoring/tests/fixtures/timing-worst-path");
  assert.equal(result.status, 0, result.stderr);
});

test("T14 accepts required-path budgets when P50 exceeds the old share, including practice", () => {
  const result = runCheck("T14", "authoring/tests/fixtures/timing-budget-policy");
  assert.equal(result.status, 0, result.stderr);
});

test("T14 keeps course 1 on its approved legacy-label basis", () => {
  const result = runCheck("T14", "authoring/tests/fixtures/timing-legacy-label");
  assert.equal(result.status, 0, result.stderr);
});

test("T14 rejects a budget below the rounded-up P50", () => {
  const result = runCheck("T14", "authoring/tests/fixtures/timing-over-budget");
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /budget 1 is below required 2 minutes .*P50 1\.7/);
});

test("T14 reports day overflow instead of compressing honest topic budgets", () => {
  const result = runCheck("T14", "authoring/tests/fixtures/timing-day-overflow");
  assert.notEqual(result.status, 0);
  assert.match(
    result.stderr,
    /F4 topic budgets total 135\.00 exceeds 120 minute day total by 15\.00 minutes; budgets were not compressed/,
  );
});

test("T14 validates worst-path metadata", () => {
  const result = runCheck("T14", "authoring/tests/fixtures/timing-invalid-metadata");
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /modeledWorstPath must be at least modeledP50/);
  assert.match(result.stderr, /minutes\.basis must be non-empty/);
  assert.match(result.stderr, /aboutLabel does not cover modeledWorstPath/);
});

test("T15 rejects a stale source receipt", () => {
  const fixture = path.join(repo, "authoring/tests/fixtures/receipts-stale");
  const result = runCheck("T15", null, fixture);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /receipt is older than 30 days/);
});

test("T17 rejects a stale video receipt", () => {
  const fixture = path.join(repo, "authoring/tests/fixtures/receipts-stale");
  const result = runCheck("T17", null, fixture);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /receipt is older than 30 days/);
});
