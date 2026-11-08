// Drift test: every learner page that inlines the lesson editor must carry byte-identical, correctly stamped copies
// of the reviewed sources at the contract version. Run: node --test authoring/evidence/python/python-fundamentals/lesson-editor/drift.test.mjs
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { createHash } from "node:crypto";
import path from "node:path";
import { DIR, CONTRACT, verifyPage } from "./stamp.mjs";
const REPO = path.resolve(DIR, "../../../../..");
function pages(dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (name === "node_modules" || name === "authoring" || name === "build" || name.startsWith(".")) continue;
    const p = path.join(dir, name);
    if (statSync(p).isDirectory()) pages(p, out);
    else if (name === "artifact.html") out.push(p);
  }
  return out;
}
test("contract.json records the current source hashes", () => {
  for (const [name, f] of Object.entries(CONTRACT.fragments)) {
    const h = createHash("sha256").update(readFileSync(path.join(DIR, f.file), "utf8")).digest("hex");
    assert.equal(f.sha256, h, `${name}: run rehash.mjs after a reviewed change`);
  }
});
const all = pages(REPO);
const bearing = all.filter((p) => readFileSync(p, "utf8").includes("lesson-editor"));
test("the pilot page inlines the editor", () => {
  assert.ok(bearing.some((p) => p.endsWith(path.join("python-syntax-for-java-developers", "artifact.html"))), "pilot page missing");
});
test("every Python fundamentals activity has the four labelled procedure steps", () => {
  const moduleDir = path.join(REPO, "python", "python-fundamentals");
  const labels = ["Where to look", "What to do or type", "What to expect", "How to know it's done"];
  for (const topic of readdirSync(moduleDir)) {
    const p = path.join(moduleDir, topic, "artifact.html");
    if (!statSync(path.join(moduleDir, topic)).isDirectory()) continue;
    const html = readFileSync(p, "utf8");
    const lists = [...html.matchAll(/<ol class="steps" aria-label="Steps">([\s\S]*?)<\/ol>/g)].map((m) => m[1]);
    assert.ok(lists.length >= 4, `${topic}: expected a procedure for every activity`);
    for (const [index, list] of lists.entries()) {
      for (const label of labels) assert.ok(list.includes(`<strong>${label}:</strong>`), `${topic} activity ${index + 1}: missing ${label}`);
    }
  }
});
for (const p of bearing) {
  test(`inlined copy matches the source: ${path.relative(REPO, p)}`, () => {
    const r = verifyPage(readFileSync(p, "utf8"));
    assert.ok(r.present, "no stamped editor found");
    assert.deepEqual(r.errors, []);
  });
}
