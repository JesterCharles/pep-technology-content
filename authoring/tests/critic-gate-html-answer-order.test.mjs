// Narrow T25 exception for artifact.html: a page that is only an option-order
// permutation of the exact Git-history blob its evidence binds counts as
// current. The counterpart of the artifact.gift cases in critic-gate.test.mjs.
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { cp, mkdir, mkdtemp, readFile, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";
import { answerKeys, reorderPage } from "../tools/html/answer-order.mjs";

const repo = path.resolve(import.meta.dirname, "../..");
const pep = path.join(repo, "authoring", "tools", "pep");
const target = "demo-course/demo-module/demo-topic/artifact.html";
const evidence = "authoring/evidence/demo-course/demo-module/demo-topic";

const hash = (bytes) => createHash("sha256").update(bytes).digest("hex");
const option = (value, text) =>
  `<label class="opt"><input type="radio" name="predict" value="${value}"> <span>${text}</span></label>`;
const opts = `<div class="opts">${option("a", "Right")}${option("b", "Wrong b")}${option("c", "Wrong c")}${option("d", "Wrong d")}</div>`;
const keys = answerKeys("predict:{correct:'a'}");

async function writeJson(file, value) {
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, `${JSON.stringify(value, null, 2)}\n`);
}

function gitIn(root, ...args) {
  const result = spawnSync(
    "git",
    ["-c", "user.name=fixture", "-c", "user.email=fixture@example.invalid", "-c", "commit.gpgsign=false", ...args],
    { cwd: root, encoding: "utf8" },
  );
  assert.equal(result.status, 0, result.stderr);
}

function check(root) {
  return spawnSync(process.execPath, [pep, "check", "--only", "T25"], { cwd: root, encoding: "utf8" });
}

function report(role, digest) {
  return { schemaVersion: 1, role, author: `${role}-critic`, reviewedPath: target, reviewedSha256: digest, findings: [] };
}

function ownerRecord(digest) {
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
  };
}

// The positive fixture page with one keyed question added, bound by both
// critic reports (or by an owner record) and committed when asked.
async function pageFixture({ commit = true, owner = false } = {}) {
  const root = await mkdtemp(path.join(os.tmpdir(), "pep-html-order-"));
  await cp(path.join(repo, "authoring/tests/fixtures/positive/demo-course"), path.join(root, "demo-course"), { recursive: true });
  await cp(path.join(repo, "authoring/tests/fixtures/positive/authoring/catalog"), path.join(root, "authoring/catalog"), { recursive: true });
  const original = await readFile(path.join(root, target), "utf8");
  assert.ok(original.includes("</body>"));
  const page = original.replace("</body>", `${opts}</body>`);
  await writeFile(path.join(root, target), page);
  if (owner) {
    await writeJson(path.join(root, evidence, "owner-essential-qa.json"), ownerRecord(hash(Buffer.from(page))));
  } else {
    await writeJson(path.join(root, evidence, "critic-education.json"), report("education", hash(Buffer.from(page))));
    await writeJson(path.join(root, evidence, "critic-sme.json"), report("sme", hash(Buffer.from(page))));
  }
  if (commit) {
    gitIn(root, "init", "-q");
    gitIn(root, "add", "-A");
    gitIn(root, "commit", "-q", "-m", "fixture");
  }
  return { root, page };
}

test("T25 accepts a page that only moves whole option labels of its bound history blob", async () => {
  const { root, page } = await pageFixture();
  assert.equal(check(root).status, 0, check(root).stderr);
  await writeFile(path.join(root, target), reorderPage(page, keys, "C"));
  const result = check(root);
  assert.equal(result.status, 0, result.stderr);
});

test("T25 rejects page drift that is not a pure option-order permutation", async () => {
  const { page } = await pageFixture({ commit: false });
  const permuted = reorderPage(page, keys, "C");
  const cases = {
    "option text drift": permuted.replace("Wrong b", "Wrong bee"),
    "value drift": permuted.replace('value="b"', 'value="x"'),
    "text outside the options": permuted.replace("</body>", "<p>extra</p></body>"),
  };
  for (const [label, bytes] of Object.entries(cases)) {
    const { root } = await pageFixture();
    await writeFile(path.join(root, target), bytes);
    const result = check(root);
    assert.notEqual(result.status, 0, label);
    assert.match(result.stderr, /artifact\.html: missing current education critic coverage/, label);
  }
});

test("T25 rejects a permuted page when the bound blob is not in Git history", async () => {
  const { root, page } = await pageFixture({ commit: false });
  await writeFile(path.join(root, target), reorderPage(page, keys, "C"));
  const result = check(root);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /artifact\.html: missing current sme critic coverage/);
});

test("T25 accepts owner essential QA whose page binding is only option-order permuted", async () => {
  const { root, page } = await pageFixture({ owner: true });
  assert.equal(check(root).status, 0, check(root).stderr);
  await writeFile(path.join(root, target), reorderPage(page, keys, "D"));
  assert.equal(check(root).status, 0, check(root).stderr);
  await writeFile(path.join(root, target), reorderPage(page, keys, "D").replace("Wrong c", "Changed"));
  const result = check(root);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /owner essential QA binding artifacts\[0\]\.reviewedSha256 is stale/);
});
