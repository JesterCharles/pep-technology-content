import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import {
  convertCodeBlocks,
  entityCodeNewlines,
  literalCodeNewlines,
  numericCodeNewlines,
  NUMERIC_NEWLINE,
  unsafeCodeLines,
} from "../tools/gift/code-newlines.mjs";
import { parseGift, validateGift } from "../tools/gift/validate.mjs";

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

// The four captain-approved Foundation course-final MCQ banks, checked as the exact bytes that ship.
// Collections & Streams declares its own Moodle category; the other three use their folder path.
const FOUNDATION_BANKS = {
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

// The course-final contract: the bank holds exactly the blueprint's MCQ count, and the blueprint allows
// at least one minute per question. Foundation banks hold 30; a registered course final sets its own
// count (Spring Boot: 30 questions in its 30 minutes), so the per-letter key floor is floor(N/4).
const FOUNDATION_QUESTIONS = 30;

const readJson = async (file) => JSON.parse(await readFile(path.join(repo, file), "utf8"));

// A Standard/Fast course final lives at <course>/assessments/<id>/final-mcq.gift, where <id> is a
// graded MCQ assessment the course manifest registers. Its blueprint sets the contract it must meet.
async function courseFinal(file) {
  const match = file.match(/^([a-z0-9]+(?:-[a-z0-9]+)*)\/assessments\/([a-z0-9]+(?:-[a-z0-9]+)*)\/final-mcq\.gift$/);
  if (!match) return null;
  const [, course, id] = match;
  let manifest;
  let blueprint;
  try {
    manifest = await readJson(`authoring/catalog/${course}/course.json`);
    blueprint = await readJson(`${course}/assessments/${id}/blueprint.json`);
  } catch {
    return null;
  }
  if (!(manifest.assessments ?? []).includes(id) || blueprint.id !== id || blueprint.kind !== "gradedMcq") return null;
  return { category: `${course}/assessments/${id}`, html: true, blueprint };
}

const trackedBanks = () =>
  execFileSync("git", ["ls-files", "--", "*/assessments/*/final-mcq.gift"], { cwd: repo, encoding: "utf8" })
    .split("\n")
    .filter(Boolean)
    .sort();

const courseFinals = {};
for (const file of trackedBanks()) {
  if (FOUNDATION_BANKS[file]) continue;
  const final = await courseFinal(file);
  if (final) courseFinals[file] = final;
}

test("every tracked course-final bank is a Foundation bank or a registered graded course final", () => {
  const tracked = trackedBanks();
  for (const file of Object.keys(FOUNDATION_BANKS)) assert.ok(tracked.includes(file), `${file} is no longer tracked`);
  assert.deepEqual(tracked, [...Object.keys(FOUNDATION_BANKS), ...Object.keys(courseFinals)].sort());
});

test("only a manifest-registered gradedMcq assessment can hold a course-final bank", async () => {
  assert.equal(await courseFinal("html-css-js/assessments/web-client-practical/final-mcq.gift"), null, "practical, not gradedMcq");
  assert.equal(await courseFinal("html-css-js/assessments/not-registered/final-mcq.gift"), null, "unregistered id");
  assert.equal(await courseFinal("html-css-js/html-and-css/assessments/x/final-mcq.gift"), null, "module-level path");
  assert.equal(await courseFinal("html-css-js/assessments/web-client-mcq/other.gift"), null, "other file name");
});

for (const [file, { blueprint }] of Object.entries(courseFinals)) {
  test(`${file} meets the course-final contract in its blueprint`, () => {
    const count = blueprint.itemCounts?.MCQ;
    assert.ok(Number.isInteger(count) && count >= 20 && count <= 30, `blueprint MCQ count ${count} is outside 20 to 30`);
    assert.ok(
      Number.isInteger(blueprint.durationMinutes) && blueprint.durationMinutes >= count,
      `blueprint allows ${blueprint.durationMinutes} minutes for ${count} questions`,
    );
  });
}

const BANKS = { ...FOUNDATION_BANKS, ...courseFinals };

for (const [file, { category, html, blueprint }] of Object.entries(BANKS)) {
  const expected = blueprint ? blueprint.itemCounts.MCQ : FOUNDATION_QUESTIONS;
  test(`${file} validates raw in its declared format`, async () => {
    const bytes = await readFile(path.join(repo, file));
    if (html) {
      // The plain-text rule still fires on the real bytes; only the opt-in [html] mode accepts them.
      assert.throws(() => validateGift(bytes, category), /must not contain < or >/);
    }
    const questions = validateGift(bytes, category, { html });
    assert.equal(questions.length, expected);
    const lines = bytes.toString("ascii").split("\n");
    const comments = lines.filter((line) => line.trimStart().startsWith("//"));
    for (const line of comments)
      assert.doesNotMatch(line, /PROTECTED|never commit|not for learners|private route/i, "obsolete private-bank header");
    // GIFT import drops every line that starts with //, so only the leading header may use one;
    // a code line inside a question that starts with // must be written &\#47;/ (or follow &nbsp; indentation) to survive import.
    const header = lines.findIndex((line) => !line.startsWith("//"));
    const dropped = lines
      .map((line, index) => (index >= header && line.trimStart().startsWith("//") ? index + 1 : 0))
      .filter(Boolean);
    assert.deepEqual(dropped, [], "question lines that GIFT import would drop as comments");
    if (html) {
      // Code blocks use actual line breaks; numeric &\#10; references are the retired form.
      const text = bytes.toString("ascii");
      assert.deepEqual(numericCodeNewlines(text), [], "numeric newline references in code");
      // Indentation-safe: an importer that trims each physical line must not change any code line.
      assert.deepEqual(unsafeCodeLines(text), [], "code lines that start or end with whitespace, are blank or start with //");
    }
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
    for (const letter of "ABCD") assert.ok((positions[letter] ?? 0) >= Math.floor(expected / 4), `${letter} keyed ${positions[letter] ?? 0} times`);
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

// Code-block line breaks: the indentation-safe literal form must parse to the same questions as
// the numeric-reference form, show the same code with and without per-line trimming, and invert.
const codeBank = (body) => Buffer.from(`// header\n$CATEGORY: ${htmlCategory}\n\n${body}\n`, "ascii");
const entityBody = [
  "::c1::[html]<p>What prints?</p><pre><code>class A \\{&\\#10;    int x \\= 1;&\\#10;&\\#10;    // note: x \\~ y&\\#10;    void m() \\{ if (x &gt; 0 &amp;&amp; y &lt; 2) \\{\\} \\}&\\#10;// end&\\#10;\\}</code></pre>{",
  "=<code>1</code>#Correct. \\{ok\\}",
  "~<code>2</code>#Not quite. no \\#",
  "~<code>3</code>#Not quite. no",
  "}",
  "",
  "::c2::[html]<p>Which query?</p><pre><code>// first line comment&\\#10;SELECT a&\\#10;  FROM t&\\#10;&\\#10;  WHERE b \\= 2;</code></pre>{",
  "~<code>a</code>#Not quite. no",
  "=<code>b</code>#Correct. yes",
  "}",
].join("\n");

const shape = (questions, form) =>
  questions.map(({ category, title, stem, options }) => ({
    category,
    title,
    stem: form === "entity" ? stem : convertCodeBlocks(stem, form, "entity", { escaped: false }),
    options,
  }));

// What a reader sees: optional per-physical-line trim (as Moodle's importer does), then GIFT
// parsing, then HTML decoding of each <pre> block into visible lines.
const visibleCode = (body, trim) => {
  const text = trim ? body.split("\n").map((line) => line.trim()).join("\n") : body;
  return parseGift(codeBank(text), { html: true }).flatMap((question) =>
    [...question.stem.matchAll(/<pre>([\s\S]*?)<\/pre>/g)].map((match) =>
      match[1]
        .replace(/^<code>([\s\S]*)<\/code>$/, "$1")
        .replaceAll("&#10;", "\n")
        .replaceAll("&#47;", "/")
        .replaceAll("&nbsp;", " ")
        .replaceAll("&lt;", "<")
        .replaceAll("&gt;", ">")
        .replaceAll("&amp;", "&")
        .split("\n")
        .map((line) => line.trimEnd()),
    ),
  );
};

test("indentation-safe code-block line breaks keep every parsed field and invert exactly", () => {
  const safeBody = literalCodeNewlines(entityBody);
  assert.equal(entityCodeNewlines(safeBody), entityBody, "inverse reproduces the entity form byte for byte");
  assert.equal(safeBody.match(NUMERIC_NEWLINE), null);
  assert.match(safeBody, /\n&nbsp;\n/, "visually blank code line becomes &nbsp;");
  assert.match(safeBody, /\n&nbsp;   int x \\= 1;/, "first indent space becomes &nbsp;, the rest stay");
  assert.match(safeBody, /\n&nbsp;   \/\/ note/, "indented comment is protected without an extra column");
  assert.match(safeBody, /\n&\\#47;\/ end/, "unindented comment becomes &\\#47;/ without an extra column");
  assert.match(safeBody, /<pre><code>\/\/ first line comment/, "first code line shares the <pre><code> line and is unchanged");
  assert.match(safeBody, /class A \\\{\n/, "escaped braces and operators survive");
  const before = validateGift(codeBank(entityBody), htmlCategory, { html: true });
  const after = validateGift(codeBank(safeBody), htmlCategory, { html: true });
  assert.equal(after.length, 2);
  assert.deepEqual(shape(after, "safe"), shape(before, "entity"));
  assert.deepEqual(after.map((q) => q.options), before.map((q) => q.options));
  assert.ok(after.every((q) => q.stem.includes("\n")), "stems carry multiline code");
});

// The same questions with their code in plain <pre> blocks instead of <pre><code>.
const plainPreBody = entityBody.replaceAll("<pre><code>", "<pre>").replaceAll("</code></pre>", "</pre>");

test("numeric newline detection covers plain <pre> and <pre><code> blocks, not other text", () => {
  const outside = "[html]<p>outside &\\#10; reference</p>";
  assert.deepEqual(numericCodeNewlines(outside), [], "a reference outside <pre> stays permitted");
  assert.deepEqual(numericCodeNewlines(`${outside}<pre>a&\\#10;b</pre>`), ["&\\#10;"], "plain <pre>");
  assert.deepEqual(numericCodeNewlines(`${outside}<pre><code>a&\\#10;b</code></pre>`), ["&\\#10;"], "<pre><code>");
  assert.equal(numericCodeNewlines(entityBody).length, numericCodeNewlines(plainPreBody).length);
  assert.ok(numericCodeNewlines(plainPreBody).length > 0);
  assert.equal(literalCodeNewlines(outside), outside, "text outside <pre> is not converted");
});

test("plain <pre> and <pre><code> convert alike: trim-safe, inverse-exact and parse-equivalent", () => {
  for (const body of [entityBody, plainPreBody]) {
    const safeBody = literalCodeNewlines(body);
    assert.deepEqual(numericCodeNewlines(safeBody), []);
    assert.deepEqual(unsafeCodeLines(safeBody), []);
    assert.ok(unsafeCodeLines(body.replaceAll("&\\#10;", "\n")).length > 0, "unguarded literal lines are caught");
    assert.equal(entityCodeNewlines(safeBody), body, "inverse reproduces the entity form byte for byte");
    const before = validateGift(codeBank(body), htmlCategory, { html: true });
    const after = validateGift(codeBank(safeBody), htmlCategory, { html: true });
    assert.deepEqual(shape(after, "safe"), shape(before, "entity"));
    assert.deepEqual(visibleCode(safeBody, true), visibleCode(body, false));
  }
  assert.deepEqual(visibleCode(literalCodeNewlines(plainPreBody), true), visibleCode(entityBody, false));
  assert.equal(
    literalCodeNewlines(plainPreBody),
    literalCodeNewlines(entityBody).replaceAll("<pre><code>", "<pre>").replaceAll("</code></pre>", "</pre>"),
  );
});

test("indentation-safe code shows the same code and indentation with or without per-line trimming", () => {
  const safeBody = literalCodeNewlines(entityBody);
  const reference = visibleCode(entityBody, false);
  assert.equal(reference.length, 2);
  assert.ok(reference[0].some((line) => line.startsWith("    ")), "reference has indented code");
  assert.deepEqual(visibleCode(safeBody, false), reference);
  assert.deepEqual(visibleCode(safeBody, true), reference);
  // Counterfactual: the earlier literal form (&nbsp; only before //) loses indentation
  // under trimming and shows its comments one column to the right even untrimmed.
  const plain = convertCodeBlocks(entityBody, "entity", "nbsp");
  assert.notDeepEqual(visibleCode(plain, true), reference);
  assert.equal(visibleCode(plain, true)[0][1], "int x = 1;");
  assert.equal(visibleCode(plain, false)[0][3], "     // note: x ~ y");
});

test("unguarded blank or // code lines would break GIFT import", () => {
  const raw = entityBody.replaceAll("&\\#10;", "\n");
  assert.throws(() => parseGift(codeBank(raw), { html: true }), /answer block|title/);
  const commentOnly = entityBody.replaceAll("&\\#10;&\\#10;", "&\\#10;&nbsp;&\\#10;").replaceAll("&\\#10;", "\n");
  const dropped = parseGift(codeBank(commentOnly), { html: true });
  assert.equal(dropped[0].stem.includes("// note"), false, "a bare // code line is dropped as a GIFT comment");
});
