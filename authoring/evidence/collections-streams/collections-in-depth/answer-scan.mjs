#!/usr/bin/env node
// Whole-document answer and private-material scan for the Sorting with Comparator learner files.
// Reads the raw bytes of artifact.html (text, attributes, scripts, styles, comments, noscript),
// artifact.md and artifact.gift, normalizes HTML entities and JavaScript string escapes, and fails
// if any file contains a Player comparator that orders by score highest first and then by name
// (the Activity 2 answer), or answer-key, rubric, hidden-test or reference-solution material.
// Run from the repository root: node authoring/evidence/collections-streams/collections-in-depth/answer-scan.mjs
import { readFile } from "node:fs/promises";
import path from "node:path";

const topic = path.join(process.cwd(), "collections-streams/collections-in-depth/sorting-with-comparator");
const decode = (text) => text
  .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&amp;/g, "&")
  .replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
  .replace(/\\x([0-9a-fA-F]{2})/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
  .replace(/'\s*\+\s*'|"\s*\+\s*"/g, "");
const flat = (text) => decode(text).replace(/\s+/g, "");
const ANSWER = [
  /comparing(Int)?\((Player::score|\w+->\w+\.score\(\))\)\.reversed\(\)\.thenComparing\((Player::name|\w+->\w+\.name\(\)|Comparator\.comparing\((Player::name|\w+->\w+\.name\(\))\))\)/,
  /comparing(Int)?\((Player::score|\w+->\w+\.score\(\)),Comparator\.reverseOrder\(\)\)\.thenComparing\((Player::name|\w+->\w+\.name\(\))/,
  /nullsLast\(Comparator\.comparing(Int)?\(Player::score\)/,
];
const PRIVATE = /data-(pep-)?(solution|answer-key|rubric|secret-test|reference-implementation)|reference solution|answer key|hidden test|instructor solution/i;
const failures = [];
let scanned = 0;
for (const name of ["artifact.html", "artifact.md", "artifact.gift"]) {
  const text = await readFile(path.join(topic, name), "utf8").catch(() => null);
  if (text == null) continue;
  scanned++;
  const compact = flat(text);
  for (const pattern of ANSWER) if (pattern.test(compact)) failures.push(`${name}: contains the Activity 2 or challenge answer (${pattern})`);
  if (PRIVATE.test(text)) failures.push(`${name}: contains answer-key, rubric, hidden-test or solution material`);
}
if (scanned < 3) failures.push(`expected 3 learner files, scanned ${scanned}`);
if (failures.length) {
  console.error(failures.join("\n"));
  process.exitCode = 1;
} else {
  console.log(`answer scan: ${scanned} learner files carry no comparator answer or private material`);
}
