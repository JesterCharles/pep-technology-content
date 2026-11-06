// Module regressions for python-fundamentals learner pages.
// Run: node --test authoring/evidence/python/python-fundamentals/lesson-editor/module-regressions.test.mjs
// The live pytest check uses PEP_PYTEST_PYTHON (or python3) and is skipped, with a reason, when pytest is not installed.
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, mkdtempSync, writeFileSync } from "node:fs";
import { execFileSync, spawnSync } from "node:child_process";
import { tmpdir } from "node:os";
import path from "node:path";
import vm from "node:vm";
import { DIR } from "./stamp.mjs";
import { NOJS_STARTERS, privateComprehensionFixtures, privateScaffoldFixtures } from "./fixtures.mjs";

const REPO = path.resolve(DIR, "../../../../..");
const MOD = path.join(REPO, "python/python-fundamentals");
const EV = path.join(REPO, "authoring/evidence/python/python-fundamentals");
const TOPICS = JSON.parse(readFileSync(path.join(REPO, "authoring/catalog/python/python-fundamentals/module.json"), "utf8")).topicOrder;
const page = (t) => readFileSync(path.join(MOD, t, "artifact.html"), "utf8");
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const unesc = (s) => s.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&amp;/g, "&");
// Stepped pages: one <section class="pep-act" data-step="N"> per activity, in source order, each holding its own
// teaching and steps (reading) and prompt, model, controls, static result and feedback (workspace).
const ACT_OPEN = (n) => `<section class="pep-regions pep-act" data-step="${n}" aria-labelledby="teach-${n}-h">`;
const stepAct = (html, n) => { const a = html.indexOf(ACT_OPEN(n)); if (a < 0) return ""; const b = html.indexOf('<section class="pep-regions pep-act" data-step=', a + 1); return html.slice(a, b > 0 ? b : html.indexOf('<div class="fbrow pep-next-row">', a)); };
const stepActs = (html) => (html.match(/<section class="pep-regions pep-act" data-step="\d+"/g) || []).length;
const stepDiv = (html, region, n) => { const sec = stepAct(html, n), a = sec.indexOf(`data-region="${region}">`); return a < 0 ? "" : sec.slice(a, sec.indexOf("\n      </div>", a)); };
const topicJs = (html) => html.match(/\nvar TOPIC=\{[\s\S]*?\n\};\n/)[0];
// Pages re-authored to the learner guidance contract (one section per activity, reversible navigation, objectives
// disclosure, activity checks, hints). The other pages keep the earlier stage anatomy until they are re-authored.
const GUIDED = new Set(["slicing-and-comprehensions"]);
const activity = (html, n) => { const a = html.indexOf(`<section class="pep-activity" id="activity-${n}"`); const b = html.indexOf(`<section class="pep-activity" id="activity-${n + 1}"`); return html.slice(a, b > 0 ? b : html.indexOf('<div class="pep-activity-actions')); };
// A completed slicing comprehension: a result/doubled assignment whose value is a comprehension with a for part.
const COMPLETED_TARGET = /\b(?:result|doubled)\s*=\s*(?:\[[^\]\n:]*\bfor\b|\{[^}\n]*\bfor\b)/;
// Every string a committed file presents: a JSON file is parsed and walked string by string, so escapes cannot hide a
// value; any other file contributes its raw text and its HTML-decoded text.
const jsonStrings = (node, out = []) => {
  if (typeof node === "string") out.push(node);
  else if (node && typeof node === "object") for (const value of Object.values(node)) jsonStrings(value, out);
  return out;
};
const committedStrings = (file) => {
  const raw = readFileSync(file, "utf8");
  return file.endsWith(".json") ? [raw, ...jsonStrings(JSON.parse(raw))] : [raw, unesc(raw)];
};
const SCAFFOLD_TOPICS = { "functions-and-arguments": "fned", "exceptions-and-logging": "exed", "writing-and-running-script-files": "sced", "testing-with-pytest": "pted" };

test("learner pages carry no completed editor answer", () => {
  const scaffold = SCAFFOLD_TOPICS;
  for (const t of TOPICS) {
    const h = page(t);
    assert.ok(!/editorGood/.test(h), `${t}: editorGood is back`);
    if (scaffold[t]) assert.ok(h.includes(`id="${scaffold[t]}"`), `${t}: editor missing`);
  }
  const committed = [
    path.join(MOD, "slicing-and-comprehensions/artifact.html"), path.join(MOD, "slicing-and-comprehensions/artifact.md"),
    path.join(EV, "slicing-and-comprehensions/qa-paths.json"),
    ...["fixtures.mjs", "import-proof.mjs", "module-regressions.test.mjs", "comprehension-adapter.js", "README.md"].map((f) => path.join(DIR, f)),
  ];
  for (const f of committed) {
    for (const text of committedStrings(f)) {
      assert.ok(!COMPLETED_TARGET.test(text.replace(/\\n/g, "\n")), `${path.relative(REPO, f)}: a completed result/doubled comprehension is committed`);
    }
  }
  // The four scaffold answers are private: with the authorized fixtures, no committed page, companion, QA path or
  // editor source may carry one, raw, HTML-decoded or as any parsed JSON string.
  const sfx = privateScaffoldFixtures();
  if (sfx) {
    const surfaces = [
      ...TOPICS.flatMap((t) => ["artifact.html", "artifact.md", "artifact.gift", "video-artifact.md"].map((f) => path.join(MOD, t, f))),
      ...TOPICS.map((t) => path.join(EV, t, "qa-paths.json")),
      ...["fixtures.mjs", "import-proof.mjs", "module-regressions.test.mjs", "scaffold-adapter.js", "README.md"].map((f) => path.join(DIR, f)),
    ].filter((f) => { try { readFileSync(f); return true; } catch { return false; } });
    for (const f of surfaces) {
      for (const text of committedStrings(f)) {
        for (const [id, fx] of Object.entries(sfx)) {
          assert.ok(!text.includes(fx.trim()) && !text.includes(esc(fx).trim()), `${path.relative(REPO, f)}: the completed ${id} scaffold is committed`);
        }
      }
    }
  }
  const fx = privateComprehensionFixtures();
  if (fx) {
    const sl = page("slicing-and-comprehensions");
    for (const line of [fx.cpedSet, fx.cpedDict].flatMap((x) => x.split("\n")).filter((l) => /^(result|doubled) = /.test(l))) {
      const expr = line.split(" = ")[1];
      assert.ok(!sl.includes(expr) && !sl.includes(esc(expr)), "slicing: a private completed comprehension is shown on the page");
    }
  }
});

