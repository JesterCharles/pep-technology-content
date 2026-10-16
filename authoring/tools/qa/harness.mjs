import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import { mkdir, readFile, realpath, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import AxeBuilder from "@axe-core/playwright";
import Ajv2020 from "ajv/dist/2020.js";
import { chromium } from "playwright";
import { error, evidencePath, findCourses, loadCourse, readJson, relative, sha256, walk } from "../lib/common.mjs";

export const VIEWPORTS = [
  { name: "desktop", width: 1366, height: 768, theme: "light", zoom: 1 },
  { name: "short", width: 1366, height: 681, theme: "light", zoom: 1 },
  { name: "phone-320", width: 320, height: 568, theme: "dark", zoom: 1, touch: true },
  { name: "phone-390", width: 390, height: 844, theme: "light", zoom: 1, touch: true },
  { name: "phone-landscape", width: 844, height: 390, theme: "dark", zoom: 1, touch: true },
  { name: "tablet-768", width: 768, height: 1024, theme: "light", zoom: 1, touch: true },
  { name: "zoom-200", width: 1366, height: 768, theme: "light", zoom: 2 },
];
const LEGACY_VIEWPORTS = [
  VIEWPORTS[0],
  VIEWPORTS[1],
  { name: "mobile", width: 400, height: 860, theme: "dark", zoom: 1 },
  VIEWPORTS.at(-1),
];
const PACKAGE = JSON.parse(
  await readFile(new URL("../../../package.json", import.meta.url), "utf8"),
);
const QA_PATH_SCHEMA = JSON.parse(
  await readFile(new URL("../../schemas/qa-paths.schema.json", import.meta.url), "utf8"),
);
const validateQaPath = new Ajv2020({ allErrors: true, strict: false }).compile(QA_PATH_SCHEMA);

function digest(bytes) {
  return createHash("sha256").update(bytes).digest("hex");
}

export async function launchChromium() {
  try {
    return await chromium.launch({ headless: true });
  } catch (error) {
    if (!/Executable doesn't exist/.test(error.message)) throw error;
    return chromium.launch({ channel: "chrome", headless: true });
  }
}

export async function findHtmlTopics(ctx) {
  const topics = [];
  for (const descriptor of await findCourses(ctx)) {
    const course = await loadCourse(descriptor);
    for (const module of course.modules) {
      const moduleId = module.id;
      for (const topicId of module.manifest.topicOrder ?? []) {
        const topicRoot = path.join(module.contentRoot, topicId);
        const manifest = await readJson(path.join(module.catalogRoot, topicId, "topic.json")).catch(() => null);
        if (manifest?.artifacts?.html?.status !== "present") continue;
        topics.push({
          courseId: course.id,
          moduleId,
          topicId,
          root: topicRoot,
          output: path.join(ctx.root, "build", "qa", "failures"),
          html: path.join(topicRoot, "artifact.html"),
          manifest,
          displayHtml: ctx.display(path.join(topicRoot, "artifact.html")),
          displaySpec: ctx.display(
            evidencePath(course.repoRoot, course.id, moduleId, topicId, "qa-paths.json"),
          ),
          spec: evidencePath(course.repoRoot, course.id, moduleId, topicId, "qa-paths.json"),
        });
      }
    }
  }
  return topics;
}

function issue(rule, topic, detail) {
  return {
    rule,
    file: topic.displayHtml,
    message: detail,
  };
}

async function loadSpec(topic) {
  let spec;
  try {
    spec = await readJson(topic.spec);
  } catch (error) {
    throw new Error(`${topic.displaySpec} is required and must be valid JSON: ${error.message}`);
  }
  if (!validateQaPath(spec)) {
    const detail = (validateQaPath.errors ?? [])
      .map((item) => `${item.instancePath || "/"} ${item.message}`)
      .join("; ");
    throw new Error(`${topic.displaySpec} does not match qa-paths.schema.json: ${detail}`);
  }
  const html = await readFile(topic.html, "utf8");
  const enrolled = /<main\b[^>]*\bdata-pep-guidance-contract(?:\s|=|>)/iu.test(html);
  if (enrolled !== Boolean(spec.guidance)) {
    throw new Error("data-pep-guidance-contract and spec.guidance must be present together");
  }
  if (enrolled) {
    const hasHints = /<details\b[^>]*\bdata-pep-hint(?:\s|=|>)/iu.test(html);
    if (hasHints !== Boolean(spec.guidance.hints)) {
      throw new Error("spec.guidance.hints must be present exactly when the enrolled page contains hints");
    }
  }
  return spec;
}

function attachDiagnostics(page, log) {
  page.on("console", (message) => {
    if (message.type() === "error") log.push(`console error: ${message.text()}`);
  });
  page.on("pageerror", (error) => log.push(`page error: ${error.message}`));
}

async function blockNetwork(page, log, pageUrl) {
  await page.route("**/*", async (route) => {
    const url = route.request().url();
    if (/^(data:|about:|blob:)/.test(url)) return route.continue();
    if (url.startsWith("file:")) {
      if (pageUrl && url.split(/[?#]/)[0] === pageUrl) return route.continue();
      log.push(`sibling file request: ${url}`);
      return route.abort("blockedbyclient");
    }
    log.push(`network request: ${url}`);
    return route.abort("blockedbyclient");
  });
}

async function assertState(target, assertion) {
  const locator = target.locator(assertion.selector);
  await locator.waitFor({ state: "attached" });
  if (assertion.text !== undefined) {
    const text = await locator.innerText();
    if (!new RegExp(assertion.text, "m").test(text)) {
      throw new Error(`${assertion.selector} text did not match /${assertion.text}/; got ${JSON.stringify(text)}`);
    }
  }
  if (assertion.value !== undefined) {
    const value = await locator.inputValue();
    if (!new RegExp(assertion.value).test(value)) {
      throw new Error(`${assertion.selector} value did not match /${assertion.value}/; got ${JSON.stringify(value)}`);
    }
  }
  if (assertion.attribute !== undefined) {
    const value = await locator.getAttribute(assertion.attribute);
    if (value !== assertion.equals) {
      throw new Error(
        `${assertion.selector} ${assertion.attribute} expected ${JSON.stringify(assertion.equals)}; ` +
          `got ${JSON.stringify(value)}`,
      );
    }
  }
}

async function focusVisible(locator) {
  return locator.evaluate((element) => {
    const parse = (value) => {
      const match = value.match(/rgba?\(([^)]+)\)/);
      if (!match) return null;
      const parts = match[1].split(/[ ,/]+/).filter(Boolean).map(Number);
      return [parts[0], parts[1], parts[2], parts[3] ?? 1];
    };
    const blend = (front, back) => {
      const alpha = front[3];
      return [0, 1, 2].map((i) => front[i] * alpha + back[i] * (1 - alpha)).concat(1);
    };
    const background = (node) => {
      let result = [255, 255, 255, 1];
      const layers = [];
      for (let current = node; current; current = current.parentElement) {
        const color = parse(getComputedStyle(current).backgroundColor);
        if (color && color[3] > 0) layers.push(color);
      }
      for (const color of layers.reverse()) result = blend(color, result);
      return result;
    };
    const luminance = (color) => {
      const rgb = color.slice(0, 3).map((value) => {
        const channel = value / 255;
        return channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
      });
      return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
    };
    const ratio = (first, second) => {
      const values = [luminance(first), luminance(second)].sort((a, b) => b - a);
      return (values[0] + 0.05) / (values[1] + 0.05);
    };
    const chain = [];
    for (let node = element; node; node = node.parentElement) chain.push(node);
    document.activeElement?.blur();
    const before = chain.map((node) => {
      const style = getComputedStyle(node);
      return {
        outline: `${style.outlineStyle}|${style.outlineWidth}|${style.outlineColor}`,
        shadow: style.boxShadow,
      };
    });
    element.focus({ preventScroll: true });
    return chain.some((node, index) => {
      const style = getComputedStyle(node);
      const behind = background(node.parentElement ?? document.body);
      const outline = `${style.outlineStyle}|${style.outlineWidth}|${style.outlineColor}`;
      if (
        outline !== before[index].outline &&
        style.outlineStyle !== "none" &&
        parseFloat(style.outlineWidth) > 0
      ) {
        const color = parse(style.outlineColor);
        if (color && color[3] > 0 && ratio(blend(color, behind), behind) >= 3) return true;
      }
      if (style.boxShadow === "none" || style.boxShadow === before[index].shadow) return false;
      return (style.boxShadow.match(/rgba?\([^)]+\)/g) ?? []).some((value) => {
        const color = parse(value);
        return color && color[3] > 0 && ratio(blend(color, behind), behind) >= 3;
      });
    });
  });
}

async function perform(target, action, options = {}) {
  if (action.do === "goBack") {
    if (typeof target.goBack === "function") await target.goBack();
    else {
      const before = await target.evaluate(() => location.href);
      await target.evaluate(() => history.back());
      await target.waitForFunction((value) => location.href !== value, before);
    }
    return;
  }
  if (action.do === "goForward") {
    if (typeof target.goForward === "function") await target.goForward();
    else {
      const before = await target.evaluate(() => location.href);
      await target.evaluate(() => history.forward());
      await target.waitForFunction((value) => location.href !== value, before);
    }
    return;
  }
  const locator = target.locator(action.selector);
  const timeout = action.timeoutMs ?? 5000;
  if (action.do.startsWith("expect")) {
    if (action.do === "expectText") return assertState(target, action);
    if (action.do === "expectValue") return assertState(target, action);
    if (action.do === "expectAttribute") return assertState(target, action);
    if (action.do === "expectVisible") return locator.waitFor({ state: "visible", timeout });
    if (action.do === "expectHidden") return locator.waitFor({ state: "hidden", timeout });
    if (action.do === "expectEnabled" && !(await locator.isEnabled())) {
      throw new Error(`${action.selector} is disabled`);
    }
    if (action.do === "expectDisabled" && !(await locator.isDisabled())) {
      throw new Error(`${action.selector} is enabled`);
    }
    if (action.do === "expectFocus") {
      const focused = await locator.evaluate((element) => element === document.activeElement);
      if (!focused) throw new Error(`${action.selector} is not focused`);
    }
    return;
  }
  await locator.waitFor({ state: "visible", timeout });
  if (options.keyboard) {
    if (!(await focusVisible(locator))) throw new Error(`${action.selector} has no visible focus indicator`);
    if (action.do === "click") {
      const tag = await locator.evaluate((element) => `${element.tagName}:${element.getAttribute("type") ?? ""}`);
      await locator.press(tag === "INPUT:checkbox" || tag === "INPUT:radio" ? "Space" : "Enter");
      return;
    }
    if (action.do === "check") {
      await locator.press("Space");
      return;
    }
    if (action.do === "fill") {
      await locator.press("ControlOrMeta+A");
      await locator.pressSequentially(action.value ?? "");
      return;
    }
    if (action.do === "select") {
      const index = await locator.evaluate((element, value) =>
        [...element.options].findIndex((option) => option.value === value), action.value);
      if (index < 0) throw new Error(`${action.selector} has no option ${JSON.stringify(action.value)}`);
      await locator.press("Home");
      for (let count = 0; count < index; count++) await locator.press("ArrowDown");
      return;
    }
  }
  if (action.do === "click") {
    await locator.evaluate((element) => element.scrollIntoView({ block: "center", inline: "nearest" }));
    if (options.touch) await locator.tap();
    else await locator.click();
  }
  else if (action.do === "check") await locator.check();
  else if (action.do === "fill") await locator.fill(action.value ?? "");
  else if (action.do === "press") await locator.press(action.key);
  else if (action.do === "select") await locator.selectOption(action.value);
}

async function execute(target, actions, options = {}) {
  for (const action of actions) await perform(target, action, options);
}

async function setupActionKind(target, action) {
  if (action.do === "goBack" || action.do === "goForward") return "navigation";
  if (!action.selector || action.do.startsWith("expect")) return "other";
  return target.locator(action.selector).evaluate((element) =>
    element.closest("[data-pep-previous], [data-pep-next], [data-pep-activity-link], [data-pep-back-link]")
      ? "navigation"
      : "other");
}

async function exerciseSequentialHints(target, options = {}) {
  const hints = target.locator("details[data-pep-hint]");
  const count = await hints.count();
  for (let index = 0; index < count; index++) {
    const hint = hints.nth(index);
    if (await hint.getAttribute("data-pep-hint-order") !== "1" && await hint.locator(":scope > summary").isVisible()) {
      throw new Error("a later hint is visible before its predecessor opens");
    }
  }
  for (let index = 0; index < count; index++) {
    const hint = hints.nth(index);
    const summary = hint.locator(":scope > summary");
    if (!(await summary.isVisible())) throw new Error(`hint ${index + 1} is unavailable after its predecessor opens`);
    if (options.keyboard) {
      if (!(await focusVisible(summary))) throw new Error(`hint ${index + 1} has no visible focus indicator`);
      await summary.press("Enter");
    } else if (options.touch) await summary.tap();
    else await summary.click();
    if ((await hint.getAttribute("open")) === null) throw new Error(`hint ${index + 1} did not open`);
    const step = hint.locator(":scope > .pep-hint__body > [data-pep-hint-step]");
    if (!(await step.isVisible())) throw new Error(`hint ${index + 1} next step is not visible`);
    if (options.afterOpen) await options.afterOpen(index, hint);
  }
}

async function guidanceState(target) {
  return target.locator("[data-pep-guidance-contract]").evaluate((root) => {
    const allActivities = [...root.querySelectorAll("[data-pep-activity]")];
    const controls = [...root.querySelectorAll("input, textarea, select")].map((control) => ({
      id: control.id,
      activity: allActivities.findIndex((activity) => activity.contains(control)) + 1,
      value: control.value,
      checked: control.checked,
      selectedIndex: control.selectedIndex,
    }));
    const activities = [...root.querySelectorAll("[data-pep-activity]")].map((activity) => ({
      id: activity.id,
      attempts: activity.dataset.pepAttempts,
      settled: activity.dataset.pepSettled,
      completed: activity.dataset.pepCompleted,
      credit: activity.dataset.pepCredit,
      grade: activity.dataset.pepGrade,
      canContinue: activity.dataset.pepContinue,
      feedback: [...activity.querySelectorAll("[data-pep-feedback]")].map((node) => ({
        text: node.textContent,
        hidden: node.hidden,
      })),
    }));
    return {
      current: root.dataset.pepCurrentActivity,
      frontier: root.dataset.pepUnlockedThrough,
      requiredMinutes: root.dataset.pepRequiredMinutes,
      complete: root.dataset.pepComplete,
      controls,
      activities,
      hash: location.hash,
      focused: document.activeElement?.id ?? "",
      disclosures: [...root.querySelectorAll("details")].map((item) => item.open),
    };
  });
}

function preservedGuidance(state) {
  const copy = structuredClone(state);
  delete copy.current;
  delete copy.hash;
  delete copy.focused;
  return copy;
}

function sameState(actual, expected, message) {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) throw new Error(message);
}

async function expectRenderedCurrentGuidance(target) {
  const result = await target.locator("[data-pep-guidance-contract]").evaluate((root) => {
    const normalize = (value) => (value ?? "").replace(/\s+/gu, " ").trim();
    const rendered = (node) => {
      if (!node?.getClientRects().length) return false;
      const hasZeroOpacityFilter = (filter) => [...filter.matchAll(/\bopacity\(\s*([+-]?(?:\d+(?:\.\d*)?|\.\d+))(%?)\s*\)/giu)]
        .some((match) => Number(match[1]) === 0);
      for (let current = node; current && current !== document; current = current.parentElement) {
        const style = getComputedStyle(current);
        if (style.display === "none" || style.visibility === "hidden" || style.visibility === "collapse" ||
            style.contentVisibility === "hidden" || Number(style.opacity) === 0 || hasZeroOpacityFilter(style.filter)) return false;
      }
      return true;
    };
    const visibleOwnedText = (owner, excluded) => {
      const walker = document.createTreeWalker(owner, NodeFilter.SHOW_TEXT);
      const values = [];
      while (walker.nextNode()) {
        const parent = walker.currentNode.parentElement;
        if (!parent || parent.closest(excluded) || !rendered(parent)) continue;
        const value = normalize(walker.currentNode.textContent);
        if (value) values.push(value);
      }
      return normalize(values.join(" "));
    };
    const current = root.querySelector("[data-pep-activity]:not([hidden])");
    if (!current) return "current activity is not rendered";
    const tasks = [...current.querySelectorAll("[data-pep-task]")]
      .filter((task) => task.closest("[data-pep-activity]") === current);
    if (!tasks.length || tasks.some((task) => !rendered(task) ||
        !visibleOwnedText(task, "details[data-pep-hint], template, script, style"))) {
      return "current task is hidden or has no rendered instructional text";
    }
    const checks = [...current.querySelectorAll("[data-pep-activity-checks]")]
      .filter((check) => check.closest("[data-pep-activity]") === current);
    if (checks.length !== 1 || !rendered(checks[0])) return "current activity-check block is not rendered";
    const check = checks[0];
    const headings = [...check.querySelectorAll(":scope > h2, :scope > h3")]
      .filter((heading) => rendered(heading) && /^(What success looks like|Activity checks)$/u.test(normalize(heading.innerText)));
    if (headings.length !== 1) return "current activity-check heading is hidden or empty";
    const criteria = [...check.querySelectorAll(":scope > p, :scope > ul > li, :scope > ol > li")]
      .filter((criterion) => criterion.closest("[data-pep-activity-checks]") === check &&
        rendered(criterion) && normalize(criterion.innerText));
    if (!criteria.length) return "current activity-check criteria are hidden or empty";
    return "";
  });
  if (result) throw new Error(result);
}

async function divergeCurrentControls(target, current, authored, label, mode) {
  const controls = target.locator("[data-pep-activity]:not([hidden]) input, [data-pep-activity]:not([hidden]) textarea, [data-pep-activity]:not([hidden]) select");
  for (let index = 0; index < await controls.count(); index++) {
    const control = controls.nth(index);
    const metadata = await control.evaluate((element) => ({
      disabled: element.disabled,
      readOnly: element.readOnly,
      tag: element.tagName,
      type: element.type,
      checked: element.checked,
      value: element.value,
      options: element.tagName === "SELECT"
        ? [...element.options].map((option, optionIndex) => ({ optionIndex, disabled: option.disabled }))
        : [],
    }));
    if (metadata.disabled || metadata.readOnly || metadata.type === "hidden" || metadata.type === "file") continue;
    if (metadata.type === "checkbox") {
      if (mode === "keyboard") { await control.focus(); await control.press("Space"); }
      else if (metadata.checked) await control.uncheck(); else await control.check();
    } else if (metadata.type === "radio") {
      if (!metadata.checked) {
        if (mode === "keyboard") { await control.focus(); await control.press("Space"); }
        else await control.check();
      }
    } else if (metadata.tag === "SELECT") {
      const alternative = metadata.options.find((option) => !option.disabled && option.optionIndex !== authored[index]?.selectedIndex);
      if (alternative && mode === "keyboard") {
        await control.focus();
        await control.press("Home");
        for (let step = 0; step < alternative.optionIndex; step++) await control.press("ArrowDown");
      } else if (alternative) await control.selectOption({ index: alternative.optionIndex });
    } else if (mode === "keyboard") {
      await control.focus();
      await control.press("ControlOrMeta+A");
      await control.pressSequentially(`pep-restart-${label}-${index}`);
    } else {
      await control.fill(`pep-restart-${label}-${index}`);
    }
  }
  const changed = (await guidanceState(target)).controls.filter((control) => control.activity === current);
  if (JSON.stringify(changed) === JSON.stringify(authored)) {
    throw new Error(`Restart ${label} check could not establish non-authored current controls`);
  }
}

async function activateGuidance(locator, mode) {
  if (await locator.getAttribute("aria-disabled") === "true") {
    if (mode === "keyboard") {
      await locator.focus();
      await locator.press("Enter");
    } else await locator.dispatchEvent("click");
    return;
  }
  if (mode === "keyboard") {
    if (!(await focusVisible(locator))) {
      const identity = await locator.evaluate((element) => `${element.tagName.toLowerCase()}#${element.id || "(no-id)"}`);
      throw new Error(`guidance navigation ${identity} has no visible focus indicator`);
    }
    await locator.press("Enter");
  } else {
    await locator.evaluate((element) => element.scrollIntoView({ block: "center", inline: "nearest" }));
    if (mode === "touch") await locator.tap();
    else await locator.click();
  }
}

async function expectDestination(target, number, before, { history = false } = {}) {
  if (history && before.focused) await target.waitForFunction((id) => document.activeElement?.id === id, before.focused);
  const after = await guidanceState(target);
  if (after.current !== String(number) || after.hash !== `#activity-${number}`) {
    throw new Error(`navigation did not select canonical activity ${number}`);
  }
  sameState(preservedGuidance(after), preservedGuidance(before), "navigation changed non-navigation state");
  await expectRenderedCurrentGuidance(target);
  if (history) {
    if (after.focused !== before.focused) throw new Error("browser history moved focus");
  } else {
    const headingId = await target.locator(`#activity-${number}`).getAttribute("aria-labelledby");
    if (!headingId || after.focused !== headingId) throw new Error(`navigation did not focus activity ${number} heading`);
  }
  return after;
}

async function setFragment(target, hash, expected) {
  await target.evaluate((value) => { location.hash = value; }, hash);
  await target.waitForFunction((value) => location.hash === value, expected);
}

async function traverseHistory(target, direction) {
  const before = await target.evaluate(() => location.href);
  if (typeof target[direction] === "function") await target[direction]();
  else {
    await target.evaluate((method) => history[method](), direction === "goBack" ? "back" : "forward");
    await target.waitForFunction((value) => location.href !== value, before);
  }
}

async function checkGuidanceInvariants(target, setupActions, mode = "pointer") {
  const root = target.locator("[data-pep-guidance-contract]");
  const activities = target.locator("[data-pep-activity]");
  const links = target.locator("[data-pep-activity-link]");
  const count = await activities.count();
  const initial = await guidanceState(target);
  if (!initial.current || !initial.frontier || !initial.requiredMinutes || count < 2) throw new Error("guidance state hooks are incomplete");
  await expectRenderedCurrentGuidance(target);

  for (let index = Number(initial.frontier); index < count; index++) {
    const before = await guidanceState(target);
    await activateGuidance(links.nth(index), mode);
    const after = await guidanceState(target);
    sameState(preservedGuidance(after), preservedGuidance(before), "locked future timeline activation changed guidance state");
    if (after.current !== before.current || after.hash !== before.hash) throw new Error("locked future timeline activation changed current activity");
  }
  for (let number = Number(initial.frontier) + 1; number <= count; number++) {
    const before = await guidanceState(target);
    await setFragment(target, `#activity-${number}`, `#activity-${before.current}`);
    const after = await guidanceState(target);
    if (after.current !== before.current || after.frontier !== before.frontier || after.hash !== `#activity-${before.current}`) {
      throw new Error(`fresh future fragment ${number} bypassed the frontier or was not normalized`);
    }
    sameState(preservedGuidance(after), preservedGuidance(before), "future fragment changed preserved state");
  }

  let completionCheckpoint = initial.complete;
  for (const action of setupActions) {
    const before = await guidanceState(target);
    const kind = await setupActionKind(target, action);
    await perform(target, action, { keyboard: mode === "keyboard", touch: mode === "touch" });
    const after = await guidanceState(target);
    if (after.requiredMinutes !== initial.requiredMinutes) throw new Error("guidance setup changed authored required time");
    if (kind === "navigation") {
      sameState(preservedGuidance(after), preservedGuidance(before), "guidance setup navigation changed non-navigation state");
    }
    if (after.complete !== completionCheckpoint) {
      const transitions = after.activities.filter((activity, index) =>
        before.activities[index]?.completed !== "true" && activity.completed === "true" &&
        activity.settled === "true" && activity.credit === "1" && activity.canContinue === "true");
      if (kind === "navigation" || transitions.length !== 1 || after.complete !== "true") {
        throw new Error("guidance setup changed page completion without a coherent activity completion transition");
      }
      completionCheckpoint = after.complete;
    }
    await expectRenderedCurrentGuidance(target);
  }
  let prepared = await guidanceState(target);
  if (prepared.complete !== completionCheckpoint) throw new Error("guidance setup page completion drifted from its validated checkpoint");
  await expectRenderedCurrentGuidance(target);
  const populatedActivities = prepared.activities.filter((activity, index) =>
    prepared.controls.some((control) => control.activity === index + 1 && control.value));
  if (!prepared.activities.some((activity) => Number(activity.attempts) > 0) ||
      !prepared.controls.some((control) => control.value) ||
      !prepared.activities.some((activity) => activity.completed === "true" && activity.credit === "1") ||
      Number(prepared.frontier) < 2 || populatedActivities.length < 2) {
    throw new Error("guidance setup did not establish attempts, preserved inputs, completion, frontier and another populated activity");
  }

  const current = Number(prepared.current);
  if (current < 2) throw new Error("guidance setup must finish on a later unlocked activity");
  await activateGuidance(target.locator("[data-pep-previous]"), mode);
  let state = await expectDestination(target, current - 1, prepared);
  await activateGuidance(target.locator("[data-pep-next]"), mode);
  state = await expectDestination(target, current, state);
  await activateGuidance(links.first(), mode);
  state = await expectDestination(target, 1, state);
  await activateGuidance(links.nth(current - 1), mode);
  state = await expectDestination(target, current, state);
  const back = target.locator(`#activity-${current} [data-pep-back-link]`);
  await activateGuidance(back, mode);
  state = await expectDestination(target, current - 1, state);

  await activateGuidance(target.locator("[data-pep-next]"), mode);
  state = await expectDestination(target, current, state);
  const historyBase = state;
  await activateGuidance(target.locator("[data-pep-previous]"), mode);
  const historyPrevious = await guidanceState(target);
  await target.locator("[data-pep-reset]").focus();
  const focused = await guidanceState(target);
  await traverseHistory(target, "goBack");
  state = await expectDestination(target, current, { ...historyBase, focused: focused.focused }, { history: true });
  await traverseHistory(target, "goForward");
  state = await expectDestination(target, current - 1, { ...historyPrevious, focused: focused.focused }, { history: true });
  await activateGuidance(target.locator("[data-pep-next]"), mode);
  prepared = await expectDestination(target, current, state);

  const authoredCurrentControls = initial.controls.filter((control) => control.activity === current);
  if (!authoredCurrentControls.length) throw new Error("current activity has no authored controls for Restart verification");
  const otherBefore = prepared.activities.filter((_, index) => index !== current - 1);
  const controlsBefore = prepared.controls.filter((control) => control.activity !== current);
  await divergeCurrentControls(target, current, authoredCurrentControls, "wrong", mode);
  await activateGuidance(target.locator("[data-pep-activity]:not([hidden]) [data-pep-wrong-attempt]"), mode);
  const wrong = await guidanceState(target);
  if (Number(wrong.activities[current - 1].attempts) < 1) throw new Error("wrong-attempt setup did not increment attempts");
  await activateGuidance(target.locator("[data-pep-reset]"), mode);
  const restartedWrong = await guidanceState(target);
  const clean = restartedWrong.activities[current - 1];
  if (clean.attempts !== "0" || clean.settled !== "false" || clean.completed !== "false" || clean.credit !== "0" ||
      clean.grade !== "0" || clean.canContinue !== "false" || clean.feedback.some((item) => item.text.trim())) {
    throw new Error("Restart after a wrong attempt left stale current-activity state");
  }
  sameState(restartedWrong.activities.filter((_, index) => index !== current - 1), otherBefore, "Restart changed another activity");
  sameState(restartedWrong.controls.filter((control) => control.activity !== current), controlsBefore, "Restart changed another activity input");
  sameState(restartedWrong.controls.filter((control) => control.activity === current), authoredCurrentControls, "Restart after a wrong attempt did not restore authored current controls");
  if (restartedWrong.frontier !== prepared.frontier || restartedWrong.requiredMinutes !== initial.requiredMinutes || restartedWrong.complete !== completionCheckpoint) {
    throw new Error("Restart changed frontier, required time or page completion");
  }
  await expectRenderedCurrentGuidance(target);

  await divergeCurrentControls(target, current, authoredCurrentControls, "completed", mode);
  const otherBeforeComplete = (await guidanceState(target)).activities.filter((_, index) => index !== current - 1);
  const controlsBeforeComplete = (await guidanceState(target)).controls.filter((control) => control.activity !== current);
  await activateGuidance(target.locator("[data-pep-activity]:not([hidden]) [data-pep-complete-activity]"), mode);
  const completed = await guidanceState(target);
  if (completed.activities[current - 1].credit !== "1") throw new Error("completion did not award exactly one credit");
  await activateGuidance(target.locator("[data-pep-reset]"), mode);
  const restartedComplete = await guidanceState(target);
  if (restartedComplete.activities[current - 1].completed !== "false" || restartedComplete.activities[current - 1].credit !== "0") {
    throw new Error("Restart after completion left stale current state");
  }
  sameState(restartedComplete.activities.filter((_, index) => index !== current - 1), otherBeforeComplete, "completed Restart changed another activity");
  sameState(restartedComplete.controls.filter((control) => control.activity !== current), controlsBeforeComplete, "completed Restart changed another activity input");
  sameState(restartedComplete.controls.filter((control) => control.activity === current), authoredCurrentControls, "Restart after completion did not restore authored current controls");
  if (restartedComplete.frontier !== prepared.frontier || restartedComplete.requiredMinutes !== initial.requiredMinutes || restartedComplete.complete !== completionCheckpoint) {
    throw new Error("completed Restart changed frontier, required time or page completion");
  }
  await expectRenderedCurrentGuidance(target);
  await activateGuidance(target.locator("[data-pep-activity]:not([hidden]) [data-pep-complete-activity]"), mode);
  const recompleted = await guidanceState(target);
  if (recompleted.activities[current - 1].credit !== "1") throw new Error("re-completion after Restart did not award exactly one credit");
  await activateGuidance(target.locator("[data-pep-activity]:not([hidden]) [data-pep-complete-activity]"), mode);
  if ((await guidanceState(target)).activities[current - 1].credit !== "1") throw new Error("revisiting completion duplicated credit");
  if (await root.getAttribute("data-pep-current-activity") !== (await guidanceState(target)).current) throw new Error("current activity hook drifted");
}

async function withPage(browser, topic, options, callback) {
  const context = await browser.newContext({
    viewport: options.viewport ?? { width: 1366, height: 768 },
    colorScheme: options.theme ?? "light",
    reducedMotion: options.reducedMotion ? "reduce" : "no-preference",
    hasTouch: options.touch ?? false,
    forcedColors: options.forcedColors ?? "none",
    javaScriptEnabled: options.javaScriptEnabled ?? true,
  });
  const page = await context.newPage();
  const diagnostics = [];
  const label = (options.label ?? "page").replace(/[^a-z0-9-]+/gi, "-");
  attachDiagnostics(page, diagnostics);
  const pageUrl = pathToFileURL(topic.html).href;
  if (options.offline !== false) await blockNetwork(page, diagnostics, pageUrl);
  await context.tracing.start({ screenshots: true, snapshots: true });
  let failed = false;
  try {
    await page.goto(pageUrl, { waitUntil: "load" });
    await callback(page, diagnostics, context);
    if (diagnostics.length) throw new Error(diagnostics.join("; "));
  } catch (error) {
    failed = true;
    await mkdir(topic.output, { recursive: true });
    await page.screenshot({ path: path.join(topic.output, `${topic.topicId}-${label}.png`), fullPage: true });
    await context.tracing.stop({ path: path.join(topic.output, `${topic.topicId}-${label}-trace.zip`) });
    throw error;
  } finally {
    if (!failed) await context.tracing.stop();
    await context.close();
  }
}

async function sandboxFrame(page, topic, expectedViewport) {
  const viewportStyle = expectedViewport
    ? "<style>html,body{width:100%;height:100%;margin:0;overflow:hidden}#lesson{display:block;width:100%;height:100%;border:0}</style>"
    : "";
  await page.setContent(
    `<!doctype html><meta charset="utf-8">${viewportStyle}<iframe id="lesson" sandbox="allow-scripts"></iframe>`,
  );
  const html = await readFile(topic.html, "utf8");
  await page.locator("#lesson").evaluate((iframe, source) => new Promise((resolve) => {
    iframe.addEventListener("load", resolve, { once: true });
    iframe.srcdoc = source;
  }), html);
  const frame = page.frames()[1];
  if (!frame) throw new Error("sandbox iframe did not load");
  await frame.waitForFunction(() => document.readyState === "complete" && Boolean(document.body?.childElementCount));
  if (expectedViewport) {
    const actual = await frame.evaluate(() => ({ width: innerWidth, height: innerHeight }));
    if (actual.width !== expectedViewport.width || actual.height !== expectedViewport.height) {
      throw new Error(`sandbox child viewport ${actual.width}x${actual.height} does not match configured ${expectedViewport.width}x${expectedViewport.height}`);
    }
  }
  return frame;
}

async function checkSandboxGuidanceMatrix(browser, topic, spec) {
  const configurations = [
    { label: "sandbox-guidance-pointer", mode: "pointer", setup: spec.guidance.activityNavigation, viewport: { width: 1366, height: 768 } },
    { label: "sandbox-guidance-keyboard", mode: "keyboard", setup: spec.guidance.activityNavigationKeyboard, viewport: { width: 1366, height: 768 } },
    { label: "sandbox-guidance-touch-320", mode: "touch", setup: spec.guidance.activityNavigationTouch, viewport: { width: 320, height: 568 }, touch: true },
    { label: "sandbox-guidance-touch-390", mode: "touch", setup: spec.guidance.activityNavigationTouch, viewport: { width: 390, height: 844 }, touch: true },
  ];
  for (const configuration of configurations) {
    const context = await browser.newContext({ viewport: configuration.viewport, hasTouch: configuration.touch ?? false });
    const page = await context.newPage();
    try {
      const frame = await sandboxFrame(page, topic, configuration.viewport);
      await checkGuidanceInvariants(frame, configuration.setup, configuration.mode);
    } finally {
      await context.close();
    }
  }
}

async function checkPrint(browser, topic) {
  await withPage(browser, topic, { label: "print" }, async (page) => {
    if (!(await page.locator("[data-pep-guidance-contract]").count())) return;
    const details = page.locator("details[data-pep-objectives], details[data-pep-hint], details[data-pep-optional]");
    if (await details.count()) await details.first().locator(":scope > summary").click();
    const before = await details.evaluateAll((items) => items.map((item) => item.open));
    await page.evaluate(() => dispatchEvent(new Event("beforeprint")));
    await page.emulateMedia({ media: "print" });
    await semanticSurfaceAudit(page);
    const visibleText = async (locator, label) => {
      if (!(await locator.count()) || !(await locator.isVisible()) || !(await locator.innerText()).trim()) {
        throw new Error(`print hides required ${label} content`);
      }
    };
    for (const selector of ["[data-pep-activity]", "[data-pep-teaching]"]) {
      const items = page.locator(selector);
      for (let index = 0; index < await items.count(); index++) await visibleText(items.nth(index), selector);
    }
    const checks = page.locator("[data-pep-activity-checks]");
    for (let index = 0; index < await checks.count(); index++) {
      await visibleText(checks.nth(index).locator(":scope > h2, :scope > h3"), "activity-check heading");
      await visibleText(checks.nth(index).locator(":scope > p, :scope > ul > li, :scope > ol > li").first(), "activity-check criteria");
    }
    const objectives = page.locator("details[data-pep-objectives]");
    for (let index = 0; index < await objectives.count(); index++) {
      const objective = objectives.nth(index);
      const summary = objective.locator(":scope > summary");
      await visibleText(summary, "objectives label");
      const controlled = await summary.getAttribute("aria-controls");
      if (!controlled) throw new Error("print objectives label has no controlled body");
      await visibleText(page.locator(`#${controlled}`), "objectives body");
      const items = page.locator(`#${controlled} li`);
      for (let item = 0; item < await items.count(); item++) await visibleText(items.nth(item), "objective item");
    }
    const hints = page.locator("details[data-pep-hint]");
    for (let index = 0; index < await hints.count(); index++) {
      const hint = hints.nth(index);
      await visibleText(hint.locator(":scope > summary"), "hint label");
      await visibleText(hint.locator(":scope > .pep-hint__body > [data-pep-hint-target]"), "hint target");
      await visibleText(hint.locator(":scope > .pep-hint__body > [data-pep-hint-step]"), "hint reasoning step");
    }
    const optionals = page.locator("details[data-pep-optional]");
    for (let index = 0; index < await optionals.count(); index++) {
      const optional = optionals.nth(index);
      await visibleText(optional.locator(":scope > summary"), "optional label");
      await visibleText(optional.locator(":scope > .pep-optional__body"), "optional body");
      for (const selector of [".pep-optional__cue", "[data-pep-anecdote-story]", "[data-pep-anecdote-map]", "[data-pep-success-criteria]", "[data-pep-optional-time]"]) {
        const items = optional.locator(selector);
        for (let item = 0; item < await items.count(); item++) await visibleText(items.nth(item), selector);
      }
    }
    const alternatives = page.locator("[data-static-alt]");
    for (let index = 0; index < await alternatives.count(); index++) {
      const alternative = alternatives.nth(index);
      const rendered = await alternative.evaluate((node) => {
        if (!node.getClientRects().length || getComputedStyle(node).visibility === "hidden") return "";
        const pseudo = ["::before", "::after"].map((kind) => getComputedStyle(node, kind).content)
          .filter((value) => value && value !== "none" && value !== "normal").join(" ");
        return `${node.innerText} ${pseudo}`.replace(/(?:^|\s)["']|["'](?:\s|$)/gu, " ").trim();
      });
      if (!rendered) throw new Error("print hides required static alternative representation");
    }
    const navigation = page.locator('[data-pep-activity-link], [data-pep-previous], [data-pep-next], [data-pep-back-link], [aria-label="Activities"], [aria-label="Activity navigation"]');
    for (let index = 0; index < await navigation.count(); index++) {
      if (await navigation.nth(index).isVisible()) throw new Error("print must hide navigation-only controls");
    }
    await page.evaluate(() => dispatchEvent(new Event("afterprint")));
    await page.emulateMedia({ media: "screen" });
    const after = await details.evaluateAll((items) => items.map((item) => item.open));
    if (JSON.stringify(after) !== JSON.stringify(before)) throw new Error("print did not restore exact disclosure state");
  });
}

async function checkOffline(browser, topic) {
  await loadSpec(topic);
  await withPage(browser, topic, {}, async () => {});
  await withPage(browser, topic, { javaScriptEnabled: false, label: "no-js" }, async (page) => {
    if (!(await page.locator("body").innerText()).trim()) throw new Error("no-JavaScript reading is empty");
    const laterHints = page.locator('details[data-pep-hint]:not([data-pep-hint-order="1"])');
    for (let index = 0; index < await laterHints.count(); index++) {
      if (await laterHints.nth(index).locator(":scope > summary").isVisible()) throw new Error("a later hint is operable before its predecessor opens");
    }
    const disclosures = page.locator("details[data-pep-optional], details[data-pep-hint], details[data-pep-objectives]");
    for (let index = 0; index < await disclosures.count(); index++) {
      const disclosure = disclosures.nth(index);
      const summary = disclosure.locator(":scope > summary");
      if (!(await summary.innerText()).trim()) throw new Error("native disclosure has no no-JavaScript summary");
      await summary.click();
      if ((await disclosure.getAttribute("open")) === null) throw new Error("native disclosure did not open without JavaScript");
      if (!(await disclosure.innerText()).trim()) throw new Error("native disclosure has no no-JavaScript content");
    }
    if (await page.locator("[data-pep-guidance-contract]").count()) {
      const activities = page.locator("[data-pep-activity]");
      const links = page.locator("a[data-pep-activity-link]");
      const count = await activities.count();
      if (count < 2 || await links.count() !== count) throw new Error("guided no-JavaScript reading requires one timeline anchor per activity");
      for (let index = 0; index < count; index++) {
        const activity = activities.nth(index);
        const id = await activity.getAttribute("id");
        if (!(await activity.isVisible())) throw new Error("no-JavaScript activity section is hidden");
        if (await links.nth(index).getAttribute("href") !== `#${id}`) throw new Error("no-JavaScript timeline href/id order mismatch");
        await links.nth(index).evaluate((link) => link.click());
        if (await page.evaluate(() => location.hash) !== `#${id}`) throw new Error("no-JavaScript timeline anchor did not reach its activity");
        const back = activity.locator("a[data-pep-back-link]");
        if (index === 0 && await back.count()) throw new Error("first activity has an unexpected no-JavaScript back link");
        if (index > 0) {
          const priorId = await activities.nth(index - 1).getAttribute("id");
          if (await back.count() !== 1 || await back.getAttribute("href") !== `#${priorId}`) throw new Error("no-JavaScript back link does not resolve to the predecessor");
          await back.evaluate((link) => link.click());
          if (await page.evaluate(() => location.hash) !== `#${priorId}`) throw new Error("no-JavaScript back link did not reach its predecessor");
        }
      }
    }
    const codeWorkspaces = page.locator('[data-pep-workspace="code"]');
    for (let index = 0; index < await codeWorkspaces.count(); index++) {
      const reading = codeWorkspaces.nth(index).locator("noscript[data-pep-no-js]");
      if ((await reading.count()) !== 1 || !(await reading.innerText()).trim()) throw new Error("code workspace requires a complete noscript[data-pep-no-js] reading");
    }
  });
  await checkPrint(browser, topic);
}

async function checkSandbox(browser, topic) {
  const spec = await loadSpec(topic);
  const context = await browser.newContext({ viewport: { width: 1366, height: 768 } });
  const page = await context.newPage();
  const diagnostics = [];
  await context.tracing.start({ screenshots: true, snapshots: true });
  attachDiagnostics(page, diagnostics);
  await blockNetwork(page, diagnostics);
  let failed = false;
  try {
    for (const name of ["success", "wrongFirst", "wrongTwice"]) {
      const frame = await sandboxFrame(page, topic);
      await execute(frame, spec.routes[name]);
      await assertState(frame, spec.completion);
      await assertState(frame, spec.progress);
    }
    if (spec.guidance) {
      for (const name of ["activityNavigation", "activityNavigationKeyboard", "activityNavigationTouch", "objectives", "objectivesTouch", "hints"]) {
        if (!spec.guidance[name]) continue;
        const frame = await sandboxFrame(page, topic);
        await execute(frame, spec.guidance[name], { keyboard: name.endsWith("Keyboard") });
      }
      const frame = await sandboxFrame(page, topic);
      await exerciseSequentialHints(frame);
    }
    if (diagnostics.length) throw new Error(diagnostics.join("; "));
  } catch (error) {
    failed = true;
    await mkdir(topic.output, { recursive: true });
    await page.screenshot({ path: path.join(topic.output, `${topic.topicId}-sandbox.png`), fullPage: true });
    await context.tracing.stop({ path: path.join(topic.output, `${topic.topicId}-sandbox-trace.zip`) });
    throw error;
  } finally {
    if (!failed) await context.tracing.stop();
    await context.close();
  }
  if (spec.guidance) await checkSandboxGuidanceMatrix(browser, topic, spec);
}

async function checkBehavior(browser, topic) {
  const spec = await loadSpec(topic);
  for (const name of ["success", "wrongFirst", "wrongTwice"]) {
    await withPage(browser, topic, {}, async (page) => {
      await execute(page, spec.routes[name]);
      await assertState(page, spec.completion);
      await assertState(page, spec.progress);
    });
  }
  for (const edge of spec.simulatorEdges) {
    await withPage(browser, topic, {}, async (page) => execute(page, edge.actions));
  }
  await withPage(browser, topic, {}, async (page) => {
    await execute(page, spec.restart.actions);
    await assertState(page, spec.restart.credit);
  });
  if (spec.guidance) {
    await withPage(browser, topic, { label: "activity-navigation" }, async (page) => execute(page, spec.guidance.activityNavigation));
    await withPage(browser, topic, { label: "activity-navigation-keyboard" }, async (page) => execute(page, spec.guidance.activityNavigationKeyboard, { keyboard: true }));
    for (const viewport of [{ width: 320, height: 568 }, { width: 390, height: 844 }]) {
      await withPage(browser, topic, { label: `activity-navigation-touch-${viewport.width}`, viewport, touch: true }, async (page) => execute(page, spec.guidance.activityNavigationTouch, { touch: true }));
    }
    await withPage(browser, topic, { label: "objectives" }, async (page) => execute(page, spec.guidance.objectives));
    await withPage(browser, topic, { label: "objectives-keyboard" }, async (page) => {
      const summary = page.locator("details[data-pep-objectives] > summary");
      if (!(await focusVisible(summary))) throw new Error("objectives summary has no visible focus indicator");
      await summary.press("Enter");
      if ((await page.locator("details[data-pep-objectives]").getAttribute("open")) === null) throw new Error("keyboard did not open objectives");
      await summary.press("Escape");
      if ((await page.locator("details[data-pep-objectives]").getAttribute("open")) !== null) throw new Error("Escape did not close objectives");
      if (!(await summary.evaluate((element) => element === document.activeElement))) throw new Error("Escape did not return focus to objectives summary");
    });
    for (const viewport of [{ width: 320, height: 568 }, { width: 390, height: 844 }]) {
      await withPage(browser, topic, { label: `objectives-touch-${viewport.width}`, viewport, touch: true }, async (page) => execute(page, spec.guidance.objectivesTouch, { touch: true }));
    }
    if (spec.guidance.hints) {
      await withPage(browser, topic, { label: "hints-pointer" }, async (page) => exerciseSequentialHints(page));
      await withPage(browser, topic, { label: "hints-keyboard" }, async (page) => exerciseSequentialHints(page, { keyboard: true }));
      for (const viewport of [{ width: 320, height: 568 }, { width: 390, height: 844 }]) {
        await withPage(browser, topic, { label: `hints-touch-${viewport.width}`, viewport, touch: true }, async (page) => exerciseSequentialHints(page, { touch: true }));
      }
    }
    await withPage(browser, topic, { label: "guidance-invariants" }, async (page) => {
      const root = page.locator("[data-pep-guidance-contract]");
      const links = page.locator("[data-pep-activity-link]");
      const activities = page.locator("[data-pep-activity]");
      const initial = await guidanceState(page);
      if (!initial.current || !initial.frontier || !initial.requiredMinutes) throw new Error("guidance state hooks are incomplete");
      for (let index = Number(initial.frontier); index < await links.count(); index++) {
        const before = await guidanceState(page);
        await links.nth(index).dispatchEvent("click");
        const after = await guidanceState(page);
        delete before.focused;
        delete after.focused;
        if (JSON.stringify(after) !== JSON.stringify(before)) throw new Error("locked future timeline activation changed guidance state");
      }
      await page.locator("[data-pep-activity]:not([hidden]) [data-pep-wrong-attempt]").click();
      const afterWrong = await guidanceState(page);
      const otherBefore = afterWrong.activities.slice(1);
      const frontierBeforeRestart = afterWrong.frontier;
      await page.locator("[data-pep-reset]").click();
      const afterWrongRestart = await guidanceState(page);
      const currentState = afterWrongRestart.activities[Number(afterWrongRestart.current) - 1];
      if (currentState.attempts !== "0" || currentState.settled !== "false" || currentState.completed !== "false" || currentState.credit !== "0" || currentState.grade !== "0" || currentState.canContinue !== "false" || currentState.feedback.some((item) => item.text)) {
        throw new Error("Restart after a wrong attempt left stale current-activity state");
      }
      if (JSON.stringify(afterWrongRestart.activities.slice(1)) !== JSON.stringify(otherBefore) || afterWrongRestart.frontier !== frontierBeforeRestart || afterWrongRestart.requiredMinutes !== initial.requiredMinutes) {
        throw new Error("Restart changed another activity, the unlocked frontier, or required time");
      }
      const complete = page.locator("[data-pep-activity]:not([hidden]) [data-pep-complete-activity]").first();
      await complete.click();
      let completed = await guidanceState(page);
      if (completed.activities[0].credit !== "1" || Number(completed.frontier) < Number(initial.frontier)) throw new Error("completion did not award exactly one credit or preserve a monotonic frontier");
      await page.locator("[data-pep-reset]").click();
      await page.locator("[data-pep-activity]:not([hidden]) [data-pep-complete-activity]").first().click();
      completed = await guidanceState(page);
      if (completed.activities[0].credit !== "1") throw new Error("re-completion after Restart did not award exactly one credit");
      await page.locator("[data-pep-activity]:not([hidden]) [data-pep-complete-activity]").first().click();
      completed = await guidanceState(page);
      if (completed.activities[0].credit !== "1") throw new Error("revisiting completion duplicated credit");
      if (await activities.count() > 1) {
        const firstEditable = page.locator("[data-pep-activity]:not([hidden]) input:not([type=hidden]), [data-pep-activity]:not([hidden]) textarea").first();
        if (await firstEditable.count()) await firstEditable.fill("harness-preserved-first-state");
        const beforeNavigation = await guidanceState(page);
        await page.locator("[data-pep-next]").click();
        const afterNavigation = await guidanceState(page);
        if (afterNavigation.activities.reduce((sum, item) => sum + Number(item.credit), 0) !== beforeNavigation.activities.reduce((sum, item) => sum + Number(item.credit), 0)) throw new Error("navigation issued credit");
        if (Number(afterNavigation.frontier) < Number(beforeNavigation.frontier)) throw new Error("navigation decreased the unlocked frontier");
        if (JSON.stringify(afterNavigation.activities) !== JSON.stringify(beforeNavigation.activities) || JSON.stringify(afterNavigation.controls) !== JSON.stringify(beforeNavigation.controls) || afterNavigation.requiredMinutes !== beforeNavigation.requiredMinutes) throw new Error("forward navigation changed preserved activity state");
        const secondEditable = page.locator("[data-pep-activity]:not([hidden]) input:not([type=hidden]), [data-pep-activity]:not([hidden]) textarea").first();
        if (await secondEditable.count()) await secondEditable.fill("harness-preserved-second-state");
        const preservedState = await guidanceState(page);
        const historyFocus = page.locator("[data-pep-reset]");
        await historyFocus.focus();
        const focusedId = await historyFocus.getAttribute("id");
        await page.goBack();
        let historyState = await guidanceState(page);
        if (historyState.current !== beforeNavigation.current || historyState.focused !== focusedId || JSON.stringify(historyState.activities) !== JSON.stringify(preservedState.activities) || JSON.stringify(historyState.controls) !== JSON.stringify(preservedState.controls)) throw new Error("browser Back changed state or failed to preserve focus");
        await page.goForward();
        historyState = await guidanceState(page);
        if (historyState.current !== afterNavigation.current || historyState.focused !== focusedId || JSON.stringify(historyState.activities) !== JSON.stringify(preservedState.activities) || JSON.stringify(historyState.controls) !== JSON.stringify(preservedState.controls)) throw new Error("browser Forward changed state or failed to preserve focus");
        await page.locator("[data-pep-previous]").click();
        const afterPrevious = await guidanceState(page);
        if (JSON.stringify(afterPrevious.activities) !== JSON.stringify(preservedState.activities) || JSON.stringify(afterPrevious.controls) !== JSON.stringify(preservedState.controls) || afterPrevious.frontier !== beforeNavigation.frontier) throw new Error("backward navigation changed preserved activity state");
      }
      if (await root.getAttribute("data-pep-current-activity") !== (await guidanceState(page)).current) throw new Error("current activity hook drifted");
    });
    await withPage(browser, topic, { label: "future-fragment" }, async (page) => {
      const last = await page.locator("[data-pep-activity]").last().getAttribute("id");
      await page.goto(`${pathToFileURL(topic.html).href}#${last}`, { waitUntil: "load" });
      const state = await guidanceState(page);
      if (state.frontier !== "1" || state.current !== "1" || state.hash !== "#activity-1") throw new Error("fresh future fragment unlocked or selected a future activity");
    });
    for (const configuration of [
      { label: "owned-guidance-pointer", mode: "pointer", setup: spec.guidance.activityNavigation, viewport: { width: 1366, height: 768 } },
      { label: "owned-guidance-keyboard", mode: "keyboard", setup: spec.guidance.activityNavigationKeyboard, viewport: { width: 1366, height: 768 } },
      { label: "owned-guidance-touch-320", mode: "touch", setup: spec.guidance.activityNavigationTouch, viewport: { width: 320, height: 568 }, touch: true },
      { label: "owned-guidance-touch-390", mode: "touch", setup: spec.guidance.activityNavigationTouch, viewport: { width: 390, height: 844 }, touch: true },
    ]) {
      await withPage(browser, topic, configuration, async (page) => {
        await checkGuidanceInvariants(page, configuration.setup, configuration.mode);
      });
    }
  }
  await withPage(browser, topic, { label: "optional-accounting" }, async (page) => {
    const disclosures = page.locator("details[data-pep-optional], details[data-pep-hint]");
    if ((await disclosures.count()) === 0) return;
    const snapshot = async () => {
      const required = {
        completion: spec.completion.attribute
          ? await page.locator(spec.completion.selector).getAttribute(spec.completion.attribute)
          : await page.locator(spec.completion.selector).innerText(),
        progress: spec.progress.attribute
          ? await page.locator(spec.progress.selector).getAttribute(spec.progress.attribute)
          : await page.locator(spec.progress.selector).innerText(),
      };
      if (spec.guidance) {
        const state = await guidanceState(page);
        required.current = state.current;
        required.frontier = state.frontier;
        required.requiredMinutes = state.requiredMinutes;
        required.activities = state.activities;
      }
      return required;
    };
    const before = await snapshot();
    for (let index = 0; index < await disclosures.count(); index++) {
      const disclosure = disclosures.nth(index);
      await disclosure.locator(":scope > summary").click();
      const fields = disclosure.locator("input:not([type=hidden]), textarea");
      for (let field = 0; field < await fields.count(); field++) {
        const control = fields.nth(field);
        if (await control.isEditable()) await control.fill("optional attempt");
      }
      const buttons = disclosure.locator("button:not([disabled])");
      for (let button = 0; button < await buttons.count(); button++) await buttons.nth(button).click();
    }
    const after = await snapshot();
    if (JSON.stringify(after) !== JSON.stringify(before)) {
      throw new Error(`optional disclosures changed required state from ${JSON.stringify(before)} to ${JSON.stringify(after)}`);
    }
  });
}

async function semanticSurfaceAudit(page, { forcedColors = false } = {}) {
  const failures = await page.evaluate(({ forcedColors }) => {
    const root = document.querySelector("[data-pep-guidance-contract]");
    if (!root) return [];
    const normalize = (value) => (value ?? "").replace(/\s+/gu, " ").trim();
    const parse = (value) => {
      const match = value.match(/rgba?\(([^)]+)\)/u);
      if (!match) return null;
      const parts = match[1].split(/[ ,/]+/u).filter(Boolean).map(Number);
      return [parts[0], parts[1], parts[2], parts[3] ?? 1];
    };
    const token = (name) => {
      const probe = document.createElement("span");
      probe.style.color = `var(${name})`;
      document.body.append(probe);
      const value = getComputedStyle(probe).color;
      probe.remove();
      return value;
    };
    const sameChannels = (first, second) => first && second
      && first.every((value, index) => Math.abs(value - second[index]) < 0.6);
    const sameColor = (actual, expected) => sameChannels(parse(actual), parse(expected));
    const composite = (front, back) => {
      const alpha = front[3] + back[3] * (1 - front[3]);
      if (!alpha) return [0, 0, 0, 0];
      return [0, 1, 2].map((index) =>
        (front[index] * front[3] + back[index] * back[3] * (1 - front[3])) / alpha,
      ).concat(alpha);
    };
    const effectiveBackground = (element) => {
      const layers = [];
      for (let node = element; node; node = node.parentElement) {
        const color = parse(getComputedStyle(node).backgroundColor);
        if (color) layers.push(color);
      }
      return layers.reverse().reduce((result, color) => composite(color, result), [255, 255, 255, 1]);
    };
    const visibleBorder = (style, side, surface) => {
      const width = Number.parseFloat(style[`border${side}Width`]);
      const borderStyle = style[`border${side}Style`];
      const color = parse(style[`border${side}Color`]);
      if (!(width > 0) || borderStyle === "none" || borderStyle === "hidden" || !color || color[3] === 0) return false;
      return !sameChannels(composite(color, surface), surface);
    };
    const luminance = (color) => {
      const rgb = color.slice(0, 3).map((value) => {
        const channel = value / 255;
        return channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
      });
      return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
    };
    const ratio = (first, second) => {
      const values = [luminance(first), luminance(second)].sort((a, b) => b - a);
      return (values[0] + 0.05) / (values[1] + 0.05);
    };
    const deficiencyMatrices = {
      protanopia: [[0.567, 0.433, 0], [0.558, 0.442, 0], [0, 0.242, 0.758]],
      deuteranopia: [[0.625, 0.375, 0], [0.7, 0.3, 0], [0, 0.3, 0.7]],
      tritanopia: [[0.95, 0.05, 0], [0, 0.433, 0.567], [0, 0.475, 0.525]],
    };
    const transform = (color, matrix) => matrix.map((row) =>
      row.reduce((sum, coefficient, index) => sum + coefficient * color[index], 0));
    const definitions = [
      { name: "instructions", nodes: [...root.querySelectorAll("[data-pep-instructions]")], instruction: true },
      { name: "topic bar", nodes: [...root.querySelectorAll(".pep-topicbar")], label: "h1", labelPattern: /\S/u, surface: "--pep-accent-soft", border: "--pep-accent", edge: "block" },
      { name: "interactive workspace", nodes: [...root.querySelectorAll("[data-pep-workspace]")], label: "[data-pep-task]", labelPattern: /\S/u, surface: "--pep-card", border: "--pep-line-strong", edge: "box" },
      { name: "Where this fits", nodes: [...root.querySelectorAll("[data-pep-where-fits]")], label: ":scope > h2, :scope > h3", labelPattern: /^Where this fits$/u, surface: "--pep-card", border: "--pep-accent", edge: "block" },
      { name: "Another way to think about it", nodes: [...root.querySelectorAll('.pep-optional--anecdote[data-pep-optional="anecdote"]')], label: ":scope > summary", labelPattern: /^Another way to think about it/u, surface: "--pep-card", border: "--pep-line-strong", edge: "block" },
      { name: "Need a hint?", nodes: [...root.querySelectorAll("details[data-pep-hint]")].filter((node) => !node.parentElement?.closest("details[data-pep-hint]")), label: ":scope > summary", labelPattern: /^Need a hint\?/u, surface: "--pep-accent-soft", border: "--pep-accent", edge: "block" },
      { name: "activity checks", nodes: [...root.querySelectorAll("[data-pep-activity-checks]")], label: ":scope > h2, :scope > h3", labelPattern: /^(What success looks like|Activity checks)$/u, surface: "--pep-accent-soft", border: "--pep-accent", edge: "block" },
      { name: "Challenge (optional)", nodes: [...root.querySelectorAll('.pep-optional--challenge[data-pep-optional="challenge"]')], label: ":scope > summary", labelPattern: /^Challenge \(optional\)$/u, surface: "--pep-control", border: "--pep-line-strong", edge: "block" },
    ];
    const problems = [];
    for (const definition of definitions) {
      for (const [index, node] of definition.nodes.entries()) {
        const style = getComputedStyle(node);
        const hiddenActivity = node.closest("[data-pep-activity][hidden]");
        if (!hiddenActivity && !node.getClientRects().length) problems.push(`${definition.name} ${index + 1} is not rendered`);
        const surface = effectiveBackground(node);
        if (definition.instruction) {
          const pageSurface = effectiveBackground(document.body);
          if (!sameChannels(surface, pageSurface)) problems.push(`${definition.name} ${index + 1} does not resolve to --pep-page`);
          if (["Top", "Right", "Bottom", "Left"].some((side) => visibleBorder(style, side, surface))) {
            problems.push(`${definition.name} ${index + 1} has a decorative status surface/rail`);
          }
          continue;
        }
        const label = node.querySelector(definition.label);
        if (!label || !definition.labelPattern.test(normalize(label.textContent))) {
          problems.push(`${definition.name} ${index + 1} lacks its visible non-color label`);
        }
        const edge = definition.edge === "inline"
          ? { width: style.borderInlineStartWidth, style: style.borderInlineStartStyle, color: style.borderInlineStartColor, minimum: 4 }
          : definition.edge === "block"
            ? { width: style.borderBlockStartWidth, style: style.borderBlockStartStyle, color: style.borderBlockStartColor, minimum: 4 }
            : { width: style.borderTopWidth, style: style.borderTopStyle, color: style.borderTopColor, minimum: 1 };
        if (edge.style === "none" || edge.style === "hidden" || Number.parseFloat(edge.width) < edge.minimum) {
          problems.push(`${definition.name} ${index + 1} lacks its non-color ${definition.edge === "box" ? "boundary" : "rail"}`);
          continue;
        }
        const border = parse(edge.color);
        if (!border || border[3] === 0) {
          problems.push(`${definition.name} ${index + 1} has an invisible semantic rail/boundary`);
          continue;
        }
        const compositedBorder = composite(border, surface);
        if (sameChannels(compositedBorder, surface)) {
          problems.push(`${definition.name} ${index + 1} has an indistinguishable semantic rail/boundary`);
          continue;
        }
        if (forcedColors) {
          if (style.forcedColorAdjust === "none" && ratio(surface, compositedBorder) < 3) {
            problems.push(`${definition.name} ${index + 1} forced-color rail/boundary contrast is below 3:1`);
          }
          continue;
        }
        const expectedSurface = token(definition.surface);
        const expectedBorder = token(definition.border);
        if (!sameColor(style.backgroundColor, expectedSurface)) problems.push(`${definition.name} ${index + 1} does not use ${definition.surface}`);
        if (!sameColor(edge.color, expectedBorder)) problems.push(`${definition.name} ${index + 1} does not use ${definition.border}`);
        if (ratio(surface, compositedBorder) < 3) problems.push(`${definition.name} ${index + 1} rail/boundary contrast is below 3:1`);
        for (const [kind, matrix] of Object.entries(deficiencyMatrices)) {
          if (ratio(transform(surface, matrix), transform(compositedBorder, matrix)) < 3) {
            problems.push(`${definition.name} ${index + 1} loses 3:1 rail/boundary contrast under ${kind}`);
          }
        }
      }
    }
    return problems;
  }, { forcedColors });
  if (failures.length) throw new Error(`semantic guidance surfaces: ${failures.slice(0, 8).join("; ")}`);
}

function contrastAudit(page) {
  return page.evaluate(() => {
    const parse = (value) => {
      const match = value.match(/rgba?\(([^)]+)\)/);
      if (!match) return null;
      const parts = match[1].split(/[ ,/]+/).filter(Boolean).map(Number);
      return [parts[0], parts[1], parts[2], parts[3] ?? 1];
    };
    const blend = (front, back) => {
      const alpha = front[3];
      return [0, 1, 2].map((i) => front[i] * alpha + back[i] * (1 - alpha)).concat(1);
    };
    const background = (element) => {
      let result = [255, 255, 255, 1];
      const layers = [];
      for (let node = element; node; node = node.parentElement) {
        const color = parse(getComputedStyle(node).backgroundColor);
        if (color && color[3] > 0) layers.push(color);
      }
      for (const color of layers.reverse()) result = blend(color, result);
      return result;
    };
    const luminance = (color) => {
      const rgb = color.slice(0, 3).map((value) => {
        const channel = value / 255;
        return channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
      });
      return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
    };
    const ratio = (first, second) => {
      const values = [luminance(first), luminance(second)].sort((a, b) => b - a);
      return (values[0] + 0.05) / (values[1] + 0.05);
    };
    const visible = (element) =>
      element.getClientRects().length > 0 && getComputedStyle(element).visibility !== "hidden";
    const label = (element) => element.id ? `#${element.id}` : element.tagName.toLowerCase();
    const failures = [];
    for (const element of document.querySelectorAll("body *")) {
      if (!visible(element)) continue;
      const style = getComputedStyle(element);
      const directText = [...element.childNodes].some(
        (node) => node.nodeType === Node.TEXT_NODE && node.textContent.trim(),
      );
      if (directText) {
        const foreground = parse(style.color);
        const backgroundColor = background(element);
        if (foreground && ratio(blend(foreground, backgroundColor), backgroundColor) < 4.5) {
          failures.push(`${label(element)} text ${ratio(foreground, backgroundColor).toFixed(2)} < 4.5`);
        }
      }
      const widths = [style.borderTopWidth, style.borderRightWidth, style.borderBottomWidth, style.borderLeftWidth];
      const styles = [style.borderTopStyle, style.borderRightStyle, style.borderBottomStyle, style.borderLeftStyle];
      const colors = [style.borderTopColor, style.borderRightColor, style.borderBottomColor, style.borderLeftColor];
      for (let index = 0; index < 4; index++) {
        if (parseFloat(widths[index]) < 1 || styles[index] === "none") continue;
        const border = parse(colors[index]);
        const behind = background(element.parentElement ?? document.body);
        const borderRatio = border ? ratio(blend(border, behind), behind) : null;
        if (border && border[3] > 0 && borderRatio < 3) {
          failures.push(`${label(element)} border ${borderRatio.toFixed(2)} < 3`);
          break;
        }
      }
    }
    return failures;
  });
}

async function checkAccessibility(browser, topic) {
  const spec = await loadSpec(topic);
  for (const theme of ["light", "dark"]) {
    await withPage(browser, topic, { theme }, async (page) => {
      const axe = await new AxeBuilder({ page }).analyze();
      const severe = axe.violations.filter((item) => ["serious", "critical"].includes(item.impact));
      if (severe.length) throw new Error(`axe serious/critical: ${severe.map((item) => item.id).join(", ")}`);
      const contrast = await contrastAudit(page);
      if (contrast.length) throw new Error(`${theme} contrast: ${contrast.slice(0, 8).join("; ")}`);
      await semanticSurfaceAudit(page);
      if ((await page.locator("[aria-live]").count()) === 0) throw new Error("aria-live region is required");
    });
  }
  await withPage(browser, topic, { label: "forced-colors", forcedColors: "active" }, async (page) => {
    await semanticSurfaceAudit(page, { forcedColors: true });
    const axe = await new AxeBuilder({ page }).analyze();
    const severe = axe.violations.filter((item) => ["serious", "critical"].includes(item.impact));
    if (severe.length) throw new Error(`forced-colors axe serious/critical: ${severe.map((item) => item.id).join(", ")}`);
  });
  await withPage(browser, topic, {}, async (page) => {
    await execute(page, spec.keyboard, { keyboard: true });
    await assertState(page, spec.completion);
    await assertState(page, spec.progress);
  });
  await withPage(browser, topic, { reducedMotion: true }, async (page) => {
    await execute(page, spec.routes.success);
    await assertState(page, spec.completion);
    await assertState(page, spec.progress);
  });
}

async function checkResponsive(browser, topic) {
  const spec = await loadSpec(topic);
  const html = await readFile(topic.html, "utf8");
  const viewports = /\bdata-pep-responsive(?:\s|=|>)/i.test(html) ? VIEWPORTS : LEGACY_VIEWPORTS;
  topic.checkedViewports = viewports;
  for (const viewport of viewports) {
    await withPage(
      browser,
      topic,
      {
        viewport: {
          width: Math.floor(viewport.width / viewport.zoom),
          height: Math.floor(viewport.height / viewport.zoom),
        },
        theme: viewport.theme,
        touch: viewport.touch,
      },
      async (page) => {
        const inspect = async () => {
          if (spec.guidance) await semanticSurfaceAudit(page);
          const geometry = await page.evaluate(() => {
            const root = document.documentElement;
            const essentialSelector = [
              "[data-essential]",
              "h1",
              "[aria-live]",
              "button:not([hidden])",
              "input:not([type=hidden])",
              "select",
              "textarea",
            ].join(",");
            const isVisible = (element) =>
              element.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true });
            const visibleTextRects = (element) => {
              const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
              const rects = [];
              for (let node = walker.nextNode(); node; node = walker.nextNode()) {
                if (!node.textContent.trim() || !isVisible(node.parentElement)) continue;
                const range = document.createRange();
                range.selectNodeContents(node);
                rects.push(...[...range.getClientRects()].filter((box) => box.width >= 1 && box.height >= 1));
              }
              return rects;
            };
            const renderedBoxes = (element) => {
              if (!isVisible(element)) return [];
              const own = [...element.getClientRects()].filter((box) => box.width >= 1 && box.height >= 1);
              const text = visibleTextRects(element);
              if (own.length) return [...own, ...text];
              const descendants = [...element.querySelectorAll("*")]
                .filter(isVisible)
                .flatMap((node) => [...node.getClientRects()])
                .filter((box) => box.width >= 1 && box.height >= 1);
              return [...descendants, ...text];
            };
            const clipped = [...document.querySelectorAll(essentialSelector)]
              .map((element) => ({ element, boxes: renderedBoxes(element) }))
              .filter(({ boxes }) => boxes.length)
              .filter(({ element, boxes }) => {
                for (const box of boxes) {
                  if (
                    box.left < -1 ||
                    box.right > root.scrollWidth + 1 ||
                    box.bottom + scrollY > root.scrollHeight + 1
                  ) return true;
                  for (let parent = element; parent; parent = parent.parentElement) {
                    const style = getComputedStyle(parent);
                    if (!/(hidden|clip)/.test(`${style.overflowX} ${style.overflowY}`)) continue;
                    const parentBox = parent.getBoundingClientRect();
                    if (
                      box.left < parentBox.left - 1 ||
                      box.right > parentBox.right + 1 ||
                      box.top < parentBox.top - 1 ||
                      box.bottom > parentBox.bottom + 1
                    ) return true;
                  }
                }
                return false;
              })
              .map(({ element }) => element.id || element.tagName.toLowerCase());
            const targetSelector = [
              "button:not([hidden])",
              "input:not([type=hidden])",
              "select",
              "textarea",
              "summary",
              '[role="button"]',
              '[role="tab"]',
              '[role="checkbox"]',
              '[role="radio"]',
              'a[href]',
            ].join(",");
            const undersized = [...document.querySelectorAll(targetSelector)]
              .filter(isVisible)
              .map((element) => ({ element, box: element.getBoundingClientRect() }))
              .filter(({ box }) => box.width < 44 || box.height < 44)
              .map(({ element, box }) =>
                `${element.id ? `#${element.id}` : element.tagName.toLowerCase()} ${Math.round(box.width)}x${Math.round(box.height)}`
              );
            return { scrollWidth: root.scrollWidth, clientWidth: root.clientWidth, clipped, undersized };
          });
          if (geometry.scrollWidth > geometry.clientWidth + 1) {
            throw new Error(
              `${viewport.name} horizontal overflow: ${geometry.scrollWidth} > ${geometry.clientWidth}`,
            );
          }
          if (geometry.clipped.length) {
            throw new Error(`${viewport.name} clipped essentials: ${geometry.clipped.join(", ")}`);
          }
          if (viewport.touch && geometry.undersized.length) {
            throw new Error(`${viewport.name} touch targets below 44x44: ${geometry.undersized.join(", ")}`);
          }
        };
        await inspect();
        if (spec.guidance) {
          const objectives = page.locator("details[data-pep-objectives]");
          await objectives.locator(":scope > summary").click();
          await inspect();
          if (spec.guidance.hints) await exerciseSequentialHints(page, { touch: viewport.touch, afterOpen: inspect });
        }
        for (const action of spec.routes.wrongTwice) {
          await perform(page, action, { touch: viewport.touch });
          await inspect();
        }
        await assertState(page, spec.completion);
        await assertState(page, spec.progress);
      },
    );
  }
}

