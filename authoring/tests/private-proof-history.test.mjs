import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { validatePrivateProofs } from "../tools/checks/T06-lock.mjs";

const OWNER = "course/module/topic";
const RECEIPT = `authoring/evidence/${OWNER}/qa-receipt.json`;
const LOCK = "authoring/catalog/course/module/module.lock.json";
const RUN_ID = "local-safe-history-1";
const PUBLIC = {
  [`${OWNER}/artifact.html`]: "<!doctype html><title>Public artifact</title>\n",
  [`authoring/evidence/${OWNER}/qa-paths.json`]: `${JSON.stringify({ answerSafety: { privateSuccessProof: true } })}\n`,
  "authoring/tools/qa/harness.mjs": "// public harness\n",
  "authoring/tools/qa/python-answer-scan.py": "# public scanner\n",
  "authoring/tools/checks/T08-html-static.mjs": "// public static check\n",
};
const MSG = {
  ancestor: "private success proof commit must be an ancestor of current HEAD",
  child: "private success receipt must be introduced in the immediate child of its proof commit",
  original: "private success original receipt commit must be an ancestor of current HEAD",
  reused: "private success runId is reintroduced with a different proof object",
};

function git(root, ...args) {
  const result = spawnSync("git", ["-c", "user.name=QA", "-c", "user.email=qa@example.invalid", "-c", "advice.detachedHead=false", ...args], {
    cwd: root,
    encoding: "utf8",
  });
  assert.equal(result.status, 0, `git ${args.join(" ")}: ${result.stderr}`);
  return result.stdout.trim();
}

async function put(root, file, contents) {
  await mkdir(path.dirname(path.join(root, file)), { recursive: true });
  await writeFile(path.join(root, file), contents);
}

// Base B on main; PR branch P (public bytes) -> R (receipt + lock only) -> H (later work).
// S squashes H onto B; M is the repair merge of H into S with S as first parent.
async function buildHistory() {
  const root = await mkdtemp(path.join(os.tmpdir(), "pep-proof-history-"));
  git(root, "init", "-q", "-b", "main");
  await put(root, "README.md", "base\n");
  git(root, "add", ".");
  git(root, "commit", "-qm", "base");
  const B = git(root, "rev-parse", "HEAD");
  git(root, "checkout", "-q", "-b", "pr");
  for (const [file, contents] of Object.entries(PUBLIC)) await put(root, file, contents);
  git(root, "add", ".");
  git(root, "commit", "-qm", "public bytes");
  const P = git(root, "rev-parse", "HEAD");
  const proof = {
    record: `validated at ${P} by run ${RUN_ID}`,
    runId: RUN_ID,
    ranAt: "2026-11-07T00:00:00Z",
    environment: { node: "24" },
    result: "pass",
    stagingRetired: true,
    publicBindings: Object.entries(PUBLIC).map(([file, contents]) => ({ file, reviewedSha256: createHash("sha256").update(contents).digest("hex") })),
    commit: P,
  };
  await put(root, RECEIPT, `${JSON.stringify({ privateSuccessProof: proof }, null, 2)}\n`);
  await put(root, LOCK, "{}\n");
  git(root, "add", ".");
  git(root, "commit", "-qm", "record private proof");
  const R = git(root, "rev-parse", "HEAD");
  await put(root, "notes.md", "later readiness\n");
  git(root, "add", ".");
  git(root, "commit", "-qm", "later work");
  const H = git(root, "rev-parse", "HEAD");
  const S = squashOnto(root, B, H, "squash");
  git(root, "checkout", "-q", "--detach", S);
  git(root, "merge", "-q", "--no-ff", "-m", "repair merge", H);
  const M = git(root, "rev-parse", "HEAD");
  assert.equal(git(root, "rev-parse", `${M}^{tree}`), git(root, "rev-parse", `${H}^{tree}`));
  return { root, B, P, R, H, S, M, proof };
}

function squashOnto(root, base, source, message) {
  git(root, "checkout", "-q", "--detach", base);
  git(root, "read-tree", "-u", "--reset", source);
  git(root, "commit", "-qm", message);
  return git(root, "rev-parse", "HEAD");
}

