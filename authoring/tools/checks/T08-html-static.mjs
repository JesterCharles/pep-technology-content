import { spawnSync } from "node:child_process";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import { error, evidencePath, findCourses, readJson } from "../lib/common.mjs";

export const id = "T08";
export const gate = 8;
export const description = "static HTML contract";

const ANSWER_SCANNER = fileURLToPath(new URL("../qa/python-answer-scan.py", import.meta.url));

function metas(html) {
  const out = {};
  for (const m of html.matchAll(/<meta\s+[^>]*name=["'](pep:[^"']+)["'][^>]*>/gi)) {
    const c = m[0].match(/content=["']([^"']*)["']/i);
    if (c) out[m[1].toLowerCase()] = c[1];
  }
  return out;
}

async function launchParserBrowser() {
  try {
    return await chromium.launch({ headless: true });
  } catch (cause) {
    if (!/Executable doesn't exist/.test(cause.message)) throw cause;
    return chromium.launch({ channel: "chrome", headless: true });
  }
}

function scriptStrings(source) {
  const strings = [];
  let quote = "";
  let value = "";
  let escaped = false;
  let lineComment = false;
  let blockComment = false;
  for (let index = 0; index < source.length; index++) {
    const char = source[index];
    const next = source[index + 1];
    if (lineComment) {
      if (char === "\n") lineComment = false;
      continue;
    }
    if (blockComment) {
      if (char === "*" && next === "/") { blockComment = false; index++; }
      continue;
    }
    if (!quote && char === "/" && next === "/") { lineComment = true; index++; continue; }
    if (!quote && char === "/" && next === "*") { blockComment = true; index++; continue; }
    if (!quote && (char === "'" || char === '"' || char === "`")) {
      quote = char;
      value = "";
      continue;
    }
    if (!quote) continue;
    if (escaped) {
      value += char;
      escaped = false;
      continue;
    }
    if (char === "\\") {
      escaped = true;
      continue;
    }
    if (char === quote) {
      strings.push(value);
      quote = "";
      value = "";
      continue;
    }
    value += char;
  }
  return strings;
}

function recursiveStrings(value, out = []) {
  if (typeof value === "string") out.push(value);
  else if (Array.isArray(value)) value.forEach((item) => recursiveStrings(item, out));
  else if (value && typeof value === "object") Object.values(value).forEach((item) => recursiveStrings(item, out));
  return out;
}

function scanPythonAnswers(strings, targets) {
  const result = spawnSync("python3", [ANSWER_SCANNER], {
    input: JSON.stringify({ strings, targets }),
    encoding: "utf8",
  });
  if (result.status !== 0) throw new Error(`Python answer scanner failed: ${result.stderr.trim()}`);
  return JSON.parse(result.stdout).findings ?? [];
}

async function inspectHtml(html, browser) {
  const ownBrowser = browser ?? await launchParserBrowser();
  const context = await ownBrowser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  try {
    await page.setContent(html, { waitUntil: "load" });
    return await page.evaluate(() => {
      const normalize = (value) => (value ?? "").replace(/\s+/gu, " ").trim();
      const direct = (element, selector) => [...element.querySelectorAll(selector)]
        .filter((node) => node.closest("details") === element);
      const directSummary = (details) => [...details.children].find((child) => child.tagName === "SUMMARY");
      const focusableHeading = (activity) => {
        const id = activity.getAttribute("aria-labelledby");
        const heading = id && document.getElementById(id);
        return heading && activity.contains(heading) && /^H[1-6]$/.test(heading.tagName) &&
          (heading.hasAttribute("tabindex") || /^(A|BUTTON|INPUT|SELECT|TEXTAREA)$/.test(heading.tagName));
      };
      const problems = { optional: [], guidance: [] };
      const answerSources = [];

      const optionalMarkers = [...document.querySelectorAll("[data-pep-optional]")];
      const optionals = optionalMarkers.filter((node) => node.tagName === "DETAILS");
      if (optionalMarkers.length !== optionals.length) {
        problems.optional.push("every data-pep-optional marker must be on a complete native <details> disclosure");
      }
      const seenKinds = new Set();
      for (const disclosure of optionals) {
        const kind = disclosure.dataset.pepOptional?.toLowerCase() ?? "";
        if (!["anecdote", "challenge"].includes(kind)) {
          problems.optional.push(`unknown optional disclosure kind ${JSON.stringify(kind)}`);
          continue;
        }
        if (seenKinds.has(kind)) problems.optional.push(`optional ${kind} disclosure must not be duplicated`);
        seenKinds.add(kind);
        if (!disclosure.classList.contains("pep-optional") || !disclosure.classList.contains(`pep-optional--${kind}`)) {
          problems.optional.push(`optional ${kind} disclosure must use pep-optional and pep-optional--${kind} classes`);
        }
        if (!disclosure.hasAttribute("data-section-skip")) problems.optional.push(`optional ${kind} disclosure must carry data-section-skip`);
        if (disclosure.open) problems.optional.push(`optional ${kind} disclosure must be closed by default`);
        const summary = directSummary(disclosure);
        const label = normalize(summary?.textContent);
        if (!summary || !label) problems.optional.push(`optional ${kind} disclosure requires a non-empty summary`);
        if (kind === "anecdote" && (!label.includes("Another way to think about it") || !label.includes("Optional example"))) {
          problems.optional.push("optional anecdote summary must include “Another way to think about it” and “Optional example”");
        }
        if (kind === "anecdote") {
          const stories = direct(disclosure, "[data-pep-anecdote-story]");
          const maps = direct(disclosure, "[data-pep-anecdote-map]");
          if (stories.length !== 1 || !normalize(stories[0]?.textContent)) {
            problems.optional.push("optional anecdote requires exactly one non-empty data-pep-anecdote-story");
          }
          if (maps.length > 1 || maps.some((item) => !normalize(item.textContent))) {
            problems.optional.push("optional anecdote may have at most one non-empty data-pep-anecdote-map sentence");
          }
          const map = normalize(maps[0]?.textContent);
          if (map && (map.split(/\s+/u).length > 25 || (map.match(/[.!?](?:\s|$)/gu) ?? []).length > 1)) {
            problems.optional.push("optional anecdote concept mapping must be one short plain-language sentence");
          }
          if (disclosure.querySelector("pre, code, kbd, samp, textarea, output, [data-code-block], [data-command], [data-output]")) {
            problems.optional.push("optional anecdote must be code-free");
          }
          const prose = normalize([...stories, ...maps].map((item) => item.textContent).join(" "));
          if (/(?:=>|===|\+\+|--|\[[^\]]+\bfor\b[^\]]+\]|\b(?:print|console\.log)\s*\(|(?:^|\s)(?:git|npm|python3?)\s+\S)/u.test(prose)) {
            problems.optional.push("optional anecdote must not contain code, syntax, commands or exact program output");
          }
        }
        if (kind === "challenge" && label !== "Challenge (optional)") problems.optional.push("optional challenge summary must be exactly “Challenge (optional)”");
        if (kind === "challenge" && (!disclosure.querySelector("[data-pep-optional-time]") || !disclosure.querySelector("[data-pep-success-criteria]"))) {
          problems.optional.push("optional challenge requires optional time and success criteria");
        }
        if (disclosure.querySelector("[data-interaction], [data-confidence], [data-pep-objectives], [data-pep-progress], [data-pep-complete]")) {
          problems.optional.push(`optional ${kind} disclosure must not carry required objective, interaction, progress or completion hooks`);
        }
        if (disclosure.querySelector("[data-solution], [data-pep-solution], [data-answer-key], [data-pep-answer-key], [data-rubric], [data-secret-test], [data-reference-implementation]")) {
          problems.optional.push(`optional ${kind} disclosure must not expose answer or scoring material`);
        }
      }

      const instructions = document.querySelector("[data-pep-instructions]");
      const workspace = document.querySelector("[data-pep-workspace]");
      const responsive = document.querySelector("[data-pep-responsive]");
      if (Boolean(instructions) !== Boolean(workspace) ||
          (instructions && workspace && Boolean(instructions.compareDocumentPosition(workspace) & Node.DOCUMENT_POSITION_PRECEDING)) ||
          (responsive && !instructions)) {
        problems.optional.push("data-pep-instructions and data-pep-workspace must both exist, with instructions first");
      }
      if (document.querySelector('[data-pep-workspace="code"]') && !document.querySelector("noscript[data-pep-no-js]")) {
        problems.optional.push("a code workspace requires a noscript[data-pep-no-js] reading");
      }

      const enrolled = [...document.querySelectorAll("main[data-pep-guidance-contract]")];
      if (!enrolled.length) {
        return { ...problems, answerSources, hasGuidanceMarker: false, hintCount: 0, answerDeclaration: null, scripts: [] };
      }
      if (enrolled.length !== 1) problems.guidance.push("guidance-contract pages require exactly one enrolled root main");
      const root = enrolled[0];
      if (!root || root.parentElement?.closest("main[data-pep-guidance-contract]")) {
        problems.guidance.push("the guidance-contract main must be the single enrolled root");
      }
      if ([...document.querySelectorAll("h1, h2, h3, p, legend")].some((node) => normalize(node.textContent) === "Goals")) {
        problems.guidance.push("guidance-contract pages must not label course objectives or activity checks as Goals");
      }

      const topicbar = root?.querySelector(".pep-topicbar");
      const objectives = [...root?.querySelectorAll("details[data-pep-objectives]") ?? []];
      if (objectives.length !== 1 || !topicbar?.contains(objectives[0])) {
        problems.guidance.push("guidance-contract pages require one native objectives disclosure in the topic bar");
      } else {
        const objective = objectives[0];
        const summary = directSummary(objective);
        const label = normalize(summary?.textContent);
        const controls = summary?.getAttribute("aria-controls") ?? "";
        const body = controls && document.getElementById(controls);
        if (!["Objectives", "What you’ll learn", "What you'll learn"].includes(label)) {
          problems.guidance.push("course objectives must have an accepted non-empty label");
        }
        if (!controls || !body || !objective.contains(body) || !normalize(body.textContent) ||
            ![...body.querySelectorAll("li")].some((item) => normalize(item.textContent))) {
          problems.guidance.push("objectives summary aria-controls must resolve to a non-empty descendant objective list");
        }
      }

      const activities = [...root?.querySelectorAll("section[data-pep-activity]") ?? []];
      const activityIds = activities.map((activity) => activity.id);
      if (!activities.length || activityIds.some((value) => !value) || new Set(activityIds).size !== activityIds.length) {
        problems.guidance.push("guided activities require unique non-empty ids");
      }
      const timeline = [...root?.querySelectorAll("a[data-pep-activity-link]") ?? []];
      if (timeline.length !== activities.length || timeline.some((link, index) => link.getAttribute("href") !== `#${activityIds[index]}`)) {
        problems.guidance.push("one ordered timeline anchor must resolve to each activity id");
      }
      activities.forEach((activity, index) => {
        if (!focusableHeading(activity)) problems.guidance.push(`activity ${JSON.stringify(activity.id)} requires a focusable labelled heading`);
        const tasks = [...activity.querySelectorAll("[data-pep-task]")];
        if (!tasks.length) problems.guidance.push(`activity ${JSON.stringify(activity.id)} requires a non-empty task`);
        const checks = [...activity.querySelectorAll("[data-pep-activity-checks]")];
        if (checks.length !== 1 ||
            ![...checks[0]?.querySelectorAll("p, li") ?? []].some((item) => normalize(item.textContent)) ||
            ![...checks[0]?.querySelectorAll("h2, h3") ?? []].some((heading) => /^(What success looks like|Activity checks)$/u.test(normalize(heading.textContent)))) {
          problems.guidance.push(`activity ${JSON.stringify(activity.id)} requires exactly one non-empty accepted activity-check block`);
        }
        if (tasks[0] && checks[0] && Boolean(tasks[0].compareDocumentPosition(checks[0]) & Node.DOCUMENT_POSITION_PRECEDING)) {
          problems.guidance.push(`activity ${JSON.stringify(activity.id)} activity checks must follow its task`);
        }
        if (!tasks.some((task) => [...task.querySelectorAll("h2, h3")].some((heading) => normalize(heading.textContent).includes("Your task"))) &&
            ![...activity.querySelectorAll("h2, h3")].some((heading) => normalize(heading.textContent).includes("Your task"))) {
          problems.guidance.push(`activity ${JSON.stringify(activity.id)} requires a Your task heading naming the action and location`);
        }
        const back = [...activity.querySelectorAll("a[data-pep-back-link]")];
        if (index === 0 && back.length) problems.guidance.push("the first activity must not contain a predecessor back link");
        if (index > 0 && (back.length !== 1 || back[0].getAttribute("href") !== `#${activityIds[index - 1]}`)) {
          problems.guidance.push(`activity ${JSON.stringify(activity.id)} requires exactly one back link to its predecessor`);
        }
      });

      if (!root?.querySelector("button[data-pep-previous]") || !root?.querySelector("button[data-pep-next]")) {
        problems.guidance.push("guided activities require Previous activity and Continue/Next button actions");
      }

      for (const fit of root?.querySelectorAll("section[data-pep-where-fits]") ?? []) {
        const fields = ["decision", "good", "boundary"].map((name) => [...fit.querySelectorAll(`[data-pep-fit-${name}]`)]);
        if (!/^Where this fits$|^When and why$/u.test(normalize(fit.querySelector("h2")?.textContent)) ||
            fields.some((items) => items.length !== 1 || !normalize(items[0]?.textContent))) {
          problems.guidance.push("Where this fits requires a heading and one non-empty decision, good-fit and boundary field");
        } else if (fields.some((items, index) => index > 0 && Boolean(fields[index - 1][0].compareDocumentPosition(items[0]) & Node.DOCUMENT_POSITION_PRECEDING))) {
          problems.guidance.push("Where this fits fields must appear in decision, good-fit, boundary order");
        }
        const firstTask = root.querySelector("[data-pep-task]");
        const teaching = root.querySelector("[data-pep-teaching]");
        if ((teaching && Boolean(teaching.compareDocumentPosition(fit) & Node.DOCUMENT_POSITION_PRECEDING)) ||
            (firstTask && Boolean(fit.compareDocumentPosition(firstTask) & Node.DOCUMENT_POSITION_PRECEDING))) {
          problems.guidance.push("Where this fits must follow its teaching and precede the relevant task or workspace");
        }
      }

      const tasks = [...root?.querySelectorAll("[data-pep-task]") ?? []];
      const taskIds = tasks.map((task) => task.id);
      if (taskIds.some((value) => !value) || new Set(taskIds).size !== taskIds.length) {
        problems.guidance.push("guided tasks require unique non-empty ids");
      }
      const hintMarkers = [...root?.querySelectorAll("[data-pep-hint]") ?? []];
      const hints = hintMarkers.filter((node) => node.tagName === "DETAILS");
      if (hints.length !== hintMarkers.length) problems.guidance.push("every data-pep-hint must be a native details disclosure");
      const names = new Set();
      for (const task of tasks.filter((item) => item.hasAttribute("data-pep-may-stall"))) {
        const sequence = hints.filter((hint) => hint.dataset.pepHintFor === task.id);
        if (!sequence.length) {
          problems.guidance.push(`task ${JSON.stringify(task.id)} may stall and requires a native hint disclosure`);
          continue;
        }
        sequence.forEach((hint, index) => {
          const order = Number(hint.dataset.pepHintOrder);
          if (order !== index + 1) problems.guidance.push(`hints for task ${JSON.stringify(task.id)} must use 1..N in DOM order`);
          if (hint.open || !hint.hasAttribute("data-section-skip")) problems.guidance.push("hints must be closed by default and carry data-section-skip");
          if (index > 0 && hint.parentElement?.closest("details[data-pep-hint]") !== sequence[index - 1]) {
            problems.guidance.push(`hint ${index + 1} for task ${JSON.stringify(task.id)} must be nested inside its predecessor`);
          }
          const summary = directSummary(hint);
          const name = normalize(summary?.textContent);
          const taskLabel = normalize(activityIds.map((id, activityIndex) => activities[activityIndex].contains(task) ? `Activity ${activityIndex + 1}` : "").find(Boolean));
          const expectedLead = index === 0 ? "Need a hint?" : "Another hint";
          if (!name.includes(expectedLead) || !name.includes(`${index + 1} of ${sequence.length}`) || !name.includes(taskLabel)) {
            problems.guidance.push(`hint ${index + 1} for task ${JSON.stringify(task.id)} requires a unique ordinal and activity label`);
          }
          if (!name || names.has(name.toLowerCase())) problems.guidance.push("hint accessible names must be non-empty and unique across the page");
          names.add(name.toLowerCase());
          const owned = (selector) => [...hint.querySelectorAll(selector)].filter((node) => node.closest("details[data-pep-hint]") === hint);
          const targets = owned("[data-pep-hint-target]");
          const steps = owned("[data-pep-hint-step]");
          if (targets.length !== 1 || steps.length !== 1 || !normalize(targets[0]?.textContent) || !normalize(steps[0]?.textContent)) {
            problems.guidance.push("each hint requires exactly one non-empty target and next reasoning step");
          }
          const clue = normalize(`${targets[0]?.textContent ?? ""} ${steps[0]?.textContent ?? ""}`).toLowerCase();
          if (sequence.slice(0, index).some((earlier) => {
            const parts = [...earlier.querySelectorAll("[data-pep-hint-target], [data-pep-hint-step]")]
              .filter((node) => node.closest("details[data-pep-hint]") === earlier);
            return normalize(parts.map((part) => part.textContent).join(" ")).toLowerCase() === clue;
          })) problems.guidance.push(`hints for task ${JSON.stringify(task.id)} must not duplicate normalized clue text`);
          if (hint.querySelector("[data-interaction], [data-confidence], [data-pep-objectives], [data-pep-progress], [data-pep-complete]")) {
            problems.guidance.push("hints must not carry required objective, interaction, progress or completion hooks");
          }
        });
      }
      if (hints.some((hint) => !taskIds.includes(hint.dataset.pepHintFor ?? ""))) problems.guidance.push("hint ownership must equal an exact task id");

      const sensitive = [...root?.querySelectorAll("[data-pep-answer-sensitive]") ?? []];
      let answerDeclaration = null;
      if (sensitive.length) {
        if (sensitive.length !== 1 || sensitive[0].dataset.pepAnswerSensitive !== "python-comprehension") {
          problems.guidance.push("answer-sensitive guidance requires one supported task declaration");
        } else {
          const targets = (sensitive[0].dataset.pepAnswerTargets ?? "").split(/\s+/u).filter(Boolean);
          if (!targets.length) problems.guidance.push("answer-sensitive guidance requires declared target names");
          answerDeclaration = { task: `#${sensitive[0].id}`, language: "python-comprehension", targets };
          const activityScope = sensitive[0].closest("[data-pep-activity]") ?? sensitive[0];
          const scoped = new Set([activityScope, ...activityScope.querySelectorAll("*"),
            ...root.querySelectorAll("noscript, template, [data-static-alt], [data-pep-where-fits], [data-pep-optional=\"anecdote\"]")]);
          for (const node of scoped) {
            const sourceText = node.tagName === "TEMPLATE" ? node.content.textContent : node.textContent;
            if (normalize(sourceText)) answerSources.push(sourceText);
            for (const attribute of node.attributes) answerSources.push(attribute.value);
          }
        }
      }
      const scripts = [...document.scripts].map((script) => script.textContent ?? "");
      return { ...problems, answerSources, hasGuidanceMarker: true, hintCount: hints.length, answerDeclaration, scripts };
    });
  } finally {
    await context.close();
    if (!browser) await ownBrowser.close();
  }
}