const CHECKERS = {
  T09: checkOffline,
  T10: checkSandbox,
  T11: checkBehavior,
  T12: checkAccessibility,
  T13: checkResponsive,
};

export async function validateQaPrivateProofs(repoRoot, evidenceRoot) {
  const out = [];
  const git = (args) => spawnSync("git", args, { cwd: repoRoot, encoding: "utf8" });
  const privateName = /(^|[-_.\/])(?:answer[-_ ]?key|rubric|(?:reference|instructor|private)[-_ ]?solution|hidden[-_ ]?tests?)([-_.\/]|$)/iu;
  for (const receiptFile of (await walk(evidenceRoot)).files.filter((file) => path.basename(file) === "qa-receipt.json")) {
    const receipt = await readJson(receiptFile).catch(() => null);
    const proof = receipt?.privateSuccessProof;
    if (!proof) continue;
    const display = relative(repoRoot, receiptFile);
    if (proof.record !== `validated at ${proof.commit} by run ${proof.runId}`) out.push(error("T06", display, "private success record must match commit and runId"));
    const commit = git(["cat-file", "-e", `${proof.commit}^{commit}`]);
    if (commit.status !== 0) {
      out.push(error("T06", display, "private success proof commit does not exist in this repository"));
      continue;
    }
    const evidenceRelative = display.split("/");
    const evidenceIndex = evidenceRelative.indexOf("evidence");
    const owner = evidenceIndex >= 0 ? evidenceRelative.slice(evidenceIndex + 1, -1) : [];
    const ownerPath = owner.join("/");
    const required = new Set([
      `${ownerPath}/artifact.html`,
      `authoring/evidence/${ownerPath}/qa-paths.json`,
      "authoring/tools/qa/harness.mjs",
      "authoring/tools/qa/python-answer-scan.py",
      "authoring/tools/checks/T08-html-static.mjs",
    ]);
    const bindings = proof.publicBindings ?? [];
    const seen = new Set(bindings.map((binding) => binding.file));
    if (bindings.length !== 5 || seen.size !== 5 || [...seen].some((file) => !required.has(file)) || [...required].some((file) => !seen.has(file))) {
      out.push(error("T06", display, "private-success public bindings must equal the exact five approved public paths"));
    }
    for (const binding of bindings) {
      if (privateName.test(binding.file)) out.push(error("T06", display, `private material cannot be bound: ${binding.file}`));
      const blob = git(["show", `${proof.commit}:${binding.file}`]);
      if (blob.status !== 0) {
        out.push(error("T06", display, `private-success public binding is missing from proof commit: ${binding.file}`));
        continue;
      }
      const blobHash = sha256(Buffer.from(blob.stdout, "utf8"));
      if (blobHash !== binding.reviewedSha256) out.push(error("T06", display, `private-success commit blob differs from receipt: ${binding.file}`));
      try {
        const currentHash = sha256(await readFile(path.join(repoRoot, ...binding.file.split("/"))));
        if (currentHash !== blobHash) out.push(error("T06", display, `stale private-success public binding: ${binding.file}`));
      } catch (cause) {
        if (cause.code === "ENOENT") out.push(error("T06", display, `private-success public binding is missing: ${binding.file}`));
        else throw cause;
      }
    }
    if (git(["merge-base", "--is-ancestor", proof.commit, "HEAD"]).status !== 0) {
      out.push(error("T06", display, "private success proof commit must be an ancestor of current HEAD"));
    }
    const introduction = git(["log", "--all", "--format=%H", "-S", proof.runId, "--", display]);
    const introductions = introduction.stdout.trim().split(/\s+/u).filter(Boolean);
    if (introductions.length !== 1) {
      out.push(error("T06", display, "private success runId must be introduced by exactly one evidence commit"));
      continue;
    }
    const receiptCommit = introductions[0];
    const parents = git(["rev-list", "--parents", "-n", "1", receiptCommit]).stdout.trim().split(/\s+/u).slice(1);
    if (parents.length !== 1 || parents[0] !== proof.commit) {
      out.push(error("T06", display, "private success receipt must be introduced in the immediate child of its proof commit"));
      continue;
    }
    const allowedLock = owner.length >= 2 ? `authoring/catalog/${owner[0]}/${owner[1]}/module.lock.json` : "";
    const changed = git(["diff-tree", "--no-commit-id", "--name-only", "-r", receiptCommit]).stdout.trim().split(/\n/u).filter(Boolean);
    if (changed.some((file) => file !== display && file !== allowedLock)) {
      out.push(error("T06", display, "private success receipt commit may change only its receipt and generated module lock"));
    }
  }
  return out;
}

