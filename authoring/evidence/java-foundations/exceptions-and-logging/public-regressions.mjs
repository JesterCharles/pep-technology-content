import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

function lex(source) {
  const tokens = [];
  const pattern = /\s+|\/\/[^\n]*|\/\*[\s\S]*?\*\/|(::|->|\|\||&&|[<>=!]=|[A-Za-z_$][\w$]*|\d+|"(?:[^"\\\n]|\\.)*"|.)/g;
  let match;
  while ((match = pattern.exec(source))) {
    if (match[1] !== undefined) tokens.push(match[1]);
  }
  return tokens;
}

function oldAssessed(source, starter) {
  return source.trim() !== starter.trim();
}

function currentAssessed(source, starter) {
  const actual = lex(source);
  const baseline = lex(starter);
  return actual.length !== baseline.length || actual.some((token, index) => token !== baseline[index]);
}

function settlesAfterTwo(classifier, source, starter) {
  let assessedFailingExecutions = 0;
  for (let press = 0; press < 2; press += 1) {
    if (classifier(source, starter)) assessedFailingExecutions += 1;
  }
  return assessedFailingExecutions >= 2;
}

const starter = "static int sample() { return 0; }";
const commentOnly = `${starter}\n// learner note`;

assert.equal(settlesAfterTwo(oldAssessed, commentOnly, starter), true, "old trim comparison wrongly settles after two comment-only runs");
assert.equal(settlesAfterTwo(currentAssessed, commentOnly, starter), false, "token comparison must not settle after comment-only runs");
assert.equal(currentAssessed("static int sample( ) {\n  return 0;\n}", starter), false, "formatting-only edits must not be assessed");
assert.equal(currentAssessed("static int sample() { return 1; }", starter), true, "a token change must remain assessable");
const passedSource = "static int sample() { return 1; }";
const formattedPass = "static int sample ( ) { /* same tokens */ return 1 ; }";
assert.equal(currentAssessed(formattedPass, passedSource), false, "a formatting/comment edit after a pass must stay token-equivalent and retain credit");
assert.equal(currentAssessed(starter, passedSource), true, "Reset code must detect a token-different starter and revoke stale credit");
assert.equal(currentAssessed('static String sample() { return "alpha"; }', 'static String sample() { return "beta"; }'), true, "token equivalence must preserve meaningful Java string contents");

function oldPostSettleRun(state) {
  state.runPresses += 1;
  state.assessedRuns += 1;
}

function currentEditorRun(state, { sourceChanged = false, passes = false } = {}) {
  if (state.done && state.result === "settled") return;
  if (state.done && sourceChanged) {
    state.done = false;
    state.credit = 0;
    state.grade = 0;
    state.pageComplete = false;
    state.recapVisible = false;
  }
  state.runPresses += 1;
  if (passes) {
    state.done = true;
    state.result = "correct";
    state.credit = 1;
    state.grade = 1;
  } else {
    state.assessedRuns += 1;
  }
}

const oldSettled = { done: true, runPresses: 2, assessedRuns: 2 };
oldPostSettleRun(oldSettled);
assert.deepEqual(oldSettled, { done: true, runPresses: 3, assessedRuns: 3 }, "old engine spends a third run after settlement");

const currentSettled = { done: true, result: "settled", runPresses: 2, assessedRuns: 2, credit: 0, grade: 0 };
currentEditorRun(currentSettled);
assert.deepEqual(currentSettled, { done: true, result: "settled", runPresses: 2, assessedRuns: 2, credit: 0, grade: 0 }, "settled activity must require Restart before another assessed run");

const editedPass = { done: true, result: "correct", runPresses: 1, assessedRuns: 0, credit: 1, grade: 1, pageComplete: true, recapVisible: true };
currentEditorRun(editedPass, { sourceChanged: true, passes: false });
assert.deepEqual(editedPass, { done: false, result: "correct", runPresses: 2, assessedRuns: 1, credit: 0, grade: 0, pageComplete: false, recapVisible: false }, "editing passed code must remove stale credit and page completion before a nonpassing run");
currentEditorRun(editedPass, { passes: true });
assert.equal(editedPass.done, true, "a real pass after invalidation must restore completion");
assert.equal(editedPass.credit, 1, "a real pass after invalidation must restore credit");

