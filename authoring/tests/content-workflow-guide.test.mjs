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

test("both Archify outputs are pinned, static, hash-bound, and embedded byte-for-byte", async () => {
  const [
    guide,
    simpleSource,
    simpleSvg,
    simpleScript,
    simpleManifestText,
    detailedSource,
    detailedSvg,
    detailedScript,
    detailedManifestText,
    packageLock
  ] = await Promise.all([
    text("index.html"),
    readFile(path.join(directory, "golden-path.archify.json")),
    text("golden-path.svg"),
    readFile(path.join(directory, "reproduce-diagram.mjs")),
    text("diagram-provenance.json"),
    readFile(path.join(directory, "detailed-architecture.archify.json")),
    text("detailed-architecture.svg"),
    readFile(path.join(directory, "reproduce-detailed-diagram.mjs")),
    text("detailed-diagram-provenance.json"),
    readFile(path.join(root, "package-lock.json"), "utf8").then(JSON.parse)
  ]);
  const simpleWorkflow = JSON.parse(simpleSource);
  const detailedWorkflow = JSON.parse(detailedSource);
  const expectedPath = ["input", "design", "build", "verify", "review", "deliver"];
  assert.deepEqual(simpleWorkflow.mainPath, expectedPath);
  assert.deepEqual(detailedWorkflow.mainPath, expectedPath);
  assert.equal(simpleWorkflow.mainPath.length, 6);
  assert.equal(detailedWorkflow.meta.quality_profile, "standard");
  assert.equal(detailedWorkflow.lanes.length, 4);
  assert.deepEqual(
    detailedWorkflow.nodes.filter((node) => !expectedPath.includes(node.id)).map((node) => node.id).sort(),
    ["affected-checks", "clarify", "correct", "handoff-return", "recheck", "reconcile", "refresh-proof", "repair-artifact", "repair-design", "responsible-fix"].sort()
  );
  for (const edge of ["input-unclear", "design-invalid", "verify-failed", "review-findings", "deliver-stale", "deliver-ci", "deliver-handoff"]) {
    assert.ok(detailedWorkflow.edges.some((candidate) => candidate.id === edge), `missing detailed failure edge ${edge}`);
  }

  for (const [source, svg, script, manifestText] of [
    [simpleSource, simpleSvg, simpleScript, simpleManifestText],
    [detailedSource, detailedSvg, detailedScript, detailedManifestText]
  ]) {
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
  }
  const simpleIds = new Set([...simpleSvg.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]));
  const detailedIds = new Set([...detailedSvg.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]));
  assert.deepEqual([...detailedIds].filter((id) => simpleIds.has(id)), [], "inline SVG ids must remain unique");
  assert.ok(guide.includes(`<!-- diagram:start -->\n${simpleSvg.trim()}\n<!-- diagram:end -->`));
  assert.ok(guide.includes(`<!-- detailed-diagram:start -->\n${detailedSvg.trim()}\n<!-- detailed-diagram:end -->`));
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

