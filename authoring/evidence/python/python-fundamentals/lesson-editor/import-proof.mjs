// Import proof for lesson-editor pages, modelled on an LMS (Evolv-like) import:
// 1. copy the final artifact.html byte-for-byte into an empty temporary directory, alone;
// 2. verify the copy's sha256 and the stamped component version and hashes;
// 3. load it in headless Chromium with every request other than the page itself blocked, once directly and once
//    inside an iframe whose only sandbox token is allow-scripts (no forms, no same-origin, no storage);
// 4. drive the real editor with mouse and keyboard and record each check;
// 5. write a byte/hash receipt next to the topic's other evidence.
// Usage: node import-proof.mjs [topic-dir ...]   (default: every learner page that inlines the editor)
import { readFileSync, writeFileSync, mkdtempSync, copyFileSync, readdirSync, statSync, rmSync } from "node:fs";
import { createHash } from "node:crypto";
import { tmpdir } from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { chromium } from "playwright";
import { DIR, CONTRACT, verifyPage } from "./stamp.mjs";
import { NOJS_STARTERS, privateComprehensionFixtures, privateScaffoldFixtures } from "./fixtures.mjs";

const REPO = path.resolve(DIR, "../../../../..");
const sha = (b) => createHash("sha256").update(b).digest("hex");
function pages(dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (name === "node_modules" || name === "authoring" || name === "build" || name.startsWith(".")) continue;
    const p = path.join(dir, name);
    if (statSync(p).isDirectory()) pages(p, out);
    else if (name === "artifact.html" && readFileSync(p, "utf8").includes("data-lesson-editor=")) out.push(p);
  }
  return out;
}
const targets = process.argv.length > 2 ? process.argv.slice(2).map((d) => path.resolve(d, "artifact.html")) : pages(REPO);

async function launch() {
  try { return await chromium.launch({ headless: true }); } catch { return chromium.launch({ channel: "chrome", headless: true }); }
}

