#!/usr/bin/env node
// Correct-answer position planning for formative topic GIFT banks.
//
// Moves whole option blocks (marker, answer text and attached # feedback)
// inside each question's answer block. It never edits option text, feedback,
// markers, stems, titles, categories or question order, and it re-parses every
// result with the repository GIFT parser to prove the semantics are unchanged.
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { parseGift } from "./validate.mjs";

export const LETTERS = "ABCD";
const SEED = "pep-topic-gift-answer-order-v1";

function isEscaped(text, index) {
  let count = 0;
  for (let cursor = index - 1; cursor >= 0 && text[cursor] === "\\"; cursor -= 1) count += 1;
  return count % 2 === 1;
}

function findUnescaped(text, character, start = 0) {
  for (let index = start; index < text.length; index += 1) {
    if (text[index] === character && !isEscaped(text, index)) return index;
  }
  return -1;
}

// Locate each question's answer block in the original text, using the same
// blank-line block split, ::title:: scan and {...} search as validate.mjs.
function answerBlocks(text) {
  if (text.includes("\r")) throw new Error("CRLF GIFT banks are not supported");
  const blocks = [];
  const separator = /\n[ \t]*\n+/g;
  let start = 0;
  const spans = [];
  for (const match of text.matchAll(separator)) {
    spans.push([start, match.index]);
    start = match.index + match[0].length;
  }
  spans.push([start, text.length]);
  for (const [from, to] of spans) {
    const raw = text.slice(from, to);
    let offset = 0;
    let questionAt = -1;
    for (const line of raw.split("\n")) {
      if (line.startsWith("::")) {
        questionAt = offset;
        break;
      }
      offset += line.length + 1;
    }
    if (questionAt < 0) continue;
    const body = raw.slice(questionAt);
    if (body.split("\n").some((line) => line.trimStart().startsWith("//"))) {
      throw new Error("comment lines inside a question are not supported");
    }
    let titleEnd = -1;
    for (let index = 2; index < body.length - 1; index += 1) {
      if (body.slice(index, index + 2) === "::" && !isEscaped(body, index)) {
        titleEnd = index;
        break;
      }
    }
    const open = findUnescaped(body, "{", titleEnd + 2);
    const close = findUnescaped(body, "}", open + 1);
    if (titleEnd < 0 || open < 0 || close < 0) throw new Error("unparseable question block");
    blocks.push({ start: from + questionAt + open + 1, end: from + questionAt + close });
  }
  return blocks;
}

// Split an answer block into option bodies and the whitespace slots around
// them; bodies move, slots stay, so layout bytes are preserved exactly.
function splitAnswerBlock(block) {
  const markers = [];
  for (let index = 0; index < block.length; index += 1) {
    if ((block[index] === "=" || block[index] === "~") && !isEscaped(block, index)) markers.push(index);
  }
  const lead = block.slice(0, markers[0]);
  const bodies = [];
  const gaps = [];
  markers.forEach((at, index) => {
    const segment = block.slice(at, markers[index + 1] ?? block.length);
    const body = segment.replace(/\s+$/, "");
    bodies.push(body);
    gaps.push(segment.slice(body.length));
  });
  return { lead, bodies, gaps };
}

export function correctSequence(questions) {
  return questions.map((question) => LETTERS[question.options.findIndex((option) => option.correct)]).join("");
}

// Reorder each question so its correct option sits at the target letter. The
// distractors keep their existing relative order.
export function reorderBank(text, sequence) {
  const questions = parseGift(Buffer.from(text, "ascii"));
  const blocks = answerBlocks(text);
  if (blocks.length !== questions.length || sequence.length !== questions.length) {
    throw new Error("sequence length must equal the question count");
  }
  let output = "";
  let cursor = 0;
  blocks.forEach((block, questionIndex) => {
    const { lead, bodies, gaps } = splitAnswerBlock(text.slice(block.start, block.end));
    const target = LETTERS.indexOf(sequence[questionIndex]);
    if (target < 0 || target >= bodies.length) throw new Error(`invalid target ${sequence[questionIndex]}`);
    const correct = bodies.filter((body) => body.startsWith("="));
    if (correct.length !== 1) throw new Error("expected exactly one = option");
    const ordered = bodies.filter((body) => !body.startsWith("="));
    ordered.splice(target, 0, correct[0]);
    output += text.slice(cursor, block.start) + lead + ordered.map((body, index) => body + gaps[index]).join("");
    cursor = block.end;
  });
  output += text.slice(cursor);
  const after = parseGift(Buffer.from(output, "ascii"));
  if (semanticDigest(after) !== semanticDigest(questions)) throw new Error("reorder changed bank semantics");
  if (correctSequence(after) !== sequence) throw new Error("reorder did not reach the target sequence");
  return output;
}

