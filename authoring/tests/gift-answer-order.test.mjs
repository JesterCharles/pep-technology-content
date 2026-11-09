import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import path from "node:path";
import test from "node:test";
import {
  candidateSequences,
  correctSequence,
  isBalanced,
  isRecurring,
  loadBanks,
  planSequences,
  reorderBank,
  semanticDigest,
  signature,
} from "../tools/gift/answer-order.mjs";
import { parseGift } from "../tools/gift/validate.mjs";

const repo = path.resolve(import.meta.dirname, "../..");
// Last commit whose topic banks predate the answer-order permutation.
const baseline = "f2647727d35e331d92a85ac550280efd35f0f7f8";

function git(...args) {
  return spawnSync("git", args, { cwd: repo, encoding: "buffer" });
}

test("reorderBank moves whole option blocks and keeps feedback, escapes and layout", () => {
  const text = [
    "// header comment",
    "$CATEGORY: demo-course/demo-module/demo-topic",
    "",
    "::q1 escapes::Which value is x\\=1\\: {",
    "=The safe \\= option \\{ok\\} #Correct. Uses \\~ and \\# safely.",
    "~Risky one #Not quite. First distractor.",
    "~Risky two#Not quite. Second distractor.",
    "~Risky three #Not quite. Third distractor.",
    "}",
    "",
    "::q2 inline::Pick the second one.{=Right#Correct. Yes. ~Wrong a#Not quite. A. ~Wrong b#Not quite. B. ~Wrong c#Not quite. C.}",
    "",
  ].join("\n");
  const before = parseGift(Buffer.from(text, "ascii"));
  const targets = "DB";
  const output = reorderBank(text, targets);
  const after = parseGift(Buffer.from(output, "ascii"));
  assert.equal(correctSequence(after), targets);
  assert.equal(semanticDigest(after), semanticDigest(before));
  assert.equal(output.length, text.length);
  assert.deepEqual(output.split("\n").slice(0, 10).sort(), text.split("\n").slice(0, 10).sort());
  assert.equal(output.split("\n")[10], "::q2 inline::Pick the second one.{~Wrong a#Not quite. A. =Right#Correct. Yes. ~Wrong b#Not quite. B. ~Wrong c#Not quite. C.}");
  for (const [index, question] of after.entries()) {
    assert.equal(question.title, before[index].title);
    assert.equal(question.stem, before[index].stem);
    assert.deepEqual(
      question.options.find((option) => option.correct),
      before[index].options.find((option) => option.correct),
    );
    assert.deepEqual(
      question.options.filter((option) => !option.correct),
      before[index].options.filter((option) => !option.correct),
    );
  }
  assert.equal(reorderBank(output, correctSequence(before)), text);
});

test("balance and recurrence rules accept varied sequences and reject patterns", () => {
  for (const sequence of ["AAAAA", "AABCC", "ABCDAB", "ABCD"]) {
    assert.equal(isBalanced(sequence) && !isRecurring(sequence), false, sequence);
  }
  assert.equal(isRecurring("ABCDA"), true);
  assert.equal(isRecurring("DCBAD"), true);
  assert.equal(isRecurring("ACBDAC"), true);
  for (const sequence of ["DADBC", "CBDCABD", "ACDB", "BDCAAB"]) {
    assert.equal(isBalanced(sequence) && !isRecurring(sequence), true, sequence);
  }
  assert.equal(candidateSequences(5).length, 232);
  assert.equal(signature("DADBC"), "D");
});

test("planner flags recurring and duplicate sequences and keeps compliant ones", () => {
  const plan = planSequences([
    { path: "a/b/c/artifact.gift", sequence: "AAAAA" },
    { path: "a/b/d/artifact.gift", sequence: "DADBC" },
    { path: "a/b/e/artifact.gift", sequence: "DADBC" },
    { path: "a/b/f/artifact.gift", sequence: "ABCDA" },
  ]);
  assert.equal(plan.get("a/b/d/artifact.gift"), "DADBC");
  const assigned = [...plan.values()];
  assert.equal(new Set(assigned).size, 4);
  assert.ok(assigned.every((sequence) => isBalanced(sequence) && !isRecurring(sequence)));
});

test("every topic GIFT bank has balanced, varied and non-recurring answer positions", async () => {
  const banks = await loadBanks(repo);
  assert.ok(banks.length > 0);
  const plan = planSequences(banks);
  const groups = new Map();
  for (const bank of banks) {
    assert.equal(plan.get(bank.path), bank.sequence, `${bank.path} needs answer-order planning`);
    assert.ok(isBalanced(bank.sequence), `${bank.path}: ${bank.sequence} is unbalanced`);
    assert.ok(!isRecurring(bank.sequence), `${bank.path}: ${bank.sequence} recurs`);
    const group = groups.get(bank.sequence.length) ?? [];
    group.push(bank.sequence);
    groups.set(bank.sequence.length, group);
  }
  for (const [length, sequences] of groups) {
    const pool = candidateSequences(length).length;
    const duplicates = sequences.length - new Set(sequences).size;
    assert.ok(
      duplicates <= Math.max(0, sequences.length - pool),
      `${duplicates} duplicate ${length}-question sequence(s) with a pool of ${pool}`,
    );
    if (length === 5 && sequences.length >= 4) {
      const repeats = new Set(sequences.map(signature));
      assert.equal(repeats.size, 4, "five-question banks must vary the repeated position");
    }
  }
});

test("topic GIFT banks keep the semantics they had before the answer-order permutation", async (t) => {
  if (git("cat-file", "-e", `${baseline}^{commit}`).status !== 0) {
    t.skip(`baseline ${baseline} is not in this clone`);
    return;
  }
  for (const bank of await loadBanks(repo)) {
    const shown = git("show", `${baseline}:${bank.path}`);
    if (shown.status !== 0) continue;
    const before = parseGift(shown.stdout);
    const after = parseGift(Buffer.from(bank.text, "ascii"));
    assert.equal(after.length, before.length, bank.path);
    assert.equal(semanticDigest(after), semanticDigest(before), bank.path);
    for (const [index, question] of after.entries()) {
      assert.equal(question.title, before[index].title, bank.path);
      assert.deepEqual(
        question.options.find((option) => option.correct),
        before[index].options.find((option) => option.correct),
        `${bank.path} ${question.title}`,
      );
    }
  }
});