// Each exercise has its own scenario: the Python pilot (describe.py), the four scaffolds and the typed comprehensions.
const GOOD = 'def describe(n):\n    steps = 0\n    while n > 1:\n        n = n // 2\n        steps += 1\n    if steps == 0:\n        return "tiny"\n    elif steps < 4:\n        return "small"\n    else:\n        return "large"\n';
const FLOAT = GOOD.replace("n // 2", "n / 2");
// Drive a page to its editor step by replaying the topic's own QA success route up to the first editor action.
async function toEditor(f, topicId, editorId) {
  const spec = JSON.parse(readFileSync(path.join(REPO, "authoring/evidence/python/python-fundamentals", topicId, "qa-paths.json"), "utf8"));
  for (const a of spec.routes.success) {
    if (a.selector.startsWith(`#${editorId}`)) return;
    const l = f.locator(a.selector).first();
    if (a.do === "click") { await l.scrollIntoViewIfNeeded(); await l.click(); }
    else if (a.do === "check") await l.check();
    else if (a.do === "fill") await l.fill(a.value);
    else if (a.do === "press") await l.press(a.key);
    else if (a.do === "select") await l.selectOption(a.value);
  }
  throw new Error(`no ${editorId} action in the success route`);
}
// Value-free structural mutations: they act on whatever completed file the private fixtures supply and carry no
// fragment of it, so the committed proof holds no completed answer or near-miss copy of one.
function dropColon(source, header) {
  const out = source.split("\n");
  const index = out.findIndex((line) => header.test(line) && /:\s*$/.test(line));
  if (index < 0) throw new Error("no block header to break");
  out[index] = out[index].replace(/:\s*$/, "");
  return out.join("\n");
}
function dedentFirstBody(source) {
  const out = source.split("\n");
  const index = out.findIndex((line) => /^def\b.*:\s*$/.test(line));
  if (index < 0 || !/^ {4}\S/.test(out[index + 1] ?? "")) throw new Error("no indented body to dedent");
  out[index + 1] = out[index + 1].slice(4);
  return out.join("\n");
}
// Swap the bodies of two sibling clauses (for example the except and else handlers of one try statement).
function swapHandlerBodies(source, first, second) {
  const out = source.split("\n");
  const block = (keyword) => {
    const head = out.findIndex((line) => new RegExp(`^\\s*${keyword}\\b.*:\\s*$`).test(line));
    if (head < 0) throw new Error(`no ${keyword} clause`);
    const indent = out[head].match(/^\s*/)[0].length;
    let end = head + 1;
    while (end < out.length && (!out[end].trim() || out[end].match(/^\s*/)[0].length > indent)) end++;
    while (end > head + 1 && !out[end - 1].trim()) end--;
    return { head, end, indent };
  };
  const a = block(first), b = block(second);
  if (a.indent !== b.indent || a.end > b.head) throw new Error("clauses are not ordered siblings");
  const bodyA = out.slice(a.head + 1, a.end), bodyB = out.slice(b.head + 1, b.end);
  if (bodyA.join("\n") === bodyB.join("\n")) throw new Error("identical clause bodies cannot form a negative");
  return [...out.slice(0, a.head + 1), ...bodyB, ...out.slice(a.end, b.head + 1), ...bodyA, ...out.slice(b.end)].join("\n");
}
function scaffoldNegatives(id, good, starter) {
  const indentAll = "if True:\n" + good.split("\n").map((line) => line ? `    ${line}` : line).join("\n");
  const common = {
    "comment-only": good.split("\n").map((line) => `# ${line}`).join("\n"),
    "string-only": `\"\"\"${good}\"\"\"`,
    placeholder: starter,
  };
  if (id === "fned") return { ...common, misplaced: indentAll, syntax: dropColon(good, /^def\b/), indentation: dedentFirstBody(good) };
  if (id === "exed") return { ...common, misplaced: swapHandlerBodies(good, "except", "else"), syntax: dropColon(good, /^\s*except\b/), indentation: good.replace("            raise OutOfStock", "        raise OutOfStock") };
  if (id === "sced") return { ...common, "empty-stderr": good.replace('        print("usage: python summary.py SESSION", file=sys.stderr)', "        print(file=sys.stderr)"), "meaningless-stderr": good.replace('        print("usage: python summary.py SESSION", file=sys.stderr)', '        print("aa", file=sys.stderr)'), "bare-usage-stderr": good.replace('        print("usage: python summary.py SESSION", file=sys.stderr)', '        print("usage", file=sys.stderr)'), "nonsense-usage-stderr": good.replace('        print("usage: python summary.py SESSION", file=sys.stderr)', '        print("usage: aa", file=sys.stderr)'), "prose-stderr": good.replace('        print("usage: python summary.py SESSION", file=sys.stderr)', '        print("error: missing SESSION argument", file=sys.stderr)'), "extra-prose-stderr": good.replace('        print("usage: python summary.py SESSION", file=sys.stderr)', '        print("Usage: python summary.py SESSION (SESSION is required)", file=sys.stderr)'), "wrong-script-stderr": good.replace('        print("usage: python summary.py SESSION", file=sys.stderr)', '        print("Usage: python main.py SESSION", file=sys.stderr)'), "wrong-argument-stderr": good.replace('        print("usage: python summary.py SESSION", file=sys.stderr)', '        print("Usage: python summary.py NAME", file=sys.stderr)'), "b-prefix-stderr": good.replace('        print("usage: python summary.py SESSION", file=sys.stderr)', '        print(b"usage: python summary.py SESSION", file=sys.stderr)'), "br-prefix-stderr": good.replace('        print("usage: python summary.py SESSION", file=sys.stderr)', '        print(br"usage: python summary.py SESSION", file=sys.stderr)'), "rb-prefix-stderr": good.replace('        print("usage: python summary.py SESSION", file=sys.stderr)', '        print(rb"usage: python summary.py SESSION", file=sys.stderr)'), "bf-prefix-stderr": good.replace('        print("usage: python summary.py SESSION", file=sys.stderr)', '        print(bf"usage: python summary.py SESSION", file=sys.stderr)'), stdout: good.replace('        print("usage: python summary.py SESSION", file=sys.stderr)', '        print("usage: python summary.py SESSION")'), "zero-exit": good.replace("        return 2", "        return 0"), misplaced: good.replace("    sys.exit(main(sys.argv))", "    pass\nsys.exit(main(sys.argv))"), syntax: good.replace("def main(argv):", "def main(argv)"), indentation: good.replace('        print("usage:', '    print("usage:').replace("        return 2", "    return 2") };
  if (id === "pted") return { ...common, misplaced: indentAll, syntax: good.replace("def test_some_taken():", "def test_some_taken()"), indentation: good.replace("    assert seats_left(10, 3)", "assert seats_left(10, 3)") };
  throw new Error(`no negative cases for ${id}`);
}

// Every documented usage-line form earns the same credit as the fixture's wording.
function scaffoldAlternatives(id, good) {
  if (id !== "sced") return {};
  return {
    "python3-session-usage": good.replace('        print("usage: python summary.py SESSION", file=sys.stderr)', '        print("usage: python3 summary.py SESSION", file=sys.stderr)'),
    "py-session-usage": good.replace('        print("usage: python summary.py SESSION", file=sys.stderr)', '        print("usage: py summary.py SESSION", file=sys.stderr)'),
    "python-bracketed-usage": good.replace('        print("usage: python summary.py SESSION", file=sys.stderr)', '        print("Usage: python summary.py <SESSION>", file=sys.stderr)'),
    "python3-bracketed-usage": good.replace('        print("usage: python summary.py SESSION", file=sys.stderr)', '        print("Usage: python3 summary.py <SESSION>", file=sys.stderr)'),
    "py-bracketed-usage": good.replace('        print("usage: python summary.py SESSION", file=sys.stderr)', '        print("Usage: py summary.py <SESSION>", file=sys.stderr)'),
    "spaced-uppercase-usage": good.replace('        print("usage: python summary.py SESSION", file=sys.stderr)', '        print("USAGE :  python3   summary.py   SESSION  ", file=sys.stderr)'),
  };
}

