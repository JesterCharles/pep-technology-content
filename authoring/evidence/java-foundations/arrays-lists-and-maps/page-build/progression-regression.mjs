#!/usr/bin/env node
/* Behavioural regression for the completion correction on all four pages. Two runs of edited code, including
   identical edits, unlock unlimited ungraded navigation but never completion or credit. Finishing the final
   activity while code remains open names and links that activity and keeps the recap hidden. A synthetic engine
   result (no learner answer) then proves completion, and Restart makes completion stale until another pass.
   Every typed value is public and non-answer-bearing; no completed solution is typed.
   Usage: node authoring/evidence/java-foundations/arrays-lists-and-maps/page-build/progression-regression.mjs */
import path from "node:path";
import { pathToFileURL } from "node:url";
import { launchChromium } from "../../../../tools/qa/harness.mjs";

const repo = path.resolve(path.dirname(new URL(import.meta.url).pathname), "../../../../..");
const page = (topic) => pathToFileURL(path.join(repo, "java-foundations/arrays-lists-and-maps", topic, "artifact.html")).href;
const predict = [{ check: "input[name=predict][value=a]" }, { check: "input[name=pconf][value=low]" }, { click: "#predict-check" }];
const next = [{ click: "#next-activity" }];
const clicks = (selector, n) => Array.from({ length: n }, () => ({ click: selector }));
const trace = (target, steps) => [{ check: `input[name=bs-target][value="${target}"]` }, ...steps.map((s) => ({ click: `[data-act=${s}]` }))];
const PAGES = [
  { topic: "declaring-and-looping-over-arrays", code: 3, apply: "b",
    before: [...predict, ...next, { click: "[data-act=read]" }, { click: "[data-act=write]" }, ...clicks("[data-act=inc]", 4), { click: "[data-act=read]" }, { click: "[data-act=inc]" }, { click: "[data-act=read]" }, ...next] },
  { topic: "linear-and-binary-search", code: 2, apply: "c", before: [...predict, ...next],
    between: [...trace(58, ["higher", "higher", "lower", "found"]), ...trace(40, ["higher", "lower", "lower", "higher", "missing"]), ...next] },
  { topic: "arraylist-basics", code: 3, apply: "b",
    before: [...predict, ...next, { click: "[data-act=add]" }, { click: "[data-act=remove]" }, { click: "[data-act=set]" }, ...clicks("[data-act=inc]", 9), { click: "[data-act=get]" }, ...next] },
  { topic: "hashmap-basics", code: 3, apply: "b",
    before: [...predict, ...next, { click: "#mp-put" }, { check: "input[name=map-key][value=pear]" }, { click: "#mp-put" }, { check: "input[name=map-key][value=kiwi]" }, { click: "#mp-get" }, { click: "#mp-contains" }, ...next] },
];

async function act(p, steps) {
  for (const step of steps) {
    if (step.check) await p.check(step.check);
    else await p.click(step.click);
  }
}
async function state(p, n) {
  return p.evaluate((n) => {
    const s = document.getElementById(`activity-${n}`), m = document.getElementById("lesson");
    return {
      completed: s.dataset.pepCompleted, credit: s.dataset.pepCredit, grade: s.dataset.pepGrade, cont: s.dataset.pepContinue,
      attempts: s.dataset.pepAttempts, checksDone: s.querySelectorAll("[data-goal].done").length, checks: s.querySelectorAll("[data-goal]").length,
      complete: m.dataset.pepComplete, unlocked: m.dataset.pepUnlockedThrough, step: document.querySelectorAll("[data-pep-activity-link] .pep-step__state")[n - 1].textContent,
      progress: document.getElementById("prog-text").textContent, feedback: s.querySelector("[data-pep-feedback]").textContent,
      current: m.dataset.pepCurrentActivity, recapPending: document.getElementById("recap").classList.contains("is-pending"),
      recapDisplay: getComputedStyle(document.getElementById("recap")).display,
    };
  }, n);
}
async function run(p, code) {
  await p.fill("#ed .pep-editor__input", code);
  await p.click("#ed .pep-editor__run");
}
function never(label, s, failures) {
  const bad = [];
  if (s.completed !== "false") bad.push("completed");
  if (s.credit !== "0") bad.push("credit");
  if (s.grade !== "0") bad.push("grade");
  if (s.checksDone === s.checks) bad.push("all checks done");
  if (s.complete !== "false") bad.push("page complete");
  if (/done/.test(s.step)) bad.push("timeline done");
  if (bad.length) failures.push(`${label}: ${bad.join(", ")}`);
}

