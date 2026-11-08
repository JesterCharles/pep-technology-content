import { spawnSync } from "node:child_process";
import path from "node:path";
import { error, readJson, relative, walk } from "./common.mjs";

// Owns the history checks for answer-sensitive private-success receipts. The rest of
// the receipt contract stays in qa/harness.mjs, which is itself a bound public file
// and must not change without a fresh private run for every receipt.

export const HISTORY_MESSAGES = Object.freeze({
  introduction: "private success runId must be introduced by exactly one evidence commit",
  immediateChild: "private success receipt must be introduced in the immediate child of its proof commit",
  receiptOnly: "private success receipt commit may change only its receipt and generated module lock",
});

const ORIGINAL_NOT_ANCESTOR = "private success original receipt commit must be an ancestor of current HEAD";
const REUSED_RUN = "private success runId is reintroduced with a different proof object";

function canonical(value) {
  if (Array.isArray(value)) return `[${value.map(canonical).join(",")}]`;
  if (value && typeof value === "object") {
    return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${canonical(value[key])}`).join(",")}}`;
  }
  return JSON.stringify(value);
}

export async function validatePrivateProofHistory(repoRoot, evidenceRoot) {
  const out = [];
  const git = (args) => spawnSync("git", args, { cwd: repoRoot, encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
  const lines = (result) => result.stdout.trim().split(/\s+/u).filter(Boolean);
  const proofAt = (commit, file) => {
    const blob = git(["show", `${commit}:${file}`]);
    if (blob.status !== 0) return undefined;
    try {
      return JSON.parse(blob.stdout)?.privateSuccessProof;
    } catch {
      return undefined;
    }
  };
  const receipts = (await walk(evidenceRoot)).files.filter((file) => path.basename(file) === "qa-receipt.json");
  for (const receiptFile of receipts) {
    const proof = (await readJson(receiptFile).catch(() => null))?.privateSuccessProof;
    if (!proof || typeof proof.runId !== "string" || typeof proof.commit !== "string") continue;
    // A missing proof commit is reported by the harness; there is no lineage to inspect.
    if (git(["cat-file", "-e", `${proof.commit}^{commit}`]).status !== 0) continue;
    const display = relative(repoRoot, receiptFile);
    // --full-history: a merge that is TREESAME on both sides must not hide either side's introduction.
    const introductions = lines(git(["log", "--all", "--full-history", "--format=%H", "-S", proof.runId, "--", display]));
    const originals = introductions.filter((commit) => {
      const parents = lines(git(["rev-list", "--parents", "-n", "1", commit])).slice(1);
      return parents.length === 1 && parents[0] === proof.commit;
    });
    if (introductions.length === 0 || originals.length > 1) {
      out.push(error("T06", display, HISTORY_MESSAGES.introduction));
      continue;
    }
    if (originals.length !== 1) {
      out.push(error("T06", display, HISTORY_MESSAGES.immediateChild));
      continue;
    }
    const [original] = originals;
    if (git(["merge-base", "--is-ancestor", original, "HEAD"]).status !== 0) {
      out.push(error("T06", display, ORIGINAL_NOT_ANCESTOR));
      continue;
    }
    const expected = canonical(proofAt(original, display));
    const reused = introductions.filter((commit) => commit !== original && canonical(proofAt(commit, display)) !== expected);
    if (reused.length) {
      out.push(error("T06", display, `${REUSED_RUN}: ${reused.join(", ")}`));
      continue;
    }
    const evidenceRelative = display.split("/");
    const evidenceIndex = evidenceRelative.indexOf("evidence");
    const owner = evidenceIndex >= 0 ? evidenceRelative.slice(evidenceIndex + 1, -1) : [];
    const allowedLock = owner.length >= 2 ? `authoring/catalog/${owner[0]}/${owner[1]}/module.lock.json` : "";
    const changed = git(["diff-tree", "--no-commit-id", "--name-only", "-r", original]).stdout.trim().split(/\n/u).filter(Boolean);
    if (changed.some((file) => file !== display && file !== allowedLock)) {
      out.push(error("T06", display, HISTORY_MESSAGES.receiptOnly));
    }
  }
  return out;
}
