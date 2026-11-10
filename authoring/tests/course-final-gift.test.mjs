import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { validateGift } from "../tools/gift/validate.mjs";

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

// The four captain-approved Foundation course-final MCQ banks, checked as the exact bytes that ship.
// Collections & Streams declares its own Moodle category; the other three use their folder path.
const BANKS = {
  "collections-streams/assessments/collections-module-check/final-mcq.gift": {
    category: "collections-streams/final-mcq",
    html: true,
  },
  "git-linux-ai-foundations/assessments/tooling-module-check/final-mcq.gift": {
    category: "git-linux-ai-foundations/assessments/tooling-module-check",
    html: false,
  },
  "java-foundations/assessments/java-module-check/final-mcq.gift": {
    category: "java-foundations/assessments/java-module-check",
    html: true,
  },
  "sql-jdbc-foundations/assessments/sql-module-check/final-mcq.gift": {
    category: "sql-jdbc-foundations/assessments/sql-module-check",
    html: true,
  },
};

test("exactly the four approved course-final banks are tracked", () => {
  const tracked = execFileSync("git", ["ls-files", "--", "*/assessments/*/final-mcq.gift"], {
    cwd: repo,
    encoding: "utf8",
  })
    .split("\n")
    .filter(Boolean)
    .sort();
  assert.deepEqual(tracked, Object.keys(BANKS).sort());
});

for (const [file, { category, html }] of Object.entries(BANKS)) {
  test(`${file} validates raw in its declared format`, async () => {
    const bytes = await readFile(path.join(repo, file));
    if (html) {
      // The plain-text rule still fires on the real bytes; only the opt-in [html] mode accepts them.
      assert.throws(() => validateGift(bytes, category), /must not contain < or >/);
    }
    const questions = validateGift(bytes, category, { html });
    assert.equal(questions.length, 30);
    const positions = {};
    let previous;
    let run = 0;
    let longest = 0;
    for (const question of questions) {
      assert.equal(question.options.length, 4);
      const letter = "ABCD"[question.options.findIndex((option) => option.correct)];
      positions[letter] = (positions[letter] ?? 0) + 1;
      run = letter === previous ? run + 1 : 1;
      previous = letter;
      longest = Math.max(longest, run);
    }
    for (const letter of "ABCD") assert.ok((positions[letter] ?? 0) >= 7, `${letter} keyed ${positions[letter] ?? 0} times`);
    assert.ok(longest <= 2, `longest repeated key run is ${longest}`);
  });
}

const htmlCategory = "demo/final";
const htmlQuestion = (stem, answer = "<code>a</code>", title = "q1") =>
  Buffer.from(
    `$CATEGORY: ${htmlCategory}\n\n::${title}::${stem}{\n=${answer}#Correct. yes\n~<code>b</code>#Not quite. no\n}\n`,
    "ascii",
  );

test("[html] mode accepts bare p/pre/code tags and entity-escaped code", () => {
  const bytes = htmlQuestion("[html]<p>Is <code>x &lt; y &amp;&amp; z</code> true?</p><pre><code>a&#10;b</code></pre>");
  assert.equal(validateGift(bytes, htmlCategory, { html: true }).length, 1);
});

const htmlFailures = [
  ["a literal < in code", htmlQuestion("[html]<p><code>x < y</code></p>"), /write literal < and > as &lt; and &gt;/],
  ["a disallowed tag", htmlQuestion("[html]<script>x</script>"), /only bare <p>, <pre> and <code>/],
  ["a tag with attributes", htmlQuestion("[html]<p class=x>x</p>"), /only bare <p>, <pre> and <code>/],
  ["unbalanced markup", htmlQuestion("[html]<p><code>x</p></code>"), /unbalanced <p> markup/],
  ["an unclosed tag", htmlQuestion("[html]<pre>x"), /leaves <pre> unclosed/],
  ["an unknown entity", htmlQuestion("[html]<p>x &foo; y</p>"), /entity other than/],
  ["a missing [html] marker", htmlQuestion("<p>x</p>"), /\[html\] format marker/],
  ["markup in the title", htmlQuestion("[html]<p>x</p>", "<code>a</code>", "a<b"), /title must not contain/],
  ["a literal > in an option", htmlQuestion("[html]<p>x</p>", "a > b"), /option 1 may use only bare/],
];

for (const [label, bytes, message] of htmlFailures) {
  test(`[html] mode rejects ${label}`, () => {
    assert.throws(() => validateGift(bytes, htmlCategory, { html: true }), message);
  });
}

test("the default topic-quiz mode still rejects any < or >", () => {
  const bytes = htmlQuestion("[html]<p>x</p>");
  assert.throws(() => validateGift(bytes, htmlCategory), /must not contain < or >/);
});