test("DESIGN.md lesson anatomy on every page", () => {
  const shell = readFileSync(path.join(EV, "page-shell/shell.css"), "utf8");
  const guided = readFileSync(path.join(EV, "page-shell/guidance-shell.css"), "utf8");
  for (const t of TOPICS) {
    const h = page(t);
    if (GUIDED.has(t)) {
      assert.ok(h.slice(h.indexOf("<style>\n") + 8).startsWith(guided), `${t}: base CSS differs from page-shell/guidance-shell.css`);
      assert.equal((h.match(/<h1[ >]/g) || []).length, 1, `${t}: one h1`);
      assert.match(h, /<main id="lesson" class="pep-main" data-pep-responsive data-pep-guidance-contract /, `${t}: guidance enrollment`);
      assert.match(h, /<header class="pep-topicbar">[\s\S]*<details class="pep-objectives" data-pep-objectives>\s*<summary aria-controls="objectives-body">Objectives<\/summary>[\s\S]*<\/header>/, `${t}: objectives disclosure in the topic bar`);
      assert.match(h, /id="prog-text">Activity 1 of \d · 0 of \d done · about \d+ min</, `${t}: position and minutes in the bar`);
      assert.ok(!/>Goals</.test(h) && !/class="pep-goals"/.test(h), `${t}: a Goals panel is back`);
      const n = (h.match(/<section class="pep-activity" id="activity-\d+" data-pep-activity /g) || []).length;
      assert.ok(n >= 3, `${t}: one section per activity`);
      for (let i = 1; i <= n; i++) {
        const sec = activity(h, i);
        assert.match(sec, /data-pep-instructions>[\s\S]*data-pep-workspace="(code|activity)">/, `${t} activity ${i}: instructions before workspace`);
        const ws = sec.slice(sec.indexOf("data-pep-workspace="));
        assert.match(ws, /data-pep-task[\s\S]*<h2>Your task<\/h2>[\s\S]*data-pep-activity-checks[\s\S]*data-pep-feedback/, `${t} activity ${i}: task, checks and feedback in the workspace`);
        if (i > 1) assert.ok(sec.includes(`<a href="#activity-${i - 1}" data-pep-back-link>`), `${t} activity ${i}: back link`);
        assert.ok(!/ hidden[ >]/.test(sec.slice(0, sec.indexOf(">"))), `${t} activity ${i}: authored hidden`);
      }
      assert.match(h, /data-pep-previous[\s\S]*data-pep-next/, `${t}: Previous beside Next`);
      const css = h.slice(h.indexOf("<style>"), h.indexOf("</style>"));
      assert.ok(!/@font-face|position:\s*(fixed|sticky)|100d?vh|box-shadow/.test(guided), `${t}: forbidden layout, font or shadow rule`);
      for (const m of css.slice(0, guided.length + 8).matchAll(/font[^;]*?(\d+)px/g)) assert.ok([12, 13, 14, 16, 20, 28].includes(+m[1]), `${t}: font size ${m[1]}px`);
      continue;
    }
    assert.ok(h.slice(h.indexOf("<style>\n") + 8).startsWith(shell), `${t}: base CSS differs from page-shell/shell.css`);
    assert.equal((h.match(/<h1[ >]/g) || []).length, 1, `${t}: one h1`);
    assert.match(h, /<header class="pep-topicbar">\n    <h1>/, `${t}: topic bar`);
    assert.match(h, /id="prog-text">Activity 1 of \d · 0 of \d done · about \d+ min</, `${t}: position and minutes in the bar`);
    assert.match(h, /<ul class="pep-goals" data-pep-objectives>/, `${t}: visible Goals list`);
    assert.ok(!/<details[^>]*data-pep-objectives/.test(h) && !/class="crumbs/.test(h) && !/class="meta"/.test(h) && !/Topic \d+ of \d+/.test(h), `${t}: removed furniture is back`);
    assert.match(h, /<div class="stage" id="stage" data-step="1">/, `${t}: stage`);
    const n = stepActs(h);
    assert.ok(n >= 4, `${t}: one section per activity`);
    for (let i = 1; i <= n; i++) {
      const sec = stepAct(h, i);
      assert.match(sec, /class="pep-region reading" data-pep-instructions>[\s\S]*data-region="current-teaching">[\s\S]*data-region="current-task">[\s\S]*class="pep-region workspace" data-pep-workspace="(code|activity)">[\s\S]*data-region="current-ask">[\s\S]*data-region="current-feedback"/, `${t} activity ${i}: teaching and steps, then the workspace with its feedback`);
    }
    assert.ok(h.indexOf('id="next"') > h.indexOf(ACT_OPEN(n)), `${t}: Continue follows the activities`);
    const css = h.slice(h.indexOf("<style>"), h.indexOf("</style>"));
    assert.ok(!/@font-face|position:\s*(fixed|sticky)|100d?vh/.test(css), `${t}: forbidden layout or font rule`);
    for (const m of css.slice(0, shell.length + 8).matchAll(/font[^;]*?(\d+)px/g)) assert.ok([12, 13, 14, 16, 20, 28].includes(+m[1]), `${t}: font size ${m[1]}px`);
  }
});

test("every editor production follows the teaching of each construct it requires", () => {
  const need = {
    "functions-and-arguments": ["fned", [/-&gt; int:/, /nights: int = 1/, /\*parts/, /\*\*fields/, /\*values/, /\*\*opts/]],
    "exceptions-and-logging": ["exed", [/raise OutOfStock\(/, /class OutOfStock\(Exception\)/, /except ValueError:/, /<code>else<\/code>/, /<code>finally<\/code>/, /logger\.exception/, /getLogger\(__name__\)/, /<code>info<\/code>/, /<code>debug<\/code>/]],
    "writing-and-running-script-files": ["sced", [/sys\.argv\[1\]/, /Check its length/, /sys\.exit\(2\)/, /file=sys\.stderr/, /if __name__ == "__main__":/, /sys\.exit\(main\(sys\.argv\)\)/]],
    "testing-with-pytest": ["pted", [/plain <code>assert<\/code>/, /pytest\.raises\(/, /@pytest\.fixture/, /@pytest\.mark\.parametrize/]],
    "slicing-and-comprehensions": ["cped", [/\[n \* 10 for n in counts if n &lt; 5\]/, /build a set/, /build a dict/]],
  };
  for (const [t, [ed, constructs]] of Object.entries(need)) {
    const h = page(t);
    if (GUIDED.has(t)) {
      const taught = h.slice(h.indexOf('<section class="pep-activity" id="activity-1"'), h.indexOf(`id="${ed}"`)).replace(/<details[^>]*data-section-skip[\s\S]*?<\/details>/g, "");
      for (const re of constructs) assert.match(taught, re, `${t}: ${re} is not taught before the editor`);
      continue;
    }
    let step = 0;
    for (let i = 1; i <= stepActs(h); i++) if (stepAct(h, i).includes(`id="${ed}"`)) step = i;
    const acts = JSON.parse(topicJs(h).match(/acts:(\[[^\]]*\])/)[1].replace(/'/g, '"'));
    if (t !== "slicing-and-comprehensions") assert.equal(step, acts.length - 1, `${t}: the editor is the activity right before the apply check`);
    let taught = "";
    for (let n = 1; n <= step; n++) taught += stepDiv(h, "current-teaching", n).replace(/<details[^>]*data-section-skip[\s\S]*?<\/details>/g, "");
    for (const re of constructs) assert.match(taught, re, `${t}: ${re} is not taught by activity ${step}`);
  }
});

test("slicing objective 2 is typed production, not fragment selection", (t) => {
  const h = page("slicing-and-comprehensions");
  const a3 = activity(h, 3);
  assert.match(a3, /data-lesson-editor-adapter="python-comprehension@1"/);
  assert.ok(!/type="radio"/.test(a3), "activity 3 still offers radio fragments");
  assert.match(h, /var NEED=\{2:\['neg','step2','rev'\],3:\['list','coll'\]\};/);
  assert.match(a3, /data-pep-answer-sensitive="python-comprehension" data-pep-answer-targets="result doubled"/);
  assert.match(a3, /<code>result = ___<\/code>[\s\S]*one list comprehension[\s\S]*<code>doubled = ___<\/code>[\s\S]*one set or dict comprehension/, "two ordered edits");
  assert.match(a3, /keeps each price over 10, doubles it and appends it, building <code>\[24, 24, 60\]<\/code>\. The repeated 24 stays/, "the shown loop is explained");
  assert.equal((a3.match(/data-pep-hint-for="task-3"/g) || []).length, 4, "four nested Activity 3 hints");
  const A = new Function(readFileSync(path.join(DIR, "comprehension-adapter.js"), "utf8") + "\nreturn LESSON_EDITOR_COMPREHENSION;")();
  const S = NOJS_STARTERS["slicing-and-comprehensions"];
  const starter = A.check(S);
  assert.equal(starter.problems.length, 2);
  const literal = A.check(S.replace("result = ___", "result = [24, 24, 60]"));
  assert.ok(literal.problems.some((p) => /finished values/.test(p.msg)), "a copied result list must not count");
  const brackets = A.check(S.replace("result = ___", "result = [p: p for p in prices]"));
  assert.ok(brackets.problems.some((p) => p.kind === "error" && /curly braces/.test(p.msg)), "key: value in square brackets is a Python error");
  const fx = privateComprehensionFixtures();
  if (!fx) { t.diagnostic("private comprehension fixtures not provided; positive check skipped"); return; }
  for (const x of [fx.cpedSet, fx.cpedDict]) {
    const c = A.check(x);
    assert.deepEqual(c.problems, []);
    assert.equal(A.run(c.program).status, "pass");
  }
});

test("slicing passes the static guidance, optional-disclosure and answer-safety contract", async () => {
  const { validateHtmlContracts } = await import(path.join(REPO, "authoring/tools/checks/T08-html-static.mjs"));
  const spec = JSON.parse(readFileSync(path.join(EV, "slicing-and-comprehensions/qa-paths.json"), "utf8"));
  const r = await validateHtmlContracts(page("slicing-and-comprehensions"), { spec });
  assert.deepEqual([...r.optional, ...r.guidance], []);
  assert.equal(r.hasGuidanceMarker, true);
  assert.equal(r.hintCount, 5);
});

test("slicing reads completely without JavaScript", () => {
  const h = page("slicing-and-comprehensions");
  assert.match(h, /<script>document\.documentElement\.classList\.add\('pep-js'\);<\/script>/, "enhancement flag set before render");
  assert.match(h, /html:not\(\.pep-js\) \.pep-js-only \{ display: none !important; \}/);
  assert.ok(!/class="recap[^"]*" [^>]*hidden/.test(h) && !/<section class="pep-activity"[^>]* hidden/.test(h), "authored hidden activity or recap");
  for (let i = 1; i <= 4; i++) {
    const sec = activity(h, i);
    assert.match(sec, /<noscript( data-pep-no-js)? data-section-skip>/, `activity ${i}: a static result for the no-JavaScript reading`);
    for (const ctl of sec.match(/<fieldset[^>]*data-interaction[^>]*>/g) || []) assert.ok(sec.slice(0, sec.indexOf(ctl)).lastIndexOf('<div class="pep-js-only"') > sec.slice(0, sec.indexOf(ctl)).lastIndexOf("</div>\n        <noscript"), `activity ${i}: an inert control is visible without JavaScript`);
  }
});

function runTerminal(t, commands) {
  const h = page(t);
  const lines = [];
  const log = { appendChild: (d) => lines.push(d.textContent), set innerHTML(v) { lines.length = 0; }, scrollTop: 0, scrollHeight: 0 };
  const doc = { createElement: () => ({}) };
  const TOPIC = new Function("document", topicJs(h) + "\nreturn TOPIC;")(doc);
  const t0 = TOPIC.init(); t0.g = {};
  const S = { t: t0 };
  const api = { $: () => log, hit: () => {}, esc: (s) => s };
  const out = [];
  for (const c of commands) { lines.length = 0; TOPIC.run(c, "2", S, api); out.push(lines.slice(1)); }
  return { out, S, TOPIC };
}

test("venv terminal keeps full mutable requirements.txt state that matches real pip", () => {
  const pip = JSON.parse(readFileSync(path.join(EV, "tool-runs/pip.json"), "utf8")).steps;
  const { out, S, TOPIC } = runTerminal("modules-imports-and-virtual-environments", [
    "python3 -m venv .venv", "source .venv/bin/activate", "cat requirements.txt", "python -m pip install -r requirements.txt",
    "python -m pip freeze > requirements.txt", "cat requirements.txt", "python -m pip install -r requirements.txt", "python -m pip install pytest==9.1.1", "python -m pip freeze",
  ]);
  assert.deepEqual(out[2], ["pytest==9.1.1"]);
  assert.deepEqual(out[3].filter((l) => !l.startsWith("(")), pip.install_from_single_pin.stdout);
  assert.deepEqual(out[4], [], "redirected freeze prints nothing");
  assert.deepEqual(out[5].join("\n").split("\n"), pip.freeze.stdout, "cat shows the whole frozen file");
  assert.deepEqual(S.t.req, pip.freeze.stdout, "requirements.txt state is the freeze output");
  assert.deepEqual(out[6], pip.reinstall_from_frozen_file.stdout, "reinstall reads every recorded pin");
  assert.deepEqual(out[7], pip.direct_install_when_present.stdout);
  assert.deepEqual(out[8].join("\n").split("\n"), pip.freeze.stdout);
  assert.equal(S.t.g.record, 1);
  assert.deepEqual(TOPIC.FREEZE, pip.freeze.stdout);
  const empty = runTerminal("modules-imports-and-virtual-environments", ["python3 -m venv .venv", "source .venv/bin/activate", "python -m pip freeze > requirements.txt", "cat requirements.txt", "python -m pip install -r requirements.txt", "python -m pip install pytest==9.1.1"]);
  assert.deepEqual(empty.S.t.req, pip.freeze_in_empty_venv.stdout);
  assert.deepEqual(empty.out[4], pip.install_from_empty_file.stdout);
  assert.deepEqual(empty.out[5].filter((l) => !l.startsWith("(")), pip.direct_install_fresh.stdout);
});

test("pytest page shows the exact seats.py and real pytest reports", () => {
  const rec = JSON.parse(readFileSync(path.join(EV, "tool-runs/pytest.json"), "utf8"));
  const h = page("testing-with-pytest");
  const shown = [...h.matchAll(/<p(?: class="simnote")?>seats\.py<\/p><pre class="code">([\s\S]*?)<\/pre>/g)].map((m) => unesc(m[1]) + "\n");
  assert.ok(shown.length >= 2, "seats.py is shown before the terminal and beside the editor");
  for (const s of shown) assert.equal(s, rec["seats.py"], "a displayed seats.py differs from the executed one");
  const { out, TOPIC } = runTerminal("testing-with-pytest", ["cat seats.py", "python -m pytest", "python -m pytest -q", "python -m pytest test_seats.py::test_some_taken"]);
  assert.equal(out[0].join("\n") + "\n", rec["seats.py"]);
  const norm = (ls) => ls.flatMap((l) => l.split("\n")).filter((l) => !/^(platform|rootdir)/.test(l)).map((l) => l.replace(/in \d\.\d\ds/, "in T")).filter((l) => l !== "");
  assert.deepEqual(norm(out[1]), norm(rec.runs.all.stdout));
  assert.deepEqual(norm(out[2]), norm(rec.runs.quiet.stdout));
  assert.deepEqual(norm(out[3]), norm(rec.runs.node_id_pass.stdout));
  assert.ok(TOPIC.H[1].endsWith(rec.runs.all.stdout[1].split(" -- ")[1]), "versions on the platform line");
});

test("the completed pytest scaffold passes real pytest against the displayed seats.py", (t) => {
  const sfx = privateScaffoldFixtures();
  if (!sfx) { t.skip("the completed scaffold is private; set PEP_PRIVATE_SCAFFOLD_FIXTURES"); return; }
  const py = process.env.PEP_PYTEST_PYTHON || "python3";
  if (spawnSync(py, ["-c", "import pytest"]).status !== 0) { t.skip(`pytest is not importable by ${py}; set PEP_PYTEST_PYTHON`); return; }
  const rec = JSON.parse(readFileSync(path.join(EV, "tool-runs/pytest.json"), "utf8"));
  const dir = mkdtempSync(path.join(tmpdir(), "pted-"));
  writeFileSync(path.join(dir, "seats.py"), rec["seats.py"]);
  writeFileSync(path.join(dir, "test_seats.py"), sfx.pted);
  const r = spawnSync(py, ["-m", "pytest", "-q", "-p", "no:cacheprovider"], { cwd: dir, encoding: "utf8" });
  assert.equal(r.status, 0, r.stdout + r.stderr);
  assert.match(r.stdout, /4 passed/);
});

// The script-files usage line has one documented grammar: Usage (any case) : python|python3|py summary.py SESSION|<SESSION>.
const USAGE_LINE = '        print("usage: python summary.py SESSION", file=sys.stderr)';
const USAGE_ACCEPTED = [
  "usage: python summary.py SESSION", "usage: python3 summary.py SESSION", "usage: py summary.py SESSION",
  "Usage: python summary.py <SESSION>", "Usage: python3 summary.py <SESSION>", "Usage: py summary.py <SESSION>",
  "USAGE: python3 summary.py SESSION", "Usage:python summary.py SESSION", "  Usage :  py   summary.py   <SESSION>  ",
];
const USAGE_REFUSED = [
  "", "   ", "!", "aa", "zz", "hello world", "usage", "usage: aa", "aa session", "usages",
  "error: missing SESSION argument", "Usage: python3 summary.py <session>",
  "Usage: python summary.py SESSION (SESSION is required)", "error: Usage: python summary.py SESSION",
  "Usage: python main.py SESSION", "Usage: python summary.py NAME", "Usage: summary.py SESSION",
  "Usage: Python summary.py SESSION", "Usage: python summary.py <SESSION", "Usage: python summary.py SESSION SESSION",
];
// Literal prefixes: text-string prefixes print the same line; bytes forms print b'...' instead and bf or ur are SyntaxErrors.
const USAGE_TEXT_PREFIXES = ["r", "R", "u", "f", "rf", "Fr"];
const USAGE_PREFIXED = ["b", "B", "br", "rb", "Rb", "bf", "ur"];
let SCED = null;
const withPrefix = (prefix) => SCED.replace(USAGE_LINE, `        print(${prefix}"usage: python summary.py SESSION", file=sys.stderr)`);
const withUsage = (text) => SCED.replace(USAGE_LINE, `        print(${JSON.stringify(text)}, file=sys.stderr)`);
const scaffoldCopies = () => {
  const copies = [["source", readFileSync(path.join(DIR, "scaffold-adapter.js"), "utf8")]];
  for (const t of ["functions-and-arguments", "exceptions-and-logging", "writing-and-running-script-files", "testing-with-pytest"]) {
    const m = page(t).match(/\/\* lesson-editor@3 scaffold-adapter\.js \S+ \*\/\n([\s\S]*?)\/\* \/lesson-editor scaffold-adapter\.js \*\//);
    assert.ok(m, `${t}: no inline scaffold adapter`);
    copies.push([t, m[1]]);
  }
  return copies.map(([name, code]) => { const ctx = {}; vm.runInNewContext(code + "\nthis.S=LESSON_EDITOR_SCAFFOLD;", ctx); return [name, (src) => ctx.S.validate(src, "scripts").filter((p) => p.kind !== "hint")]; });
};

test("the script-files check accepts only the documented usage line on stderr with a non-zero status", (t) => {
  const sfx = privateScaffoldFixtures();
  if (!sfx) { t.skip("the completed scaffold is private; set PEP_PRIVATE_SCAFFOLD_FIXTURES"); return; }
  SCED = sfx.sced;
  assert.ok(SCED.includes(USAGE_LINE));
  for (const [name, blocking] of scaffoldCopies()) {
    assert.equal(blocking(SCED).length, 0, `${name}: the completed scaffold is blocked`);
    for (const text of USAGE_ACCEPTED) assert.equal(blocking(withUsage(text)).length, 0, `${name}: ${JSON.stringify(text)} is blocked`);
    for (const text of USAGE_REFUSED) {
      const problems = blocking(withUsage(text));
      assert.ok(problems.length > 0, `${name}: ${JSON.stringify(text)} was accepted`);
      assert.ok(problems.every((p) => p.kind === "limit"), `${name}: ${JSON.stringify(text)} is reported as invalid Python`);
    }
    for (const prefix of USAGE_TEXT_PREFIXES) assert.equal(blocking(withPrefix(prefix)).length, 0, `${name}: the ${prefix}-prefixed usage line is blocked`);
    for (const prefix of USAGE_PREFIXED) {
      const problems = blocking(withPrefix(prefix));
      assert.ok(problems.length > 0, `${name}: the ${prefix}-prefixed usage line was accepted`);
      assert.ok(problems.every((p) => p.kind === "limit"), `${name}: the ${prefix}-prefixed usage line is reported as an editor error`);
    }
    const other = [
      ["no object", SCED.replace(USAGE_LINE, "        print(file=sys.stderr)")],
      ["stdout", SCED.replace(USAGE_LINE, '        print("usage: python summary.py SESSION")')],
      ["zero exit", SCED.replace("        return 2", "        return 0")],
      ["usage outside the guard", SCED.replace(USAGE_LINE, USAGE_LINE.slice(4))],
      ["main run on import", SCED.replace('if __name__ == "__main__":\n    sys.exit(main(sys.argv))', "sys.exit(main(sys.argv))")],
    ];
    for (const [label, src] of other) assert.ok(blocking(src).length > 0, `${name}: ${label} was accepted`);
  }
  // Under CPython every message variant exits 2 with its text on stderr, so only the usage grammar separates them.
  const py = process.env.PEP_PYTEST_PYTHON || "python3";
  const dir = mkdtempSync(path.join(tmpdir(), "sced-"));
  for (const text of [...USAGE_ACCEPTED, ...USAGE_REFUSED]) {
    writeFileSync(path.join(dir, "summary.py"), withUsage(text));
    const r = spawnSync(py, ["summary.py"], { cwd: dir, encoding: "utf8" });
    assert.equal(r.status, 2, JSON.stringify(text));
    assert.equal(r.stdout, "", JSON.stringify(text));
    assert.equal(r.stderr, `${text}\n`);
  }
  for (const prefix of ["b", "B", "br", "rb", "Rb"]) {
    writeFileSync(path.join(dir, "summary.py"), withPrefix(prefix));
    const r = spawnSync(py, ["summary.py"], { cwd: dir, encoding: "utf8" });
    assert.deepEqual([r.status, r.stdout, r.stderr], [2, "", "b'usage: python summary.py SESSION'\n"], prefix);
  }
  for (const prefix of ["bf", "ur"]) {
    writeFileSync(path.join(dir, "summary.py"), withPrefix(prefix));
    const r = spawnSync(py, ["summary.py"], { cwd: dir, encoding: "utf8" });
    assert.equal(r.status, 1, prefix);
    assert.match(r.stderr, /SyntaxError/, prefix);
  }
  for (const prefix of USAGE_TEXT_PREFIXES) {
    writeFileSync(path.join(dir, "summary.py"), withPrefix(prefix));
    const r = spawnSync(py, ["summary.py"], { cwd: dir, encoding: "utf8" });
    assert.deepEqual([r.status, r.stdout, r.stderr], [2, "", "usage: python summary.py SESSION\n"], prefix);
  }
  writeFileSync(path.join(dir, "summary.py"), SCED);
  const ok = spawnSync(py, ["summary.py", "s1"], { cwd: dir, encoding: "utf8" });
  assert.equal(ok.status, 0);
  assert.equal(ok.stdout, "Summary for s1\n");
  const imported = spawnSync(py, ["-c", "import summary"], { cwd: dir, encoding: "utf8" });
  assert.deepEqual([imported.status, imported.stdout, imported.stderr], [0, "", ""]);
  writeFileSync(path.join(dir, "summary.py"), SCED.replace("        return 2", "        return 0"));
  assert.equal(spawnSync(py, ["summary.py"], { cwd: dir, encoding: "utf8" }).status, 0);
  writeFileSync(path.join(dir, "summary.py"), SCED.replace(USAGE_LINE, '        print("usage: python summary.py SESSION")'));
  const out = spawnSync(py, ["summary.py"], { cwd: dir, encoding: "utf8" });
  assert.deepEqual([out.status, out.stdout, out.stderr], [2, "usage: python summary.py SESSION\n", ""]);
  writeFileSync(path.join(dir, "summary.py"), SCED.replace('if __name__ == "__main__":\n    sys.exit(main(sys.argv))', "sys.exit(main(sys.argv))"));
  const unguarded = spawnSync(py, ["-c", "import summary"], { cwd: dir, encoding: "utf8" });
  assert.equal(unguarded.status, 2, "importing an unguarded script runs main");
});

test("responsive and optional-disclosure contract on every page", async () => {
  const { validateOptionalDisclosures } = await import(path.join(REPO, "authoring/tools/checks/T08-html-static.mjs"));
  const editors = new Set(["python-syntax-for-java-developers", "functions-and-arguments", "slicing-and-comprehensions", "exceptions-and-logging", "writing-and-running-script-files", "testing-with-pytest"]);
  for (const t of TOPICS) {
    const h = page(t);
    assert.deepEqual(await validateOptionalDisclosures(h), [], `${t}: optional-disclosure or instruction/workspace problems`);
    if (GUIDED.has(t)) {
      assert.match(h, /<main id="lesson" class="pep-main" data-pep-responsive /, `${t}: responsive enrollment`);
      const a3 = activity(h, 3);
      assert.equal((a3.match(/<noscript data-pep-no-js data-section-skip>/g) || []).length, 1, `${t}: one no-JS reading inside the code workspace`);
      assert.match(a3, /data-pep-workspace="code">[\s\S]*<noscript data-pep-no-js data-section-skip>[\s\S]*Supported in the in-page editor[\s\S]*Expected result/, `${t}: no-JS reading names the subset and the comparison`);
      const reading = a3.slice(a3.indexOf("data-pep-instructions"), a3.indexOf("data-pep-workspace="));
      assert.match(reading, /data-pep-teaching[\s\S]*data-pep-where-fits[\s\S]*data-pep-optional="anecdote"/, `${t}: anecdote follows the core explanation inside its activity`);
      assert.match(a3, /data-pep-feedback[\s\S]*data-pep-optional="challenge"/, `${t}: challenge follows the required practice and feedback`);
      const opt = [...h.matchAll(/<details class="pep-optional[\s\S]*?<\/details>/g)].map((m) => m[0]).join("\n");
      assert.ok(!/<(input|textarea|button|select)\b|data-interaction|data-goal=/.test(opt), `${t}: optional content carries a control or required hook`);
      assert.ok(!/<(pre|code)\b/.test(h.match(/<details class="pep-optional pep-optional--anecdote"[\s\S]*?<\/details>/)[0]), `${t}: anecdote carries code`);
      continue;
    }
    assert.match(h, /<main id="lesson" class="pep-main" data-pep-responsive>/, `${t}: responsive enrollment`);
    const n = stepActs(h);
    // No-JavaScript linear reading: nothing in the stage is authored hidden, the head marks scripting, and only the
    // inert controls, feedback, Continue, Restart and progress are hidden without it.
    const stage = h.slice(h.indexOf('<div class="stage" id="stage"'), h.indexOf('<div class="fbrow pep-next-row">'));
    assert.ok(!/<(div|section|figure) data-step="\d+"[^>]* hidden[ >]/.test(stage) && !/<section class="pep-regions pep-act"[^>]* hidden[ >]/.test(stage), `${t}: an activity or step is authored hidden`);
    assert.match(h, /<\/title>\n<script>document\.documentElement\.classList\.add\('pep-js'\);<\/script>\n<style>/, `${t}: scripting class set in the head`);
    assert.ok(!h.includes(".task:has(> div:not([hidden]):empty)"), `${t}: the empty-step rule that hid every procedure is back`);
    assert.match(h, /<noscript><div class="nojs"><p>JavaScript is off\. Every activity below is still readable in order/, `${t}: no-JS banner`);
    assert.ok(!h.includes('class="extras"'), `${t}: global optional extras are back`);
    let codeWs = 0;
    for (let i = 1; i <= n; i++) {
      const sec = stepAct(h, i), ws = sec.slice(sec.indexOf("data-pep-workspace="));
      const editor = /data-lesson-editor=/.test(sec);
      if (editor) {
        codeWs++;
        assert.match(sec, /data-pep-workspace="code">/, `${t} activity ${i}: code workspace`);
        assert.equal((ws.match(/<noscript data-pep-no-js data-section-skip>/g) || []).length, 1, `${t} activity ${i}: one no-JS reading inside the code workspace`);
        assert.match(ws, /<noscript data-pep-no-js data-section-skip>[\s\S]*Supported in the in-page editor[\s\S]*Expected result/, `${t}: no-JS reading names the subset and the comparison`);
      } else assert.match(sec, /data-pep-workspace="activity">/, `${t} activity ${i}: activity workspace`);
      const plain = (sec.match(/data-interaction="(predict|explore|mcq|terminal)"/g) || []).length - (editor ? 1 : 0);
      if (plain) assert.match(ws, /data-region="current-control">[\s\S]*<noscript data-section-skip><div class="nojs-static"><p class="pep-label">Without JavaScript: the result<\/p><p>\S/, `${t} activity ${i}: static result for its interaction`);
    }
    assert.equal(codeWs, editors.has(t) ? 1 : 0, `${t}: code workspaces`);
    const opts = [...h.matchAll(/<details class="pep-optional pep-optional--(\w+)"[\s\S]*?<\/details>/g)];
    const opt = opts.map((m) => m[0]).join("\n");
    assert.ok(!/<(input|textarea|button|select)\b|data-step=|data-goal=|data-interaction/.test(opt), `${t}: optional content carries a control or required hook`);
    for (const m of opts) {
      const i = +[...h.slice(0, m.index).matchAll(/<section class="pep-regions pep-act" data-step="(\d+)"/g)].at(-1)[1], sec = stepAct(h, i), at = sec.indexOf(m[0]);
      assert.ok(at > 0, `${t}: ${m[1]} sits inside an activity`);
      if (m[1] === "anecdote") {
        assert.ok(at > sec.indexOf("data-pep-teaching") && at < sec.indexOf('data-region="current-task">'), `${t}: anecdote follows the core explanation inside activity ${i}`);
        assert.ok(!/<(pre|code)\b/.test(m[0]), `${t}: anecdote carries code`);
      } else assert.ok(at > sec.indexOf('data-region="current-feedback">'), `${t}: challenge follows the required practice and feedback of activity ${i}`);
    }
  }
});

test("a settled miss never counts as done, credits, or completes a stepped page", () => {
  for (const t of TOPICS) {
    if (GUIDED.has(t)) continue;
    const h = page(t);
    assert.match(h, /function settle\(act\)\{S\.settled\[act\]=true;delete S\.done\[act\];/, `${t}: settle keeps the activity not done`);
    assert.match(h, /if\(S\.settled\.apply\)\{settle\('apply'\);\}else\{complete\('apply'\);\}/, `${t}: a settled apply check is not completed`);
    assert.match(h, /main\.setAttribute\('data-pep-complete',miss\?'false':'true'\)/, `${t}: the page completes only when every activity passed`);
    assert.ok(!/answered, not marked correct\)'|setAttribute\('data-pep-complete','true'\);var c/.test(h), `${t}: settled work is counted as done again`);
    const spec = JSON.parse(readFileSync(path.join(EV, t, "qa-paths.json"), "utf8"));
    if (spec.answerSafety?.privateSuccessProof === true) {
      // Value-free public routes stop at the private editor; the import receipt, generated from the private fixtures,
      // carries the settled-miss proof for both the direct and the sandboxed load instead.
      const receipt = JSON.parse(readFileSync(path.join(EV, t, "lesson-editor-import.json"), "utf8"));
      const settled = receipt.checks.filter((c) => c.name === "a settled apply miss after a real pass leaves the page incomplete and uncredited");
      assert.ok(settled.length >= 2 && settled.every((c) => c.pass), `${t}: the private import proof shows the honest settled state after a real pass`);
      continue;
    }
    const N = +spec.progress.text.match(/of (\d+) done/)[1];
    const wt = JSON.stringify(spec.routes.wrongTwice);
    assert.ok(wt.includes(`${N - 1} of ${N} done · 1 settled, not passed`) && wt.includes('"#reset"'), `${t}: wrongTwice proves the honest settled state before Restart and a real pass`);
    const edge = spec.simulatorEdges.find((e) => e.name.startsWith("a settled apply miss"));
    assert.ok(edge, `${t}: settled-miss edge`);
    const tail = JSON.stringify(edge.actions.slice(-3));
    assert.ok(tail.includes('"data-pep-complete","equals":"false"') && tail.includes("not complete yet") && tail.includes("settled, not passed"), `${t}: the settled-miss edge disconfirms page completion and credit`);
  }
});

// Value-free state-truth regression for the four scaffold editors. No completed answer exists here: a test double
// wraps the page's own scaffold adapter so that one marker file "passes", which exercises the page's real author check,
// activity hooks, progress and Continue wiring. The completed-file versions of these sequences run only in the private
// import proof and private overlays.
test("a scaffold pass is invalidated by an edit, Reset code or a failed run, and a re-pass credits once", { timeout: 240000 }, async () => {
  const { chromium } = await import("playwright");
  const { pathToFileURL } = await import("node:url");
  const MARK = "# lesson test double: pass\n";
  const double = (mark) => {
    let real;
    Object.defineProperty(window, "LESSON_EDITOR_SCAFFOLD", {
      configurable: true,
      get: () => real,
      set: (adapter) => {
        real = { ...adapter, make: (cfg) => {
          const a = adapter.make(cfg);
          return { ...a,
            check: (src) => (src === mark ? { problems: [], program: mark } : a.check(src)),
            run: (program, calls) => (program === mark ? { status: "pass", lines: ["test double"], summary: "Scaffold complete (test double)." } : a.run(program, calls)) };
        } };
      },
    });
  };
  const browser = await chromium.launch();
  try {
    for (const [topic, id] of Object.entries(SCAFFOLD_TOPICS)) {
      const spec = JSON.parse(readFileSync(path.join(EV, topic, "qa-paths.json"), "utf8"));
      const page = await browser.newPage();
      await page.addInitScript(double, MARK);
      await page.route("**/*", (r) => (r.request().url() === pathToFileURL(path.join(MOD, topic, "artifact.html")).href ? r.continue() : r.abort()));
      await page.goto(pathToFileURL(path.join(MOD, topic, "artifact.html")).href);
      for (const a of spec.routes.success) {
        if (a.selector.startsWith(`#${id}`)) break;
        const l = page.locator(a.selector).first();
        if (a.do === "click") { await l.scrollIntoViewIfNeeded(); await l.click(); }
        else if (a.do === "check") await l.check();
        else if (a.do === "fill") await l.fill(a.value);
        else if (a.do === "press") await l.press(a.key);
        else if (a.do === "select") await l.selectOption(a.value);
      }
      const code = page.locator(`#${id}-code`);
      const done = async () => +(((await page.locator("#prog-text").textContent()) || "").match(/· (\d+) of/) || [])[1];
      const state = async () => ({
        hooks: await page.locator(`#${id}`).evaluate((n) => [n.dataset.pepCompleted, n.dataset.pepCredit, n.dataset.pepGrade].join("/")),
        goal: ((await page.locator('[data-goal="author"] .st').textContent()) || "").trim(),
        next: await page.locator("#next").isVisible(),
        done: await done(),
      });
      const before = await done();
      const passed = { hooks: "true/1/1", goal: "done", next: true, done: before + 1 };
      const open = { hooks: "false/0/0", goal: "open", next: false, done: before };
      const run = async () => { await page.locator(`#${id}-run`).click(); await page.waitForTimeout(40); };
      const pass = async () => { await code.fill(MARK); await run(); };
      const starter = await page.evaluate(() => EDITOR_CFG.starter);
      assert.deepEqual(await state(), open, `${topic}: the editor starts open`);
      for (let cycle = 1; cycle <= 3; cycle++) {
        await pass();
        assert.deepEqual(await state(), passed, `${topic}: pass ${cycle} credits exactly once`);
        await code.focus();
        await page.keyboard.press("ControlOrMeta+End");
        await page.keyboard.type("x");
        assert.deepEqual(await state(), open, `${topic}: an edit after pass ${cycle} reopens the check`);
      }
      await pass();
      await page.locator(`#${id}-reset`).click();
      assert.equal(await code.inputValue(), starter, `${topic}: Reset code restores the starter`);
      assert.deepEqual(await state(), open, `${topic}: Reset code after a pass reopens the check`);
      await pass();
      await code.evaluate((ta, value) => { ta.value = value; }, starter);
      await run();
      assert.deepEqual(await state(), open, `${topic}: a failed run after a pass reopens the check`);
      await pass();
      assert.deepEqual(await state(), passed, `${topic}: a genuine re-pass restores exactly one credit`);
      await page.locator("#reset").click();
      await page.waitForTimeout(40);
      assert.deepEqual(await state(), open, `${topic}: page Restart clears the pass`);
      await page.close();
    }
  } finally {
    await browser.close();
  }
});
