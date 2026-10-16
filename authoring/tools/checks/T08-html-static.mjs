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

function decodeEscape(source, index) {
  const char = source[index];
  const simple = { n: "\n", r: "\r", t: "\t", b: "\b", f: "\f", v: "\v", 0: "\0" };
  if (char === "\n") return { value: "", end: index + 1 };
  if (char === "\r") return { value: "", end: source[index + 1] === "\n" ? index + 2 : index + 1 };
  if (simple[char] !== undefined) return { value: simple[char], end: index + 1 };
  if (char === "x" && /^[0-9a-f]{2}$/iu.test(source.slice(index + 1, index + 3))) {
    return { value: String.fromCodePoint(Number.parseInt(source.slice(index + 1, index + 3), 16)), end: index + 3 };
  }
  if (char === "u" && source[index + 1] === "{") {
    const close = source.indexOf("}", index + 2);
    const hex = close >= 0 ? source.slice(index + 2, close) : "";
    if (/^[0-9a-f]{1,6}$/iu.test(hex) && Number.parseInt(hex, 16) <= 0x10ffff) {
      return { value: String.fromCodePoint(Number.parseInt(hex, 16)), end: close + 1 };
    }
  }
  if (char === "u" && /^[0-9a-f]{4}$/iu.test(source.slice(index + 1, index + 5))) {
    return { value: String.fromCodePoint(Number.parseInt(source.slice(index + 1, index + 5), 16)), end: index + 5 };
  }
  return { value: char ?? "", end: index + 1 };
}