async function pilotScenario(page, f, mode, record) {
  const check = async (name, fn) => {
    try { await fn(); record.push({ mode, name, pass: true }); }
    catch (e) { record.push({ mode, name, pass: false, detail: String(e.message || e).split("\n")[0] }); }
  };
  const text = async (sel) => ((await f.locator(sel).textContent()) || "").trim();
  const expect = (cond, msg) => { if (!cond) throw new Error(msg); };
  // Scroll first: inside a srcdoc iframe Playwright can otherwise click a stale position (a harness quirk, not page behaviour).
  const click = async (sel, nth) => { const l = nth === undefined ? f.locator(sel) : f.locator(sel).nth(nth); await l.scrollIntoViewIfNeeded(); await l.click(); };
  const focused = () => f.locator(":focus").evaluate((el) => el.id || el.className || el.tagName).catch(() => "none");
  await f.locator("input[name=predict][value=b]").check();
  await f.locator("input[name=pconf][value=low]").check();
  await click("#predict-check");
  await click("#next");
  await check("editor mounts with the starting code and its problems", async () => {
    expect((await f.locator("#ped").getAttribute("data-le-state")) === "ready", "state is not ready");
    expect((await f.locator("#ped-code").inputValue()).startsWith("def describe(int n) {"), "starter missing");
    expect(/Problems \(5\)/.test(await text("#ped-tab-p")), "expected 5 problems");
  });
  await check("mouse Run refuses a file with syntax errors and says why", async () => {
    await click("#ped-run");
    expect(/Not run: 5 syntax errors/.test(await text('.pep-act:not([hidden]) [data-region="current-feedback"]')), "feedback missing");
    expect((await f.locator("#ped-tab-p").getAttribute("aria-selected")) === "true", "Problems not selected");
    await page.waitForTimeout(80);
    expect(/Not run/.test(await text("#ped .le-live")), "live region not updated");
  });
  await check("pressing a problem moves the caret to its line", async () => {
    await click("#ped-p .le-jump", 3);
    expect((await focused()) === "ped-code", "editor not focused");
    expect(/^Ln 5,/.test(await text("#ped .le-pos")), "caret not on line 5");
  });
  await check("Tab indents inside the editor; Escape then Tab moves focus to Run", async () => {
    await f.locator("#ped-code").focus();
    await page.keyboard.press("ControlOrMeta+End");
    const before = (await f.locator("#ped-code").inputValue()).length;
    await page.keyboard.press("Tab");
    expect((await f.locator("#ped-code").inputValue()).length === before + 4, "Tab did not insert four spaces");
    await page.keyboard.press("Shift+Tab");
    expect((await f.locator("#ped-code").inputValue()).length === before, "Shift+Tab did not outdent");
    await page.keyboard.press("Escape");
    await page.keyboard.press("Tab");
    expect((await focused()) === "ped-run", `focus went to ${await focused()}`);
  });
  await check("focus order: Run, Reset code, Problems tab, panel", async () => {
    await page.keyboard.press("Tab");
    expect((await focused()) === "ped-reset", "Reset not next");
    await page.keyboard.press("Tab");
    expect((await focused()) === "ped-tab-p", "Problems tab not next");
    await page.keyboard.press("ArrowRight");
    expect((await focused()) === "ped-tab-o" && (await f.locator("#ped-o").isVisible()), "arrow key did not select Output");
    await page.keyboard.press("ArrowLeft");
    expect((await focused()) === "ped-tab-p", "arrow key did not return to Problems");
  });
  await check("keyboard Run (Ctrl+Enter in the editor) runs valid code and reports a mismatch", async () => {
    await f.locator("#ped-code").focus();
    await page.keyboard.press("ControlOrMeta+A");
    await page.keyboard.insertText(FLOAT);
    await page.keyboard.press("Control+Enter");
    expect(/describe\(10\) returned 'large'  expected 'small'/.test(await f.locator("#ped-o pre").innerText()), "mismatch not shown");
    expect((await f.locator("#ped-tab-o").getAttribute("aria-selected")) === "true", "Output not selected");
    expect(/always gives a float/.test(await text('.pep-act:not([hidden]) [data-region="current-feedback"]')), "float hint missing");
  });
  await check("keyboard Run (Enter on the Run button) runs again", async () => {
    await f.locator("#ped-code").focus();
    await page.keyboard.press("ControlOrMeta+A");
    await page.keyboard.insertText(GOOD);
    await f.locator("#ped-run").focus();
    await page.keyboard.press("Enter");
    expect(/describe\(10\) returned 'small'  matches/.test(await f.locator("#ped-o pre").innerText()), "match not shown");
    expect(/All checks done/.test(await text('.pep-act:not([hidden]) [data-region="current-feedback"]')), "checks not done");
    expect(/· 2 of 4 done/.test(await text("#prog-text")), "progress not 2 of 4");
  });
  await check("Reset code restores the starting version and its problems", async () => {
    await click("#ped-reset");
    expect((await f.locator("#ped-code").inputValue()).startsWith("def describe(int n) {"), "not reset");
    expect(/Problems \(5\)/.test(await text("#ped-tab-p")), "problems not recomputed");
  });
  await check("Restart activity restores the step's starting state", async () => {
    await f.locator("#ped-code").fill(GOOD);
    await click("#reset");
    expect(/· 1 of 4 done/.test(await text("#prog-text")), "progress not restored");
    expect((await f.locator("#ped-code").inputValue()).startsWith("def describe(int n) {"), "code not restored");
  });
  await check("a never-ending loop stops at the stated lesson limit", async () => {
    await f.locator("#ped-code").fill(GOOD.replace("n // 2", "n"));
    await click("#ped-run");
    expect(/lesson simulator's limit/.test(await f.locator("#ped-o pre").innerText()), "limit not reported");
  });
}

async function scaffoldScenario(page, f, mode, record, topicId) {
  const check = async (name, fn) => {
    try { await fn(); record.push({ mode, name, pass: true }); }
    catch (e) { record.push({ mode, name, pass: false, detail: String(e.message || e).split("\n")[0] }); }
  };
  const root = f.locator('[data-lesson-editor-adapter="python-scaffold@3"]');
  const editorId = await root.getAttribute("id");
  const progress = async () => ((await f.locator("#prog-text").textContent()) || "").trim();
  const total = await f.evaluate(() => TOPIC.acts.length);
  await toEditor(f, topicId, editorId);
  const before = +(/· (\d+) of/.exec(await progress()) || [])[1];
  await check("editor activity follows every taught construct (it is the last activity before the apply check)", async () => {
    const step = await f.evaluate(() => +document.getElementById("stage").getAttribute("data-step"));
    if (step !== total - 1) throw new Error(`editor is on activity ${step}, expected ${total - 1}`);
  });
  await check("scaffold editor mounts without external dependencies", async () => {
    if (await root.getAttribute("data-le-state") !== "ready") throw new Error("state is not ready");
    if (!/Lesson check/.test((await root.locator(".le-problems").textContent()) || "")) throw new Error("starter requirements missing");
  });
  const starter = await f.evaluate(() => EDITOR_CFG.starter);
  const failsToComplete = async (name, source) => {
    await root.locator(".le-code").fill(source);
    await root.locator(".le-run").click();
    await page.waitForTimeout(30);
    const live = (await root.locator(".le-live").textContent()) || "";
    if (/Scaffold complete/.test(live)) throw new Error(`${name} submission was accepted`);
    if ((await f.locator('[data-goal="author"] .st').textContent())?.trim() === "done") throw new Error(`${name} submission awarded the author check`);
    if (!/Lesson check|Error/.test((await root.locator(".le-problems").textContent()) || "")) throw new Error(`${name} submission had no blocking diagnostic`);
    const state = await root.evaluate((node) => [node.dataset.pepCompleted, node.dataset.pepCredit, node.dataset.pepGrade].join("/"));
    if (state !== "false/0/0") throw new Error(`${name} submission reported activity state ${state}`);
  };
  // Public, value-free negatives built only from the page's own starter.
  for (const [name, source] of Object.entries({
    "starter as given": starter,
    "empty file": "",
    "blanks deleted": starter.replace(/___/g, ""),
    "starter commented out": starter.split("\n").map((line) => `# ${line}`).join("\n"),
  })) await check(`${name} submission stays incomplete`, async () => failsToComplete(name, source));
  const fx = privateScaffoldFixtures();
  if (!fx) {
    record.push({ mode, name: "private completed-scaffold checks", pass: true, detail: "skipped: PEP_PRIVATE_SCAFFOLD_FIXTURES not provided" });
    return;
  }
  const completed = fx[editorId];
  await check("the learner page carries no completed answer", async () => {
    const leaked = await f.evaluate((good) => { const h = document.documentElement.outerHTML, e = good.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); return h.includes(good.trim()) || h.includes(e.trim()) || typeof TOPIC.editorGood !== "undefined"; }, completed);
    if (leaked) throw new Error("completed fixture text found in the page");
  });
  for (const [name, source] of Object.entries(scaffoldNegatives(editorId, completed, starter))) {
    await check(`${name} submission stays incomplete`, async () => failsToComplete(name, source));
  }
  await check("bounded Run accepts the completed lesson scaffold and credits the activity once", async () => {
    await root.locator(".le-code").fill(completed);
    await root.locator(".le-run").click();
    await page.waitForTimeout(80);
    if (!/Scaffold complete/.test((await root.locator(".le-live").textContent()) || "")) throw new Error("completion announcement missing");
    if ((await f.locator('[data-goal="author"] .st').textContent())?.trim() !== "done") throw new Error("author check did not settle");
    if (await root.evaluate((node) => [node.dataset.pepCompleted, node.dataset.pepCredit, node.dataset.pepGrade].join("/")) !== "true/1/1") throw new Error("activity state did not report a genuine pass");
    if (!(await progress()).includes(`· ${before + 1} of ${total} done`)) throw new Error(`progress is ${await progress()}`);
    await root.locator(".le-run").click();
    await page.waitForTimeout(40);
    if (!(await progress()).includes(`· ${before + 1} of ${total} done`)) throw new Error("a second Run earned duplicate credit");
  });
  await check("Reset code restores an incomplete scaffold", async () => {
    await root.locator(".le-reset").click();
    if (!/Lesson check/.test((await root.locator(".le-problems").textContent()) || "")) throw new Error("requirements not restored");
  });
  await check("Restart activity clears the credit and remounts the editor", async () => {
    await f.locator("#reset").click();
    await page.waitForTimeout(40);
    if (!(await progress()).includes(`· ${before} of ${total} done`)) throw new Error(`progress is ${await progress()}`);
    if ((await f.locator('[data-goal="author"] .st').textContent())?.trim() !== "open") throw new Error("author check not reopened");
    if (await root.evaluate((node) => [node.dataset.pepCompleted, node.dataset.pepCredit, node.dataset.pepGrade].join("/")) !== "false/0/0") throw new Error("Restart left a passed activity state");
    if (await root.getAttribute("data-le-state") !== "ready") throw new Error("editor not remounted");
  });
  for (const [name, source] of Object.entries(scaffoldAlternatives(editorId, completed))) {
    await check(`${name} submission is accepted`, async () => {
      await root.locator(".le-code").fill(source);
      await root.locator(".le-run").click();
      await page.waitForTimeout(80);
      if (!/Scaffold complete/.test((await root.locator(".le-live").textContent()) || "")) throw new Error(`${name} submission was not accepted`);
      if ((await f.locator('[data-goal="author"] .st').textContent())?.trim() !== "done") throw new Error(`${name} submission did not settle the author check`);
      await f.locator("#reset").click();
      await page.waitForTimeout(40);
      if (!(await progress()).includes(`· ${before} of ${total} done`)) throw new Error(`progress is ${await progress()} after restart`);
    });
  }
  // A pass counts only while the live code still passes: an edit, Reset code or a failed rerun reopens the check, and a
  // genuine re-pass restores exactly one credit. Each boundary starts from a real private pass in its own sequence.
  const hooks = () => root.evaluate((node) => [node.dataset.pepCompleted, node.dataset.pepCredit, node.dataset.pepGrade].join("/"));
  const reopened = async (label) => {
    if (await hooks() !== "false/0/0") throw new Error(`${label}: activity still reports a pass`);
    if ((await f.locator('[data-goal="author"] .st').textContent())?.trim() !== "open") throw new Error(`${label}: author check still done`);
    if (await f.locator("#next").isVisible()) throw new Error(`${label}: Continue still offered`);
    if (!(await progress()).includes(`· ${before} of ${total} done`)) throw new Error(`${label}: progress is ${await progress()}`);
  };
  const realPass = async () => {
    await root.locator(".le-code").fill(completed);
    await root.locator(".le-run").click();
    await page.waitForTimeout(80);
    if (await hooks() !== "true/1/1" || !(await progress()).includes(`· ${before + 1} of ${total} done`)) throw new Error(`pass not credited exactly once: ${await progress()}`);
  };
  await check("an edit after a real pass reopens the check", async () => {
    await realPass();
    await root.locator(".le-code").focus();
    await page.keyboard.press("ControlOrMeta+End");
    await page.keyboard.type("\n___\n");
    await reopened("edit");
  });
  await check("Reset code after a real pass restores the starter and reopens the check", async () => {
    await realPass();
    await root.locator(".le-reset").click();
    if (await root.locator(".le-code").inputValue() !== starter) throw new Error("starter not restored");
    await reopened("Reset code");
  });
  await check("a failed rerun after a real pass reopens the check", async () => {
    await realPass();
    await root.locator(".le-code").evaluate((ta) => { ta.value = ta.value + "\n___\n"; });
    await root.locator(".le-run").click();
    await page.waitForTimeout(60);
    await reopened("failed rerun");
  });
  await check("repeated pass and invalidation cycles never duplicate credit", async () => {
    for (let cycle = 0; cycle < 3; cycle++) {
      await realPass();
      await root.locator(".le-reset").click();
      await reopened(`cycle ${cycle + 1}`);
    }
    await realPass();
  });
  await f.locator("#reset").click();
  await page.waitForTimeout(40);
  // The public QA routes stop at this private editor, so the honest settled path after it is proven here: a real pass,
  // then two apply misses settle without credit and leave the page incomplete.
  await check("a settled apply miss after a real pass leaves the page incomplete and uncredited", async () => {
    await root.locator(".le-code").fill(completed);
    await root.locator(".le-run").click();
    await page.waitForTimeout(80);
    if (await root.evaluate((node) => node.dataset.pepCompleted) !== "true") throw new Error("the completed scaffold did not pass");
    await f.locator("#next").click();
    const wrong = await f.evaluate(() => ({ a: TOPIC.apply.A.correct, b: TOPIC.apply.B.correct }));
    await f.locator(`input[name=apply-a]:not([value="${wrong.a}"])`).first().check();
    await f.locator("input[name=conf][value=high]").check();
    await f.locator("#apply-check").click();
    await f.locator(`input[name=apply-b]:not([value="${wrong.b}"])`).first().check();
    await f.locator("#apply-check-b").click();
    await page.waitForTimeout(40);
    const feedback = (await f.locator('.pep-act:not([hidden]) [data-region="current-feedback"]').textContent()) || "";
    if (!/settled/.test(feedback) || !/not complete and no credit/.test(feedback)) throw new Error("apply misses did not settle honestly");
    if (!(await progress()).includes(`· ${before + 1} of ${total} done · 1 settled, not passed`)) throw new Error(`progress is ${await progress()}`);
    await f.locator("#next").click();
    if (await f.locator("#lesson").getAttribute("data-pep-complete") !== "false") throw new Error("a settled page completed");
    if (!/not complete yet: 1 of \d+ activities settled without passing/.test((await f.locator("#complete-msg").textContent()) || "")) throw new Error("recap claims completion");
  });
}