test("the Artifact-ready source is self-contained and carries a publication-safety inventory", async () => {
  const [guide, safety] = await Promise.all([text("index.html"), text("PUBLICATION-SAFETY.md")]);
  assert.match(safety, /Use \[`index\.html`\]\(index\.html\) as the single-file Claude Artifact source/);
  assert.match(safety, /credentials, tokens, secrets and absolute machine paths/);
  assert.match(safety, /assessment answer keys, rubrics, hidden tests/);
  assert.match(safety, /Preparing it does not publish, upload, deploy/);
  assert.doesNotMatch(guide, /(?:\/Users\/|[A-Za-z]:\\\\Users\\\\)/);
  assert.doesNotMatch(guide, /<(?:script|img|iframe|embed|object|source|track)\b[^>]+\b(?:src|data)\s*=/i);
  assert.doesNotMatch(guide, /<link\b[^>]+rel=["']stylesheet["']/i);
  assert.doesNotMatch(guide, /@import\b|url\(\s*["']?https?:|\bfetch\s*\(|\bXMLHttpRequest\b|\bWebSocket\b|\bEventSource\b|sendBeacon\s*\(/i);
  assert.match(guide, /<!-- diagram:start -->[\s\S]+<!-- diagram:end -->/);
  assert.match(guide, /<!-- detailed-diagram:start -->[\s\S]+<!-- detailed-diagram:end -->/);
});

test("progressive stage inspection preserves a complete no-JavaScript reading", async () => {
  const browser = await launchChromium();
  try {
    const context = await browser.newContext({
      javaScriptEnabled: false,
      colorScheme: "dark",
      viewport: { width: 400, height: 860 }
    });
    await context.setOffline(true);
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
      visibleViews: [...document.querySelectorAll("[data-view-panel]")].filter((element) => getComputedStyle(element).display !== "none").map((element) => element.id),
      noJsNotes: [...document.querySelectorAll(".nojs-note")].map((element) => getComputedStyle(element).display),
      toggle: getComputedStyle(document.querySelector(".theme-toggle")).display,
      pageBackground: getComputedStyle(document.body).backgroundColor,
      laneFill: getComputedStyle(document.querySelector(".diagram-scroll .c-lane")).fill,
      pageWidth: [document.documentElement.clientWidth, document.documentElement.scrollWidth],
      simpleDisclosures: document.querySelectorAll("[data-stage-panel] details").length,
      failureDisclosures: document.querySelectorAll(".failure-list details").length,
      essentialCounts: [...document.querySelectorAll("[data-stage-panel]")].map((panel) => panel.querySelectorAll(".essentials>div").length),
      tabLinks: document.querySelectorAll("[data-view-tab]").length,
      tabRoles: document.querySelectorAll('[role="tablist"],[role="tab"]').length,
      diagrams: document.querySelectorAll(".diagram-scroll svg").length,
      detailedDiagramWidth: [document.querySelector(".detailed-architecture .diagram-scroll").clientWidth, document.querySelector(".detailed-architecture .diagram-scroll").scrollWidth],
      headings: [...document.querySelectorAll("[data-stage-panel] h2")].map((heading) => heading.textContent)
    }));
    const noJsEdgeLabels = await page.locator('#detailed-view svg text[class^="t-edge-"]').evaluateAll((labels) => {
      const rgb = (value) => value.match(/[\d.]+/g).slice(0, 3).map(Number);
      const luminance = (color) => rgb(color).map((value) => {
        value /= 255;
        return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
      }).reduce((sum, value, index) => sum + value * [0.2126, 0.7152, 0.0722][index], 0);
      return labels.map((label) => {
        const foreground = getComputedStyle(label).fill;
        const background = getComputedStyle(label.previousElementSibling).fill;
        const [light, dark] = [luminance(foreground), luminance(background)].sort((a, b) => b - a);
        return { className: label.className.baseVal, foreground, contrast: (light + 0.05) / (dark + 0.05) };
      });
    });
    assert.equal(state.language, "en");
    assert.equal(state.enhanced, false);
    assert.deepEqual(state.allStages, ["stage-input", "stage-design", "stage-build", "stage-verify", "stage-review", "stage-deliver"]);
    assert.deepEqual(state.visibleStages, state.allStages);
    assert.deepEqual(state.headings, ["Input", "Design", "Build", "Verify", "Review + improve", "Deliver"]);
    assert.deepEqual(state.visibleViews, ["simple-view", "detailed-view"]);
    assert.deepEqual(state.noJsNotes, ["block", "block"]);
    assert.equal(state.toggle, "none");
    assert.equal(state.pageBackground, "rgb(18, 24, 22)");
    assert.equal(state.laneFill, "rgb(26, 34, 32)");
    assert.deepEqual(state.pageWidth, [400, 400]);
    assert.equal(state.simpleDisclosures, 13);
    assert.equal(state.failureDisclosures, 6);
    assert.ok(state.essentialCounts.every((count) => count === 3));
    assert.equal(state.tabLinks, 2);
    assert.equal(state.tabRoles, 0);
    assert.equal(state.diagrams, 2);
    assert.ok(state.detailedDiagramWidth[1] > state.detailedDiagramWidth[0]);
    assert.ok(noJsEdgeLabels.every((label) => label.contrast >= 4.5), JSON.stringify(noJsEdgeLabels));
    assert.deepEqual(new Set(noJsEdgeLabels.map((label) => label.foreground)), new Set(["rgb(255, 139, 124)", "rgb(173, 153, 255)"]));
    assert.deepEqual(requests, [url]);
    await context.close();
  } finally {
    await browser.close();
  }
});

test("the tab shell and both architectures work by keyboard, touch, URL history, and reduced motion", async () => {
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
      laneFill: getComputedStyle(document.querySelector("#simple-view .diagram-scroll .c-lane")).fill,
      textFill: getComputedStyle(document.querySelector("#simple-view .diagram-scroll .t-primary")).fill,
      detailedFailureFill: getComputedStyle(document.querySelector("#detailed-view .c-security-group")).fill
    }));
    const edgeLabelState = () => page.evaluate(() => {
      const rgb = (value) => value.match(/[\d.]+/g).slice(0, 3).map(Number);
      const luminance = (color) => rgb(color).map((value) => {
        value /= 255;
        return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
      }).reduce((sum, value, index) => sum + value * [0.2126, 0.7152, 0.0722][index], 0);
      const labels = [...document.querySelectorAll('#detailed-view svg text[class^="t-edge-"]')].map((label) => {
        const foreground = getComputedStyle(label).fill;
        const background = getComputedStyle(label.previousElementSibling).fill;
        const [light, dark] = [luminance(foreground), luminance(background)].sort((a, b) => b - a);
        return { className: label.className.baseVal, foreground, contrast: (light + 0.05) / (dark + 0.05) };
      });
      return {
        labels,
        nodeFill: getComputedStyle(document.querySelector("#detailed-view .t-primary")).fill,
        failureArrow: getComputedStyle(document.querySelector("#detailed-view .a-security")).stroke,
        returnArrow: getComputedStyle(document.querySelector("#detailed-view .a-dashed")).stroke
      };
    });
    assert.deepEqual(await themeState(), {
      theme: "dark",
      pressed: "true",
      toggleVisible: true,
      pageBackground: "rgb(18, 24, 22)",
      laneFill: "rgb(26, 34, 32)",
      textFill: "rgb(227, 235, 231)",
      detailedFailureFill: "rgb(40, 28, 26)"
    });
    assert.deepEqual(await page.evaluate(() => ({
      visibleView: [...document.querySelectorAll("[data-view-panel]")].find((element) => !element.hidden)?.id,
      selectedTab: document.querySelector('[role="tab"][aria-selected="true"]')?.id,
      tabs: document.querySelectorAll('[role="tab"]').length,
      hash: location.hash,
      detailedControls: document.querySelectorAll("#detailed-view svg [data-failure-control][role=button]").length,
      pressedDetailedControls: document.querySelectorAll('#detailed-view svg [data-failure-control][aria-pressed="true"]').length,
      visibleFailureDetails: [...document.querySelectorAll(".failure-list details")].filter((element) => !element.hidden).length
    })), { visibleView: "simple-view", selectedTab: "tab-simple", tabs: 2, hash: "", detailedControls: 6, pressedDetailedControls: 0, visibleFailureDetails: 0 });

    await page.locator("#node-review").tap();
    let state = await page.evaluate(() => ({
      stage: [...document.querySelectorAll("[data-stage-panel]")].filter((element) => !element.hidden).map((element) => element.id),
      selectedNode: document.querySelector("[data-stage-node].is-active")?.id,
      noJsNotes: [...document.querySelectorAll(".nojs-note")].map((element) => getComputedStyle(element).display),
      pageWidth: [document.documentElement.clientWidth, document.documentElement.scrollWidth],
      diagramWidth: [document.querySelector("#simple-view .diagram-scroll").clientWidth, document.querySelector("#simple-view .diagram-scroll").scrollWidth],
      stageNodes: document.querySelectorAll("[data-stage-node]").length,
      gridFill: getComputedStyle(document.querySelector("#simple-view .c-grid")).fill,
      scrollBehavior: getComputedStyle(document.documentElement).scrollBehavior,
      transitionDuration: getComputedStyle(document.querySelector(".theme-toggle")).transitionDuration,
      hash: location.hash
    }));
    assert.deepEqual(state.stage, ["stage-review"]);
    assert.equal(state.selectedNode, "node-review");
    assert.deepEqual(state.noJsNotes, ["none", "none"]);
    assert.deepEqual(state.pageWidth, [400, 400]);
    assert.ok(state.diagramWidth[1] > state.diagramWidth[0]);
    assert.equal(state.stageNodes, 6);
    assert.equal(state.gridFill, "none");
    assert.equal(state.scrollBehavior, "auto");
    assert.equal(state.transitionDuration, "0s");
    assert.equal(state.hash, "#stage-review");

    await page.getByRole("tab", { name: "Detailed" }).tap();
    state = await page.evaluate(() => ({
      visibleView: [...document.querySelectorAll("[data-view-panel]")].find((element) => !element.hidden)?.id,
      selectedTab: document.querySelector('[role="tab"][aria-selected="true"]')?.id,
      hash: location.hash,
      failureDisclosures: document.querySelectorAll(".failure-list details").length,
      visibleFailureDisclosures: [...document.querySelectorAll(".failure-list details")].filter((element) => !element.hidden).length,
      pressedFailureControls: document.querySelectorAll('[data-failure-control][aria-pressed="true"]').length,
      activeLoops: document.querySelectorAll("#detailed-view svg .is-loop-active").length,
      mutedLoops: document.querySelectorAll("#detailed-view svg .is-loop-muted").length,
      happyPathMuted: document.querySelectorAll('#detailed-view svg [data-edge-role="main"].is-loop-muted').length,
      defaultPrompt: getComputedStyle(document.querySelector(".failure-default")).display,
      visibleEdgeLabels: [...document.querySelectorAll('#detailed-view svg text[class^="t-edge-"]')].filter((element) => Number(getComputedStyle(element.parentElement).opacity) > 0).map((element) => element.textContent),
      diagramWidth: [document.querySelector(".detailed-architecture .diagram-scroll").clientWidth, document.querySelector(".detailed-architecture .diagram-scroll").scrollWidth],
      pageWidth: [document.documentElement.clientWidth, document.documentElement.scrollWidth]
    }));
    assert.equal(state.visibleView, "detailed-view");
    assert.equal(state.selectedTab, "tab-detailed");
    assert.equal(state.hash, "#detailed-view");
    assert.equal(state.failureDisclosures, 6);
    assert.equal(state.visibleFailureDisclosures, 0);
    assert.equal(state.pressedFailureControls, 0);
    assert.equal(state.activeLoops, 0);
    assert.ok(state.mutedLoops > 0);
    assert.equal(state.happyPathMuted, 0);
    assert.equal(state.defaultPrompt, "block");
    assert.deepEqual(state.visibleEdgeLabels, []);
    assert.ok(state.diagramWidth[1] > state.diagramWidth[0]);
    assert.deepEqual(state.pageWidth, [400, 400]);
    let edgeLabels = await edgeLabelState();
    assert.ok(edgeLabels.labels.every((label) => label.contrast >= 4.5), JSON.stringify(edgeLabels));
    assert.deepEqual(new Set(edgeLabels.labels.map((label) => label.foreground)), new Set(["rgb(255, 139, 124)", "rgb(173, 153, 255)"]));
    assert.equal(edgeLabels.failureArrow, "rgb(255, 139, 124)");
    assert.equal(edgeLabels.returnArrow, "rgb(173, 153, 255)");
    assert.notEqual(edgeLabels.nodeFill, edgeLabels.failureArrow);

    await page.locator("#detail-node-review").tap();
    state = await page.evaluate(() => ({
      selectedControl: document.querySelector('[data-failure-control][aria-pressed="true"]')?.id,
      visibleDetails: [...document.querySelectorAll(".failure-list details")].filter((element) => !element.hidden).map((element) => element.id),
      openDetails: [...document.querySelectorAll(".failure-list details[open]")].filter((element) => !element.hidden).length,
      activeLoops: document.querySelectorAll("#detailed-view svg .is-loop-active").length,
      mutedLoops: document.querySelectorAll("#detailed-view svg .is-loop-muted").length,
      happyPathMuted: document.querySelectorAll('#detailed-view svg [data-edge-role="main"].is-loop-muted').length,
      defaultPrompt: getComputedStyle(document.querySelector(".failure-default")).display,
      exampleLabels: [...document.querySelectorAll("#failure-review dt")].map((element) => element.textContent),
      exampleText: document.querySelector("#failure-review").textContent,
      loopTransition: getComputedStyle(document.querySelector('#detailed-view svg [data-edge-id="review-findings"].is-loop-active')).transitionDuration
    }));
    assert.equal(state.selectedControl, "detail-node-review");
    assert.deepEqual(state.visibleDetails, ["failure-review"]);
    assert.equal(state.openDetails, 1);
    assert.ok(state.activeLoops > 0);
    assert.ok(state.mutedLoops > state.activeLoops);
    assert.equal(state.happyPathMuted, 0);
    assert.equal(state.defaultPrompt, "none");
    assert.deepEqual(state.exampleLabels, ["Example failure", "Observable evidence", "Return stage", "Proof refreshed", "Resume when"]);
    assert.match(state.exampleText, /5 resolved and 1 open/);
    assert.match(state.exampleText, /second cycle closes all 7 unique findings/);
    assert.equal(state.loopTransition, "0s");

    await page.locator("#detail-node-input").focus();
    await page.keyboard.press("ArrowRight");
    assert.deepEqual(await page.evaluate(() => ({
      focus: document.activeElement?.id,
      selected: document.querySelector('[data-failure-control][aria-pressed="true"]')?.id,
      visibleDetails: [...document.querySelectorAll(".failure-list details")].filter((element) => !element.hidden).map((element) => element.id),
      reviewLoopMuted: document.querySelector('[data-edge-id="review-findings"]').classList.contains("is-loop-muted"),
      designLoopActive: document.querySelector('[data-edge-id="design-invalid"]').classList.contains("is-loop-active")
    })), { focus: "detail-node-design", selected: "detail-node-design", visibleDetails: ["failure-design"], reviewLoopMuted: true, designLoopActive: true });

    for (const [stageId, edgeId] of [
      ["input", "input-unclear"], ["design", "design-invalid"], ["build", "verify-failed"],
      ["verify", "deliver-stale"], ["review", "review-findings"], ["deliver", "deliver-ci"]
    ]) {
      await page.locator(`#detail-node-${stageId}`).click();
      assert.deepEqual(await page.evaluate(({ stageId, edgeId }) => ({
        selected: document.querySelector('[data-failure-control][aria-pressed="true"]')?.getAttribute("data-failure-control"),
        visibleDetails: [...document.querySelectorAll(".failure-list details")].filter((element) => !element.hidden).map((element) => element.dataset.failureDetail),
        activeEdge: document.querySelector(`[data-edge-id="${edgeId}"]`).classList.contains("is-loop-active"),
        inactiveHandoff: document.querySelector('[data-edge-id="deliver-handoff"]').classList.contains("is-loop-muted"),
        visibleExamples: [...document.querySelectorAll(".failure-list details")].filter((element) => getComputedStyle(element).display !== "none").length
      }), { stageId, edgeId }), { selected: stageId, visibleDetails: [stageId], activeEdge: true, inactiveHandoff: true, visibleExamples: 1 });
    }

    await page.goBack();
    await page.waitForFunction(() => location.hash === "#stage-review");
    assert.equal(await page.locator("#tab-simple").getAttribute("aria-selected"), "true");

    await page.locator("#tab-simple").focus();
    await page.keyboard.press("ArrowRight");
    assert.deepEqual(await page.evaluate(() => ({
      visibleView: [...document.querySelectorAll("[data-view-panel]")].find((element) => !element.hidden)?.id,
      focus: document.activeElement?.id,
      hash: location.hash
    })), { visibleView: "detailed-view", focus: "tab-detailed", hash: "#detailed-view" });
    await page.keyboard.press("ArrowLeft");
    assert.equal(await page.evaluate(() => document.activeElement?.id), "tab-simple");

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
      textFill: "rgb(27, 35, 32)",
      detailedFailureFill: "rgb(255, 244, 242)"
    });
    edgeLabels = await edgeLabelState();
    assert.ok(edgeLabels.labels.every((label) => label.contrast >= 4.5), JSON.stringify(edgeLabels));
    assert.deepEqual(new Set(edgeLabels.labels.map((label) => label.foreground)), new Set(["rgb(143, 31, 23)", "rgb(107, 75, 232)"]));
    assert.equal(edgeLabels.failureArrow, "rgb(163, 34, 24)");
    assert.equal(edgeLabels.returnArrow, "rgb(107, 75, 232)");
    assert.notEqual(edgeLabels.nodeFill, edgeLabels.failureArrow);

    await page.emulateMedia({ colorScheme: "light", reducedMotion: "reduce" });
    await page.getByRole("button", { name: "Use dark theme" }).click();
    assert.deepEqual(await themeState(), {
      theme: "dark",
      pressed: "true",
      toggleVisible: true,
      pageBackground: "rgb(18, 24, 22)",
      laneFill: "rgb(26, 34, 32)",
      textFill: "rgb(227, 235, 231)",
      detailedFailureFill: "rgb(40, 28, 26)"
    });
    edgeLabels = await edgeLabelState();
    assert.ok(edgeLabels.labels.every((label) => label.contrast >= 4.5), JSON.stringify(edgeLabels));
    assert.deepEqual(new Set(edgeLabels.labels.map((label) => label.foreground)), new Set(["rgb(255, 139, 124)", "rgb(173, 153, 255)"]));

    await page.locator("#node-deliver").click();
    await page.locator("#stage-deliver details summary").first().click();
    assert.deepEqual(requests, [url]);
    await context.close();
  } finally {
    await browser.close();
  }
});

