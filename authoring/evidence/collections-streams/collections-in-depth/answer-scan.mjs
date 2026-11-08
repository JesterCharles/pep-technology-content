#!/usr/bin/env node
// Whole-document answer and private-material scan for the Sorting with Comparator learner files.
// Reads the raw bytes of artifact.html (text, attributes, scripts, styles, comments, noscript), artifact.md and
// artifact.gift, normalizes HTML entities, JavaScript escapes and literal string concatenation, extracts every
// sort statement, and runs each one through the page's own Activity 2 editor: any statement the page credits is a
// leaked answer. No answer, pattern or derivative of one is stored here. When PEP_COMPARATOR_POSITIVES_FILE names an
// absolute uncommitted private file outside the repository, each private successful statement is also compared
// exactly and whitespace-collapsed against every decoded file. Answer-key, rubric, hidden-test and reference-solution
// material fails as before. Nothing private is printed.
// Run from the repository root: node authoring/evidence/collections-streams/collections-in-depth/answer-scan.mjs
import { readFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { launchChromium } from "../../../tools/qa/harness.mjs";

const topic = path.join(process.cwd(), "collections-streams/collections-in-depth/sorting-with-comparator");
const decode = (text) => text
  .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&amp;/g, "&")
  .replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
  .replace(/\\x([0-9a-fA-F]{2})/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
  .replace(/'\s*\+\s*'|"\s*\+\s*"/g, "");
const flat = (text) => text.replace(/\s+/g, "");
const PRIVATE = /data-(pep-)?(solution|answer-key|rubric|secret-test|reference-implementation)|reference solution|answer key|hidden test|instructor solution/i;
const statements = (text) => [...new Set((text.match(/[A-Za-z_.]*sort\s*\([^;\n]{0,400}?\)\s*;/g) ?? []).map((item) => item.trim()))];
let positives = [];
if (process.env.PEP_COMPARATOR_POSITIVES_FILE) {
  const file = path.resolve(process.env.PEP_COMPARATOR_POSITIVES_FILE);
  if (!path.isAbsolute(process.env.PEP_COMPARATOR_POSITIVES_FILE) || !path.relative(process.cwd(), file).startsWith("..")) {
    console.error("PEP_COMPARATOR_POSITIVES_FILE must be an absolute path outside the repository");
    process.exit(1);
  }
  positives = JSON.parse(await readFile(file, "utf8"));
}
const failures = [];
const files = [];
for (const name of ["artifact.html", "artifact.md", "artifact.gift"]) {
  const text = await readFile(path.join(topic, name), "utf8").catch(() => null);
  if (text == null) continue;
  files.push({ name, text, decoded: decode(text) });
  if (PRIVATE.test(text)) failures.push(`${name}: contains answer-key, rubric, hidden-test or solution material`);
  for (const [index, value] of positives.entries()) {
    if (text.includes(value) || flat(decode(text)).includes(flat(value))) failures.push(`${name}: contains private successful statement #${index + 1}`);
  }
}
if (files.length < 3) failures.push(`expected 3 learner files, scanned ${files.length}`);
const browser = await launchChromium();
let tested = 0;
try {
  const page = await browser.newPage();
  await page.goto(pathToFileURL(path.join(topic, "artifact.html")).href);
  await page.locator('input[name=predict][value="nat"]').check();
  await page.locator("input[name=conf0][value=medium]").check();
  await page.locator("#predict-check").click();
  await page.locator("#next").click();
  for (const file of files) {
    for (const statement of statements(file.decoded)) {
      tested++;
      await page.locator("#ed").fill(statement);
      await page.locator("#sort").click();
      if ((await page.locator("#activity-2").getAttribute("data-pep-credit")) === "1") failures.push(`${file.name}: a statement in this file earns Activity 2 credit`);
      await page.locator("#reset").click();
    }
  }
} finally {
  await browser.close();
}
if (failures.length) {
  console.error(failures.join("\n"));
  process.exitCode = 1;
} else {
  console.log(`answer scan: ${files.length} learner files, ${tested} sort statements run through the page, none credited; no private material${positives.length ? `; ${positives.length} private statements absent` : ""}`);
}