// The slicing activity is answer-sensitive: no completed comprehension is committed here. Public negatives are built
// from the starter; positives and the near-miss negatives derived from them come only from the private fixtures.
const COMPLETED_TARGET = /\b(?:result|doubled)\s*=\s*(?:\[[^\]\n:]*\bfor\b|\{[^}\n]*\bfor\b)/;
async function comprehensionScenario(page, f, mode, record, topicId) {
  const check = async (name, fn) => {
    try { await fn(); record.push({ mode, name, pass: true }); }
    catch (e) { record.push({ mode, name, pass: false, detail: String(e.message || e).split("\n")[0] }); }
  };
  const root = f.locator('[data-lesson-editor-adapter="python-comprehension@1"]');
  const a3 = f.locator("#activity-3");
  const progress = async () => ((await f.locator("#prog-text").textContent()) || "").trim();
  const done = async (g) => (await f.locator(`[data-goal="${g}"]`).getAttribute("class") || "").split(/\s+/).includes("done");
  const hook = (name) => a3.getAttribute(`data-pep-${name}`);
  const restart = async () => { await f.locator("#reset").click(); await page.waitForTimeout(30); };
  await toEditor(f, topicId, "cped");
  const run = async (src) => { await root.locator(".le-code").fill(src); await root.locator(".le-run").click(); await page.waitForTimeout(40); };
  const out = async () => (await root.locator(".le-output pre").textContent()) || "";
  const probs = async () => (await root.locator(".le-problems").textContent()) || "";
  const fb = async () => (await f.locator("#fb-3").textContent()) || "";
  const S = NOJS_STARTERS["slicing-and-comprehensions"];
  const fx = privateComprehensionFixtures();
  await check("comprehension editor mounts with its two placeholders open", async () => {
    if (await root.getAttribute("data-le-state") !== "ready") throw new Error("state is not ready");
    if (!/Problems \(2\)/.test((await root.locator('[role=tab]').first().textContent()) || "")) throw new Error("expected 2 problems");
  });
  await check("the learner page carries no completed answer", async () => {
    const html = await f.evaluate(() => document.documentElement.outerHTML.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&"));
    if (COMPLETED_TARGET.test(html)) throw new Error("a completed result/doubled comprehension is in the page");
    if (fx && [fx.cpedSet, fx.cpedDict].flatMap((x) => x.split("\n")).filter((l) => /^(result|doubled) = /.test(l)).some((l) => html.includes(l.split(" = ")[1]))) throw new Error("a private completed comprehension is in the page");
  });
  const negatives = {
    "placeholder starter": [S, async () => /Lesson check/.test(await probs()) && /Nothing was counted/.test(await fb())],
    "finished values instead of a comprehension": [S.replace("result = ___", "result = [24, 24, 60]"), async () => /not a list of finished values/.test(await probs())],
    "key: value inside square brackets": [S.replace("result = ___", "result = [p: p for p in prices]"), async () => /Error/.test(await probs()) && /curly braces/.test(await probs())],
    "comment-only": [S.split("\n").map((l) => (l ? `# ${l}` : l)).join("\n"), async () => /Lesson check/.test(await probs())],
  };
  if (fx) {
    Object.assign(negatives, {
      "missing filter": [fx.cpedSet.replace(/( for \w+ in prices) if [^\]]*\]/, "$1]"), async () => /\[8, 24, 24, 60\]   expected/.test(await out())],
      "wrong collection": [fx.cpedSet.replace(/(doubled = \{)[^}]*? for (\w+)/, "$1$2 for $2"), async () => /expected \{24, 60\}/.test(await out())],
      "true division outside the subset": [fx.cpedSet.replace(/(result = \[[^\]]*?)\*/, "$1/"), async () => /whole numbers/.test(await probs())],
    });
  }
  const open = { "missing filter": "list", "wrong collection": "coll" };
  for (const [name, [src, ok]] of Object.entries(negatives)) {
    await check(`${name} does not complete the activity`, async () => {
      await restart();
      await run(src);
      if (!(await ok())) throw new Error(`no corrective diagnostic for ${name}`);
      if (await hook("completed") !== "false" || await hook("credit") !== "0") throw new Error(`${name} completed the activity`);
      if (open[name] ? await done(open[name]) : (await done("list")) || (await done("coll"))) throw new Error(`${name} closed a check it should not`);
    });
  }
  await check("two runs that still differ settle the activity without revealing an answer", async () => {
    await restart();
    await run(S.replace("result = ___", "result = [24, 24, 60]"));
    if (await hook("attempts") !== "1" || await hook("completed") !== "false") throw new Error("first differing run settled early");
    await run(S.replace("result = ___", "result = [p: p for p in prices]"));
    if (await hook("settled") !== "true" || await hook("continue") !== "true" || await hook("completed") !== "false" || await hook("grade") !== "0" || await hook("credit") !== "0") throw new Error("second differing run did not settle without completion, credit or grade");
    if (!/Settled after two tries/.test(await fb()) || COMPLETED_TARGET.test(await fb())) throw new Error("settled feedback missing or reveals an answer");
    if (await f.locator("#next-activity").isDisabled()) throw new Error("Next activity stayed disabled after settling");
  });
  if (!fx) { record.push({ mode, name: "private positive comprehension checks", pass: true, detail: "skipped: PEP_PRIVATE_COMPREHENSION_FIXTURES not provided" }); }
  else {
    await check("partial work completes only its own check", async () => {
      await restart();
      await run(fx.cpedSet.replace(/( for \w+ in prices) if [^\]]*\]/, "$1]"));
      if (await done("list") || !(await done("coll"))) throw new Error("checks do not reflect the partial file");
    });
    await check("keyboard Run (Ctrl+Enter) accepts the typed list and set comprehensions", async () => {
      await restart();
      await root.locator(".le-code").fill(fx.cpedSet);
      await root.locator(".le-code").focus();
      await page.keyboard.press("Control+Enter");
      await page.waitForTimeout(40);
      if (!/Both comprehensions match/.test((await root.locator(".le-live").textContent()) || "")) throw new Error("pass not announced");
      if (!/· 3 of 4 done/.test(await progress()) || await hook("grade") !== "1" || await hook("completed") !== "true" || await hook("credit") !== "1") throw new Error(`progress is ${await progress()}`);
    });
    await check("Restart activity clears both checks and restores the starter", async () => {
      await restart();
      if (await done("list") || await done("coll")) throw new Error("checks not reopened");
      if (!/· 2 of 4 done/.test(await progress()) || await hook("credit") !== "0") throw new Error(`progress is ${await progress()}`);
      if ((await root.locator(".le-code").inputValue()) !== S) throw new Error("starter not restored");
    });
    await check("a typed dict comprehension also completes the activity", async () => {
      await run(fx.cpedDict);
      if (!/\{12: 24, 30: 60\}   matches/.test(await out())) throw new Error("dict result not shown");
      if (!/· 3 of 4 done/.test(await progress())) throw new Error(`progress is ${await progress()}`);
    });
  }
  await check("Escape then Tab leaves the editor", async () => {
    await root.locator(".le-code").focus();
    await page.keyboard.press("Escape");
    await page.keyboard.press("Tab");
    const id = await f.locator(":focus").evaluate((el) => el.id).catch(() => "");
    if (id !== "cped-run") throw new Error(`focus went to ${id}`);
  });
}

