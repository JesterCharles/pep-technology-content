#!/usr/bin/env node
// Completion-truth regression for every collections-in-depth page.
// Replays each page's committed failing routes (wrongTwice, and every route on a private-proof page, whose committed
// routes are all public-safe failures) and requires an honest outcome: assessed failures settle without completing;
// Generics routes include one assessed compile-but-wrong criterion miss while compiler/type diagnostics remain unassessed;
// that activity stays unfinished and unsettled. The recap never says "Topic complete", and no activity that settled
// without passing reports completed=true, credit 1 or grade 1.
// The committed success and wrongFirst routes of ordinary pages must still finish with every activity passed.
// Run from the repository root: node authoring/evidence/collections-streams/collections-in-depth/completion-regression.mjs
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { launchChromium } from "../../../tools/qa/harness.mjs";

const module = "collections-streams/collections-in-depth";
const topics = JSON.parse(fs.readFileSync(path.join("authoring/catalog", module, "module.json"), "utf8")).topicOrder;
const failures = [];
const browser = await launchChromium();
let routes = 0;
try {
  for (const topic of topics) {
    const spec = JSON.parse(fs.readFileSync(path.join("authoring/evidence", module, topic, "qa-paths.json"), "utf8"));
    const privateProof = spec.answerSafety?.privateSuccessProof === true;
    const unfinishedGenerics = topic === "generics";
    const names = ["success", "wrongFirst", "wrongTwice"];
    for (const name of names) {
      const failing = privateProof || name === "wrongTwice";
      const page = await browser.newPage();
      page.on("pageerror", (error) => failures.push(`${topic} ${name}: page error ${error.message}`));
      await page.goto(pathToFileURL(path.join(module, topic, "artifact.html")).href);
      for (const action of spec.routes[name]) {
        const target = action.selector ? page.locator(action.selector).first() : null;
        if (action.do === "click") await target.click();
        else if (action.do === "check") await target.check();
        else if (action.do === "fill") await target.fill(action.value);
        else if (action.do === "press") await target.press(action.key);
      }
      routes++;
      const state = await page.evaluate(() => {
        const main = document.querySelector("#lesson");
        return {
          complete: main.dataset.pepComplete,
          settled: main.dataset.pepPathSettled,
          recap: document.querySelector("#complete")?.textContent ?? "",
          progress: document.querySelector("#prog-text")?.textContent ?? "",
          activities: [...document.querySelectorAll("section[data-pep-activity]")].map((section) => ({
            id: section.id, settled: section.dataset.pepSettled, completed: section.dataset.pepCompleted,
            credit: section.dataset.pepCredit, grade: section.dataset.pepGrade, cont: section.dataset.pepContinue,
            attempts: section.dataset.pepAttempts,
          })),
        };
      });
      const where = `${topic} ${name}`;
      if (unfinishedGenerics) {
        const editor = state.activities.find((activity) => activity.id === "activity-2");
        if (state.settled !== "false" || state.complete !== "false") failures.push(`${where}: the unfinished Generics criterion miss settled the required path`);
        if (!editor || editor.attempts !== "1" || editor.settled !== "false" || editor.cont !== "false" || editor.completed !== "false" || editor.credit !== "0" || editor.grade !== "0") failures.push(`${where}: the Generics criterion miss did not remain one assessed, unfinished zero-credit attempt`);
      } else if (failing) {
        if (state.settled !== "true") failures.push(`${where}: the required path did not settle`);
        if (state.complete !== "false") failures.push(`${where}: a failed route marks the page complete`);
        if (/Topic complete/.test(state.recap)) failures.push(`${where}: a failed route says "Topic complete"`);
        if (!/^Required path settled; \d activit(y remains|ies remain) incomplete: /.test(state.recap)) failures.push(`${where}: the recap does not name the incomplete activities`);
        if (!/settled, not passed/.test(state.progress)) failures.push(`${where}: progress does not count settled activities apart from completed ones`);
        const settledOnly = state.activities.filter((activity) => activity.completed === "false");
        if (state.activities.length && !settledOnly.length) failures.push(`${where}: no activity is left incomplete on a failed route`);
        for (const activity of settledOnly) {
          if (activity.settled !== "true" || activity.cont !== "true") failures.push(`${where}: ${activity.id} does not settle and continue`);
          if (activity.credit !== "0" || activity.grade !== "0") failures.push(`${where}: ${activity.id} keeps credit or grade without passing`);
        }
        for (const activity of state.activities) {
          if (activity.completed === "true" && activity.credit !== "1") failures.push(`${where}: ${activity.id} completed without its one credit`);
        }
      } else {
        if (state.settled !== "true") failures.push(`${where}: the required path did not settle`);
        if (state.complete !== "true") failures.push(`${where}: a passing route does not complete the page`);
        if (!/^Topic complete\./.test(state.recap)) failures.push(`${where}: a passing route does not say "Topic complete"`);
        if (!/^Completed 4 of 4$/.test(state.progress)) failures.push(`${where}: a passing route does not count four completed activities`);
        if (state.activities.some((activity) => activity.completed !== "true" || activity.credit !== "1")) failures.push(`${where}: a passing route leaves an activity uncredited`);
        if (state.activities.length) {
          await page.locator("#reset").click();
          const restarted = await page.evaluate(() => {
            const main = document.querySelector("#lesson"), current = document.querySelector('[data-pep-activity][data-pep-completed="false"]');
            return { complete: main.dataset.pepComplete, settled: main.dataset.pepPathSettled,
              recap: document.querySelector("#complete")?.textContent ?? "", current: current?.id ?? "", credit: current?.dataset.pepCredit ?? "" };
          });
          if (restarted.complete !== "false" || restarted.settled !== "false") failures.push(`${where}: complete→restart leaves stale page completion (${JSON.stringify(restarted)})`);
          if (!restarted.current || restarted.credit !== "0") failures.push(`${where}: complete→restart does not invalidate the restarted activity credit`);
          if (/Topic complete/.test(restarted.recap)) failures.push(`${where}: complete→restart leaves a learner-visible Topic complete claim`);
        }
      }
      await page.close();
    }
  }
} finally {
  await browser.close();
}
console.log(`completion regression: ${topics.length} topics, ${routes} committed routes replayed`);
if (failures.length) {
  console.error(failures.join("\n"));
  process.exitCode = 1;
}
