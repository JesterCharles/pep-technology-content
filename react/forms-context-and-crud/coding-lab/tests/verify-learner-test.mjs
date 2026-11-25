// npm test: runs the whole suite, then checks the Task 8 learner test against
// an unchanged copy of the finished form and controlled faulty variants. Uses
// the Node binary directly (no shell, no .cmd shim) so it runs the same way on
// Windows, macOS and Linux.
import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const vitest = path.join(here, "node_modules", "vitest", "vitest.mjs");

function runVitest(args, env = process.env, stdio = "pipe") {
  const result = spawnSync(process.execPath, [vitest, ...args], {
    cwd: here,
    env,
    stdio,
    encoding: "utf8",
  });
  if (result.error) {
    console.error(`Could not start Vitest: ${result.error.message}`);
    process.exit(1);
  }
  return result;
}

const normal = runVitest(["run"], process.env, "inherit");
if (normal.status !== 0) process.exit(normal.status ?? 1);

const out = mkdtempSync(path.join(tmpdir(), "task8-"));
function runVariant(variant) {
  const file = path.join(out, `${variant}.json`);
  const marks = path.join(out, `${variant}.marks`);
  const run = runVitest(
    ["run", "--config", "vitest.mutation.config.js", "--reporter=json", `--outputFile=${file}`],
    { ...process.env, TASK8_VARIANT: variant, TASK8_REPORT: marks },
  );
  let unreadable = false;
  try {
    unreadable = readFileSync(marks, "utf8").includes("unreadable");
  } catch {
    unreadable = false;
  }
  let report;
  try {
    report = JSON.parse(readFileSync(file, "utf8"));
  } catch {
    console.error("Task 8 check could not read the test results. Vitest said:");
    console.error((run.stderr || run.stdout || "").trim().split("\n").slice(-15).join("\n"));
    rmSync(out, { recursive: true, force: true });
    process.exit(1);
  }
  const files = report.testResults ?? [];
  const assertions = files.flatMap((file) => file.assertionResults ?? []);
  return {
    unreadable,
    fileFailed: files.some((file) => file.status === "failed"),
    // A test file that failed without a single passed or failed test in it
    // failed to load (or its setup failed) during the check.
    loadFailed: files.some(
      (file) =>
        file.status === "failed" &&
        !(file.assertionResults ?? []).some((a) => a.status === "passed" || a.status === "failed"),
    ),
    failed: assertions.some((a) => a.status === "failed"),
    passed: assertions.filter((a) => a.status === "passed").length,
    clean: run.status === 0 && assertions.every((a) => a.status !== "failed"),
  };
}

const UNREADABLE_MESSAGE =
  'Task 8: the check could not find the "Service name" and "Owning team" fields by their labels inside the form your test submitted, so it could not finish checking your test. Keep the text that labels each field inside the <form> element, then run npm test again.';

const missed = [];
const control = runVariant("control");
// No test file failed and no test passed or failed: the file is missing or
// empty, or holds only todo or skipped tests. Vitest exits non-zero when no
// test file is found, so this does not depend on the exit status. A test file
// that fails to load is a failed file and is not reported as missing.
if (!control.fileFailed && !control.failed && control.passed === 0) {
  missed.push(
    "Task 8: no runnable test was found in starter/src/service-form.test.jsx. The file may be missing or empty, or hold only todo or skipped tests. Write the test described in task 8 there.",
  );
} else if (control.loadFailed && !control.failed) {
  // A learner test file that failed to load during the check produced no
  // results, so the check could not read the form, whether or not another
  // test file passed. The suite error is not shown.
  missed.push(UNREADABLE_MESSAGE);
} else if (!control.clean) {
  missed.push(
    "Task 8: your test fails against an unchanged copy of your finished form, so it depends on something other than the form's behaviour.",
  );
} else {
  const checks = [
    ["blank-ignored", 'it still passes when the form ignores a blank-name submission. Check that "Enter a service name." appears after you click Save with a blank name.'],
    ["blank-saves", "it still passes when a blank-name submission calls onSave. Check that onSave was not called."],
    ["complete-ignored", "it still passes when the form ignores the completed submission. After typing a name and choosing a team, submit again and check that onSave receives the values."],
    ["complete-never-saves", "it still passes when the completed submission never reaches onSave. Check that onSave was called."],
    ["complete-wrong-name", "it still passes when onSave receives a different name. Check the name that onSave receives."],
    ["complete-wrong-team", "it still passes when onSave receives a different team. Check the team that onSave receives."],
  ];
  let unreadable = false;
  for (const [variant, message] of checks) {
    const result = runVariant(variant);
    if (result.unreadable) unreadable = true;
    else if (!result.failed) missed.push(`Task 8: ${message}`);
  }
  if (unreadable) {
    missed.unshift(UNREADABLE_MESSAGE);
  }
}
rmSync(out, { recursive: true, force: true });

if (missed.length) {
  console.error("\n Task 8 is not complete yet:");
  for (const line of missed) console.error(`   - ${line}`);
  process.exit(1);
}
console.log("\n ✓ Task 8 rejects faulty submission behaviors");
