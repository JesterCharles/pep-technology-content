#!/usr/bin/env node
// Answer-position and answer-length statistics for learner multiple-choice
// questions: page-build topic sources (keyed radio groups, see
// ../html/answer-order.mjs) and tracked GIFT banks outside authoring/.
//
// Position: where the correct option sits as shown (A is first). Length: how
// often the correct option is strictly the longest by visible text, which a
// learner can use as a cue; with four options chance is about 25%.
import { execFileSync } from "node:child_process";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { LETTERS, correctSequence as giftSequence, isBalanced, isRecurring } from "../gift/answer-order.mjs";
import { parseGift } from "../gift/validate.mjs";
import { loadPages, questions as pageQuestions } from "../html/answer-order.mjs";

const ENTITIES = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " " };

export function visibleText(html) {
  return String(html)
    .replace(/<input\b[^>]*>/g, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&(#\d+|[a-z]+);/gi, (entity, name) =>
      name.startsWith("#") ? String.fromCharCode(Number(name.slice(1))) : (ENTITIES[name.toLowerCase()] ?? entity),
    )
    .replace(/\s+/g, " ")
    .trim();
}

function question(source, options, correct) {
  const lengths = options.map((option) => visibleText(option).length);
  const top = Math.max(...lengths);
  return {
    source,
    position: LETTERS[correct],
    longest: lengths[correct] === top && lengths.filter((length) => length === top).length === 1,
  };
}

function trackedGifts(repoRoot) {
  try {
    return execFileSync("git", ["ls-files", "--", "*.gift"], { cwd: repoRoot, encoding: "utf8" })
      .split("\n")
      .filter((file) => file && !file.startsWith("authoring/"));
  } catch {
    return [];
  }
}

// Page sources and GIFT banks, each with its questions. Sources that cannot
// be parsed are skipped here; their own gates report them.
export async function loadBanks(repoRoot) {
  const banks = [];
  let pages = [];
  try {
    pages = await loadPages(repoRoot);
  } catch {
    pages = [];
  }
  for (const page of pages) {
    banks.push({
      kind: "page",
      path: page.path,
      module: page.module,
      sequence: page.sequence,
      questions: pageQuestions(page.text, page.keys).map((item) => question(page.path, item.labels, item.correct)),
    });
  }
  for (const file of trackedGifts(repoRoot)) {
    // Topic banks are plain GIFT; course finals use the [html] format.
    const bytes = await readFile(path.join(repoRoot, file));
    let parsed;
    try {
      parsed = parseGift(bytes);
    } catch {
      try {
        parsed = parseGift(bytes, { html: true });
      } catch {
        continue;
      }
    }
    const usable = parsed.filter((item) => item.options.filter((option) => option.correct).length === 1);
    if (!usable.length || usable.some((item) => item.options.length > LETTERS.length)) continue;
    banks.push({
      kind: "gift",
      path: file,
      module: file.split("/").slice(0, 2).join("/"),
      sequence: giftSequence(usable),
      questions: usable.map((item) =>
        question(file, item.options.map((option) => option.answer), item.options.findIndex((option) => option.correct)),
      ),
    });
  }
  return banks;
}

function counts(sequence) {
  return [...LETTERS].map((letter) => [...sequence].filter((value) => value === letter).length);
}

// Position problems: a page source whose questions are unbalanced or follow a
// recurring pattern, a page-build module whose positions are not balanced
// across all its pages, and a GIFT bank of three or more questions whose
// correct answers all sit in one position.
export function positionProblems(banks) {
  const problems = [];
  const modules = new Map();
  for (const bank of banks) {
    if (bank.kind === "page") {
      if (bank.sequence.length > 1 && (!isBalanced(bank.sequence) || isRecurring(bank.sequence))) {
        problems.push({ path: bank.path, message: `correct options follow ${bank.sequence}; plan them with authoring/tools/html/answer-order.mjs` });
      }
      modules.set(bank.module, (modules.get(bank.module) ?? "") + bank.sequence);
    } else if (bank.sequence.length >= 3 && new Set(bank.sequence).size === 1) {
      problems.push({ path: bank.path, message: `every correct option is ${bank.sequence[0]}` });
    }
  }
  for (const [module, sequence] of modules) {
    const values = counts(sequence);
    if (sequence.length >= LETTERS.length && Math.max(...values) - Math.min(...values) > 1) {
      problems.push({
        path: `authoring/evidence/${module}/page-build/src`,
        message: `correct positions across the module are ${[...LETTERS].map((letter, index) => `${letter}=${values[index]}`).join(" ")}`,
      });
    }
  }
  return problems;
}

export function lengthSummary(banks, kind) {
  const list = banks.filter((bank) => bank.kind === kind).flatMap((bank) => bank.questions);
  const longest = list.filter((item) => item.longest).length;
  return { questions: list.length, longest, share: list.length ? longest / list.length : 0 };
}

function percent(share) {
  return `${Math.round(share * 100)}%`;
}

async function main() {
  const args = process.argv.slice(2);
  if (args.includes("--help") || !args.includes("--report")) {
    console.log("Usage: node authoring/tools/qa/answer-bias.mjs --report");
    console.log("Prints correct-option position and longest-option share for every page source and GIFT bank.");
    return;
  }
  const repoRoot = path.resolve(import.meta.dirname, "../../..");
  const banks = await loadBanks(repoRoot);
  console.log("kind\tquestions\tpositions(A B C D)\tcorrect-is-longest\tpath");
  for (const bank of banks) {
    const longest = bank.questions.filter((item) => item.longest).length;
    console.log(
      `${bank.kind}\t${bank.questions.length}\t${counts(bank.sequence).join(" ")}\t${longest}/${bank.questions.length} (${percent(longest / bank.questions.length)})\t${bank.path}`,
    );
  }
  for (const kind of ["page", "gift"]) {
    const summary = lengthSummary(banks, kind);
    console.log(`${kind} total: correct option strictly longest in ${summary.longest}/${summary.questions} (${percent(summary.share)}); chance with four options is about 25%`);
  }
  for (const problem of positionProblems(banks)) console.log(`position: ${problem.path}: ${problem.message}`);
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  main().catch((error) => {
    console.error(`answer-bias: ${error.message}`);
    process.exitCode = 1;
  });
}
