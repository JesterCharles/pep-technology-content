#!/usr/bin/env node
// Mutable-key wording regression for the collections-in-depth learner text.
// The Map contract leaves behavior unspecified once a stored key changes in a way that affects
// equals, and a changed field need not change the hash code. This check fails if any learner file
// states the failure as guaranteed, or if the equals topic stops calling the behavior unspecified.
// Run from the repository root: node authoring/evidence/collections-streams/collections-in-depth/wording-regression.mjs
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

const moduleRoot = path.join(process.cwd(), "collections-streams/collections-in-depth");
const CATEGORICAL = [
  /can no longer find/i,
  /cannot be found/i,
  /key is lost/i,
  /cannot survive/i,
  /its hash code changes, so/i,
  /hashes somewhere else/i,
  /breaks (<code>)?`?HashSet/i,
  /(?<!promise )identity (hash )?codes differ/i,
  /Seat\s+as\s+a\s+`?record/i,
];
const failures = [];
for (const topic of await readdir(moduleRoot)) {
  for (const name of ["artifact.html", "artifact.md", "artifact.gift"]) {
    const text = await readFile(path.join(moduleRoot, topic, name), "utf8").catch(() => null);
    if (text == null) continue;
    for (const pattern of CATEGORICAL) {
      if (pattern.test(text)) failures.push(`${topic}/${name}: categorical wording ${pattern}`);
    }
  }
}
const equals = path.join(moduleRoot, "the-equals-and-hashcode-contract");
for (const name of ["artifact.html", "artifact.md", "artifact.gift"]) {
  const text = await readFile(path.join(equals, name), "utf8");
  if (!/unspecified/i.test(text)) failures.push(`the-equals-and-hashcode-contract/${name}: no longer says the behavior is unspecified`);
}
const html = await readFile(path.join(equals, "artifact.html"), "utf8");
if (!/In this OpenJDK 25 run/.test(html)) failures.push("equals simulator feedback is no longer scoped to the observed run");
const readme = await readFile(path.join(moduleRoot, "coding-lab/README.md"), "utf8");
if (/record Seat\(String row, int number\)/.test(readme)) failures.push("coding-lab/README.md offers the Seat record shortcut again");
if (failures.length) {
  console.error(failures.join("\n"));
  process.exitCode = 1;
} else {
  console.log("mutable-key wording: no categorical claims; unspecified behavior stated in HTML, Markdown and GIFT");
}
