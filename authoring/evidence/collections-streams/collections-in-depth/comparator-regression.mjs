#!/usr/bin/env node
// Comparator credit regression for collections-in-depth/sorting-with-comparator Activity 2.
// Enumerates every comparator the practice editor runs from the two Player keys: first key and its
// direction (natural, .reversed() or a reverseOrder() key order), an optional thenComparing key and
// direction, and an optional trailing .reversed(), plus other accepted spellings. Each typed statement is credited exactly when it
// orders by score highest first and then by name A to Z, so a name-only, score-only, misplaced
// reversed() or reversed tie-breaker shortcut can never pass on the two visible lists.
// Run from the repository root: node authoring/evidence/collections-streams/collections-in-depth/comparator-regression.mjs
import path from "node:path";
import { pathToFileURL } from "node:url";
import { launchChromium } from "../../../tools/qa/harness.mjs";

const url = pathToFileURL(path.join(process.cwd(), "collections-streams/collections-in-depth/sorting-with-comparator/artifact.html")).href;
const keys = ["score", "name"];
const firstForms = [];
for (const key of keys) {
  firstForms.push({ text: `Comparator.comparing(Player::${key})`, order: [[key, 1]] });
  firstForms.push({ text: `Comparator.comparing(Player::${key}).reversed()`, order: [[key, -1]] });
  firstForms.push({ text: `Comparator.comparing(Player::${key}, Comparator.reverseOrder())`, order: [[key, -1]] });
}
const tieForms = [{ text: "", order: [] }];
for (const key of keys) {
  tieForms.push({ text: `.thenComparing(Player::${key})`, order: [[key, 1]] });
  tieForms.push({ text: `.thenComparing(Player::${key}, Comparator.reverseOrder())`, order: [[key, -1]] });
}
const cases = [];
for (const first of firstForms) {
  for (const tie of tieForms) {
    for (const trailing of [false, true]) {
      let order = [...first.order, ...tie.order];
      if (trailing) order = order.map(([key, dir]) => [key, -dir]);
      // the effective ordering ignores a repeated key, which can never break a tie it already decided
      const effective = order.filter(([key], index) => order.findIndex(([other]) => other === key) === index);
      const correct = effective.length === 2 && effective[0][0] === "score" && effective[0][1] === -1 &&
        effective[1][0] === "name" && effective[1][1] === 1;
      cases.push({ code: `players.sort(${first.text}${tie.text}${trailing ? ".reversed()" : ""});`, correct });
    }
  }
}
// other accepted spellings: lambda keys, comparingInt, Collections.sort and a nested Comparator tie-breaker
cases.push(
  { code: "Collections.sort(players, Comparator.comparing(p -> p.score(), Comparator.reverseOrder()).thenComparing(p -> p.name()));", correct: true },
  { code: "players.sort(Comparator.comparingInt(Player::score).reversed().thenComparing(Comparator.comparing(Player::name)));", correct: true },
  { code: "players.sort(Comparator.comparingInt(Player::score).reversed().thenComparing(Comparator.comparing(Player::name).reversed()));", correct: false },
  { code: "players.sort(Comparator.comparing(Player::name).thenComparing(Player::score).reversed());", correct: false },
  { code: "players.sort(Comparator.comparing(Player::score).reversed().reversed().thenComparing(Player::name));", correct: false },
);
const browser = await launchChromium();
const failures = [];
let credited = 0;
try {
  const page = await browser.newPage();
  page.on("pageerror", (error) => failures.push(`page error: ${error.stack}`));
  await page.goto(url);
  await page.locator('input[name=predict][value="nat"]').check();
  await page.locator("input[name=conf0][value=medium]").check();
  await page.locator("#predict-check").click();
  await page.locator("#next").click();
  for (const item of cases) {
    await page.locator("#ed").fill(item.code);
    await page.locator("#sort").click();
    const credit = await page.locator("#activity-2").getAttribute("data-pep-credit");
    const status = await page.locator("#ed-status").innerText();
    const got = credit === "1";
    if (got) credited++;
    if (got !== item.correct) failures.push(`${item.code}: credit ${credit}, expected ${item.correct ? 1 : 0} (${status})`);
    if (!item.correct && !/differ/.test(status)) failures.push(`${item.code}: wrong strategy reported as a match (${status})`);
    if (got) await page.locator("#reset").click();
  }
} finally {
  await browser.close();
}
console.log(`comparator regression: ${cases.length} typed comparators, ${credited} credited, ${cases.filter((item) => item.correct).length} semantically correct`);
if (failures.length) {
  console.error(failures.join("\n"));
  process.exitCode = 1;
}
