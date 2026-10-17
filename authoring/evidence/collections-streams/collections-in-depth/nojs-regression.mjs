#!/usr/bin/env node
// No-JavaScript regression for the collections-in-depth learner pages.
// Opens every topic's artifact.html with JavaScript disabled and fails unless the page shows a
// complete reading: every objective, teaching block, activity task, static alternative (expected
// results and why) and the recap, with no inert practice control visible. The code workspace's own
// noscript[data-pep-no-js] reading stands in for its static alternative and must not give the
// target-producing statement. Optional disclosures must stay readable and openable without JavaScript.
// A page on the guidance contract (main[data-pep-guidance-contract]) is read natively instead: every
// activity section, its task, activity checks and expected results, the topic-bar objectives, the
// recap and the hints stay readable, and no inert practice control or navigation-only button shows.
// Run from the repository root: node authoring/evidence/collections-streams/collections-in-depth/nojs-regression.mjs
import { readFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { launchChromium } from "../../../tools/qa/harness.mjs";

const root = process.cwd();
const catalog = path.join(root, "authoring/catalog/collections-streams/collections-in-depth/module.json");
const { topicOrder } = JSON.parse(await readFile(catalog, "utf8"));
const browser = await launchChromium();
const failures = [];
try {
  for (const topic of topicOrder) {
    const url = pathToFileURL(path.join(root, "collections-streams/collections-in-depth", topic, "artifact.html")).href;
    const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 400, height: 860 } });
    const page = await context.newPage();
    await page.goto(url);
    if (await page.locator("main[data-pep-guidance-contract]").count()) {
      await page.locator("details[data-pep-objectives] > summary").click();
      const guided = await page.evaluate(() => {
        const norm = (text) => text.replace(/\s+/g, " ").trim();
        const shown = (element) => element.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true });
        const problems = [];
        let checked = 0;
        const need = (element, label) => { checked++; if (!element || !shown(element) || !norm(element.innerText)) problems.push(`not readable: ${label}`); };
        document.querySelectorAll("[data-pep-objectives] li").forEach((e, i) => need(e, `objective ${i + 1}`));
        document.querySelectorAll("[data-pep-activity]").forEach((activity) => {
          need(activity.querySelector(":scope h2"), `${activity.id} heading`);
          activity.querySelectorAll("[data-pep-teaching], [data-pep-model], [data-pep-where-fits]").forEach((e, i) => need(e, `${activity.id} teaching ${i + 1}`));
          activity.querySelectorAll("[data-pep-task]").forEach((e) => need(e, `${activity.id} task`));
          need(activity.querySelector("[data-pep-activity-checks]"), `${activity.id} activity checks`);
          const expected = [...activity.querySelectorAll(".pep-expected")].filter(shown);
          checked++;
          if (!expected.length) problems.push(`${activity.id}: no visible expected results or code reading`);
        });
        document.querySelectorAll("[data-pep-recap] > ul > li").forEach((e, i) => need(e, `recap ${i + 1}`));
        document.querySelectorAll("details[data-pep-hint][data-pep-hint-order='1'] > summary").forEach((e, i) => need(e, `first hint ${i + 1}`));
        const controls = [...document.querySelectorAll("button, input, textarea, select")].filter(shown).map((e) => e.id || e.tagName);
        const codeWorkspace = document.querySelector("[data-pep-workspace='code']");
        if (codeWorkspace) {
          const code = [...codeWorkspace.querySelectorAll("noscript[data-pep-no-js] > .pep-expected")].filter(shown).map((e) => norm(e.innerText)).join(" ");
          for (const want of ["Task:", "players.sort(Comparator.comparing(Player::score));", "What the practice editor accepts:", "How to compare:", "List 1 must become dee 95, ana 80, ben 80, cy 70", "List 2 must become bo 90, zed 90, al 60, cy 60"]) {
            if (!code.replace(/\s+/g, "").includes(want.replace(/\s+/g, ""))) problems.push(`code reading lacks ${want}`);
          }
        }
        if (/reversed\(\)\s*\.thenComparing\(Player::name\)|reverseOrder\(\)\)\s*\.thenComparing\(Player::name\)/.test(document.body.innerText)) {
          problems.push("no-JavaScript reading gives the target-producing comparator");
        }
        if (/\bGoals\b/.test(document.body.innerText)) problems.push("objectives or checks are labelled Goals");
        return { problems, controls, checked };
      });
      for (const item of guided.problems) failures.push(`${topic}: ${item}`);
      if (guided.controls.length) failures.push(`${topic}: inert controls visible: ${guided.controls.join(", ")}`);
      const disclosures = page.locator("details.pep-optional");
      for (let index = 0; index < await disclosures.count(); index++) {
        const disclosure = disclosures.nth(index);
        if ((await disclosure.getAttribute("open")) !== null) failures.push(`${topic}: optional disclosure open by default`);
        await disclosure.locator(":scope > summary").click({ timeout: 2000 }).catch(() => failures.push(`${topic}: optional disclosure not operable without JavaScript`));
        if ((await disclosure.getAttribute("open")) === null || !(await disclosure.innerText()).trim()) failures.push(`${topic}: optional disclosure did not open without JavaScript`);
      }
      console.log(`${topic}: guidance page, ${guided.checked} required readings, ${guided.problems.length} problems, ${guided.controls.length} visible controls`);
      await context.close();
      continue;
    }
    const result = await page.evaluate(() => {
      const norm = (text) => text.replace(/\s+/g, " ").trim();
      const shown = (element) => element.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true });
      const visible = [...document.querySelectorAll(".pep-nojs-reading")].filter(shown).map((e) => norm(e.innerText)).join(" ");
      const codeWorkspace = document.querySelector("[data-pep-workspace='code']");
      const required = [];
      const add = (kind, text) => { if (norm(text)) required.push([kind, norm(text)]); };
      document.querySelectorAll("[data-pep-objectives] > li > span:first-child").forEach((e) => add("objective", e.textContent));
      document.querySelectorAll("[data-pep-teaching] > :not(h2), [data-pep-teaching] > h2").forEach((e) => add("teaching", e.innerText || e.textContent));
      document.querySelectorAll("[data-pep-recap] > ul > li").forEach((e) => add("recap", e.textContent));
      document.querySelectorAll("[data-pep-model]").forEach((e) => add("model", e.textContent));
      document.querySelectorAll("[data-interaction]").forEach((e) => {
        if (codeWorkspace && codeWorkspace.contains(e)) return;
        add(`static alternative ${e.getAttribute("data-interaction")}`, e.getAttribute("data-static-alt"));
      });
      const codeProblems = [];
      if (codeWorkspace) {
        const code = [...codeWorkspace.querySelectorAll("noscript[data-pep-no-js] > .pep-nojs-reading")].filter(shown).map((e) => norm(e.innerText)).join(" ");
        for (const need of ["Task:", "players.sort(Comparator.comparing(Player::score));", "What the practice editor accepts:", "How to compare:", "ana 95, ben 80, cy 80, dee 70"]) {
          if (!code.replace(/\s+/g, "").includes(need.replace(/\s+/g, ""))) codeProblems.push(`code reading lacks ${need}`);
        }
        if (/reversed\(\)\s*\.thenComparing\(Player::name\)|reverseOrder\(\)\)\s*\.thenComparing\(Player::name\)/.test(visible + " " + code)) {
          codeProblems.push("no-JavaScript reading gives the target-producing comparator");
        }
      }
      const scripted = ["#current-teaching", ".pep-goalsbox", "#current-steps", "#current-task", ".fbrow"].filter((sel) => {
        const e = document.querySelector(sel);
        return e && shown(e);
      });
      document.querySelectorAll("#current-steps li[id^='task-'], #current-task [id^='task-']").forEach((e) => add(`task ${e.id}`, e.textContent));
      // compare without whitespace: a table's cells read with tabs when rendered and run together when not
      const flat = (text) => text.replace(/\s+/g, "");
      const visibleFlat = flat(visible);
      const missing = required.filter(([, text]) => !visibleFlat.includes(flat(text))).map(([kind, text]) => `${kind}: ${text.slice(0, 80)}`);
      const controls = [...document.querySelectorAll("button, input, textarea, select")].filter(shown).map((e) => e.id || e.tagName);
      return { missing, controls, scripted, codeProblems, checked: required.length };
    });
    if (!result.checked) failures.push(`${topic}: nothing to check`);
    if (result.scripted.length) failures.push(`${topic}: scripted regions visible without JavaScript: ${result.scripted.join(", ")}`);
    for (const item of result.codeProblems) failures.push(`${topic}: ${item}`);
    const disclosures = page.locator("details.pep-optional");
    for (let index = 0; index < await disclosures.count(); index++) {
      const disclosure = disclosures.nth(index);
      if ((await disclosure.getAttribute("open")) !== null) failures.push(`${topic}: optional disclosure open by default`);
      await disclosure.locator(":scope > summary").click({ timeout: 2000 }).catch(() => failures.push(`${topic}: optional disclosure not operable without JavaScript`));
      if ((await disclosure.getAttribute("open")) === null || !(await disclosure.innerText()).trim()) failures.push(`${topic}: optional disclosure did not open without JavaScript`);
    }
    if (result.controls.length) failures.push(`${topic}: inert controls visible: ${result.controls.join(", ")}`);
    for (const item of result.missing) failures.push(`${topic}: missing from the no-JavaScript reading: ${item}`);
    console.log(`${topic}: ${result.checked} required passages, ${result.missing.length} missing, ${result.controls.length} visible controls`);
    await context.close();

    const scripted = await browser.newContext();
    const live = await scripted.newPage();
    await live.goto(url);
    const leaked = await live.evaluate(() => [...document.querySelectorAll(".pep-nojs-reading")].length);
    if (leaked) failures.push(`${topic}: the reading version renders while JavaScript is on`);
    await scripted.close();
  }
} finally {
  await browser.close();
}
if (failures.length) {
  console.error(failures.join("\n"));
  process.exitCode = 1;
} else {
  console.log("no-JavaScript reading: all topics complete");
}