const browser = await launchChromium();
let failures = [];
try {
  for (const entry of PAGES) {
    const p = await browser.newPage();
    const errors = [];
    p.on("pageerror", (error) => errors.push(error.message));
    await p.goto(page(entry.topic));
    await act(p, entry.before);
    const n = entry.code, label = (x) => `${entry.topic} ${x}`;
    const starter = await p.inputValue("#ed .pep-editor__input");
    const local = [];
    await run(p, starter);
    let s = await state(p, n);
    if (s.attempts !== "0" || !/Not run yet/.test(s.feedback)) local.push(`${label("unchanged starter")}: counted as an attempt`);
    never(label("unchanged starter"), s, local);
    await run(p, "this is not java");
    s = await state(p, n);
    never(label("non-runnable run 1"), s, local);
    if (s.cont !== "false") local.push(`${label("non-runnable run 1")}: Continue available after one try`);
    await run(p, "this is not java");
    s = await state(p, n);
    never(label("identical edited run 2"), s, local);
    if (s.cont !== "true" || +s.unlocked <= n) local.push(`${label("identical edited run 2")}: no ungraded navigation after two edited runs`);
    if (!/not marked done/.test(s.feedback)) local.push(`${label("incorrect run 2")}: feedback does not say the activity stays open`);
    if (!/still open/.test(s.progress)) local.push(`${label("incorrect run 2")}: progress does not count it as still open`);
    await run(p, "still ; not java");
    s = await state(p, n);
    never(label("non-runnable run 3"), s, local);
    await act(p, next);
    if (entry.between) await act(p, entry.between);
    await act(p, [{ check: `input[name=apply-a][value=${entry.apply}]` }, { check: "input[name=conf][value=low]" }, { click: "#apply-check" }]);
    s = await state(p, n);
    never(label("after every other activity"), s, local);
    const final = await p.evaluate((n) => {
      const fb = document.querySelector("#activity-4 [data-pep-feedback]");
      const link = fb.querySelector(`[data-pep-back-link][href="#activity-${n}"]`);
      return { text: fb.textContent, linked: !!link };
    }, n);
    if (!final.linked || !final.text.includes(`Activity ${n}`) || !/still open/.test(final.text)) local.push(`${label("final activity")}: open code activity was not named and linked`);
    if (final.text.includes(`Activity ${n} of 4`)) local.push(`${label("open-note title regression")}: activity ordinal was repeated inside the title`);
    if (!s.recapPending || s.recapDisplay !== "none") local.push(`${label("final activity")}: recap was not stale and hidden`);
    const others = await p.evaluate((n) => [...document.querySelectorAll("[data-pep-activity]")].filter((x, i) => i + 1 !== n).every((x) => x.dataset.pepCompleted === "true"), n);
    if (!others) local.push(`${label("route")}: the other three activities did not all complete, so the page-completion assertion proved nothing`);
    await p.click(`#activity-4 [data-pep-back-link][href="#activity-${n}"]`);
    await p.evaluate((n) => {
      window.JMINI.parse = () => ({ problems: [], prog: {} });
      window.TOPIC.code.evaluate = () => {
        const goals = {};
        document.querySelectorAll(`#activity-${n} [data-goal]`).forEach((x) => { goals[x.dataset.goal] = true; });
        return { status: "ok", lines: ["engine regression pass"], summary: "Synthetic engine pass.", feedback: "Synthetic engine pass.", goals };
      };
    }, n);
    await run(p, "engine regression pass");
    s = await state(p, n);
    if (s.completed !== "true" || s.credit !== "1" || s.grade !== "1" || s.complete !== "true" || s.recapPending || s.recapDisplay === "none") local.push(`${label("return and pass")}: completion or current recap state is wrong`);
    const staleOpenNote = await p.evaluate(() => ({ count: document.querySelectorAll("[data-pep-open-note]").length, text: document.querySelector("#activity-4 [data-pep-feedback]").textContent }));
    if (staleOpenNote.count || /still open/.test(staleOpenNote.text)) local.push(`${label("open-note retraction regression")}: stale open note remained after the named activity passed`);
    const beforeNoop = await p.inputValue("#ed .pep-editor__input");
    await p.locator("#ed .pep-editor__input").evaluate((el) => el.setSelectionRange(0, 0));
    await p.press("#ed .pep-editor__input", "Shift+Tab");
    const afterNoop = await p.inputValue("#ed .pep-editor__input");
    s = await state(p, n);
    if (afterNoop !== beforeNoop || s.completed !== "true" || s.credit !== "1" || s.grade !== "1" || s.complete !== "true" || s.recapPending || s.recapDisplay === "none") local.push(`${label("byte-identical Shift+Tab")}: a no-op edit changed bytes or invalidated completion, credit or recap`);
    await p.fill("#ed .pep-editor__input", "answer-free stale edit");
    s = await state(p, n);
    if (s.completed !== "false" || s.credit !== "0" || s.grade !== "0" || s.complete !== "false" || !s.recapPending || s.recapDisplay !== "none" || s.unlocked !== "4") local.push(`${label("edit after pass")}: stale completion, credit, grade, recap or navigation state is wrong`);
    await p.evaluate(() => {
      window.TOPIC.code.evaluate = () => ({ status: "mismatch", lines: ["synthetic nonpass"], summary: "Synthetic nonpass.", feedback: "Synthetic nonpass.", goals: {} });
    });
    await run(p, "answer-free stale edit");
    s = await state(p, n);
    if (s.completed !== "false" || s.credit !== "0" || s.grade !== "0" || s.complete !== "false" || !s.recapPending || s.recapDisplay !== "none") local.push(`${label("nonpass after stale edit")}: stale result returned after a nonpassing run`);
    await p.evaluate((n) => {
      window.TOPIC.code.evaluate = () => {
        const goals = {};
        document.querySelectorAll(`#activity-${n} [data-goal]`).forEach((x) => { goals[x.dataset.goal] = true; });
        return { status: "ok", lines: ["engine regression repass"], summary: "Synthetic engine repass.", feedback: "Synthetic engine repass.", goals };
      };
    }, n);
    await run(p, "answer-free synthetic repass");
    s = await state(p, n);
    if (s.completed !== "true" || s.credit !== "1" || s.grade !== "1" || s.complete !== "true" || s.recapPending || s.recapDisplay === "none") local.push(`${label("genuine repass")}: current completion was not restored`);
    await p.click("#reset");
    s = await state(p, n);
    if (s.completed !== "false" || s.credit !== "0" || s.grade !== "0" || s.complete !== "false" || !s.recapPending || s.recapDisplay !== "none" || s.unlocked !== "4") local.push(`${label("Restart credited code")}: stale completion/credit/recap or navigation access is wrong`);
    await run(p, "engine regression pass again");
    s = await state(p, n);
    if (s.complete !== "true" || s.recapPending || s.recapDisplay === "none") local.push(`${label("pass after Restart")}: recap did not become current again`);
    if (errors.length) local.push(`${label("page errors")}: ${errors.join("; ")}`);
    console.log(`${local.length ? "FAIL" : "OK  "} ${entry.topic}`);
    failures = failures.concat(local);
    await p.close();
  }
} finally {
  await browser.close();
}
for (const failure of failures) console.log(`  ${failure}`);
console.log(`fails ${failures.length}`);
if (failures.length) process.exitCode = 1;