export async function validateHtmlContracts(html, options = {}) {
  const snapshot = await inspectHtml(html, options.browser);
  const answerProblems = [];
  const specDeclaration = options.spec?.answerSafety ?? null;
  if (Boolean(snapshot.answerDeclaration) !== Boolean(specDeclaration)) {
    answerProblems.push("HTML and QA must declare answer-sensitive scanning together");
  } else if (snapshot.answerDeclaration &&
      JSON.stringify(snapshot.answerDeclaration) !== JSON.stringify(specDeclaration)) {
    answerProblems.push("HTML and QA answer-sensitive declarations must match exactly");
  }
  if (snapshot.answerDeclaration) {
    const strings = [
      ...snapshot.answerSources,
      ...snapshot.scripts.flatMap(scriptStrings),
      ...recursiveStrings(options.spec ?? {}),
    ];
    if (scanPythonAnswers(strings, snapshot.answerDeclaration.targets).length) {
      answerProblems.push("answer-sensitive public bytes contain a complete target comprehension expression");
    }
  }
  return {
    optional: snapshot.optional,
    guidance: [...snapshot.guidance, ...answerProblems],
    hasGuidanceMarker: snapshot.hasGuidanceMarker,
    hintCount: snapshot.hintCount,
  };
}

export async function validateOptionalDisclosures(html) {
  return (await validateHtmlContracts(html)).optional;
}