export async function updateReceipt(ctx, topic, rule, passed, detail, writeEvidence = false) {
  writeEvidence ||= process.env.PEP_QA_WRITE_EVIDENCE === "1";
  const outputRoot = writeEvidence
    ? evidencePath(ctx.root, topic.courseId, topic.moduleId, topic.topicId)
    : path.join(ctx.root, "build", "qa", topic.courseId, topic.moduleId, topic.topicId);
  const receiptFile = path.join(outputRoot, "qa-receipt.json");
  let receipt;
  try {
    receipt = JSON.parse(await readFile(receiptFile, "utf8"));
  } catch {
    receipt = {
      schemaVersion: 1,
      artifactHashes: {},
      viewports: VIEWPORTS.map(({ width, height, theme, zoom }) => ({ width, height, theme, zoom })),
      checks: [],
      passCount: 0,
      toolVersions: {
        node: process.versions.node,
        playwright: PACKAGE.dependencies.playwright,
        axeCorePlaywright: PACKAGE.dependencies["@axe-core/playwright"],
        chromium: topic.browserVersion ?? "not-recorded",
      },
    };
  }
  if (topic.checkedViewports) {
    receipt.viewports = topic.checkedViewports.map(({ width, height, theme, zoom }) => ({ width, height, theme, zoom }));
  }
  for (const [artifact, filename] of [
    ["html", "artifact.html"],
    ["md", "artifact.md"],
    ["pdf", "artifact.pdf"],
  ]) {
    delete receipt.artifactHashes[filename];
    if (topic.manifest.artifacts?.[artifact]?.status !== "present") continue;
    const bytes = await readFile(path.join(topic.root, filename)).catch(() => null);
    if (bytes) receipt.artifactHashes[filename] = digest(bytes);
  }
  receipt.checks = receipt.checks.filter((check) => check.id !== rule);
  receipt.checks.push({ id: rule, status: passed ? "pass" : "fail", detail });
  receipt.checks.sort((a, b) => a.id.localeCompare(b.id));
  receipt.passCount = receipt.checks.filter((check) => check.status === "pass").length;
  await mkdir(outputRoot, { recursive: true });
  await writeFile(receiptFile, `${JSON.stringify(receipt, null, 2)}\n`);
}