// Checks out `head` and leaves exactly `refs` as the repository's refs, so `--all` sees only them.
async function evaluate(root, head, refs) {
  git(root, "checkout", "-q", "--detach", head);
  for (const ref of git(root, "for-each-ref", "--format=%(refname)").split("\n").filter(Boolean)) git(root, "update-ref", "-d", ref);
  refs.forEach((commit, index) => git(root, "update-ref", `refs/heads/ref-${index}`, commit));
  return (await validatePrivateProofs(root, path.join(root, "authoring/evidence/course"))).map((item) => item.message);
}

test("private-proof history accepts only identical squash materialization with the original edge in HEAD", async () => {
  const h = await buildHistory();
  try {
    // A/B: a previously green original head stays green when an unrelated squash ref exists.
    assert.deepEqual(await evaluate(h.root, h.H, [h.H]), [], "A original head");
    assert.deepEqual(await evaluate(h.root, h.H, [h.H, h.S]), [], "B unrelated squash ref must not fail the original head");
    // C1/C2: the repair merge passes whether or not the original branch ref is present.
    assert.deepEqual(await evaluate(h.root, h.M, [h.M]), [], "C1 repair merge alone");
    assert.deepEqual(await evaluate(h.root, h.M, [h.M, h.H]), [], "C2 repair merge with original branch ref");
    // D/D2: squash-only history lacks the original proof edge.
    assert.deepEqual(await evaluate(h.root, h.S, [h.S, h.H]), [MSG.ancestor, MSG.original], "D squash with original on another ref");
    assert.deepEqual(await evaluate(h.root, h.S, [h.S]), [MSG.ancestor, MSG.child], "D2 squash alone");
  } finally {
    await rm(h.root, { recursive: true, force: true });
  }
});

test("private-proof history rejects a runId reintroduced with a changed proof object or binding", async () => {
  const h = await buildHistory();
  try {
    for (const [label, mutate] of [
      ["E changed result field", (proof) => { proof.ranAt = "1970-01-01T00:00:00Z"; }],
      ["E changed binding", (proof) => { proof.publicBindings[0].reviewedSha256 = "0".repeat(64); }],
    ]) {
      // A squash-shaped copy carries an altered proof; the merge restores the original receipt bytes,
      // so default history simplification would see only the original introduction.
      git(h.root, "checkout", "-q", "--detach", h.B);
      git(h.root, "read-tree", "-u", "--reset", h.H);
      const altered = structuredClone(h.proof);
      mutate(altered);
      await put(h.root, RECEIPT, `${JSON.stringify({ privateSuccessProof: altered }, null, 2)}\n`);
      git(h.root, "add", ".");
      git(h.root, "commit", "-qm", "altered copy");
      const X = git(h.root, "rev-parse", "HEAD");
      spawnSync("git", ["merge", "--no-ff", "--no-commit", h.H], { cwd: h.root, encoding: "utf8" });
      git(h.root, "checkout", h.H, "--", RECEIPT);
      git(h.root, "commit", "-qm", "resolve to original receipt");
      const head = git(h.root, "rev-parse", "HEAD");
      assert.deepEqual(await evaluate(h.root, head, [head]), [`${MSG.reused}: ${X}`], label);
    }
  } finally {
    await rm(h.root, { recursive: true, force: true });
  }
});

test("private-proof history rejects a Reporting-style replayed receipt with dropped proof ancestry", async () => {
  const h = await buildHistory();
  try {
    git(h.root, "checkout", "-q", "--detach", h.B);
    git(h.root, "commit", "-q", "--allow-empty", "-m", "newer main");
    git(h.root, "cherry-pick", `${h.B}..${h.H}`);
    const F = git(h.root, "rev-parse", "HEAD");
    assert.equal(git(h.root, "rev-parse", `${F}^{tree}`), git(h.root, "rev-parse", `${h.H}^{tree}`));
    assert.deepEqual(await evaluate(h.root, F, [F, h.H]), [MSG.ancestor, MSG.original], "F replay with original retained elsewhere");
    assert.deepEqual(await evaluate(h.root, F, [F]), [MSG.ancestor, MSG.child], "F2 replay with original dropped");
  } finally {
    await rm(h.root, { recursive: true, force: true });
  }
});

