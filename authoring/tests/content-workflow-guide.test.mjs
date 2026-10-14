import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { access, mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import { spawnSync } from "node:child_process";
import path from "node:path";
import test from "node:test";
import { fileURLToPath, pathToFileURL } from "node:url";
import AxeBuilder from "@axe-core/playwright";
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

function shape(value) {
  if (Array.isArray(value)) return "array";
  if (value && typeof value === "object") return Object.fromEntries(Object.entries(value).map(([key, child]) => [key, shape(child)]));
  return typeof value;
}
function count(value) {
  return Number.isInteger(value) && value >= 0;
}
async function writeJson(base, relative, value) {
  await mkdir(path.dirname(path.join(base, relative)), { recursive: true });
  await writeFile(path.join(base, relative), JSON.stringify(value));
}
async function touch(base, relative, value = "x") {
  await mkdir(path.dirname(path.join(base, relative)), { recursive: true });
  await writeFile(path.join(base, relative), value);
}

test("tracked metrics snapshot is dated and internally consistent", async () => {
  const metrics = JSON.parse(await text("metrics.json"));
  assert.equal(metrics.label, "Tracked repository snapshot, not production or learner telemetry");
  assert.match(metrics.capturedOn, /^\d{4}-\d{2}-\d{2}$/);
  assert.ok(!Number.isNaN(Date.parse(`${metrics.capturedOn}T00:00:00Z`)));
  const { repository, example } = metrics;
  for (const value of [...Object.values(repository).filter((entry) => typeof entry === "number"), ...Object.values(repository.learnerArtifacts)]) {
    assert.ok(count(value));
  }
  assert.equal(repository.learnerArtifacts.html, repository.topicsWithHtml);
  assert.ok(repository.topicsWithHtml <= repository.catalogTopics);
  assert.ok(repository.modulesWithAllHtml <= repository.modules);
  for (const value of Object.values(repository.learnerArtifacts)) assert.ok(value <= repository.catalogTopics);
  for (const value of Object.values(example.learnerArtifacts)) assert.ok(value <= example.topics);
  const review = example.moduleReview;
  assert.equal(Object.values(review.severity).reduce((sum, value) => sum + value, 0), review.uniqueFindings);
  assert.ok(review.acceptedFindings <= review.uniqueFindings);
  assert.equal(review.secondRecheckUnique.resolved + review.secondRecheckUnique.open, review.uniqueFindings);
  assert.ok(metrics.unavailable.includes("platform upload or acceptance outcome"));
  assert.ok(metrics.unavailable.includes("learner usage, completion, or performance telemetry"));
  const [guide, readme] = await Promise.all([text("index.html"), text("README.md")]);
  for (const value of [metrics.capturedOn, repository.courses, repository.modules, repository.catalogTopics, repository.contractGates, repository.implementedCheckModules]) {
    assert.ok(guide.includes(String(value)), `interactive guide must render snapshot value ${value}`);
    assert.ok(readme.includes(String(value)), `written guide must render snapshot value ${value}`);
  }
});

test("metrics generator previews the live tree without touching the tracked snapshot", async () => {
  const before = await text("metrics.json");
  const result = run("generate-metrics.mjs", ["--captured-on", "2000-01-02"]);
  assert.equal(result.status, 0, result.stderr);
  const live = JSON.parse(result.stdout);
  assert.equal(live.capturedOn, "2000-01-02");
  assert.deepEqual(shape(live), shape(JSON.parse(before)));
  assert.equal(await text("metrics.json"), before);
  for (const args of [["--captured-on", "yesterday"], ["--root"], ["--write", "--root", root]]) {
    const rejected = run("generate-metrics.mjs", args);
    assert.notEqual(rejected.status, 0, args.join(" "));
  }
  assert.equal(await text("metrics.json"), before);
});

test("metrics generator derives counts from catalog, files, gates and review evidence", async () => {
  const fixture = await mkdtemp(path.join(os.tmpdir(), "pep-metrics-"));
  try {
    const course = "git-linux-ai-foundations";
    const module = "linux-foundations";
    const evidence = `authoring/evidence/${course}/${module}`;
    await writeJson(fixture, `authoring/catalog/${course}/course.json`, { moduleOrder: [module, "empty"] });
    await writeJson(fixture, `authoring/catalog/${course}/${module}/module.json`, { topicOrder: ["one", "two"] });
    await writeJson(fixture, `authoring/catalog/${course}/empty/module.json`, { topicOrder: ["three"] });
    await writeJson(fixture, `authoring/catalog/${course}/${module}/module.lock.json`, { files: [{}, {}, {}] });
    for (const topic of ["one", "two"]) {
      await touch(fixture, `${course}/${module}/${topic}/artifact.html`);
      await touch(fixture, `${course}/${module}/${topic}/artifact.md`);
      await writeJson(fixture, `${evidence}/${topic}/sources.json`, {});
    }
    await touch(fixture, `${course}/${module}/one/artifact.gift`);
    await writeJson(fixture, `${evidence}/one/video.json`, {});
    await writeJson(fixture, `${course}/${module}/coding-lab/lab.json`, {});
    await writeJson(fixture, `${course}/assessments/final/blueprint.json`, {});
    await touch(fixture, "authoring/tools/checks/T01-schema.mjs");
    await touch(fixture, "authoring/tools/checks/T02-files.mjs");
    await touch(fixture, "authoring/tools/checks/helpers.mjs");
    await touch(fixture, "authoring/docs/workflow.md", "### 2.5 Machine gates\n1. one\n2. two\n3. three\n### 2.6 Evidence\n1. not a gate\n");
    await writeJson(fixture, `${evidence}/module-critic-education.json`, { findings: [{ id: "E1", severity: "high" }] });
    await writeJson(fixture, `${evidence}/module-critic-sme.json`, { findings: [{ id: "S1", severity: "low" }] });
    await writeJson(fixture, `${evidence}/module-critic-education-recheck.json`, {
      findings: [{ id: "E2", severity: "medium" }],
      recheck: { items: [{ findingId: "E1", status: "open" }] }
    });
    await writeJson(fixture, `${evidence}/module-critic-sme-recheck.json`, { findings: [], recheck: { items: [{ findingId: "S1", status: "resolved" }] } });
    await writeJson(fixture, `${evidence}/module-2-critic-education-recheck.json`, {
      recheck: { items: [{ findingId: "E1", status: "resolved" }, { findingId: "E2", status: "open" }] }
    });
    await writeJson(fixture, `${evidence}/module-2-critic-sme-recheck.json`, { recheck: { items: [{ findingId: "E1", status: "resolved" }] } });
    await writeJson(fixture, `${evidence}/module-reconciliation.json`, {
      decisions: [{ findingId: "E1", decision: "accept" }, { findingId: "S1", decision: "reject-with-evidence" }]
    });
    await writeJson(fixture, `${evidence}/module-recheck-reconciliation.json`, { decisions: [{ findingId: "E2", decision: "accept" }] });

    const result = run("generate-metrics.mjs", ["--root", fixture, "--captured-on", "2026-01-31"]);
    assert.equal(result.status, 0, result.stderr);
    const metrics = JSON.parse(result.stdout);
    assert.equal(metrics.capturedOn, "2026-01-31");
    assert.deepEqual(metrics.repository, {
      courses: 1,
      modules: 2,
      catalogTopics: 3,
      topicsWithHtml: 2,
      modulesWithAllHtml: 1,
      learnerArtifacts: { html: 2, markdown: 2, pdf: 0, gift: 1, video: 0 },
      labs: 1,
      assessmentBlueprints: 1,
      contractGates: 3,
      implementedCheckModules: 2
    });
    assert.equal(metrics.example.topics, 2);
    assert.deepEqual([metrics.example.sourceReceipts, metrics.example.videoReceipts, metrics.example.lockFileRecords], [2, 1, 3]);
    assert.deepEqual(metrics.example.moduleReview.severity, { critical: 0, high: 1, medium: 1, low: 1 });
    assert.equal(metrics.example.moduleReview.uniqueFindings, 3);
    assert.equal(metrics.example.moduleReview.acceptedFindings, 2);
    assert.deepEqual(metrics.example.moduleReview.firstRecheck, { resolved: 1, open: 1 });
    assert.deepEqual(metrics.example.moduleReview.secondRecheckUnique, { resolved: 1, open: 1 });
  } finally {
    await rm(fixture, { recursive: true, force: true });
  }
});

test("Archify output is pinned, static, hash-bound, and embedded byte-for-byte", async () => {
  const [guide, source, svg, script, manifestText, packageLock] = await Promise.all([
    text("index.html"),
    readFile(path.join(directory, "golden-path.archify.json")),
    text("golden-path.svg"),
    readFile(path.join(directory, "reproduce-diagram.mjs")),
    text("diagram-provenance.json"),
    readFile(path.join(root, "package-lock.json"), "utf8").then(JSON.parse)
  ]);
  const manifest = JSON.parse(manifestText);
  const workflow = JSON.parse(source);
  assert.deepEqual(workflow.mainPath, ["input", "design", "build", "verify", "review", "deliver"]);
  assert.equal(workflow.mainPath.length, 6);
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
  assert.ok(!Object.hasOwn(packageLock.packages, "node_modules/archify"));
  assert.ok(!Object.hasOwn(packageLock.packages[""].dependencies ?? {}, "archify"));
  assert.ok(!Object.hasOwn(packageLock.packages[""].devDependencies ?? {}, "archify"));
  const binding = run("bind-diagram.mjs", ["--check"]);
  assert.equal(binding.status, 0, `${binding.stdout}\n${binding.stderr}`);
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
      colorScheme: "dark",
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
      allStages: [...document.querySelectorAll("[data-stage-panel]")].map((element) => element.id),
      visibleStages: [...document.querySelectorAll("[data-stage-panel]")].filter((element) => getComputedStyle(element).display !== "none").map((element) => element.id),
      noJsNote: getComputedStyle(document.querySelector(".nojs-note")).display,
      toggle: getComputedStyle(document.querySelector(".theme-toggle")).display,
      pageBackground: getComputedStyle(document.body).backgroundColor,
      laneFill: getComputedStyle(document.querySelector(".diagram-scroll .c-lane")).fill,
      pageWidth: [document.documentElement.clientWidth, document.documentElement.scrollWidth],
      disclosures: document.querySelectorAll("[data-stage-panel] details").length,
      essentialCounts: [...document.querySelectorAll("[data-stage-panel]")].map((panel) => panel.querySelectorAll(".essentials>div").length),
      tabs: document.querySelectorAll('[role="tablist"],.metrics-panel,.states').length,
      headings: [...document.querySelectorAll("[data-stage-panel] h2")].map((heading) => heading.textContent)
    }));
    assert.equal(state.language, "en");
    assert.equal(state.enhanced, false);
    assert.deepEqual(state.allStages, ["stage-input", "stage-design", "stage-build", "stage-verify", "stage-review", "stage-deliver"]);
    assert.deepEqual(state.visibleStages, state.allStages);
    assert.deepEqual(state.headings, ["Input", "Design", "Build", "Verify", "Review + improve", "Deliver"]);
    assert.equal(state.noJsNote, "block");
    assert.equal(state.toggle, "none");
    assert.equal(state.pageBackground, "rgb(18, 24, 22)");
    assert.equal(state.laneFill, "rgb(26, 34, 32)");
    assert.deepEqual(state.pageWidth, [400, 400]);
    assert.equal(state.disclosures, 13);
    assert.ok(state.essentialCounts.every((count) => count === 3));
    assert.equal(state.tabs, 0);
    assert.deepEqual(requests, [url]);
    await context.close();
  } finally {
    await browser.close();
  }
});