// Order-insensitive within each answer block, order-sensitive across questions.
export function semanticDigest(questions) {
  const canonical = questions.map((question) => ({
    category: question.category,
    title: question.title,
    stem: question.stem,
    options: question.options
      .map((option) => JSON.stringify([option.correct, option.answer, option.feedback]))
      .sort(),
  }));
  return createHash("sha256").update(JSON.stringify(canonical)).digest("hex");
}

function counts(sequence) {
  return [...LETTERS].map((letter) => [...sequence].filter((value) => value === letter).length);
}

// Balanced: every position is used once the bank has four or more questions,
// no position repeats in shorter banks, and position counts differ by at most one.
export function isBalanced(sequence) {
  const values = counts(sequence);
  const used = values.filter(Boolean).length;
  return used === Math.min(LETTERS.length, sequence.length) && Math.max(...values) - Math.min(...values) <= 1;
}

// Recurring: a constant +1/-1 cycle (ABCD..., DCBA...) or a block of two to
// four letters that repeats for at least two more questions (ABDCAB...).
export function isRecurring(sequence) {
  const steps = [...sequence].slice(1).map((letter, index) =>
    (LETTERS.indexOf(letter) - LETTERS.indexOf(sequence[index]) + LETTERS.length) % LETTERS.length,
  );
  if (steps.length >= 2 && steps.every((step) => step === steps[0]) && (steps[0] === 1 || steps[0] === 3)) {
    return true;
  }
  for (let period = 2; period <= 4 && sequence.length - period >= 2; period += 1) {
    if ([...sequence].slice(period).every((letter, index) => letter === sequence[index])) return true;
  }
  return false;
}

export function candidateSequences(length) {
  const output = [];
  const walk = (prefix) => {
    if (prefix.length === length) {
      if (isBalanced(prefix) && !isRecurring(prefix)) output.push(prefix);
      return;
    }
    for (const letter of LETTERS) walk(prefix + letter);
  };
  walk("");
  return output;
}

// Which positions carry the extra (or missing) share of a balanced sequence.
export function signature(sequence) {
  const values = counts(sequence);
  const max = Math.max(...values);
  return [...LETTERS].filter((_, index) => values[index] === max).join("");
}

function seededOrder(items, label) {
  const key = (item) => createHash("sha256").update(`${SEED}:${label}:${item}`).digest("hex");
  return [...items].sort((a, b) => key(a).localeCompare(key(b)) || a.localeCompare(b));
}