test("existing SQL/JDBC private-success receipts stay green under the history rule", async (t) => {
  const repoRoot = path.resolve(fileURLToPath(new URL("../..", import.meta.url)));
  const shallow = spawnSync("git", ["rev-parse", "--is-shallow-repository"], { cwd: repoRoot, encoding: "utf8" }).stdout.trim();
  if (shallow !== "false") return t.skip("receipt lineage needs full history");
  const evidence = path.join(repoRoot, "authoring/evidence/sql-jdbc-foundations");
  const receipts = spawnSync("git", ["ls-files", "--", "authoring/evidence/sql-jdbc-foundations/*/*/qa-receipt.json"], { cwd: repoRoot, encoding: "utf8" })
    .stdout.trim().split("\n").filter(Boolean);
  const proofs = [];
  for (const file of receipts) if (JSON.parse(await readFile(path.join(repoRoot, file), "utf8")).privateSuccessProof) proofs.push(file);
  assert.ok(proofs.length > 0, "R1 needs existing SQL/JDBC private-success receipts");
  assert.deepEqual(await validatePrivateProofs(repoRoot, evidence), [], "R1 SQL/JDBC receipts");
});

// Reporting shape: the original R is followed by a later truthful metadata-only receipt correction
// that does not change the runId count, so it is not an introduction and is not compared to R.
test("private-proof history accepts a later metadata-only correction and still verifies its bindings", async () => {
  const h = await buildHistory();
  try {
    const writeCorrection = async (mutate) => {
      git(h.root, "checkout", "-q", "--detach", h.H);
      const corrected = structuredClone(h.proof);
      corrected.environment = { node: "24", provenance: "proof-time environment historically unavailable" };
      mutate(corrected);
      await put(h.root, RECEIPT, `${JSON.stringify({ privateSuccessProof: corrected }, null, 2)}\n`);
      git(h.root, "add", ".");
      git(h.root, "commit", "-qm", "clarify proof provenance");
      return git(h.root, "rev-parse", "HEAD");
    };
    const C = await writeCorrection(() => {});
    assert.deepEqual(await evaluate(h.root, C, [C]), [], "metadata-only correction after the original introduction");

    const tampered = await writeCorrection((proof) => { proof.publicBindings[0].reviewedSha256 = "0".repeat(64); });
    assert.deepEqual(
      await evaluate(h.root, tampered, [tampered]),
      [`private-success commit blob differs from receipt: ${OWNER}/artifact.html`],
      "a later correction cannot change protected bindings",
    );

    // Reporting-style replay of the corrected chain: the copied introduction equals R, but the edge is gone.
    git(h.root, "checkout", "-q", "--detach", h.B);
    git(h.root, "commit", "-q", "--allow-empty", "-m", "newer main");
    git(h.root, "cherry-pick", `${h.B}..${C}`);
    const F = git(h.root, "rev-parse", "HEAD");
    assert.deepEqual(await evaluate(h.root, F, [F, C]), [MSG.ancestor, MSG.original], "replayed corrected chain");
    assert.deepEqual(await evaluate(h.root, C, [C, F]), [], "the accepted source is unaffected by an identical replay ref");

    // A second introduction with a genuinely changed proof object still fails after a correction.
    git(h.root, "checkout", "-q", "--detach", h.B);
    git(h.root, "read-tree", "-u", "--reset", C);
    const changed = JSON.parse(await readFile(path.join(h.root, RECEIPT), "utf8"));
    changed.privateSuccessProof.result = "different";
    await put(h.root, RECEIPT, `${JSON.stringify(changed, null, 2)}\n`);
    git(h.root, "add", ".");
    git(h.root, "commit", "-qm", "changed copy");
    const X = git(h.root, "rev-parse", "HEAD");
    spawnSync("git", ["merge", "--no-ff", "--no-commit", C], { cwd: h.root, encoding: "utf8" });
    git(h.root, "checkout", C, "--", RECEIPT);
    git(h.root, "commit", "-qm", "resolve to corrected receipt");
    const head = git(h.root, "rev-parse", "HEAD");
    assert.deepEqual(await evaluate(h.root, head, [head]), [`${MSG.reused}: ${X}`], "changed second introduction");
  } finally {
    await rm(h.root, { recursive: true, force: true });
  }
});

