import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { isBalanced, isRecurring } from "../tools/gift/answer-order.mjs";
import {
  answerKeys,
  correctSequence,
  isHtmlAnswerOrderPermutation,
  loadPages,
  optionBlocks,
  planPages,
  reorderPage,
  rewriteKeyboardSteps,
} from "../tools/html/answer-order.mjs";

const repo = path.resolve(import.meta.dirname, "../..");

const option = (name, value, text) =>
  `<label class="opt"><input type="radio" name="${name}" value="${value}"> <span>${text}</span></label>`;
const group = (name, texts, cls = "opts") =>
  `<div class="${cls}">${texts.map(([value, text]) => option(name, value, text)).join("")}</div>`;
const body = [
  "<section><h2>Predict</h2>",
  group("predict", [["a", "400px <code>right</code>"], ["b", "200px"], ["c", "300px"], ["d", "100px"]]),
  "</section><section><h2>Apply</h2>",
  group("apply-a", [["a", "flex-grow 1 on the field"], ["b", "space-between"], ["c", "align-items"], ["d", "both grow"]], "opts one"),
  group("conf", [["low", "Low"], ["high", "High"]]),
  group("apply-b", [["a", "The field takes it all"], ["b", "They share it"], ["c", "A gap"], ["d", "Taller rows"]], "opts one"),
  "</section>",
].join("\n");
const topic = "var TOPIC={predict:{correct:'a',why:{}},apply:{A:{fs:'apply-a',correct:'a'},B:{fs:'apply-b',correct:'a'}}};";

test("answer keys and option blocks are read from TOPIC data and opts blocks", () => {
  const keys = answerKeys(topic);
  assert.deepEqual([...keys], [["predict", "a"], ["apply-a", "a"], ["apply-b", "a"]]);
  assert.deepEqual(optionBlocks(body).map((block) => block.group), ["predict", "apply-a", "conf", "apply-b"]);
  assert.equal(correctSequence(body, keys), "AAA");
});

test("reorderPage moves only the correct label and keeps distractor order", () => {
  const keys = answerKeys(topic);
  const output = reorderPage(body, keys, "DBC");
  assert.equal(correctSequence(output, keys), "DBC");
  assert.ok(isHtmlAnswerOrderPermutation(body, output));
  const predict = optionBlocks(output)[0].values;
  assert.deepEqual(predict, ["b", "c", "d", "a"]);
  const unkeyed = (text) => optionBlocks(text).find((block) => block.group === "conf").labels;
  assert.deepEqual(unkeyed(output), unkeyed(body), "groups without an answer key are untouched");
  assert.throws(() => reorderPage(body, keys, "DB"), /sequence length/);
  assert.throws(() => reorderPage(body, keys, "DBE"), /invalid target/);
});

test("the permutation proof rejects anything but whole-label moves", () => {
  const keys = answerKeys(topic);
  const permuted = reorderPage(body, keys, "CAB");
  const cases = {
    "option text drift": permuted.replace("200px", "250px"),
    "value drift": permuted.replace('name="predict" value="b"', 'name="predict" value="x"'),
    "outside drift": permuted.replace("<h2>Apply</h2>", "<h2>Apply it</h2>"),
    "whitespace slot drift": permuted.replace('</label><label class="opt"><input type="radio" name="apply-b"', '</label>\n<label class="opt"><input type="radio" name="apply-b"'),
    "label removed": permuted.replace(option("apply-b", "c", "A gap"), ""),
    "block class drift": permuted.replace('<div class="opts one">', '<div class="opts">'),
  };
  for (const [label, bytes] of Object.entries(cases)) {
    assert.notEqual(bytes, permuted, label);
    assert.equal(isHtmlAnswerOrderPermutation(body, bytes), false, label);
  }
  const crossGroup = body
    .replace(option("predict", "b", "200px"), option("apply-a", "b", "200px"))
    .replace(option("apply-a", "b", "space-between"), option("predict", "b", "space-between"));
  assert.equal(isHtmlAnswerOrderPermutation(body, crossGroup), false, "labels never move between groups");
});

