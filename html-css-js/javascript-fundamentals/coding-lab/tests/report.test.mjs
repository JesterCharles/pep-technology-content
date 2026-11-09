// Public tests for the Trail report utilities lab. Run from coding-lab/ with:
//   node --test --test-reporter=spec
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const starterDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "starter");
const reportSource = readFileSync(path.join(starterDir, "report.mjs"), "utf8");
const report = await import(new URL("../starter/report.mjs", import.meta.url).href);
const format = await import(new URL("../starter/format.mjs", import.meta.url).href);

const freezeTrail = (trail) => Object.freeze({ ...trail, tags: Object.freeze([...trail.tags]) });
const fixture = Object.freeze([
  freezeTrail({ id: 1, name: "Lake Loop", distanceKm: 5, difficulty: "easy", tags: ["family"] }),
  freezeTrail({ id: 2, name: "Ridge Walk", distanceKm: 9, difficulty: "moderate", tags: ["views"] }),
  freezeTrail({ id: 3, name: "Forest Path", distanceKm: 4, difficulty: "easy", tags: ["shade"] }),
  freezeTrail({ id: 4, name: "Summit Climb", distanceKm: 14, difficulty: "hard", tags: ["steep"] }),
]);

// Strips string contents and comments so source checks cannot be fooled by
// text. Strings are stripped before comment markers so a "//" inside a string
// never truncates the line, and multi-line template literals are stripped too.
const bareSource = reportSource.replace(
  /("(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*'|`(?:\\.|[^`\\])*`)|\/\/[^\n]*|\/\*[\s\S]*?\*\//g,
  (match, stringLiteral) => (stringLiteral ? "\"\"" : ""),
);

test("task 1: hasDifficulty matches only the exact difficulty, without var or loose equality", () => {
  assert.equal(report.hasDifficulty(fixture[0], "easy"), true, "an easy trail matches \"easy\"");
  assert.equal(report.hasDifficulty(fixture[1], "easy"), false, "a moderate trail does not match \"easy\"");
  assert.equal(
    report.hasDifficulty(Object.freeze({ difficulty: "" }), 0),
    false,
    "an empty difficulty must not match the number 0: that is loose == coercion",
  );
  assert.ok(!/\bvar\b/.test(bareSource), "report.mjs still declares a variable with var; keep a variable only as const (nothing here is reassigned)");
  assert.ok(
    !/[^=!<>]==[^=]/.test(bareSource) && !/[^=!<>]!=[^=]/.test(bareSource),
    "report.mjs still compares with loose == or !=; use === or !==",
  );
});

test("task 2: byDistance is an arrow-function callback and sortTrails returns a new sorted array", () => {
  assert.equal(typeof report.byDistance, "function", "byDistance must be a function stored in the variable");
  assert.ok(
    /byDistance\s*=[\s\S]{0,80}?=>/.test(bareSource),
    "write byDistance as an arrow function assigned to the variable",
  );
  const sorted = report.sortTrails(fixture, report.byDistance);
  assert.notEqual(sorted, fixture, "sortTrails must return a new array, not the input");
  assert.deepEqual(
    sorted.map((trail) => trail.name),
    ["Forest Path", "Lake Loop", "Ridge Walk", "Summit Climb"],
    "trails must be sorted by distanceKm, shortest first",
  );
  assert.deepEqual(
    fixture.map((trail) => trail.name),
    ["Lake Loop", "Ridge Walk", "Forest Path", "Summit Climb"],
    "the input array must keep its original order",
  );
});

test("task 3: easyTrailNames keeps only easy trails and never mutates the input", () => {
  assert.deepEqual(
    report.easyTrailNames(fixture),
    ["Lake Loop", "Forest Path"],
    "expected the names of the easy trails, in their original order",
  );
  assert.deepEqual(report.easyTrailNames(Object.freeze([])), [], "an empty list gives an empty result");
});

test("task 4: totalDistance uses reduce with an explicit initial value", () => {
  assert.equal(report.totalDistance(Object.freeze([])), 0, "an empty list totals 0: pass reduce an initial value");
  assert.equal(report.totalDistance(fixture), 32, "expected 5 + 9 + 4 + 14 = 32");
  assert.ok(/\.reduce\s*\(/.test(bareSource), "totalDistance must use the reduce array method");
});

test("task 5: describeTrail destructures with a default and withTag copies instead of mutating", () => {
  assert.equal(report.describeTrail(fixture[0]), "Lake Loop: 5 km (easy)");
  assert.equal(
    report.describeTrail(Object.freeze({ name: "Bog Walk", distanceKm: 3 })),
    "Bog Walk: 3 km (unknown)",
    "a missing difficulty must fall back to \"unknown\" via a destructuring default",
  );
  const tagged = report.withTag(fixture[2], "muddy");
  assert.notEqual(tagged, fixture[2], "withTag must return a new object");
  assert.notEqual(tagged.tags, fixture[2].tags, "withTag must build a new tags array");
  assert.deepEqual(tagged.tags, ["shade", "muddy"], "the new tag goes at the end of the copied tags");
  assert.deepEqual(fixture[2].tags, ["shade"], "the original tags must not change");
  assert.equal(tagged.name, "Forest Path", "the other properties are copied across");
});

test("task 6: format.mjs exports formatKm (named) and formatTrailLine (default), used by trailLines", () => {
  assert.equal(typeof format.formatKm, "function", "formatKm must be a named export of format.mjs");
  assert.equal(typeof format.default, "function", "formatTrailLine must be the default export of format.mjs");
  assert.equal(format.formatKm(5), "5 km");
  assert.equal(format.default(fixture[0]), "Lake Loop (5 km, easy)");
  assert.deepEqual(
    report.trailLines(fixture.slice(0, 2)),
    ["Lake Loop (5 km, easy)", "Ridge Walk (9 km, moderate)"],
    "trailLines must format every trail with the imported formatTrailLine",
  );
});

test("task 7: makeTrailLog returns a closure with its own private count", () => {
  const logA = report.makeTrailLog();
  assert.equal(typeof logA, "function", "makeTrailLog must return a function");
  assert.equal(logA("Lake Loop"), 1, "the first logged name counts 1");
  assert.equal(logA("Ridge Walk"), 2, "the second logged name counts 2");
  const logB = report.makeTrailLog();
  assert.equal(logB("Forest Path"), 1, "a second log starts its own count at 1");
  assert.equal(logA("Summit Climb"), 3, "the first log keeps its own count");
  assert.ok(
    !Object.keys(report).some((name) => Array.isArray(report[name])),
    "the logged names must live inside the closure, not in an exported array",
  );
});
