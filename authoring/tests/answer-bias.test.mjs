import assert from "node:assert/strict";
import path from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";
import { ENFORCE_POSITION } from "../tools/checks/T26-answer-bias.mjs";
import { lengthSummary, positionProblems, visibleText } from "../tools/qa/answer-bias.mjs";

const repo = path.resolve(import.meta.dirname, "../..");
const q = (position, longest = false) => ({ source: "x", position, longest });
const page = (file, sequence, module = "c/m") => ({
  kind: "page",
  path: file,
  module,
  sequence,
  questions: [...sequence].map((letter) => q(letter)),
});

test("visibleText strips tags and decodes entities before lengths are compared", () => {
  assert.equal(visibleText('<input type="radio" value="a"> <span><code>a &lt; b</code>&nbsp;ok</span>'), "a < b ok");
});

test("positionProblems flags unbalanced pages, unbalanced modules and single-position GIFT banks", () => {
  const balanced = ["DBA", "CBD", "BCA", "DAC", "BDA", "CAD", "ACB"].map((sequence, index) => page(`p${index}`, sequence));
  assert.deepEqual(positionProblems(balanced), []);
  const allA = positionProblems([page("a.body.html", "AAA"), page("b.body.html", "AAA")]);
  assert.deepEqual(allA.map((problem) => problem.path), [
    "a.body.html",
    "b.body.html",
    "authoring/evidence/c/m/page-build/src",
  ]);
  assert.match(allA[0].message, /AAA/);
  const recurring = positionProblems([page("r.body.html", "ABC")]);
  assert.equal(recurring.length, 1, "a +1 cycle is a recurring pattern");
  const gift = (sequence) => ({ kind: "gift", path: "c/m/t/artifact.gift", module: "c/m", sequence, questions: [] });
  assert.equal(positionProblems([gift("BBBB")]).length, 1);
  assert.equal(positionProblems([gift("BB")]).length, 0, "short banks are not judged");
  assert.equal(positionProblems([gift("ABCDBADC")]).length, 0);
});

test("lengthSummary counts how often the correct option is strictly the longest", () => {
  const banks = [
    { kind: "gift", questions: [q("A", true), q("B", false), q("C", true), q("D", false)] },
    { kind: "page", questions: [q("A", true)] },
  ];
  assert.deepEqual(lengthSummary(banks, "gift"), { questions: 4, longest: 2, share: 0.5 });
  assert.deepEqual(lengthSummary(banks, "page"), { questions: 1, longest: 1, share: 1 });
});

test("T26 reports and passes while position enforcement is off", () => {
  assert.equal(ENFORCE_POSITION, false, "flip only after every page-build module is planned");
  const result = spawnSync(process.execPath, [path.join(repo, "authoring/tools/pep"), "check", "--only", "T26"], {
    cwd: repo,
    encoding: "utf8",
  });
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /T26 report: correct option strictly longest/);
});
