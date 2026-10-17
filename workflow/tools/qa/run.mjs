#!/usr/bin/env node
import path from "node:path";
import { defaultSkip, formatError, relative } from "../lib/common.mjs";
import { runBrowserGate } from "./harness.mjs";
import { run as runMarkdownPdf } from "../checks/T18-markdown-pdf.mjs";

const root = process.cwd();
const args = process.argv.slice(2);
let writeEvidence = false;
const paths = [];
for (const argument of args) {
  if (argument === "--write-evidence") writeEvidence = true;
  else if (argument === "--help") {
    console.log("Usage: node workflow/tools/qa/run.mjs [--write-evidence] [paths...]");
    process.exit(0);
  } else if (argument.startsWith("-")) {
    console.error(`Unknown option: ${argument}`);
    process.exit(2);
  } else paths.push(argument);
}
if (writeEvidence) process.env.PEP_QA_WRITE_EVIDENCE = "1";
const targets = (paths.length ? paths : ["."]).map((item) => path.resolve(root, item));
const ctx = {
  root,
  explicit: paths.length > 0,
  targets,
  scanRoots: targets,
  skip: paths.length ? undefined : defaultSkip(root),
  display: (file) => relative(root, file),
};
const errors = [];
for (const rule of ["T09", "T10", "T11", "T12", "T13"]) {
  errors.push(...(await runBrowserGate(ctx, rule, { writeEvidence })));
}
errors.push(...(await runMarkdownPdf(ctx)));
if (errors.length) {
  errors.sort((a, b) => formatError(a).localeCompare(formatError(b)));
  errors.forEach((error) => console.error(formatError(error)));
  process.exitCode = 1;
} else {
  console.log("QA: T09-T13 and T18 passed");
}
