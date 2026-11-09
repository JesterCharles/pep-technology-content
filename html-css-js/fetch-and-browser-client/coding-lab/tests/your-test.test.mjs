// Public check for Task 7: you write starter/format-distance.test.mjs yourself.
// When that file exists, Vitest also runs it as part of npm test, so a wrong
// assertion in it fails the run with the output you then read and fix.
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { expect, test } from "vitest";

const yourTestFile = path.join(
  path.dirname(path.dirname(fileURLToPath(import.meta.url))),
  "starter",
  "format-distance.test.mjs",
);

test("task 7: your format-distance.test.mjs exists and uses test, expect, toBe and toEqual", () => {
  let source = "";
  try {
    source = readFileSync(yourTestFile, "utf8");
  } catch {
    expect.fail(
      "starter/format-distance.test.mjs does not exist yet: create it and write your Vitest test there",
    );
  }
  const bare = source.replace(/\/\/[^\n]*/g, "").replace(/\/\*[\s\S]*?\*\//g, "");
  expect(bare, "import formatDistance from ./format-distance.mjs").toMatch(
    /from\s+["']\.\/format-distance\.mjs["']/,
  );
  expect(bare, "declare at least one test(...) block").toMatch(/\btest\s*\(/);
  expect(bare, "assert with expect(...)").toMatch(/\bexpect\s*\(/);
  expect(bare, "use toBe for a primitive result, such as the label string").toMatch(/\.toBe\s*\(/);
  expect(bare, "use toEqual for the whole result object").toMatch(/\.toEqual\s*\(/);
});
