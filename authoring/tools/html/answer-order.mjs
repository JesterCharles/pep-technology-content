#!/usr/bin/env node
// Correct-answer position planning for page-build topic sources
// (authoring/evidence/<course>/<module>/page-build/src/<topic>.body.html).
//
// A question is a radio group whose answer key is declared in the topic's
// TOPIC data (<topic>.topic.js): `predict:{correct:'x'}` or
// `fs:'<group>',correct:'x'`. Its options are whole <label class="opt">
// blocks inside one <div class="opts..."> block. This tool moves only those
// label blocks inside their own opts block. It never edits option text,
// values, answer keys (they are keyed by value, not position), static
// alternatives or any other byte, and it re-proves every result with
// isHtmlAnswerOrderPermutation. The same proof lets T25 accept a rebuilt
// artifact.html that differs from its reviewed bytes only by such moves.
import { execFileSync } from "node:child_process";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { LETTERS, historicalBlob, planSequences } from "../gift/answer-order.mjs";

const OPTS = /<div class="opts(?: [^"]*)?">/g;
const LABEL = /<label class="opt">[\s\S]*?<\/label>/g;

function attribute(fragment, name) {
  return new RegExp(`\\b${name}="([^"]*)"`).exec(fragment)?.[1];
}

// Every <div class="opts..."> block of a page or page source, in order. Each
// block must hold exactly one radio group as option labels and whitespace.
export function optionBlocks(text) {
  const blocks = [];
  for (const match of text.matchAll(OPTS)) {
    const start = match.index + match[0].length;
    const end = text.indexOf("</div>", start);
    if (end < 0) throw new Error("unclosed opts block");
    const inner = text.slice(start, end);
    if (inner.includes("<div")) throw new Error("an opts block must not nest a div");
    const labels = inner.match(LABEL) ?? [];
    const gaps = inner.split(LABEL);
    if (!labels.length || gaps.some((gap) => gap.trim())) {
      throw new Error("an opts block must hold only option labels");
    }
    const groups = new Set(labels.map((label) => attribute(label, "name")));
    if (groups.size !== 1 || groups.has(undefined)) throw new Error("an opts block must hold one radio group");
    blocks.push({
      start,
      end,
      group: [...groups][0],
      labels,
      values: labels.map((label) => attribute(label, "value")),
      gaps,
    });
  }
  return blocks;
}

// Answer keys declared in TOPIC data, as group name -> correct value, in
// declaration order (predict first, then the apply sets).
export function answerKeys(topicSource) {
  const keys = new Map();
  const predict = /\bpredict:\{correct:'([^']+)'/.exec(topicSource);
  if (predict) keys.set("predict", predict[1]);
  for (const [, group, value] of topicSource.matchAll(/\bfs:'([^']+)',correct:'([^']+)'/g)) keys.set(group, value);
  return keys;
}

// The keyed questions of a page source, in page order.
export function questions(body, keys) {
  return optionBlocks(body)
    .filter((block) => keys.has(block.group))
    .map((block) => {
      const correct = block.values.indexOf(keys.get(block.group));
      if (correct < 0) throw new Error(`${block.group}: answer key ${keys.get(block.group)} is not an option value`);
      if (correct >= LETTERS.length) throw new Error(`${block.group}: more than ${LETTERS.length} options`);
      return { ...block, correct };
    });
}

export function correctSequence(body, keys) {
  return questions(body, keys).map((question) => LETTERS[question.correct]).join("");
}

// Reorder each keyed question so its correct option sits at the target
// letter; the distractors keep their existing relative order.
export function reorderPage(body, keys, sequence) {
  const list = questions(body, keys);
  if (list.length !== sequence.length) throw new Error("sequence length must equal the question count");
  let output = "";
  let cursor = 0;
  list.forEach((question, index) => {
    const target = LETTERS.indexOf(sequence[index]);
    if (target < 0 || target >= question.labels.length) throw new Error(`invalid target ${sequence[index]}`);
    const ordered = question.labels.filter((_, at) => at !== question.correct);
    ordered.splice(target, 0, question.labels[question.correct]);
    output += body.slice(cursor, question.start);
    output += question.gaps.map((gap, at) => gap + (ordered[at] ?? "")).join("");
    cursor = question.end;
  });
  output += body.slice(cursor);
  if (!isHtmlAnswerOrderPermutation(body, output)) throw new Error("reorder changed more than option order");
  if (correctSequence(output, keys) !== sequence) throw new Error("reorder did not reach the target sequence");
  return output;
}