function staticJsSources(source) {
  const tokens = [];
  const comments = [];
  for (let index = 0; index < source.length;) {
    if (/\s/u.test(source[index])) { index++; continue; }
    if (source[index] === "/" && source[index + 1] === "/") {
      const end = source.indexOf("\n", index + 2);
      comments.push(source.slice(index + 2, end < 0 ? source.length : end));
      index = end < 0 ? source.length : end;
      continue;
    }
    if (source[index] === "/" && source[index + 1] === "*") {
      const end = source.indexOf("*/", index + 2);
      comments.push(source.slice(index + 2, end < 0 ? source.length : end));
      index = end < 0 ? source.length : end + 2;
      continue;
    }
    const quote = source[index];
    if (quote === "'" || quote === '"' || quote === "`") {
      let value = "";
      let substitution = false;
      let cursor = index + 1;
      for (; cursor < source.length; cursor++) {
        const char = source[cursor];
        if (char === "\\") {
          const decoded = decodeEscape(source, cursor + 1);
          value += decoded.value;
          cursor = decoded.end - 1;
        } else if (quote === "`" && char === "$" && source[cursor + 1] === "{") {
          substitution = true;
          break;
        } else if (char === quote) {
          cursor++;
          break;
        } else value += char;
      }
      tokens.push({ type: "string", value, complete: !substitution });
      index = cursor;
      continue;
    }
    if ("+()".includes(source[index])) tokens.push({ type: source[index], value: source[index++] });
    else {
      let end = index + 1;
      while (end < source.length && !/[\s+'"`()]/u.test(source[end])) end++;
      tokens.push({ type: "other", value: source.slice(index, end) });
      index = end;
    }
  }
  const strings = tokens.filter((token) => token.type === "string").map((token) => token.value);
  const parseAtom = (start) => {
    const token = tokens[start];
    if (token?.type === "string" && token.complete) return { value: token.value, end: start + 1 };
    if (token?.type === "(") {
      const inner = parseChain(start + 1);
      if (inner && tokens[inner.end]?.type === ")") return { value: inner.value, end: inner.end + 1 };
    }
    return null;
  };
  const parseChain = (start) => {
    let result = parseAtom(start);
    if (!result) return null;
    while (tokens[result.end]?.type === "+") {
      const next = parseAtom(result.end + 1);
      if (!next) break;
      result = { value: result.value + next.value, end: next.end };
    }
    return result;
  };
  for (let index = 0; index < tokens.length; index++) {
    const folded = parseChain(index);
    if (folded && folded.end > index + 1) strings.push(folded.value);
  }
  return { strings, comments };
}

function recursiveSelectors(value, out = new Set()) {
  if (Array.isArray(value)) value.forEach((item) => recursiveSelectors(item, out));
  else if (value && typeof value === "object") {
    if (typeof value.selector === "string") out.add(value.selector);
    Object.values(value).forEach((item) => recursiveSelectors(item, out));
  }
  return [...out];
}

function recursiveSources(value, answerSelectors, inherited = false, out = []) {
  if (typeof value === "string") out.push({ value, answerBearing: inherited });
  else if (Array.isArray(value)) value.forEach((item) => recursiveSources(item, answerSelectors, inherited, out));
  else if (value && typeof value === "object") {
    const local = inherited || (typeof value.selector === "string" && answerSelectors.includes(value.selector));
    Object.values(value).forEach((item) => recursiveSources(item, answerSelectors, local, out));
  }
  return out;
}

function decodedSources(source) {
  const values = [source];
  const trimmed = source.trim();
  for (const match of trimmed.matchAll(/(?<![A-Za-z0-9+/])((?:[A-Za-z0-9+/]{4}){2,}(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?)(?![A-Za-z0-9+/])/gu)) {
    try { values.push(new TextDecoder("utf-8", { fatal: true }).decode(Buffer.from(match[1], "base64"))); } catch {}
  }
  if (/(?:%[0-9a-f]{2}){2,}/iu.test(trimmed)) {
    try { values.push(decodeURIComponent(trimmed)); } catch {}
  }
  for (const match of trimmed.matchAll(/(?:0x[0-9a-f]{2}[\s,]*){2,}/giu)) {
    values.push(String.fromCharCode(...[...match[0].matchAll(/0x([0-9a-f]{2})/giu)].map((part) => Number.parseInt(part[1], 16))));
  }
  return values;
}

function scanPythonAnswers(sources, targets) {
  const expanded = sources.flatMap((source) => decodedSources(source.value).map((value) => ({ ...source, value })));
  const result = spawnSync("python3", [ANSWER_SCANNER], {
    input: JSON.stringify({ sources: expanded, targets }),
    encoding: "utf8",
  });
  if (result.status !== 0) throw new Error(`Python answer scanner failed: ${result.stderr.trim()}`);
  return JSON.parse(result.stdout).findings ?? [];
}

async function inspectHtml(html, browser, spec) {
  const ownBrowser = browser ?? await launchParserBrowser();
  const context = await ownBrowser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  try {
    await page.setContent(html, { waitUntil: "load" });
    const snapshot = await page.evaluate(() => {
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
      const nearestActivity = (node) => node?.closest("[data-pep-activity]") ?? null;
      const hiddenByStructure = (node, boundary) => {
        for (let current = node; current && current !== boundary; current = current.parentElement) {
          if (current.tagName === "DETAILS" || current.tagName === "TEMPLATE" || current.hidden ||
              current.getAttribute("aria-hidden") === "true" || current.hasAttribute("inert")) return true;
        }
        return false;
      };
      const ownedText = (owner, selector, ownerSelector) => [...owner.querySelectorAll(selector)]
        .filter((node) => node.closest(ownerSelector) === owner && normalize(node.textContent));

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
          const syntax = /(?:=>|===|\+\+|--|\[[^\]]+\bfor\b[^\]]+\]|\b(?:print|console\.log)\s*\()/u;
          const apiCall = /\b[A-Za-z_]\w*(?:\.[A-Za-z_]\w*)+\s*\([^)]*\)/u;
          const command = /(?:[$>]\s*)?\b(?:curl|wget)\s+(?:https?:\/\/|--?\w|\.?\/)|(?:[$>]\s*)?\b(?:ls|git|npm|python3?|pip)\s+(?:--?\w|\.?\/)/iu;
          const exception = /\b(?:Traceback \(most recent call last\)|Exception in thread|File [“"'][^”"']+[”"'], line \d+|[A-Za-z_]\w*(?:Error|Exception):\s+\S)/u;
          if (syntax.test(prose) || apiCall.test(prose) || command.test(prose) || exception.test(prose)) {
            problems.optional.push("optional anecdote must not contain code, API calls, commands or exact exception/output text");
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
        const tasks = [...activity.querySelectorAll("[data-pep-task]")].filter((task) => nearestActivity(task) === activity);
        if (!tasks.length) problems.guidance.push(`activity ${JSON.stringify(activity.id)} requires a non-empty task`);
        for (const task of tasks) {
          const copy = task.cloneNode(true);
          copy.querySelectorAll("details[data-pep-hint], template, script, style").forEach((node) => node.remove());
          if (!normalize(copy.textContent)) problems.guidance.push(`task ${JSON.stringify(task.id)} requires non-empty instructional text outside hints`);
        }
        const checks = [...activity.querySelectorAll("[data-pep-activity-checks]")]
          .filter((check) => nearestActivity(check) === activity);
        const check = checks[0];
        const heading = check && ownedText(check, "h2, h3", "[data-pep-activity-checks]")
          .find((item) => /^(What success looks like|Activity checks)$/u.test(normalize(item.textContent)));
        const criteria = check && ownedText(check, "p, li", "[data-pep-activity-checks]");
        if (checks.length !== 1 || !heading || !criteria?.length || hiddenByStructure(check, activity) ||
            check.closest("[data-pep-task]") || check.parentElement !== tasks[0]?.parentElement) {
          problems.guidance.push(`activity ${JSON.stringify(activity.id)} requires exactly one visible peer activity-check block with direct non-empty criteria`);
        }
        if (tasks[0] && check && Boolean(tasks[0].compareDocumentPosition(check) & Node.DOCUMENT_POSITION_PRECEDING)) {
          problems.guidance.push(`activity ${JSON.stringify(activity.id)} activity checks must follow its task`);
        }
        if (!tasks.some((task) => [...task.querySelectorAll("h2, h3")].some((item) => normalize(item.textContent).includes("Your task"))) &&
            ![...activity.querySelectorAll(":scope > h2, :scope > h3")].some((item) => normalize(item.textContent).includes("Your task"))) {
          problems.guidance.push(`activity ${JSON.stringify(activity.id)} requires a Your task heading naming the action and location`);
        }
        const back = [...activity.querySelectorAll("a[data-pep-back-link]")].filter((link) => nearestActivity(link) === activity);
        if (index === 0 && back.length) problems.guidance.push("the first activity must not contain a predecessor back link");
        if (index > 0 && (back.length !== 1 || back[0].getAttribute("href") !== `#${activityIds[index - 1]}`)) {
          problems.guidance.push(`activity ${JSON.stringify(activity.id)} requires exactly one back link to its predecessor`);
        }
      });

      if (!root?.querySelector("button[data-pep-previous]") || !root?.querySelector("button[data-pep-next]")) {
        problems.guidance.push("guided activities require Previous activity and Continue/Next button actions");
      }

      const fitsByActivity = new Set();
      for (const fit of root?.querySelectorAll("section[data-pep-where-fits]") ?? []) {
        const fields = ["decision", "good", "boundary"].map((name) => [...fit.querySelectorAll(`[data-pep-fit-${name}]`)]
          .filter((node) => node.closest("[data-pep-where-fits]") === fit));
        const headings = [...fit.querySelectorAll("h2")].filter((node) => node.closest("[data-pep-where-fits]") === fit);
        if (headings.length !== 1 || !/^Where this fits$|^When and why$/u.test(normalize(headings[0].textContent)) ||
            fields.some((items) => items.length !== 1 || !normalize(items[0]?.textContent))) {
          problems.guidance.push("Where this fits requires a direct heading and one non-empty decision, good-fit and boundary field, each directly owned");
        } else if (fields.some((items, fieldIndex) => fieldIndex > 0 &&
            Boolean(fields[fieldIndex - 1][0].compareDocumentPosition(items[0]) & Node.DOCUMENT_POSITION_PRECEDING))) {
          problems.guidance.push("Where this fits fields must appear in decision, good-fit, boundary order");
        }
        if (fit.closest("[data-pep-teaching], [data-pep-task], [data-pep-workspace], [data-pep-hint], [data-pep-optional]")) {
          problems.guidance.push("Where this fits must be a peer region, not nested in teaching, task, workspace, hint or optional content");
          continue;
        }
        const owner = nearestActivity(fit);
        const ownerKey = owner?.id ?? "topic";
        if (fitsByActivity.has(ownerKey)) problems.guidance.push("multiple Where this fits sections require distinct activity owners");
        fitsByActivity.add(ownerKey);
        const candidates = owner ? [...owner.querySelectorAll("[data-pep-task]")].filter((task) => nearestActivity(task) === owner) :
          [...root.querySelectorAll("[data-pep-task], [data-pep-workspace]")].filter((node) => !nearestActivity(node));
        const following = candidates.find((node) => Boolean(fit.compareDocumentPosition(node) & Node.DOCUMENT_POSITION_FOLLOWING));
        const teachings = [...root.querySelectorAll("[data-pep-teaching]")].filter((teaching) => {
          const teachingOwner = nearestActivity(teaching);
          return owner ? teachingOwner === owner || teachingOwner === null : teachingOwner === null;
        });
        const preceding = teachings.filter((teaching) => Boolean(teaching.compareDocumentPosition(fit) & Node.DOCUMENT_POSITION_FOLLOWING)).at(-1);
        if (!preceding || !following ||
            Boolean(fit.compareDocumentPosition(following) & Node.DOCUMENT_POSITION_PRECEDING)) {
          problems.guidance.push("Where this fits must follow its teaching and precede the relevant local task or workspace for its owner");
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
        const sequence = hints.filter((hint) => hint.dataset.pepHintFor === task.id && nearestActivity(hint) === nearestActivity(task));
        if (!sequence.length) {
          problems.guidance.push(`task ${JSON.stringify(task.id)} may stall and requires a native hint disclosure`);
          continue;
        }
        sequence.forEach((hint, index) => {
          const order = Number(hint.dataset.pepHintOrder);
          if (order !== index + 1) problems.guidance.push(`hints for task ${JSON.stringify(task.id)} must use 1..N in DOM order`);
          if (hint.open || !hint.hasAttribute("data-section-skip")) problems.guidance.push("hints must be closed by default and carry data-section-skip");
          if (!task.contains(hint)) problems.guidance.push(`hint ${index + 1} for task ${JSON.stringify(task.id)} must be contained by its owning task`);
          if (index > 0 && hint.parentElement?.closest("details[data-pep-hint]") !== sequence[index - 1]) {
            problems.guidance.push(`hint ${index + 1} for task ${JSON.stringify(task.id)} must be nested inside its predecessor`);
          }
          const summary = directSummary(hint);
          const name = normalize(summary?.textContent);
          const taskLabel = normalize(activityIds.map((id, activityIndex) => activities[activityIndex].contains(task) ? `Activity ${activityIndex + 1}` : "").find(Boolean));
          const expectedLead = index === 0 ? "Need a hint?" : "Another hint";
          if (!name.startsWith(expectedLead) || !name.includes(`${index + 1} of ${sequence.length}`) || !name.includes(taskLabel)) {
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
      if (hints.some((hint) => {
        const matches = tasks.filter((task) => task.id === (hint.dataset.pepHintFor ?? "") && nearestActivity(task) === nearestActivity(hint));
        return matches.length !== 1;
      })) problems.guidance.push("hint ownership must resolve to exactly one task in the same activity");

      const sensitive = [...root?.querySelectorAll("[data-pep-answer-sensitive]") ?? []];
      let answerDeclaration = null;
      let answerSelectors = [];
      if (sensitive.length) {
        if (sensitive.length !== 1 || sensitive[0].dataset.pepAnswerSensitive !== "python-comprehension") {
          problems.guidance.push("answer-sensitive guidance requires one supported task declaration");
        } else {
          const targets = (sensitive[0].dataset.pepAnswerTargets ?? "").split(/\s+/u).filter(Boolean);
          if (!targets.length) problems.guidance.push("answer-sensitive guidance requires declared target names");
          answerDeclaration = { task: `#${sensitive[0].id}`, language: "python-comprehension", targets };
          const activityScope = sensitive[0].closest("[data-pep-activity]") ?? sensitive[0];
          const bearing = (node) => activityScope.contains(node) || sensitive[0].contains(node) ||
            Boolean(node.closest?.("noscript, [data-static-alt]") || node.matches?.("noscript, [data-static-alt]"));
          for (const node of [root, ...root.querySelectorAll("*")]) {
            for (const child of node.childNodes) {
              if (child.nodeType === Node.TEXT_NODE && normalize(child.textContent)) {
                answerSources.push({ value: child.textContent, answerBearing: bearing(node), source: "html-text" });
              }
            }
            for (const attribute of node.attributes ?? []) {
              answerSources.push({ value: attribute.value, answerBearing: bearing(node), source: `attribute:${attribute.name}` });
            }
            if (node.tagName === "TEMPLATE" && normalize(node.content.textContent)) {
              answerSources.push({ value: node.content.textContent, answerBearing: bearing(node), source: "template" });
            }
          }
          const comments = document.createTreeWalker(document, NodeFilter.SHOW_COMMENT);
          while (comments.nextNode()) {
            const parent = comments.currentNode.parentElement;
            answerSources.push({ value: comments.currentNode.textContent, answerBearing: parent ? bearing(parent) : false, source: "html-comment" });
          }
          answerSelectors = [...activityScope.querySelectorAll("[id]")].map((node) => `#${CSS.escape(node.id)}`);
        }
      }
      const scripts = [...document.scripts].map((script) => script.textContent ?? "");
      return { ...problems, answerSources, answerSelectors, hasGuidanceMarker: true, hintCount: hints.length, answerDeclaration, scripts };
    });
    if (snapshot.answerDeclaration && spec) {
      for (const selector of recursiveSelectors(spec)) {
        const resolvesInsideAnswerSurface = await page.locator(selector).evaluateAll((nodes) => {
          const sensitive = document.querySelector("[data-pep-answer-sensitive]");
          const scope = sensitive?.closest("[data-pep-activity]") ?? sensitive;
          return Boolean(scope && nodes.some((node) => scope.contains(node) || node.closest("noscript, [data-static-alt]")));
        }).catch(() => false);
        if (resolvesInsideAnswerSurface) snapshot.answerSelectors.push(selector);
      }
      snapshot.answerSelectors = [...new Set(snapshot.answerSelectors)];
    }
    if (snapshot.hasGuidanceMarker) {
      const summaries = page.locator("details[data-pep-hint] > summary");
      const hintOpenStates = await page.locator("details[data-pep-hint]").evaluateAll((items) => items.map((item) => item.open));
      await page.locator("details[data-pep-hint]").evaluateAll((items) => items.forEach((item) => { item.open = true; }));
      const computedNames = [];
      for (let index = 0; index < await summaries.count(); index++) {
        const summary = summaries.nth(index);
        const hint = summary.locator("..");
        const order = Number(await hint.getAttribute("data-pep-hint-order"));
        const taskId = await hint.getAttribute("data-pep-hint-for");
        const activityIndex = await summary.evaluate((node) => [...document.querySelectorAll("[data-pep-activity]")].findIndex((activity) => activity.contains(node)) + 1);
        const sequenceCount = await page.locator(`details[data-pep-hint][data-pep-hint-for=${JSON.stringify(taskId)}]`).count();
        const aria = await summary.ariaSnapshot();
        const browserName = (aria.match(/^\s*-\s+[^:]+:\s+(.+)$/mu)?.[1] ?? "").replace(/^['"]|['"]$/gu, "").replace(/\s+/gu, " ").trim();
        const explicitName = await summary.evaluate((node) => {
          if (node.hasAttribute("aria-label")) return node.getAttribute("aria-label") ?? "";
          const references = (node.getAttribute("aria-labelledby") ?? "").split(/\s+/u).filter(Boolean);
          return references.map((id) => document.getElementById(id)?.textContent ?? "").join(" ");
        });
        const name = (explicitName || browserName).replace(/\s+/gu, " ").trim();
        const lead = order === 1 ? "Need a hint?" : "Another hint";
        if (!name.startsWith(lead) || !name.includes(`${order} of ${sequenceCount}`) || !name.includes(`Activity ${activityIndex}`)) {
          snapshot.guidance.push(`hint ${order} for ${JSON.stringify(taskId)} requires its visible prefix, ordinal and activity in the browser-computed accessible name`);
        }
        if (!name || computedNames.includes(name.toLowerCase())) snapshot.guidance.push("browser-computed hint names must be non-empty and unique across the page");
        computedNames.push(name.toLowerCase());
      }
      await page.locator("details[data-pep-hint]").evaluateAll((items, states) => items.forEach((item, index) => { item.open = states[index]; }), hintOpenStates);
    }
    return snapshot;
  } finally {
    await context.close();
    if (!browser) await ownBrowser.close();
  }
}

export async function validateHtmlContracts(html, options = {}) {
  const snapshot = await inspectHtml(html, options.browser, options.spec);
  const answerProblems = [];
  const specDeclaration = options.spec?.answerSafety ?? null;
  if (Boolean(snapshot.answerDeclaration) !== Boolean(specDeclaration)) {
    answerProblems.push("HTML and QA must declare answer-sensitive scanning together");
  } else if (snapshot.answerDeclaration &&
      JSON.stringify(snapshot.answerDeclaration) !== JSON.stringify(specDeclaration)) {
    answerProblems.push("HTML and QA answer-sensitive declarations must match exactly");
  }
  if (snapshot.answerDeclaration) {
    const scriptSources = snapshot.scripts.flatMap((script) => {
      const parsed = staticJsSources(script);
      return [
        ...parsed.strings.map((value) => ({ value, answerBearing: true, source: "script-literal" })),
        ...parsed.comments.map((value) => ({ value, answerBearing: false, source: "script-comment" })),
      ];
    });
    const sources = [
      ...snapshot.answerSources,
      ...scriptSources,
      ...recursiveSources(options.spec ?? {}, snapshot.answerSelectors),
    ];
    if (scanPythonAnswers(sources, snapshot.answerDeclaration.targets).length) {
      answerProblems.push("answer-sensitive public bytes contain a complete target comprehension expression");
    }
    const targetPattern = new RegExp(`\\b(?:${snapshot.answerDeclaration.targets.join("|")})\\b`, "u");
    const obfuscation = sources.some(({ value, answerBearing }) => {
      const associated = answerBearing || targetPattern.test(value);
      if (!associated) return false;
      return /\b(?:atob|b64decode|decodeURIComponent|unquote|fromhex|bytes\.fromhex|String\.fromCharCode|\bchr)\s*\(/u.test(value) ||
        /\b[a-f0-9]{40}(?:[a-f0-9]{24})?\b/iu.test(value);
    });
    if (obfuscation) answerProblems.push("answer-sensitive public bytes must not encode, assemble or hash a completed input");
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