const topics = ["checked-vs-unchecked-exceptions", "try-catch-finally-and-try-with-resources", "custom-exceptions", "reading-stack-traces", "logging"];
const pages = await Promise.all(topics.map((topic) => readFile(new URL(`../../../../java-foundations/exceptions-and-logging/${topic}/artifact.html`, import.meta.url), "utf8")));
const engines = pages.map((page) => [...page.matchAll(/<script>([\s\S]*?)<\/script>/g)].map((match) => match[1]).find((script) => script.includes("Guidance state:")));
assert.ok(engines.every(Boolean), "every page must expose the shared engine bytes");
assert.ok(engines.every((engine) => engine === engines[0]), "all five pages must retain exact shared engine identity");
assert.match(engines[0], /S\.done\[edKey\]&&S\.results\[edKey\]==='settled'/, "shipped engine must block post-settle runs");
assert.match(engines[0], /invalidateEditorPass\('Your edit reopened this activity/, "shipped engine must invalidate stale post-pass credit after an edit");
assert.match(engines[0], /S\.done\[edKey\]&&!sameTokens\(src,edPassedSource\)/, "run-time invalidation must compare Java tokens, not formatting bytes");
assert.match(engines[0], /!sameTokens\(\$\('#ed'\)\.value,edPassedSource\)/, "input invalidation must preserve credit for comment and formatting-only edits");
assert.match(engines[0], /!sameTokens\(ED\.starter,edPassedSource\)/, "Reset code must invalidate a pass only when the starter changes Java tokens");

const checkedPage = pages[0];
assert.match(checkedPage, /h2\.ret\.trim\(\)===''/, "checked-exception evaluator must reject blank-after-trim fallback text");
assert.doesNotMatch(checkedPage, /open:'Target:/, "open-result copy must not duplicate the Target label");
for (const [index, page] of [[0, pages[0]], [2, pages[2]], [4, pages[4]]]) {
  assert.match(page, /function decodeJavaString\(token\)/, `bounded Java page ${index} must use the module-local Java string decoder`);
  assert.doesNotMatch(page, /JSON\.parse\((?:pk\(\)|t)\)/, `bounded Java page ${index} must not decode Java literals as JSON`);
  assert.match(page, /illegal escape character/, `bounded Java page ${index} must report illegal Java escapes truthfully`);
  assert.match(page, /Unicode escape changes Java tokenization/, `bounded Java page ${index} must label pre-lexing Unicode edge cases as unsupported`);
}

const resourcePage = pages[1];
assert.match(resourcePage, /data-pep-answer-targets="useBoth"/, "Activity 4 must declare composed Java production");
assert.match(resourcePage, /id="twr-ed"/, "Activity 4 must use a composed editor rather than a selector builder");
assert.doesNotMatch(resourcePage, /id="twr-(?:open|resources|body|check)"/, "finished-piece selector controls must remain removed");
assert.match(resourcePage, /Blank construction is unassessed and uses no output attempt/, "blank construction must stay outside output attempts");
assert.match(resourcePage, /Invalid or unsupported construction is unassessed and uses no output attempt/, "invalid construction must stay outside output attempts");
assert.doesNotMatch(resourcePage, /Expected .* near piece|raw parser|JSON\.parse\(literal\)|JSON\.parse\(message\)/, "Activity 4 must not expose a token oracle or parser internals");
assert.match(resourcePage, /The block body must perform the requested action exactly once while both resources are open\./, "non-goal bodies need one concept-level diagnostic");
const bodyDiagnostic = resourcePage.match(/fail\('invalid','([^']*requested action[^']*)'\)/)?.[1] ?? "";
assert.ok(bodyDiagnostic && !/System|println|use|piece|token|[(){};]/.test(bodyDiagnostic), "the public non-goal-body diagnostic must reveal no solution token");
assert.match(resourcePage, /InputStream source.*OutputStream sink.*semicolon.*sink.*source/s, "teaching must explain one shared header, semicolon separation and reverse close with different names");
assert.match(resourcePage, /Not supported in this practice editor: qualified resource types/, "qualified types must be labeled as a bounded-model limit, not a Java syntax error");
assert.match(resourcePage, /JAVA_WORD\.test\(variable\)/, "resource names must reject Java keywords and literals");
assert.match(resourcePage, /variable==='System'/, "the bounded composer must reject shadowing System");
assert.match(resourcePage, /while\(parts\.length&&parts\[parts\.length-1\]\.length===0\)parts\.pop\(\)/, "the bounded composer must accept an optional trailing resource semicolon");
assert.match(resourcePage, /variable!=='_'/, "the bounded composer must accept Java 25 unnamed resources");
assert.match(resourcePage, /function parseResource\(part,label\)/, "Activity 4 must check declarations structurally");
assert.match(resourcePage, /function splitResources\(header\)/, "Activity 4 must structurally separate the shared resource header");
assert.doesNotMatch(resourcePage, /function need\(|var body=\['System'|Expected .* near piece/, "Activity 4 must not keep a take-token success oracle or answer-shaped token template");
assert.doesNotMatch(resourcePage, /try \(Res left = new Res\("left"\)|new Res\("right"\)/, "the output retry must not publish a two-resource construction recipe");
assert.match(resourcePage, /a resource named <code>left<\/code> opens, then one named <code>right<\/code> opens/, "the retry must remain an output-only reasoning prompt");
assert.match(resourcePage, /Expected output after a valid construction: open a, open b, use, close b, close a/, "the static alternative must preserve the output-only answer");
assert.match(resourcePage, /<noscript[\s\S]*?<strong>Expected output:<\/strong>[\s\S]*?close b[\s\S]*?close a/, "the no-JavaScript reading version must preserve output and explanation without construction code");
assert.match(resourcePage, /#twr-output \{ display: block !important; \}[\s\S]*?#apply::after \{ content: attr\(data-static-alt\)/, "print must show the output-only static alternative in reading order while hiding inert controls");
assert.match(resourcePage, /function updateOutputStatus\(\)/, "Activity 4 status must track output attempts separately from construction checks");

console.log("public editor and composed-production regressions passed");
