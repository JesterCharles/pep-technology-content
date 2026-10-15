import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import AxeBuilder from "@axe-core/playwright";
import { chromium } from "playwright";
import { evidencePath, findCourses, loadCourse, readJson } from "../lib/common.mjs";

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
  try {
    return await readJson(topic.spec);
  } catch (error) {
    throw new Error(`${topic.displaySpec} is required and must be valid JSON: ${error.message}`);
  }
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

async function checkOffline(browser, topic) {
  await withPage(browser, topic, {}, async () => {});
  await withPage(browser, topic, { javaScriptEnabled: false, label: "no-js" }, async (page) => {
    if (!(await page.locator("body").innerText()).trim()) throw new Error("no-JavaScript reading is empty");
    const disclosures = page.locator("details[data-pep-optional]");
    for (let index = 0; index < await disclosures.count(); index++) {
      const disclosure = disclosures.nth(index);
      const summary = disclosure.locator(":scope > summary");
      if (!(await summary.innerText()).trim()) throw new Error("optional disclosure has no no-JavaScript summary");
      await summary.click();
      if ((await disclosure.getAttribute("open")) === null) throw new Error("optional disclosure did not open without JavaScript");
      if (!(await disclosure.innerText()).trim()) throw new Error("optional disclosure has no no-JavaScript content");
    }
    const codeWorkspaces = page.locator('[data-pep-workspace="code"]');
    for (let index = 0; index < await codeWorkspaces.count(); index++) {
      const reading = codeWorkspaces.nth(index).locator("noscript[data-pep-no-js]");
      if ((await reading.count()) !== 1 || !(await reading.innerText()).trim()) {
        throw new Error("code workspace requires a complete noscript[data-pep-no-js] reading");
      }
    }
  });
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
  await withPage(browser, topic, { label: "optional-accounting" }, async (page) => {
    const disclosures = page.locator("details[data-pep-optional]");
    if ((await disclosures.count()) === 0) return;
    const snapshot = async () => ({
      completion: spec.completion.attribute
        ? await page.locator(spec.completion.selector).getAttribute(spec.completion.attribute)
        : await page.locator(spec.completion.selector).innerText(),
      progress: spec.progress.attribute
        ? await page.locator(spec.progress.selector).getAttribute(spec.progress.attribute)
        : await page.locator(spec.progress.selector).innerText(),
    });
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