// Control on the actual preserved Reporting graph. Its commits are local preserved refs, not on the
// forge, so this runs only where those objects exist (read through alternates, never cloned or moved).
const REPORTING = {
  receipt: "authoring/evidence/sql-jdbc-foundations/reporting-indexes-and-review/indexes/qa-receipt.json",
  proof: "4f9906d191f5c75f5c6dd137094de006782267cc",
  original: "7520b962f4cf80c1240fec418dc9f010ec9590c1",
  source: "de968705cdd80bb67c108ede0e3d170247a0c3b9",
  replay: "b64f2961877fdf543dca1c3537a1fd156f150cba",
};
test("actual Reporting source passes and its copied-receipt replay fails", async (t) => {
  const repoRoot = path.resolve(fileURLToPath(new URL("../..", import.meta.url)));
  const present = Object.entries(REPORTING).filter(([key]) => key !== "receipt")
    .every(([, commit]) => spawnSync("git", ["cat-file", "-e", `${commit}^{commit}`], { cwd: repoRoot }).status === 0);
  if (!present) return t.skip("preserved Reporting control objects are not in this repository");
  const common = spawnSync("git", ["rev-parse", "--path-format=absolute", "--git-common-dir"], { cwd: repoRoot, encoding: "utf8" }).stdout.trim();
  const root = await mkdtemp(path.join(os.tmpdir(), "pep-reporting-control-"));
  try {
    git(root, "init", "-q");
    await writeFile(path.join(root, ".git/objects/info/alternates"), `${path.join(common, "objects")}\n`);
    const proofAt = (commit) => JSON.parse(git(root, "show", `${commit}:${REPORTING.receipt}`)).privateSuccessProof;
    const original = proofAt(REPORTING.original);
    const current = proofAt(REPORTING.source);
    assert.equal(git(root, "rev-parse", `${REPORTING.original}^`), REPORTING.proof);
    assert.equal(original.runId, current.runId);
    assert.notDeepEqual(current, original, "the source carries a later metadata-only correction");
    assert.deepEqual(current.publicBindings, original.publicBindings, "protected bindings are unchanged");
    assert.deepEqual([current.commit, current.record, current.result], [original.commit, original.record, original.result]);
    const run = async (head, refs) => {
      git(root, "checkout", "-q", "-f", "--detach", head);
      for (const ref of git(root, "for-each-ref", "--format=%(refname)").split("\n").filter(Boolean)) git(root, "update-ref", "-d", ref);
      refs.forEach((commit, index) => git(root, "update-ref", `refs/heads/ref-${index}`, commit));
      return (await validatePrivateProofs(root, path.join(root, "authoring/evidence/sql-jdbc-foundations"))).map((item) => item.message);
    };
    assert.deepEqual(await run(REPORTING.source, [REPORTING.source]), [], "accepted source");
    assert.deepEqual(await run(REPORTING.source, [REPORTING.source, REPORTING.replay]), [], "accepted source with replay ref");
    const replayCopy = git(root, "log", "--full-history", "--format=%H", "-S", original.runId, REPORTING.replay, "--", REPORTING.receipt);
    assert.notEqual(replayCopy, REPORTING.original);
    assert.deepEqual(proofAt(replayCopy), original, "the replay copies the original object; only its edge is gone");
    assert.deepEqual(await run(REPORTING.replay, [REPORTING.replay, REPORTING.source]), [MSG.ancestor, MSG.original], "replay");
    assert.deepEqual(await run(REPORTING.replay, [REPORTING.replay]), [MSG.ancestor, MSG.child], "replay alone");
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
