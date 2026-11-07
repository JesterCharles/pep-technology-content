#!/usr/bin/env node
// Comparator credit regression for collections-in-depth/sorting-with-comparator Activity 2.
// The committed cases are explicit wrong orderings only: each must run, report a difference from the targets and earn
// no credit. Successful comparators never appear in public bytes; they are read only from an absolute, uncommitted
// private input file outside the repository (PEP_COMPARATOR_POSITIVES_FILE, a JSON array of statements) and each must
// be credited. Neither the positives nor any value derived from them is printed or written.
// Run from the repository root: node authoring/evidence/collections-streams/collections-in-depth/comparator-regression.mjs
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { launchChromium } from "../../../tools/qa/harness.mjs";

const url = pathToFileURL(path.join(process.cwd(), "collections-streams/collections-in-depth/sorting-with-comparator/artifact.html")).href;
const negatives = [
  "players.sort(Comparator.comparing(Player::name));",
  "players.sort(Comparator.comparing(Player::name).reversed());",
  "players.sort(Comparator.comparingInt(Player::score));"
];
const compilerNegatives = [
  "players.sort(Comparator.comparingInt(Player::score, Comparator.naturalOrder()));",
  "players.sort(Comparator.comparing(Player::name).thenComparingInt(Player::score, Comparator.naturalOrder()));",
  "players.sort(Comparator.comparing(Player::name).thenComparingInt(Comparator.naturalOrder()));"
];
const legalUnsupported = [
  "players.sort(Comparator.<Player, String>comparing(Player::name));"
];
const unassessedInputs = [
  "players.sort(Comparator.comparing(Player::score));"
];
let positives = [];
let privateNegatives = [];
const privateFile = process.env.PEP_COMPARATOR_POSITIVES_FILE;
if (privateFile) {
  const absolute = path.resolve(privateFile);
  if (!path.isAbsolute(privateFile) || !path.relative(process.cwd(), absolute).startsWith("..")) {
    console.error("PEP_COMPARATOR_POSITIVES_FILE must be an absolute path outside the repository");
    process.exit(1);
  }
  positives = JSON.parse(fs.readFileSync(absolute, "utf8"));
  // optional sibling file of wrong orderings that contain a credited comparator and so cannot be committed
  const negativesFile = absolute.replace(/positives\.json$/, "private-negatives.json");
  if (negativesFile !== absolute && fs.existsSync(negativesFile)) privateNegatives = JSON.parse(fs.readFileSync(negativesFile, "utf8"));
  if (!Array.isArray(positives) || positives.some((item) => typeof item !== "string")) {
    console.error("private positives must be a JSON array of strings");
    process.exit(1);
  }
}
const browser = await launchChromium();
const failures = [];
try {
  const page = await browser.newPage();
  page.on("pageerror", (error) => failures.push(`page error: ${error.message}`));
  await page.goto(url);
  await page.locator('input[name=predict][value="nat"]').check();
  await page.locator("input[name=conf0][value=medium]").check();
  await page.locator("#predict-check").click();
  await page.locator("#next").click();
  const run = async (code) => {
    await page.locator("#ed").fill(code);
    await page.locator("#sort").click();
    const state = {
      credit: await page.locator("#activity-2").getAttribute("data-pep-credit"),
      completed: await page.locator("#activity-2").getAttribute("data-pep-completed"),
      attempts: await page.locator("#activity-2").getAttribute("data-pep-attempts"),
      status: await page.locator("#ed-status").innerText(),
      problems: await page.locator("#ed-prob").innerText(),
    };
    await page.locator("#reset").click();
    return state;
  };
  for (const code of negatives) {
    const state = await run(code);
    if (state.credit !== "0" || state.completed !== "false") failures.push(`${code}: credited a wrong ordering`);
    if (!/differ/.test(state.status)) failures.push(`${code}: wrong ordering not reported as a difference (${state.status})`);
  }
  for (const code of compilerNegatives) {
    const state = await run(code);
    if (state.credit !== "0" || state.completed !== "false") failures.push(`${code}: compiler-rejected Comparator form was credited`);
    if (!/would not compile/.test(state.status) || !/Error/.test(state.problems)) failures.push(`${code}: not reported as a compiler diagnostic (${state.status}; ${state.problems})`);
    if (state.attempts !== "0") failures.push(`${code}: compiler diagnostic consumed an assessed run`);
  }
  for (const code of legalUnsupported) {
    const state = await run(code);
    if (!/outside what this practice editor runs/.test(state.status) || !/Not supported/.test(state.problems)) failures.push(`${code}: legal unsupported type-witness form was not bounded honestly (${state.status}; ${state.problems})`);
    if (state.attempts !== "0") failures.push(`${code}: legal unsupported form consumed an assessed run`);
  }
  for (const code of unassessedInputs) {
    const state = await run(code);
    if (state.credit !== "0" || state.completed !== "false") failures.push(`${code}: unchanged starter was credited`);
    if (state.attempts !== "0") failures.push(`${code}: unchanged starter consumed an assessed run`);
  }
  for (const [index, code] of privateNegatives.entries()) {
    const state = await run(code);
    if (state.credit !== "0") failures.push(`private negative #${index + 1}: credited a wrong ordering`);
  }
  for (const [index, code] of positives.entries()) {
    const state = await run(code);
    if (state.credit !== "1" || state.completed !== "true") failures.push(`private positive #${index + 1}: not credited`);
  }
} finally {
  await browser.close();
}
console.log(`comparator regression: ${negatives.length} committed wrong orderings refused, ${compilerNegatives.length} javac-rejected Comparator forms refused, ${legalUnsupported.length} legal unsupported forms unassessed, ${unassessedInputs.length} unchanged starters unassessed${privateFile ? `, ${positives.length} private successful comparators credited, ${privateNegatives.length} private wrong orderings refused` : "; private positives not supplied (set PEP_COMPARATOR_POSITIVES_FILE)"}`);
if (failures.length) {
  console.error(failures.join("\n"));
  process.exitCode = 1;
}
