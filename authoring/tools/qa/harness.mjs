import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
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
    const controls = [...root.querySelectorAll("input, textarea, select")].map((control) => ({
      id: control.id,
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

async function withPage(browser, topic, options, callback) {
  const context = await browser.newContext({
    viewport: options.viewport ?? { width: 1366, height: 768 },
    colorScheme: options.theme ?? "light",
    reducedMotion: options.reducedMotion ? "reduce" : "no-preference",
    hasTouch: options.touch ?? false,
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

async function sandboxFrame(page, topic) {
  await page.setContent(
    '<!doctype html><meta charset="utf-8"><iframe id="lesson" sandbox="allow-scripts"></iframe>',
  );
  const html = await readFile(topic.html, "utf8");
  await page.locator("#lesson").evaluate((iframe, source) => {
    iframe.srcdoc = source;
  }, html);
  await page.waitForFunction(() => {
    const iframe = document.querySelector("#lesson");
    return iframe?.contentWindow;
  });
  const frame = page.frames()[1];
  if (!frame) throw new Error("sandbox iframe did not load");
  return frame;
}

async function checkPrint(browser, topic) {
  await withPage(browser, topic, { label: "print" }, async (page) => {
    if (!(await page.locator("[data-pep-guidance-contract]").count())) return;
    const details = page.locator("details[data-pep-objectives], details[data-pep-hint], details[data-pep-optional]");
    if (await details.count()) await details.first().locator(":scope > summary").click();
    const before = await details.evaluateAll((items) => items.map((item) => item.open));
    await page.evaluate(() => dispatchEvent(new Event("beforeprint")));
    await page.emulateMedia({ media: "print" });
    for (const selector of ["[data-pep-activity]", "[data-pep-teaching]", "[data-pep-activity-checks]", "details[data-pep-objectives]", "details[data-pep-hint]", "details[data-pep-optional]"]) {
      const items = page.locator(selector);
      for (let index = 0; index < await items.count(); index++) {
        if (!(await items.nth(index).isVisible())) throw new Error(`print hides required ${selector} content`);
      }
    }
    const navigation = page.locator('[aria-label="Activities"], [aria-label="Activity navigation"]');
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
      await page.locator("[data-pep-wrong-attempt]").click();
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
      if ((await page.locator("[aria-live]").count()) === 0) throw new Error("aria-live region is required");
    });
  }
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
  const privateName = /(^|[-_.\/])(?:answer[-_ ]?key|rubric|(?:reference|instructor|private)[-_ ]?solution|hidden[-_ ]?tests?)([-_.\/]|$)/iu;
  for (const receiptFile of (await walk(evidenceRoot)).files.filter((file) => path.basename(file) === "qa-receipt.json")) {
    const receipt = await readJson(receiptFile).catch(() => null);
    const proof = receipt?.privateSuccessProof;
    if (!proof) continue;
    const display = relative(repoRoot, receiptFile);
    if (proof.record !== `validated at ${proof.commit} by run ${proof.runId}`) out.push(error("T06", display, "private success record must match commit and runId"));
    const commit = spawnSync("git", ["cat-file", "-e", `${proof.commit}^{commit}`], { cwd: repoRoot, encoding: "utf8" });
    if (commit.status !== 0) out.push(error("T06", display, "private success proof commit does not exist in this repository"));
    const evidenceRelative = relative(repoRoot, receiptFile).split("/");
    const evidenceIndex = evidenceRelative.indexOf("evidence");
    const owner = evidenceIndex >= 0 ? evidenceRelative.slice(evidenceIndex + 1, -1) : [];
    const required = new Set([
      `${owner.join("/")}/artifact.html`,
      `authoring/evidence/${owner.join("/")}/qa-paths.json`,
      "authoring/tools/qa/harness.mjs",
      "authoring/tools/qa/python-answer-scan.py",
      "authoring/tools/checks/T08-html-static.mjs",
    ]);
    const seen = new Set();
    for (const binding of proof.publicBindings ?? []) {
      if (seen.has(binding.file)) out.push(error("T06", display, `duplicate private-success public binding: ${binding.file}`));
      seen.add(binding.file);
      if (privateName.test(binding.file)) out.push(error("T06", display, `private material cannot be bound: ${binding.file}`));
      const file = path.join(repoRoot, ...binding.file.split("/"));
      try {
        const actual = sha256(await readFile(file));
        if (actual !== binding.reviewedSha256) out.push(error("T06", display, `stale private-success public binding: ${binding.file}`));
      } catch (cause) {
        if (cause.code === "ENOENT") out.push(error("T06", display, `private-success public binding is missing: ${binding.file}`));
        else throw cause;
      }
    }
    for (const file of required) if (!seen.has(file)) out.push(error("T06", display, `missing private-success public binding: ${file}`));
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
  const commit = spawnSync("git", ["rev-parse", "HEAD"], { cwd: ctx.root, encoding: "utf8" }).stdout.trim();
  return { commit, runId: overlay.runId, result: "pass" };
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