// Deterministic plan. A bank may carry `accepted`, the sequence it had when
// last accepted (absent means its current sequence is the accepted one). Banks
// whose sequence is still accepted claim first, then changed banks, each tier
// in path order, so growing or editing one bank never displaces another bank's
// accepted plan. A claimed sequence must be balanced, non-recurring and unique
// in its question-count group; once every candidate of that length is in use,
// a valid duplicate keeps its sequence. Every other bank receives an unused
// candidate, taking signatures round-robin so repeated positions vary. When a
// bank only appended questions to its accepted sequence, candidates that keep
// the accepted positions of its existing questions are tried first.
export function planSequences(banks) {
  const plan = new Map();
  const groups = new Map();
  const changed = (bank) => (bank.accepted ?? bank.sequence) !== bank.sequence;
  const ordered = [...banks].sort(
    (a, b) => Number(changed(a)) - Number(changed(b)) || a.path.localeCompare(b.path),
  );
  for (const bank of ordered) {
    const group = groups.get(bank.sequence.length) ?? [];
    group.push(bank);
    groups.set(bank.sequence.length, group);
  }
  for (const [length, group] of groups) {
    const used = new Map();
    const pending = [];
    for (const bank of group) {
      const keep =
        isBalanced(bank.sequence) && !isRecurring(bank.sequence) && !used.has(bank.sequence);
      if (keep) {
        used.set(bank.sequence, 1);
        plan.set(bank.path, bank.sequence);
      } else {
        pending.push(bank);
      }
    }
    if (!pending.length) continue;
    const candidates = candidateSequences(length);
    const buckets = new Map();
    for (const candidate of seededOrder(candidates, `length-${length}`)) {
      const bucket = buckets.get(signature(candidate)) ?? [];
      bucket.push(candidate);
      buckets.set(signature(candidate), bucket);
    }
    const tally = new Map([...buckets.keys()].map((key) => [key, 0]));
    for (const sequence of used.keys()) {
      if (tally.has(signature(sequence))) tally.set(signature(sequence), tally.get(signature(sequence)) + 1);
    }
    for (const bank of pending) {
      const keys = seededOrder([...buckets.keys()], bank.path).sort((a, b) => tally.get(a) - tally.get(b));
      const prefix =
        bank.accepted && bank.accepted.length < length && bank.sequence.startsWith(bank.accepted)
          ? bank.accepted
          : "";
      const fits = (candidate) => candidate.startsWith(prefix);
      // Least-used signature first, preferring candidates that keep the
      // existing questions' accepted positions.
      const fresh = (filter) => {
        for (const key of keys) {
          const found = buckets.get(key).find((candidate) => filter(candidate) && !used.has(candidate));
          if (found) return found;
        }
        return null;
      };
      // Reuse a full sequence only when every candidate of this length is
      // already taken.
      const reuse = () => {
        if (candidates.includes(bank.sequence)) return bank.sequence;
        const all = keys.flatMap((key) => buckets.get(key));
        const pool = all.some(fits) ? all.filter(fits) : all;
        return pool.sort((a, b) => used.get(a) - used.get(b))[0];
      };
      const chosen = fresh(fits) ?? fresh(() => true) ?? reuse();
      used.set(chosen, (used.get(chosen) ?? 0) + 1);
      tally.set(signature(chosen), tally.get(signature(chosen)) + 1);
      plan.set(bank.path, chosen);
    }
  }
  return plan;
}

// True only when newText is oldText with whole option blocks moved inside
// their own answer blocks: identical bytes outside answer blocks, identical
// layout slots and the same raw option blocks (marker, escaped answer text and
// attached feedback) per question, re-proven through the repository parser.
export function isAnswerOrderPermutation(oldText, newText) {
  let before;
  let after;
  let oldBlocks;
  let newBlocks;
  try {
    before = parseGift(Buffer.from(oldText, "ascii"));
    after = parseGift(Buffer.from(newText, "ascii"));
    oldBlocks = answerBlocks(oldText);
    newBlocks = answerBlocks(newText);
  } catch {
    return false;
  }
  if (
    before.length !== after.length ||
    oldBlocks.length !== before.length ||
    newBlocks.length !== after.length
  ) {
    return false;
  }
  const outside = (text, blocks) => {
    const parts = [];
    let cursor = 0;
    for (const block of blocks) {
      parts.push(text.slice(cursor, block.start));
      cursor = block.end;
    }
    parts.push(text.slice(cursor));
    return JSON.stringify(parts);
  };
  if (outside(oldText, oldBlocks) !== outside(newText, newBlocks)) return false;
  for (const [index, oldBlock] of oldBlocks.entries()) {
    const a = splitAnswerBlock(oldText.slice(oldBlock.start, oldBlock.end));
    const b = splitAnswerBlock(newText.slice(newBlocks[index].start, newBlocks[index].end));
    if (a.lead !== b.lead || JSON.stringify(a.gaps) !== JSON.stringify(b.gaps)) return false;
    if (JSON.stringify([...a.bodies].sort()) !== JSON.stringify([...b.bodies].sort())) return false;
    const correct = (question) => JSON.stringify(question.options.find((option) => option.correct));
    if (correct(before[index]) !== correct(after[index])) return false;
  }
  return semanticDigest(before) === semanticDigest(after);
}

const historyCache = new Map();

// Bytes of a historical artifact.gift blob at the same path whose SHA-256
// equals the recorded hash, from the checked-out branch's Git history.
function historicalGift(repoRoot, artifactPath, sha256) {
  const key = `${repoRoot}\0${artifactPath}`;
  if (!historyCache.has(key)) {
    const blobs = new Map();
    try {
      const log = execFileSync(
        "git",
        ["log", "--format=", "--raw", "--no-abbrev", "--no-renames", "--", artifactPath],
        { cwd: repoRoot, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] },
      );
      const ids = new Set();
      for (const line of log.split("\n")) {
        const fields = line.split("\t")[0].split(" ");
        if (line.startsWith(":") && fields.length >= 4) ids.add(fields[3]);
      }
      for (const id of ids) {
        if (/^0+$/.test(id)) continue;
        const bytes = execFileSync("git", ["cat-file", "blob", id], {
          cwd: repoRoot,
          stdio: ["ignore", "pipe", "ignore"],
        });
        blobs.set(createHash("sha256").update(bytes).digest("hex"), bytes);
      }
    } catch {
      // Not a Git checkout or no history: no historical blob is available.
    }
    historyCache.set(key, blobs);
  }
  return historyCache.get(key).get(sha256) ?? null;
}