const browser = await launch();
const version = browser.version();
let failed = 0;
for (const src of targets) {
  const bytes = readFileSync(src);
  const html = bytes.toString("utf8");
  const dir = mkdtempSync(path.join(tmpdir(), "lesson-editor-import-"));
  const copy = path.join(dir, "artifact.html");
  copyFileSync(src, copy);
  const copyBytes = readFileSync(copy);
  const stamp = verifyPage(copyBytes.toString("utf8"));
  const record = [];
  record.push({ mode: "copy", name: "copy is byte-identical and alone in its directory", pass: sha(copyBytes) === sha(bytes) && readdirSync(dir).length === 1 });
  record.push({ mode: "copy", name: "stamped version and hashes match the reviewed sources", pass: stamp.present && stamp.errors.length === 0, detail: stamp.errors.join("; ") || undefined });
  const url = pathToFileURL(copy).href;
  for (const mode of ["direct", "sandboxed iframe (allow-scripts only)"]) {
    const context = await browser.newContext({ viewport: { width: 1366, height: 900 } });
    const page = await context.newPage();
    const blocked = [], errors = [];
    page.on("pageerror", (e) => errors.push(String(e.message)));
    page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
    await context.route("**/*", (route) => {
      const u = route.request().url();
      if (u === url || u.startsWith("data:") || u === "about:blank" || u === "about:srcdoc") return route.continue();
      blocked.push(u); return route.abort();
    });
    let f = page;
    if (mode === "direct") await page.goto(url);
    else {
      // The frame is kept well inside the host viewport: with a frame nearly as tall as the viewport, headless
      // Chromium drops Playwright's pointer events into the out-of-process frame (a harness quirk, not page behaviour).
      await page.setContent('<!doctype html><title>host</title><iframe id="lms" sandbox="allow-scripts" style="width:1340px;height:640px;border:0"></iframe>');
      await page.locator("#lms").evaluate((el, h) => new Promise((res) => { el.addEventListener("load", res, { once: true }); el.srcdoc = h; }), html);
      f = page.frames()[1];
    }
    const topicId = path.basename(path.dirname(src));
    if (html.includes('id="ped"')) await pilotScenario(page, f, mode, record);
    else if (html.includes('id="cped"')) await comprehensionScenario(page, f, mode, record, topicId);
    else await scaffoldScenario(page, f, mode, record, topicId);
    record.push({ mode, name: "no network or sibling-file requests", pass: blocked.length === 0, detail: blocked.join(" ") || undefined });
    record.push({ mode, name: "no script errors", pass: errors.length === 0, detail: errors.join(" | ") || undefined });
    await context.close();
  }
  {
    const mode = "direct with JavaScript disabled";
    const context = await browser.newContext({ viewport: { width: 1366, height: 900 }, javaScriptEnabled: false });
    const page = await context.newPage();
    const blocked = [], errors = [];
    page.on("pageerror", (e) => errors.push(String(e.message)));
    await context.route("**/*", (route) => {
      const u = route.request().url();
      if (u === url) return route.continue();
      blocked.push(u); return route.abort();
    });
    try {
      await page.goto(url);
      const fallbackVisible = await page.locator(".nojs-editor").isVisible();
      const inertChromeVisible = await page.locator(".le .le-actions").isVisible().catch(() => false);
      const text = ((await page.locator(".nojs-editor").textContent()) || "").trim();
      const topicId = path.basename(path.dirname(src));
      const expectedStarter = NOJS_STARTERS[topicId];
      const shownStarter = await page.locator(".nojs-editor pre").textContent().catch(() => null);
      record.push({ mode, name: "static editor exercise and expected result are visible", pass: fallbackVisible && /Expected result/.test(text), detail: fallbackVisible ? undefined : "fallback is not visible" });
      record.push({ mode, name: "exact page-specific starter scaffold is visible", pass: typeof shownStarter === "string" && typeof expectedStarter === "string" && shownStarter.replace(/\r\n?/g, "\n").trimEnd() === expectedStarter.trimEnd(), detail: shownStarter === null ? "starter pre is missing" : undefined });
      record.push({ mode, name: "inert editor chrome is hidden", pass: !inertChromeVisible });
      record.push({ mode, name: "no network or sibling-file requests", pass: blocked.length === 0, detail: blocked.join(" ") || undefined });
      record.push({ mode, name: "no script errors", pass: errors.length === 0, detail: errors.join(" | ") || undefined });
    } finally { await context.close(); }
  }
  rmSync(dir, { recursive: true, force: true });
  const pass = record.every((r) => r.pass);
  if (!pass) failed++;
  const rel = path.relative(REPO, src);
  const parts = rel.split(path.sep);
  const receipt = {
    schemaVersion: 1,
    kind: "lesson-editor import receipt",
    page: rel.split(path.sep).join("/"),
    pageBytes: bytes.length,
    pageSha256: sha(bytes),
    component: { id: CONTRACT.id, version: CONTRACT.version, roots: stamp.roots, fragments: stamp.blocks },
    environment: { browser: `chromium ${version}`, network: "blocked except the page itself", isolation: "byte copy alone in an empty temporary directory", sandbox: "allow-scripts" },
    ranAt: new Date().toISOString(),
    result: pass ? "pass" : "fail",
    checks: record,
  };
  const out = path.join(REPO, "authoring/evidence", parts[0], parts[1], parts[2], "lesson-editor-import.json");
  writeFileSync(out, JSON.stringify(receipt, null, 2) + "\n");
  console.log(`${pass ? "PASS" : "FAIL"} ${rel} -> ${path.relative(REPO, out)}`);
  for (const r of record) if (!r.pass) console.log(`  ${r.mode}: ${r.name}${r.detail ? ` (${r.detail})` : ""}`);
}
await browser.close();
process.exit(failed ? 1 : 0);
