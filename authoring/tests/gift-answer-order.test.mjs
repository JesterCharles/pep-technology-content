import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import path from "node:path";
import test from "node:test";
import {
  candidateSequences,
  correctSequence,
  isAnswerOrderPermutation,
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

const agilePath = "git-linux-ai-foundations/ai-foundations/agile-scrum-user-stories/artifact.gift";

function git(...args) {
  return spawnSync("git", args, { cwd: repo, encoding: "buffer" });
}

// Baseline questions are matched by durable identity (title) at their
// original positions and must keep their full semantics and correct option;
// a bank may only grow by appending questions with new titles.
function baselineProblems(before, after) {
  const problems = [];
  if (after.length < before.length) problems.push(`${before.length - after.length} baseline question(s) removed`);
  for (const [index, question] of before.entries()) {
    const current = after[index];
    if (!current || current.title !== question.title) {
      problems.push(`${question.title} is not at position ${index + 1}`);
      continue;
    }
    if (semanticDigest([current]) !== semanticDigest([question])) problems.push(`${question.title} changed`);
    const correct = (entry) => JSON.stringify(entry.options.find((option) => option.correct));
    if (correct(current) !== correct(question)) problems.push(`${question.title} changed its correct option`);
  }
  const titles = new Set(before.map((question) => question.title));
  for (const question of after.slice(before.length)) {
    if (titles.has(question.title)) problems.push(`appended ${question.title} reuses a baseline title`);
  }
  return problems;
}

// Task-owned fixture: append one four-option question whose correct option
// sits at `letter`, without touching the learner bank on disk.
function appendQuestion(text, letter, title = "agile-scrum-user-stories fixture - Appended question") {
  const options = ["~Wrong one #Not quite. One.", "~Wrong two #Not quite. Two.", "~Wrong three #Not quite. Three."];
  options.splice("ABCD".indexOf(letter), 0, "=Right #Correct. Right.");
  return `${text.replace(/\n*$/, "\n")}\n::${title}::Which option is right? {\n${options.join("\n")}\n}\n`;
}

function grownBanks(banks, path, text, accepted) {
  return banks.map((bank) =>
    bank.path === path
      ? { path, text, sequence: correctSequence(parseGift(Buffer.from(text, "ascii"))), ...(accepted && { accepted }) }
      : bank,
  );
}

function assertOthersStable(banks, plan, grownPath) {
  for (const bank of banks) {
    if (bank.path !== grownPath) assert.equal(plan.get(bank.path), bank.sequence, `${bank.path} was displaced`);
  }
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

test("baseline comparison lets a bank append questions but not change, drop or reorder baseline ones", async () => {
  const bank = (await loadBanks(repo)).find((entry) => entry.path === agilePath);
  assert.ok(bank, agilePath);
  const before = parseGift(Buffer.from(bank.text, "ascii"));
  const parse = (text) => parseGift(Buffer.from(text, "ascii"));
  assert.deepEqual(baselineProblems(before, before), []);
  const grown = parse(appendQuestion(bank.text, "C"));
  assert.equal(grown.length, before.length + 1);
  assert.deepEqual(baselineProblems(before, grown), []);
  assert.deepEqual(baselineProblems(before, parse(reorderBank(bank.text, [...correctSequence(before)].reverse().join("")))), []);
  assert.notDeepEqual(baselineProblems(before, grown.slice(0, -2)), []);
  assert.notDeepEqual(baselineProblems(before, [grown[1], grown[0], ...grown.slice(2)]), []);
  assert.notDeepEqual(baselineProblems(before, parse(bank.text.replace("Which Scrum event comes next?", "Which event comes next?"))), []);
  assert.notDeepEqual(baselineProblems(before, parse(appendQuestion(bank.text, "C", before[0].title))), []);
});

test("growing the Agile bank by one question keeps every other bank's plan byte-for-byte", async () => {
  const banks = await loadBanks(repo);
  const agile = banks.find((bank) => bank.path === agilePath);
  assert.ok(agile, agilePath);
  const length = agile.sequence.length + 1;
  const pool = candidateSequences(length);
  const claimed = new Set(banks.filter((bank) => bank.sequence.length === length).map((bank) => bank.sequence));
  const exhausted = pool.every((candidate) => claimed.has(candidate));
  const keepable = (sequence) => pool.includes(sequence) && (exhausted || !claimed.has(sequence));
  const letters = [..."ABCD"];
  // The appended question already sits at a position the planner can keep
  // (unclaimed, or a valid duplicate once the pool is exhausted, as for the
  // 3 -> 4 growth): the bank keeps it whether or not its HEAD sequence is known.
  const keep = letters.find((letter) => keepable(agile.sequence + letter));
  // The reported 3 -> 4 growth (DBA + C) must stay keepable; a later bank
  // length may have every extension claimed, which the loop below covers.
  if (agile.sequence.length === 3) assert.ok(keep, `${agile.sequence} has a keepable one-question extension`);
  for (const accepted of keep ? [undefined, agile.sequence] : []) {
    const grown = grownBanks(banks, agilePath, appendQuestion(agile.text, keep), accepted);
    const plan = planSequences(grown);
    assert.equal(plan.get(agilePath), agile.sequence + keep);
    assertOthersStable(banks, plan, agilePath);
  }
  // The appended question needs moving (invalid or claimed position): the
  // bank yields, the other banks keep their plans, only the appended question
  // moves when a candidate keeps the existing positions, and the bank gets a
  // valid balanced order.
  for (const letter of letters.filter((value) => !keepable(agile.sequence + value))) {
    const text = appendQuestion(agile.text, letter);
    const plan = planSequences(grownBanks(banks, agilePath, text, agile.sequence));
    const planned = plan.get(agilePath);
    assert.ok(isBalanced(planned) && !isRecurring(planned), `${planned} is balanced and non-recurring`);
    assertOthersStable(banks, plan, agilePath);
    const output = reorderBank(text, planned);
    assert.ok(isAnswerOrderPermutation(text, output));
    if (pool.some((candidate) => candidate.startsWith(agile.sequence) && keepable(candidate))) {
      assert.ok(planned.startsWith(agile.sequence), `${planned} keeps ${agile.sequence}`);
      assert.equal(output.slice(0, agile.text.length), text.slice(0, agile.text.length));
    }
  }
});

test("a grown bank yields to accepted plans and keeps its existing positions when it can", () => {
  // The grown bank sorts first by path, so a path-greedy planner would keep
  // its DABDC and displace b/other; accepted plans now claim first.
  const banks = [
    { path: "a/grown/artifact.gift", sequence: "DABDC", accepted: "DAB" },
    { path: "b/other/artifact.gift", sequence: "DABDC" },
    { path: "c/third/artifact.gift", sequence: "CADBC" },
  ];
  const plan = planSequences(banks);
  assert.equal(plan.get("b/other/artifact.gift"), "DABDC");
  assert.equal(plan.get("c/third/artifact.gift"), "CADBC");
  const grown = plan.get("a/grown/artifact.gift");
  assert.ok(grown.startsWith("DAB") && grown !== "DABDC", grown);
  assert.ok(isBalanced(grown) && !isRecurring(grown), grown);
  assert.deepEqual(planSequences(banks), plan, "planning is deterministic");
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
    assert.deepEqual(baselineProblems(before, after), [], bank.path);
  }
});