test("both views have no axe violations and keep overflow inside keyboard-reachable regions", async () => {
  const browser = await launchChromium();
  try {
    for (const [width, colorScheme] of [[320, "dark"], [390, "light"], [1440, "dark"]]) {
      const context = await browser.newContext({ colorScheme, viewport: { width, height: 860 } });
      const page = await context.newPage();
      await page.goto(pathToFileURL(guidePath).href);
      for (const view of ["simple", "detailed"]) {
        if (view === "detailed") {
          await page.getByRole("tab", { name: "Detailed" }).click();
          await page.getByRole("button", { name: "Explore Review + improve failure path" }).click();
        }
        const { violations } = await new AxeBuilder({ page }).analyze();
        assert.deepEqual(violations.map((violation) => `${violation.id}: ${violation.nodes.map((node) => node.target).join(", ")}`), [], `${width}px ${colorScheme} ${view}`);
        const layout = await page.evaluate(() => ({
          pageWidth: [document.documentElement.clientWidth, document.documentElement.scrollWidth],
          unreachable: [...document.querySelectorAll("body *")]
            .filter((element) => {
              const overflow = getComputedStyle(element).overflowX;
              return (overflow === "auto" || overflow === "scroll") && element.scrollWidth > element.clientWidth && element.tabIndex < 0;
            })
            .map((element) => element.className || element.tagName)
        }));
        assert.deepEqual(layout.pageWidth, [width, width], `${width}px ${view} page overflow`);
        assert.deepEqual(layout.unreachable, [], `${width}px ${view} scrollable regions without keyboard focus`);
      }
      await context.close();
    }
  } finally {
    await browser.close();
  }
});
