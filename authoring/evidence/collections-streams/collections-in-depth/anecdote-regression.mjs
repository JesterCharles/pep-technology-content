#!/usr/bin/env node
// Optional-anecdote regression for the seven collections-in-depth pages that carry one.
// During the step 1 prediction the anecdote must be unavailable: not rendered and not operable. After the public
// prediction route reaches the activity that owns it, which follows its core explanation, it must render closed,
// open by pointer and stay outside required progress. The equals/hashCode and How HashMap Works anecdotes must each
// stay one focused analogy: one story, one short map sentence, and none of the full-lesson elements named below.
// Run from the repository root: node authoring/evidence/collections-streams/collections-in-depth/anecdote-regression.mjs
import path from "node:path";
import { pathToFileURL } from "node:url";
import { launchChromium } from "../../../tools/qa/harness.mjs";

const module = "collections-streams/collections-in-depth";
const TOPICS = ["lists-sets-and-maps-in-depth", "stacks-and-queues", "generics", "wrapper-types-and-autoboxing",
  "big-o-basics", "the-equals-and-hashcode-contract", "how-hashmap-works"];
// full-lesson elements the two simplified analogies must not restate
const BOUNDARY = {
  "the-equals-and-hashcode-contract": /\b(shelf|shelves|catalogue|copy|copies|miss|misses|search|hash|bucket|changes? .* while)\b/i,
  "how-hashmap-works": /\b(resiz\w*|rebuil\w*|wider|twice as|crowded|order|collision|rehash\w*|wall)\b/i,
};
const failures = [];
const browser = await launchChromium();
try {
  for (const topic of TOPICS) {
    const page = await browser.newPage();
    await page.goto(pathToFileURL(path.join(module, topic, "artifact.html")).href);
    const anecdote = page.locator("details[data-pep-optional='anecdote']");
    if ((await anecdote.count()) !== 1) { failures.push(`${topic}: expected exactly one anecdote`); await page.close(); continue; }
    const owner = await anecdote.evaluate((node) => node.closest("[data-pep-activity]")?.id ?? null);
    if (!owner || owner === "activity-1") failures.push(`${topic}: the anecdote must be owned by an activity after the prediction (owner ${owner})`);
    const atPrediction = await anecdote.evaluate((node) => ({ visible: node.checkVisibility(), current: document.querySelector("#lesson").dataset.pepCurrentActivity ?? document.querySelector("#stage")?.dataset.at }));
    if (atPrediction.current !== "1" || atPrediction.visible) failures.push(`${topic}: the anecdote is available during the step 1 prediction`);
    const opened = await anecdote.locator(":scope > summary").click({ timeout: 1000 }).then(() => true, () => false);
    if (opened && await anecdote.evaluate((node) => node.open)) failures.push(`${topic}: the anecdote opens during the prediction`);
    // public prediction route, then forward to the owning activity
    await page.locator("input[name=predict]").first().check({ timeout: 2000 }).catch(() => {});
    await page.locator("input[name=conf0]").first().check({ timeout: 2000 }).catch(() => {});
    await page.locator("#predict-check").click({ timeout: 2000 }).catch(() => {});
    const ownerNumber = Number((owner ?? "activity-2").split("-")[1]);
    for (let n = 2; n <= ownerNumber; n++) {
      if (n > 2) break; // owners are activity 2 on every page; later owners would need their own public route
      await page.locator("#next").click({ timeout: 2000 }).catch(() => {});
    }
    const later = await anecdote.evaluate((node) => ({ visible: node.checkVisibility(), open: node.open, skip: node.hasAttribute("data-section-skip") }));
    if (!later.visible || later.open || !later.skip) failures.push(`${topic}: in its owning activity the anecdote must render closed and section-skipped (${JSON.stringify(later)})`);
    const progress = page.locator("#path-text, #prog-text").first();
    const progressBefore = await progress.innerText({ timeout: 2000 }).catch(() => "");
    await anecdote.locator(":scope > summary").click({ timeout: 2000 }).catch(() => {});
    if (!(await anecdote.evaluate((node) => node.open))) failures.push(`${topic}: the anecdote does not open in its owning activity`);
    if ((await progress.innerText({ timeout: 2000 }).catch(() => "")) !== progressBefore) failures.push(`${topic}: opening the anecdote changed required progress`);
    if (BOUNDARY[topic]) {
      const prose = await anecdote.evaluate((node) => ({
        stories: node.querySelectorAll("[data-pep-anecdote-story]").length,
        maps: node.querySelectorAll("[data-pep-anecdote-map]").length,
        text: [...node.querySelectorAll("[data-pep-anecdote-story], [data-pep-anecdote-map]")].map((item) => item.textContent).join(" "),
      }));
      if (prose.stories !== 1 || prose.maps !== 1) failures.push(`${topic}: the anecdote must be one story and one map sentence`);
      const hit = prose.text.match(BOUNDARY[topic]);
      if (hit) failures.push(`${topic}: the simplified anecdote restates a full-lesson element ("${hit[0]}")`);
      if (prose.text.split(/\s+/).length > 75) failures.push(`${topic}: the simplified anecdote is longer than one focused analogy`);
    }
    await page.close();
  }
} finally {
  await browser.close();
}
console.log(`anecdote regression: ${TOPICS.length} anecdotes unavailable during prediction and operable in their owning activity; 2 simplified boundaries checked`);
if (failures.length) {
  console.error(failures.join("\n"));
  process.exitCode = 1;
}
