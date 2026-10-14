import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { access, readFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import path from "node:path";
import test from "node:test";
import { fileURLToPath, pathToFileURL } from "node:url";
import { launchChromium } from "../tools/qa/harness.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const directory = path.join(root, "authoring/docs/content-workflow");
const guidePath = path.join(directory, "index.html");
const sha256 = (value) => createHash("sha256").update(value).digest("hex");

async function text(name) {
  return readFile(path.join(directory, name), "utf8");
}
function run(script, args = []) {
  return spawnSync(process.execPath, [path.join(directory, script), ...args], {
    cwd: root,
    encoding: "utf8"
  });
}

test("content workflow metrics remain derived from tracked repository evidence", async () => {
  const result = run("generate-metrics.mjs");
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
  const metrics = JSON.parse(await text("metrics.json"));
  assert.equal(metrics.label, "Tracked repository snapshot, not production or learner telemetry");
  assert.deepEqual(
    [metrics.repository.courses, metrics.repository.modules, metrics.repository.catalogTopics],
    [9, 36, 249]
  );
  assert.equal(metrics.repository.contractGates, 18);
  assert.equal(metrics.example.moduleReview.uniqueFindings, 7);
  assert.equal(metrics.example.moduleReview.secondRecheckUnique.open, 0);
  assert.ok(metrics.unavailable.includes("platform upload or acceptance outcome"));
});

test("Archify output is pinned, static, hash-bound, and embedded byte-for-byte", async () => {
  const [guide, source, svg, script, manifestText, packageLock] = await Promise.all([
    text("index.html"),
    readFile(path.join(directory, "golden-path.archify.json")),
    text("golden-path.svg"),
    readFile(path.join(directory, "reproduce-diagram.mjs")),
    text("diagram-provenance.json"),
    readFile(path.join(root, "package-lock.json"), "utf8")
  ]);
  const manifest = JSON.parse(manifestText);
  assert.equal(manifest.producer.tag, "v3.0.1");
  assert.equal(manifest.producer.commit, "2ab3cae7ac2c2a55d7386ca789d03c4fcd31816c");
  assert.equal(manifest.producer.license, "MIT");
  assert.equal(manifest.producer.cliPath, "archify/bin/archify.mjs");
  assert.equal(manifest.input.sha256, sha256(source));
  assert.equal(manifest.postprocess.scriptSha256, sha256(script));
  assert.equal(manifest.postprocess.finalSvgSha256, sha256(svg));
  assert.match(svg, new RegExp(`data-archify-input-sha256="${sha256(source)}"`));
  assert.doesNotMatch(svg, /\s(?:src|href)="https?:/i);
  assert.doesNotMatch(svg, /url\(\s*["']?https?:/i);
  assert.doesNotMatch(svg, /role="button"|tabindex="0"/);
  assert.ok(guide.includes(`<!-- diagram:start -->\n${svg.trim()}\n<!-- diagram:end -->`));
  assert.doesNotMatch(packageLock, /node_modules\/archify"/);
  const binding = run("bind-diagram.mjs", ["--check"]);
  assert.equal(binding.status, 0, `${binding.stdout}\n${binding.stderr}`);
});

test("guide has no runtime network or sibling asset dependency", async () => {
  const guide = await text("index.html");
  assert.doesNotMatch(guide, /<(?:script|img|iframe|source)\b[^>]*\bsrc\s*=\s*["'][^"']+/i);
  assert.doesNotMatch(guide, /<link\b[^>]*\bhref\s*=\s*["'][^"']+/i);
  assert.doesNotMatch(guide, /\b(?:fetch|XMLHttpRequest|WebSocket|EventSource|sendBeacon)\s*\(/);
  assert.doesNotMatch(guide, /@import\b|url\(\s*["']?https?:/i);
  assert.match(guide, /<style>[\s\S]+<\/style>/);
  assert.match(guide, /<script>[\s\S]+<\/script>/);
  assert.match(guide, /<svg[\s\S]+<\/svg>/);
});

test("every local guide link resolves from the documentation directory", async () => {
  const guide = await text("index.html");
  const hrefs = [...guide.matchAll(/\bhref="([^"]+)"/g)].map((match) => match[1]);
  assert.ok(hrefs.length > 20);
  for (const href of hrefs) {
    if (href.startsWith("#") || /^[a-z][a-z0-9+.-]*:/i.test(href)) continue;
    const relative = decodeURIComponent(href.split("#")[0]);
    await assert.doesNotReject(access(path.resolve(directory, relative)), `missing local link ${href}`);
  }
});

test("progressive stage inspection preserves a complete no-JavaScript reading", async () => {
  const browser = await launchChromium();
  try {
    const context = await browser.newContext({
      javaScriptEnabled: false,
      viewport: { width: 400, height: 860 }
    });
    const page = await context.newPage();
    const requests = [];
    page.on("request", (request) => requests.push(request.url()));
    const url = pathToFileURL(guidePath).href;
    await page.goto(url);
    const state = await page.evaluate(() => ({
      language: document.documentElement.lang,
      enhanced: document.documentElement.classList.contains("enhanced"),
      stageTargets: [...document.querySelectorAll("[data-stage-target]")].map((element) => element.getAttribute("data-stage-target")),
      visibleStages: [...document.querySelectorAll("[data-stage-panel]")].filter((element) => getComputedStyle(element).display !== "none").map((element) => element.id),
      visibleMetrics: [...document.querySelectorAll("[data-metrics-panel]")].filter((element) => getComputedStyle(element).display !== "none").length,
      noJsNote: getComputedStyle(document.querySelector(".nojs-note")).display,
      pageWidth: [document.documentElement.clientWidth, document.documentElement.scrollWidth],
      instructionAnchors: document.querySelectorAll("[data-stage-panel] details").length,
      stageFieldCounts: [...document.querySelectorAll("[data-stage-panel]")].map((panel) => panel.querySelectorAll(".field").length),
      hasTextEquivalent: Boolean(document.querySelector(".flow-text"))
    }));
    assert.equal(state.language, "en");
    assert.equal(state.enhanced, false);
    assert.equal(state.stageTargets.length, 10);
    assert.deepEqual(state.visibleStages, state.stageTargets);
    assert.equal(state.visibleMetrics, 2);
    assert.equal(state.noJsNote, "block");
    assert.deepEqual(state.pageWidth, [400, 400]);
    assert.equal(state.instructionAnchors, 10);
    assert.ok(state.stageFieldCounts.every((count) => count >= 6));
    assert.equal(state.hasTextEquivalent, true);
    assert.deepEqual(requests, [url]);
    await context.close();
  } finally {
    await browser.close();
  }
});

test("interactive controls work by keyboard and touch across theme and motion preferences", async () => {
  const browser = await launchChromium();
  try {
    const context = await browser.newContext({
      colorScheme: "dark",
      hasTouch: true,
      isMobile: true,
      viewport: { width: 400, height: 860 }
    });
    const page = await context.newPage();
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(pathToFileURL(guidePath).href);

    await page.locator('[data-stage-target="stage-reconcile"]').tap();
    await page.getByRole("tab", { name: "Worked module" }).tap();
    let state = await page.evaluate(() => ({
      stage: [...document.querySelectorAll("[data-stage-panel]")].filter((element) => !element.hidden).map((element) => element.id),
      metrics: [...document.querySelectorAll("[data-metrics-panel]")].filter((element) => !element.hidden).map((element) => element.id),
      theme: document.documentElement.dataset.theme,
      noJsNote: getComputedStyle(document.querySelector(".nojs-note")).display,
      pageWidth: [document.documentElement.clientWidth, document.documentElement.scrollWidth],
      diagramWidth: [document.querySelector(".diagram-scroll").clientWidth, document.querySelector(".diagram-scroll").scrollWidth],
      minimumTarget: Math.min(...[...document.querySelectorAll("button,.stage-index a,.quick-nav a")].map((element) => element.getBoundingClientRect().height)),
      gridFill: getComputedStyle(document.querySelector(".c-grid")).fill,
      scrollBehavior: getComputedStyle(document.documentElement).scrollBehavior,
      transitionDuration: getComputedStyle(document.querySelector(".theme-toggle")).transitionDuration
    }));
    assert.deepEqual(state.stage, ["stage-reconcile"]);
    assert.deepEqual(state.metrics, ["metrics-example"]);
    assert.equal(state.theme, "dark");
    assert.equal(state.noJsNote, "none");
    assert.deepEqual(state.pageWidth, [400, 400]);
    assert.ok(state.diagramWidth[1] > state.diagramWidth[0]);
    assert.ok(state.minimumTarget >= 44);
    assert.equal(state.gridFill, "none");
    assert.equal(state.scrollBehavior, "auto");
    assert.equal(state.transitionDuration, "0s");

    await page.locator('[data-stage-target="stage-intake"]').focus();
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("Enter");
    state = await page.evaluate(() => ({
      activePanel: [...document.querySelectorAll("[data-stage-panel]")].find((element) => !element.hidden)?.id,
      focus: document.activeElement?.id
    }));
    assert.equal(state.activePanel, "stage-design");
    assert.equal(state.focus, "stage-design");

    await page.getByRole("button", { name: "Use light theme" }).click();
    state = await page.evaluate(() => ({
      theme: document.documentElement.dataset.theme,
      pressed: document.querySelector("#theme-toggle").getAttribute("aria-pressed")
    }));
    assert.equal(state.theme, "light");
    assert.equal(state.pressed, "false");
    await context.close();
  } finally {
    await browser.close();
  }
});
