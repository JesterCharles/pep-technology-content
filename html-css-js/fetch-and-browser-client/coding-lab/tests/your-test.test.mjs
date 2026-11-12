// Public check for Task 7: you write starter/format-distance.test.mjs yourself.
// This check runs your file with Vitest three times: once against the shipped
// formatDistance, and once each against a copy with a wrong label and a copy
// with a wrong km. Your two tests must pass on the first run and catch both
// broken copies. Vitest also runs your file directly as part of npm test.
import { execFile } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { expect, test } from "vitest";

const labDir = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const yourTestFile = path.join(labDir, "starter", "format-distance.test.mjs");
const vitestCli = path.join(labDir, "starter", "node_modules", "vitest", "vitest.mjs");
const configFile = path.join(labDir, "tests", "your-test.vitest.config.mjs");

function runYourTests(variant) {
  return new Promise((resolve, reject) => {
    execFile(
      process.execPath,
      [vitestCli, "run", "--config", configFile],
      { cwd: path.join(labDir, "starter"), env: { ...process.env, TASK7_VARIANT: variant } },
      (error, stdout) => {
        const line = stdout.split("\n").find((entry) => entry.startsWith("TASK7_RESULT "));
        if (!line) {
          reject(new Error(`Vitest could not run your test file: ${error?.message ?? stdout}`));
          return;
        }
        resolve(JSON.parse(line.slice("TASK7_RESULT ".length)));
      },
    );
  });
}

const failedCount = (run) => run.tests.filter((entry) => entry.state === "failed").length;

test(
  "task 7: your format-distance.test.mjs has exactly two passing tests that catch a broken formatDistance",
  async () => {
    expect(
      existsSync(yourTestFile),
      "starter/format-distance.test.mjs does not exist yet: create it and write your Vitest tests there",
    ).toBe(true);

    const [real, wrongLabel, wrongKm] = await Promise.all([
      runYourTests("real"),
      runYourTests("wrong-label"),
      runYourTests("wrong-km"),
    ]);

    expect(real.errors, "your test file must load: check its imports and syntax").toEqual([]);
    expect(real.tests.length, "declare exactly two tests in your file").toBe(2);
    expect(
      real.tests.map((entry) => entry.state),
      "both of your tests must pass against the shipped formatDistance",
    ).toEqual(["passed", "passed"]);
    expect(
      failedCount(wrongLabel),
      "with a formatDistance that returns a wrong label, both of your tests must fail: " +
        "each one must call formatDistance from ./format-distance.mjs and check its label, " +
        "one with toBe on the label string and one with toEqual on the whole result",
    ).toBe(2);
    expect(
      failedCount(wrongKm),
      "with a formatDistance that returns a wrong km, a test must fail: " +
        "compare the whole result object, km included, with toEqual",
    ).toBeGreaterThanOrEqual(1);
  },
  60_000,
);