test("keyboard focus steps follow the new option order and still reach the expected option", () => {
  const keys = answerKeys(topic);
  const reordered = reorderPage(body, keys, "CAB");
  const route = {
    keyboard: {
      steps: [
        { do: "press", selector: "body", key: "Tab" },
        { do: "expectFocus", selector: "input[name=predict][value=a]" },
        { do: "press", selector: "input[name=predict][value=a]", key: "Space" },
        { do: "press", selector: "#teach", key: "Tab" },
        { do: "expectFocus", selector: "input[name=apply-a][value=a]" },
        { do: "expectFocus", selector: "input[name=conf][value=low]" },
      ],
    },
  };
  const { qaPaths, rewritten } = rewriteKeyboardSteps(route, reordered, keys);
  assert.equal(rewritten, 1, "apply-a keeps value a first under CAB, so only predict moves");
  assert.deepEqual(qaPaths.keyboard.steps.slice(0, 7), [
    { do: "press", selector: "body", key: "Tab" },
    { do: "expectFocus", selector: "input[name=predict][value=b]" },
    { do: "press", selector: "input[name=predict][value=b]", key: "ArrowDown" },
    { do: "expectFocus", selector: "input[name=predict][value=c]" },
    { do: "press", selector: "input[name=predict][value=c]", key: "ArrowDown" },
    { do: "expectFocus", selector: "input[name=predict][value=a]" },
    { do: "press", selector: "input[name=predict][value=a]", key: "Space" },
  ]);
  assert.equal(rewriteKeyboardSteps(qaPaths, reordered, keys).rewritten, 0, "rewriting is idempotent");
  assert.equal(rewriteKeyboardSteps(route, body, keys).rewritten, 0, "nothing changes while the order is unchanged");
  const backwards = { steps: [{ do: "press", selector: "#x", key: "Shift+Tab" }, { do: "expectFocus", selector: "input[name=predict][value=a]" }] };
  assert.throws(() => rewriteKeyboardSteps(backwards, reordered, keys), /Shift\+Tab/);
});

test("planPages gives each page a distinct balanced sequence and balances the module", () => {
  const keys = answerKeys(topic);
  const pages = Array.from({ length: 7 }, (_, index) => ({
    path: `authoring/evidence/c/m/page-build/src/t${index}.body.html`,
    module: "c/m",
    text: body,
    keys,
    sequence: "AAA",
  }));
  const plan = planPages(pages);
  const sequences = pages.map((page) => plan.get(page.path));
  assert.equal(new Set(sequences).size, pages.length);
  for (const sequence of sequences) assert.ok(isBalanced(sequence) && !isRecurring(sequence), sequence);
  const counts = [..."ABCD"].map((letter) => [...sequences.join("")].filter((value) => value === letter).length);
  assert.ok(Math.max(...counts) - Math.min(...counts) <= 1, counts.join(" "));
});

test("every tracked page source and its built pages parse, and their plans reorder cleanly", async () => {
  const pages = await loadPages(repo);
  assert.ok(pages.length > 0);
  const plan = planPages(pages);
  for (const page of pages) {
    const output = reorderPage(page.text, page.keys, plan.get(page.path));
    assert.ok(isHtmlAnswerOrderPermutation(page.text, output), page.path);
  }
  for (const page of pages.filter((item) => item.module === "html-css-js/html-and-css")) {
    const topicId = path.basename(page.path, ".body.html");
    const built = await readFile(path.join(repo, "html-css-js/html-and-css", topicId, "artifact.html"), "utf8");
    assert.equal(optionBlocks(built).length, optionBlocks(page.text).length, topicId);
    assert.ok(isHtmlAnswerOrderPermutation(built, built), topicId);
  }
});