test("the architecture controls one integrated stage detail by keyboard and touch", async () => {
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
    const requests = [];
    page.on("request", (request) => requests.push(request.url()));
    const url = pathToFileURL(guidePath).href;
    await page.goto(url);
    const themeState = () => page.evaluate(() => ({
      theme: document.documentElement.dataset.theme,
      pressed: document.querySelector("#theme-toggle").getAttribute("aria-pressed"),
      toggleVisible: getComputedStyle(document.querySelector(".theme-toggle")).display !== "none",
      pageBackground: getComputedStyle(document.body).backgroundColor,
      laneFill: getComputedStyle(document.querySelector(".diagram-scroll .c-lane")).fill,
      textFill: getComputedStyle(document.querySelector(".diagram-scroll .t-primary")).fill
    }));
    assert.deepEqual(await themeState(), {
      theme: "dark",
      pressed: "true",
      toggleVisible: true,
      pageBackground: "rgb(18, 24, 22)",
      laneFill: "rgb(26, 34, 32)",
      textFill: "rgb(227, 235, 231)"
    });

    await page.locator("#node-review").tap();
    let state = await page.evaluate(() => ({
      stage: [...document.querySelectorAll("[data-stage-panel]")].filter((element) => !element.hidden).map((element) => element.id),
      selectedNode: document.querySelector("[data-stage-node].is-active")?.id,
      theme: document.documentElement.dataset.theme,
      noJsNote: getComputedStyle(document.querySelector(".nojs-note")).display,
      pageWidth: [document.documentElement.clientWidth, document.documentElement.scrollWidth],
      diagramWidth: [document.querySelector(".diagram-scroll").clientWidth, document.querySelector(".diagram-scroll").scrollWidth],
      stageNodes: document.querySelectorAll("[data-stage-node]").length,
      gridFill: getComputedStyle(document.querySelector(".c-grid")).fill,
      scrollBehavior: getComputedStyle(document.documentElement).scrollBehavior,
      transitionDuration: getComputedStyle(document.querySelector(".theme-toggle")).transitionDuration
    }));
    assert.deepEqual(state.stage, ["stage-review"]);
    assert.equal(state.selectedNode, "node-review");
    assert.equal(state.theme, "dark");
    assert.equal(state.noJsNote, "none");
    assert.deepEqual(state.pageWidth, [400, 400]);
    assert.ok(state.diagramWidth[1] > state.diagramWidth[0]);
    assert.equal(state.stageNodes, 6);
    assert.equal(state.gridFill, "none");
    assert.equal(state.scrollBehavior, "auto");
    assert.equal(state.transitionDuration, "0s");

    await page.locator("#node-input").focus();
    await page.keyboard.press("ArrowRight");
    state = await page.evaluate(() => ({
      activePanel: [...document.querySelectorAll("[data-stage-panel]")].find((element) => !element.hidden)?.id,
      focus: document.activeElement?.id,
      selectedNode: document.querySelector("[data-stage-node].is-active")?.id
    }));
    assert.deepEqual(state, { activePanel: "stage-design", focus: "node-design", selectedNode: "node-design" });

    await page.getByRole("button", { name: "Use light theme" }).click();
    assert.deepEqual(await themeState(), {
      theme: "light",
      pressed: "false",
      toggleVisible: true,
      pageBackground: "rgb(238, 242, 240)",
      laneFill: "rgb(248, 250, 249)",
      textFill: "rgb(27, 35, 32)"
    });

    await page.emulateMedia({ colorScheme: "light", reducedMotion: "reduce" });
    await page.getByRole("button", { name: "Use dark theme" }).click();
    assert.deepEqual(await themeState(), {
      theme: "dark",
      pressed: "true",
      toggleVisible: true,
      pageBackground: "rgb(18, 24, 22)",
      laneFill: "rgb(26, 34, 32)",
      textFill: "rgb(227, 235, 231)"
    });

    await page.locator("#node-deliver").click();
    await page.locator("#stage-deliver details summary").first().click();
    assert.deepEqual(requests, [url]);
    await context.close();
  } finally {
    await browser.close();
  }
});

test("guide has no axe violations and keeps scrollable regions keyboard reachable at every width", async () => {
  const browser = await launchChromium();
  try {
    for (const [width, colorScheme] of [[320, "dark"], [390, "light"], [1440, "dark"]]) {
      const context = await browser.newContext({ colorScheme, viewport: { width, height: 860 } });
      const page = await context.newPage();
      await page.goto(pathToFileURL(guidePath).href);
      const { violations } = await new AxeBuilder({ page }).analyze();
      assert.deepEqual(violations.map((violation) => `${violation.id}: ${violation.nodes.map((node) => node.target).join(", ")}`), [], `${width}px ${colorScheme}`);
      const unreachable = await page.evaluate(() => [...document.querySelectorAll("body *")]
        .filter((element) => {
          const overflow = getComputedStyle(element).overflowX;
          return (overflow === "auto" || overflow === "scroll") && element.scrollWidth > element.clientWidth && element.tabIndex < 0;
        })
        .map((element) => element.className || element.tagName));
      assert.deepEqual(unreachable, [], `${width}px scrollable regions without keyboard focus`);
      await context.close();
    }
  } finally {
    await browser.close();
  }
});