export async function validateLearnerGuidance(html, spec) {
  return (await validateHtmlContracts(html, { spec })).guidance;
}

export async function run(ctx) {
  const out = [];
  const browser = await launchParserBrowser();
  try {
    for (const course of await findCourses(ctx)) {
      const c = course.manifest;
      const cr = course.contentRoot;
      for (const mid of c.moduleOrder ?? []) {
        const m = await readJson(path.join(course.catalogRoot, mid, "module.json")).catch(() => null);
        if (!m) continue;
        for (const tid of m.topicOrder ?? []) {
          const tf = path.join(course.catalogRoot, mid, tid, "topic.json");
          const t = await readJson(tf).catch(() => null);
          if (!t || t.artifacts?.html?.status !== "present") continue;
          const f = path.join(cr, mid, tid, "artifact.html");
          const html = await readFile(f, "utf8").catch(() => null);
          if (html == null) continue;
          if (/<(?:script|img|link|source|video|audio|iframe|object|embed)\b[^>]*(?:src|href|data)=["'](?:https?:|\/\/|data:)/i.test(html) ||
              /url\(\s*["']?(?:https?:|\/\/|data:)/i.test(html) || /@font-face/i.test(html)) {
            out.push(error(id, ctx.display(f), "remote or data resource load is forbidden"));
          }
          if (/<form\b|type=["']submit["']|\.requestSubmit\s*\(|\.submit\s*\(/i.test(html)) out.push(error(id, ctx.display(f), "form submission dependency is forbidden"));
          if (!/data-interaction(?:\s|=|>)/i.test(html)) out.push(error(id, ctx.display(f), "data-interaction marker is required"));
          const specFile = evidencePath(course.repoRoot, c.id, mid, tid, "qa-paths.json");
          const spec = await readJson(specFile).catch(() => null);
          const checked = await validateHtmlContracts(html, { browser, spec });
          for (const problem of [...checked.optional, ...checked.guidance]) out.push(error(id, ctx.display(f), problem));
          const marker = checked.hasGuidanceMarker;
          if (marker !== Boolean(spec?.guidance)) out.push(error(id, ctx.display(f), "data-pep-guidance-contract and QA guidance must be present together"));
          if (marker && Boolean(spec?.guidance?.hints) !== (checked.hintCount > 0)) out.push(error(id, ctx.display(f), "guidance.hints must be present exactly when the page contains hints"));
          const got = metas(html);
          const want = {
            "pep:course": c.id,
            "pep:module": m.id,
            "pep:topic": t.title,
            "pep:topic-id": t.id,
            "pep:budget-minutes": String(t.minutes?.budget),
            "pep:source": t.freshness?.sourcesRef,
          };
          for (const [name, val] of Object.entries(want)) if (got[name] !== val) out.push(error(id, ctx.display(f), `${name} must equal topic.json value ${JSON.stringify(val)}`));
        }
      }
    }
  } finally {
    await browser.close();
  }
  return out;
}