// True only when newText is oldText with whole option labels moved inside
// their own opts blocks: identical bytes outside every opts block, the same
// radio group, the same whitespace slots and the same label blocks per block.
export function isHtmlAnswerOrderPermutation(oldText, newText) {
  let before;
  let after;
  try {
    before = optionBlocks(oldText);
    after = optionBlocks(newText);
  } catch {
    return false;
  }
  if (!before.length || before.length !== after.length) return false;
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
  if (outside(oldText, before) !== outside(newText, after)) return false;
  return before.every((block, index) => {
    const other = after[index];
    return (
      block.group === other.group &&
      JSON.stringify(block.gaps) === JSON.stringify(other.gaps) &&
      JSON.stringify([...block.labels].sort()) === JSON.stringify([...other.labels].sort())
    );
  });
}

// T25 narrow exception, the artifact.html counterpart of
// acceptAnswerOrderPermutations: a stale binding to a topic artifact.html
// counts as current when its exact recorded blob is in Git history and the
// current page is only an option-order permutation of it.
export async function acceptHtmlAnswerOrderPermutations(repoRoot, bindings) {
  const output = [];
  for (const binding of bindings) {
    if (binding.current || binding.historical || path.basename(binding.artifactPath) !== "artifact.html") {
      output.push(binding);
      continue;
    }
    let current = null;
    try {
      current = await readFile(path.join(repoRoot, binding.artifactPath));
    } catch {
      current = null;
    }
    // Only pages with option blocks can qualify; skip the Git history lookup for every other page.
    const candidate = current && current.includes('<div class="opts');
    const old = candidate ? historicalBlob(repoRoot, binding.artifactPath, binding.sha256) : null;
    const accepted =
      old && current && isHtmlAnswerOrderPermutation(old.toString("utf8"), current.toString("utf8"));
    output.push(accepted ? { ...binding, current: true, answerOrderPermutation: true } : binding);
  }
  return output;
}

const FOCUS_OPTION = /^input\[name=([\w-]+)\]\[value=([\w-]+)\]$/;

// Keyboard routes in a topic's qa-paths.json Tab into a keyed group and expect
// focus on one option. A forward Tab into a radio group with nothing checked
// focuses its first option in page order, so such a step encodes the option
// order. After a reorder, the step expects the group's new first option and
// is followed by ArrowDown presses that move to (and select) the option the
// route expected, so the route still reaches the same state by keyboard.
// Returns the rewritten paths and the number of steps rewritten; a Shift+Tab
// entry (which focuses the last option) is refused rather than guessed.
export function rewriteKeyboardSteps(qaPaths, body, keys) {
  const order = new Map(optionBlocks(body).filter((block) => keys.has(block.group)).map((block) => [block.group, block.values]));
  let rewritten = 0;
  const visit = (value) => {
    if (Array.isArray(value)) {
      const steps = [];
      value.forEach((item, index) => {
        const previous = value[index - 1];
        const match = item && item.do === "expectFocus" && FOCUS_OPTION.exec(item.selector ?? "");
        const values = match && order.get(match[1]);
        const enters = previous && previous.do === "press" && (previous.key === "Tab" || previous.key === "Shift+Tab");
        if (!values || !enters || !values.includes(match[2]) || values[0] === match[2]) {
          steps.push(visit(item));
          return;
        }
        if (previous.key === "Shift+Tab") throw new Error(`qa-paths: Shift+Tab into ${match[1]} cannot be rewritten automatically`);
        const selector = (option) => `input[name=${match[1]}][value=${option}]`;
        steps.push({ ...item, selector: selector(values[0]) });
        for (let at = 1; at <= values.indexOf(match[2]); at += 1) {
          steps.push({ do: "press", selector: selector(values[at - 1]), key: "ArrowDown" });
          steps.push({ do: "expectFocus", selector: selector(values[at]) });
        }
        rewritten += 1;
      });
      return steps;
    }
    if (value && typeof value === "object") {
      return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, visit(item)]));
    }
    return value;
  };
  return { qaPaths: visit(qaPaths), rewritten };
}

function qaPathsFile(page) {
  return path.join(path.dirname(path.dirname(path.dirname(page.path))), path.basename(page.path, ".body.html"), "qa-paths.json");
}