export async function runPrivateOverlay(ctx, overlayFile) {
  const git = (args) => spawnSync("git", args, { cwd: ctx.root, encoding: "utf8" });
  const top = git(["rev-parse", "--show-toplevel"]);
  if (top.status !== 0 || await realpath(top.stdout.trim()) !== await realpath(ctx.root)) throw new Error("private overlay repository root is invalid");
  const commit = git(["rev-parse", "HEAD"]).stdout.trim();
  if (!/^[a-f0-9]{40}$/u.test(commit)) throw new Error("private overlay requires a public commit");
  if (git(["status", "--porcelain=v1", "--untracked-files=all"]).stdout.trim()) throw new Error("private overlay requires a clean public commit");
  const absolute = path.resolve(overlayFile);
  const outside = path.relative(ctx.root, absolute);
  if (!outside.startsWith(`..${path.sep}`) && outside !== "..") throw new Error("private overlay must be outside the repository");
  let overlay;
  try {
    overlay = JSON.parse(await readFile(absolute, "utf8"));
  } catch {
    throw new Error("private overlay is required and must be valid JSON");
  }
  if (overlay?.schemaVersion !== 1 || !/^[A-Za-z0-9._-]+$/u.test(overlay?.runId ?? "") ||
      !/^[a-z0-9]+(?:-[a-z0-9]+)*\/[a-z0-9]+(?:-[a-z0-9]+)*\/[a-z0-9]+(?:-[a-z0-9]+)*$/u.test(overlay?.topic ?? "")) {
    throw new Error("private overlay metadata is invalid");
  }
  const routeNames = ["success", "wrongFirst", "keyboard", "sandbox"];
  if (!overlay.routes || routeNames.some((name) => !Array.isArray(overlay.routes[name]) || !overlay.routes[name].length)) {
    throw new Error("private overlay requires success, wrongFirst, keyboard and sandbox routes");
  }
  const topic = (await findHtmlTopics(ctx)).find((item) => `${item.courseId}/${item.moduleId}/${item.topicId}` === overlay.topic);
  if (!topic) throw new Error("private overlay topic does not resolve to one HTML topic");
  const spec = await loadSpec(topic);
  const approved = [
    relative(ctx.root, topic.html),
    relative(ctx.root, topic.spec),
    "authoring/tools/qa/harness.mjs",
    "authoring/tools/qa/python-answer-scan.py",
    "authoring/tools/checks/T08-html-static.mjs",
  ];
  const beforeHashes = new Map();
  for (const file of approved) {
    const working = sha256(await readFile(path.join(ctx.root, ...file.split("/"))));
    const blob = git(["show", `${commit}:${file}`]);
    if (blob.status !== 0 || sha256(Buffer.from(blob.stdout, "utf8")) !== working) throw new Error("private overlay public files must equal the captured commit");
    beforeHashes.set(file, working);
  }
  for (const name of routeNames) {
    const candidate = structuredClone(spec);
    candidate.routes.success = overlay.routes[name];
    if (!validateQaPath(candidate)) throw new Error(`private overlay ${name} route does not match the public action schema`);
  }
  const browser = await launchChromium();
  const runTopLevel = async (actions, keyboard = false) => {
    const context = await browser.newContext({ viewport: { width: 1366, height: 768 } });
    const page = await context.newPage();
    let attemptedExternalLoad = false;
    await page.route("**/*", async (route) => {
      const url = route.request().url();
      if (url.split(/[?#]/u)[0] === pathToFileURL(topic.html).href) return route.continue();
      attemptedExternalLoad = true;
      return route.abort("blockedbyclient");
    });
    try {
      await page.goto(pathToFileURL(topic.html).href, { waitUntil: "load" });
      await execute(page, actions, { keyboard });
      await assertState(page, spec.completion);
      await assertState(page, spec.progress);
      if (attemptedExternalLoad) throw new Error("external load");
    } finally {
      await context.close();
    }
  };
  try {
    await runTopLevel(overlay.routes.success);
    await runTopLevel(overlay.routes.wrongFirst);
    await runTopLevel(overlay.routes.keyboard, true);
    const context = await browser.newContext({ viewport: { width: 1366, height: 768 } });
    const page = await context.newPage();
    let sandboxExternalLoad = false;
    await page.route("**/*", async (route) => { sandboxExternalLoad = true; await route.abort("blockedbyclient"); });
    try {
      const frame = await sandboxFrame(page, topic);
      await execute(frame, overlay.routes.sandbox);
      await assertState(frame, spec.completion);
      await assertState(frame, spec.progress);
      if (sandboxExternalLoad) throw new Error("external load");
    } finally {
      await context.close();
    }
  } catch {
    throw new Error("private success route failed; no private values were recorded");
  } finally {
    await browser.close();
  }
  if (git(["rev-parse", "HEAD"]).stdout.trim() !== commit ||
      git(["status", "--porcelain=v1", "--untracked-files=all"]).stdout.trim()) {
    throw new Error("private overlay changed the captured clean public commit");
  }
  const publicBindings = [];
  for (const file of approved) {
    const working = sha256(await readFile(path.join(ctx.root, ...file.split("/"))));
    const blob = git(["show", `${commit}:${file}`]);
    if (blob.status !== 0 || working !== beforeHashes.get(file) || sha256(Buffer.from(blob.stdout, "utf8")) !== working) {
      throw new Error("private overlay public files changed during validation");
    }
    publicBindings.push({ file, reviewedSha256: working });
  }
  return { commit, runId: overlay.runId, result: "pass", publicBindings };
}

export async function runBrowserGate(ctx, rule, options = {}) {
  const topics = await findHtmlTopics(ctx);
  if (!topics.length) {
    console.log(`${rule}: no topics with artifact.html; skipped`);
    return [];
  }
  const browser = await launchChromium();
  const errors = [];
  try {
    for (const topic of topics) {
      topic.browserVersion = browser.version();
      let passed = true;
      let detail = "passed";
      try {
        await CHECKERS[rule](browser, topic, rule);
      } catch (error) {
        passed = false;
        detail = error.message;
        errors.push(issue(rule, topic, detail));
        const shotRoot = path.join(ctx.root, "build", "qa", "failures");
        await mkdir(shotRoot, { recursive: true });
      }
      await updateReceipt(ctx, topic, rule, passed, detail, options.writeEvidence);
    }
  } finally {
    await browser.close();
  }
  return errors;
}