// T25 narrow exception: a stale binding to a topic artifact.gift counts as
// current when its exact recorded blob is in Git history and the current bank
// is only an answer-order permutation of it. Every other binding is unchanged.
export async function acceptAnswerOrderPermutations(repoRoot, bindings) {
  const output = [];
  for (const binding of bindings) {
    if (
      binding.current ||
      binding.historical ||
      path.basename(binding.artifactPath) !== "artifact.gift"
    ) {
      output.push(binding);
      continue;
    }
    const old = historicalGift(repoRoot, binding.artifactPath, binding.sha256);
    let current = null;
    try {
      current = await readFile(path.join(repoRoot, binding.artifactPath));
    } catch {
      current = null;
    }
    const accepted =
      old &&
      current &&
      !old.some((byte) => byte > 0x7f) &&
      !current.some((byte) => byte > 0x7f) &&
      isAnswerOrderPermutation(old.toString("ascii"), current.toString("ascii"));
    output.push(accepted ? { ...binding, current: true, answerOrderPermutation: true } : binding);
  }
  return output;
}

export function topicGiftPaths(repoRoot) {
  return execFileSync("git", ["ls-files", "--", "*/artifact.gift"], { cwd: repoRoot, encoding: "utf8" })
    .split("\n")
    .filter((file) => file && !file.startsWith("authoring/"));
}

export async function loadBanks(repoRoot) {
  const banks = [];
  for (const file of topicGiftPaths(repoRoot)) {
    const text = await readFile(path.join(repoRoot, file), "ascii");
    banks.push({ path: file, text, sequence: correctSequence(parseGift(Buffer.from(text, "ascii"))) });
  }
  return banks;
}

// Record HEAD's sequence as `accepted` on each bank whose bytes differ from
// HEAD ("" for a bank HEAD does not have), so the planner keeps every other
// bank's committed plan and extends an appended bank's existing positions.
export function withAcceptedSequences(repoRoot, banks) {
  let changed = [];
  try {
    changed = execFileSync("git", ["diff", "--name-only", "HEAD", "--", ...banks.map((bank) => bank.path)], {
      cwd: repoRoot,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).split("\n");
  } catch {
    return banks;
  }
  const changedPaths = new Set(changed.filter(Boolean));
  return banks.map((bank) => {
    if (!changedPaths.has(bank.path)) return bank;
    let accepted = "";
    try {
      const bytes = execFileSync("git", ["show", `HEAD:${bank.path}`], {
        cwd: repoRoot,
        stdio: ["ignore", "pipe", "ignore"],
      });
      accepted = correctSequence(parseGift(bytes));
    } catch {
      accepted = "";
    }
    return { ...bank, accepted };
  });
}

async function main() {
  const args = process.argv.slice(2);
  if (args.includes("--help") || !args.length) {
    console.log("Usage: node authoring/tools/gift/answer-order.mjs --check|--write");
    console.log("Plans correct-answer positions for tracked topic artifact.gift banks.");
    return;
  }
  const repoRoot = path.resolve(import.meta.dirname, "../../..");
  const banks = withAcceptedSequences(repoRoot, await loadBanks(repoRoot));
  const plan = planSequences(banks);
  const changes = banks.filter((bank) => plan.get(bank.path) !== bank.sequence);
  for (const bank of changes) {
    console.log(`${bank.path}: ${bank.sequence} -> ${plan.get(bank.path)}`);
    if (args.includes("--write")) {
      await writeFile(path.join(repoRoot, bank.path), reorderBank(bank.text, plan.get(bank.path)), "ascii");
    }
  }
  console.log(`answer-order: ${banks.length} bank(s), ${changes.length} ${args.includes("--write") ? "rewritten" : "need reordering"}`);
  if (args.includes("--check") && changes.length) process.exitCode = 1;
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  main().catch((error) => {
    console.error(`answer-order: ${error.message}`);
    process.exitCode = 1;
  });
}