// Tracked page sources that declare at least one keyed question.
export async function loadPages(repoRoot) {
  const files = execFileSync(
    "git",
    ["ls-files", "--", "authoring/evidence/*/*/page-build/src/*.body.html"],
    { cwd: repoRoot, encoding: "utf8" },
  )
    .split("\n")
    .filter(Boolean);
  const pages = [];
  for (const file of files) {
    const topicFile = file.replace(/\.body\.html$/, ".topic.js");
    let keys;
    try {
      keys = answerKeys(await readFile(path.join(repoRoot, topicFile), "utf8"));
    } catch {
      continue;
    }
    if (!keys.size) continue;
    const text = await readFile(path.join(repoRoot, file), "utf8");
    pages.push({ path: file, module: file.split("/").slice(2, 4).join("/"), text, keys, sequence: correctSequence(text, keys) });
  }
  return pages;
}

// Record HEAD's sequence as `accepted` on each page source whose bytes differ
// from HEAD, so the planner keeps every other page's committed plan.
export function withAcceptedSequences(repoRoot, pages) {
  let changed = [];
  try {
    changed = execFileSync("git", ["diff", "--name-only", "HEAD", "--", ...pages.map((page) => page.path)], {
      cwd: repoRoot,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).split("\n");
  } catch {
    return pages;
  }
  const changedPaths = new Set(changed.filter(Boolean));
  return pages.map((page) => {
    if (!changedPaths.has(page.path)) return page;
    let accepted = "";
    try {
      const head = execFileSync("git", ["show", `HEAD:${page.path}`], {
        cwd: repoRoot,
        encoding: "utf8",
        stdio: ["ignore", "pipe", "ignore"],
      });
      accepted = correctSequence(head, page.keys);
    } catch {
      accepted = "";
    }
    return { ...page, accepted };
  });
}

// Plans every page source module by module, so each module's pages get
// distinct balanced sequences whose positions also balance across the module.
export function planPages(pages) {
  const plan = new Map();
  const modules = new Map();
  for (const page of pages) modules.set(page.module, [...(modules.get(page.module) ?? []), page]);
  for (const group of modules.values()) {
    for (const [file, sequence] of planSequences(group)) plan.set(file, sequence);
  }
  return plan;
}

async function main() {
  const args = process.argv.slice(2);
  if (args.includes("--help") || !args.length) {
    console.log("Usage: node authoring/tools/html/answer-order.mjs --check|--write");
    console.log("Plans correct-answer positions for page-build topic sources (src/*.body.html).");
    console.log("--write also points keyboard focus steps in each topic's qa-paths.json at the new order.");
    console.log("After --write, rebuild the module's pages with its page-build/build.mjs.");
    return;
  }
  const repoRoot = path.resolve(import.meta.dirname, "../../..");
  const pages = withAcceptedSequences(repoRoot, await loadPages(repoRoot));
  const plan = planPages(pages);
  const changes = pages.filter((page) => plan.get(page.path) !== page.sequence);
  for (const page of changes) {
    console.log(`${page.path}: ${page.sequence} -> ${plan.get(page.path)}`);
    if (args.includes("--write")) {
      const output = reorderPage(page.text, page.keys, plan.get(page.path));
      await writeFile(path.join(repoRoot, page.path), output, "utf8");
      const qaFile = path.join(repoRoot, qaPathsFile(page));
      let qa = null;
      try {
        qa = JSON.parse(await readFile(qaFile, "utf8"));
      } catch {
        qa = null;
      }
      if (qa) {
        const { qaPaths, rewritten } = rewriteKeyboardSteps(qa, output, page.keys);
        if (rewritten) {
          await writeFile(qaFile, `${JSON.stringify(qaPaths, null, 2)}\n`, "utf8");
          console.log(`  ${path.relative(repoRoot, qaFile)}: ${rewritten} keyboard focus step(s) follow the new order`);
        }
      }
    }
  }
  console.log(
    `html answer-order: ${pages.length} page source(s), ${changes.length} ${args.includes("--write") ? "rewritten" : "need reordering"}`,
  );
  if (args.includes("--check") && changes.length) process.exitCode = 1;
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  main().catch((error) => {
    console.error(`html answer-order: ${error.message}`);
    process.exitCode = 1;
  });
}
