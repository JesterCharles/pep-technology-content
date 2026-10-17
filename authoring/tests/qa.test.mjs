import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";
import test from "node:test";
import Ajv2020 from "ajv/dist/2020.js";
import MarkdownIt from "markdown-it";
import { run as runT01 } from "../tools/checks/T01-schema.mjs";
import { validateLearnerGuidance, validateOptionalDisclosures } from "../tools/checks/T08-html-static.mjs";
import { run as runT09 } from "../tools/checks/T09-offline.mjs";
import { run as runT10 } from "../tools/checks/T10-sandbox.mjs";
import { run as runT11 } from "../tools/checks/T11-behavior.mjs";
import { run as runT12 } from "../tools/checks/T12-accessibility.mjs";
import { run as runT13 } from "../tools/checks/T13-responsive.mjs";
import { run as runT18 } from "../tools/checks/T18-markdown-pdf.mjs";
import { markdownFromHtml } from "../tools/qa/md-from-html.mjs";
import { pdfFromMarkdown } from "../tools/qa/pdf-from-md.mjs";
import { launchChromium, runPrivateOverlay, validateQaPrivateProofs, VIEWPORTS } from "../tools/qa/harness.mjs";

const fixtures = path.resolve("authoring/tests/fixtures/qa");
const runners = { T09: runT09, T10: runT10, T11: runT11, T12: runT12, T13: runT13, T18: runT18 };
const expectedHtml = "course/module/topic/artifact.html";

async function makeRepository(pageName, options = {}) {
  const root = await mkdtemp(path.join(os.tmpdir(), "pep-qa-"));
  const topicRoot = path.join(root, "course", "module", "topic");
  const evidenceRoot = path.join(root, "authoring", "evidence", "course", "module", "topic");
  await mkdir(topicRoot, { recursive: true });
  await mkdir(evidenceRoot, { recursive: true });
  let html = await readFile(path.join(fixtures, pageName), "utf8");
  if (options.transformHtml) html = options.transformHtml(html);
  await writeFile(path.join(topicRoot, "artifact.html"), html);
  const catalogRoot = path.join(root, "authoring", "catalog", "course");
  await mkdir(path.join(catalogRoot, "module", "topic"), { recursive: true });
  await writeFile(
    path.join(catalogRoot, "course.json"),
    `${JSON.stringify({ id: "course", moduleOrder: ["module"] }, null, 2)}\n`,
  );
  await writeFile(
    path.join(catalogRoot, "module", "module.json"),
    `${JSON.stringify({ id: "module", topicOrder: ["topic"] }, null, 2)}\n`,
  );
  const topic = {
    id: "topic",
    title: "QA fixture",
    artifacts: {
      html: { status: "present" },
      md: { status: options.markdown === false ? "absent" : "present" },
      pdf: { status: options.pdf ? "present" : "absent" },
    },
  };
  await writeFile(path.join(catalogRoot, "module", "topic", "topic.json"), `${JSON.stringify(topic, null, 2)}\n`);
  const spec = structuredClone(options.spec ?? JSON.parse(await readFile(path.join(fixtures, "qa-paths.json"), "utf8")));
  if (!options.preserveGuidance && !/<main\b[^>]*\bdata-pep-guidance-contract(?:\s|=|>)/iu.test(html)) {
    delete spec.guidance;
    if (!options.spec) {
      spec.routes = {
        success: [{ do: "click", selector: "#success" }],
        wrongFirst: [{ do: "click", selector: "#wrong" }, { do: "click", selector: "#retry-right" }],
        wrongTwice: [{ do: "click", selector: "#wrong" }, { do: "click", selector: "#retry-wrong" }],
      };
      spec.simulatorEdges = [{ name: "unsupported", actions: [
        { do: "fill", selector: "#command", value: "unsupported" },
        { do: "press", selector: "#command", key: "Enter" },
      ] }];
      spec.restart = {
        actions: [
          { do: "click", selector: "#sim" }, { do: "click", selector: "#restart" }, { do: "click", selector: "#sim" },
        ],
        credit: { selector: "#progress", text: "^1 of 1$" },
      };
      spec.keyboard = [{ do: "click", selector: "#success" }];
    }
  }
  await writeFile(path.join(evidenceRoot, "qa-paths.json"), `${JSON.stringify(spec, null, 2)}\n`);
  if (options.markdownText !== undefined) {
    await writeFile(path.join(topicRoot, "artifact.md"), options.markdownText);
  }
  return { root, topicRoot };
}

function context(root) {
  return {
    root,
    explicit: true,
    targets: [root],
    scanRoots: [root],
    display: (file) => path.relative(root, file).split(path.sep).join("/") || ".",
  };
}

async function runFixture(rule, page, options) {
  const repository = await makeRepository(page, options);
  try {
    return await runners[rule](context(repository.root));
  } finally {
    await rm(repository.root, { recursive: true, force: true });
  }
}

async function runFrontmatter(frontmatter) {
  const directory = await mkdtemp(path.join(os.tmpdir(), "pep-frontmatter-"));
  const file = path.join(directory, "video-artifact.md");
  await writeFile(file, `${frontmatter}\n`);
  const root = path.resolve(import.meta.dirname, "../..");
  try {
    return await runT01({
      root,
      explicit: true,
      targets: [file],
      scanRoots: [file],
      display: (target) => path.basename(target),
    });
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
}

function assertPreciseFailure(errors, rule, message, file = expectedHtml) {
  assert.equal(errors.length, 1, JSON.stringify(errors));
  assert.equal(errors[0].rule, rule);
  assert.equal(errors[0].file, file);
  assert.match(errors[0].message, message);
}

for (const rule of ["T09", "T10", "T11", "T12", "T13"]) {
  test(`${rule} accepts the known-good page`, { timeout: rule === "T10" ? 120000 : 60000 }, async () => {
    assert.deepEqual(await runFixture(rule, "good.html"), []);
  });
}

test("qa-paths schema requires complete guidance and exact per-action operands", async () => {
  const schema = JSON.parse(await readFile(path.resolve("authoring/schemas/qa-paths.schema.json"), "utf8"));
  const validate = new Ajv2020({ allErrors: true, strict: false }).compile(schema);
  const good = JSON.parse(await readFile(path.join(fixtures, "qa-paths.json"), "utf8"));
  assert.equal(validate(good), true, JSON.stringify(validate.errors));
  const enabledHints = structuredClone(good);
  enabledHints.guidance.hints = true;
  assert.equal(validate(enabledHints), true, JSON.stringify(validate.errors));
  for (const mutate of [
    (value) => { value.guidance = {}; },
    (value) => { delete value.guidance.objectivesTouch; },
    (value) => { value.guidance.hints = []; },
    (value) => { value.routes.success = [{ do: "fill", selector: "#command" }]; },
    (value) => { value.routes.success = [{ do: "goBack", selector: "body" }]; },
    (value) => { value.routes.success = [{ do: "expectText", selector: "#feedback" }]; },
    (value) => { value.routes.success = [{ do: "click", selector: "#success", value: "irrelevant" }]; },
  ]) {
    const invalid = structuredClone(good);
    mutate(invalid);
    assert.equal(validate(invalid), false, "mutation unexpectedly matched qa-paths schema");
  }
});

test("QA private-success proof binds only current public bytes", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "pep-private-qa-"));
  const owner = "course/module/topic";
  const publicFiles = {
    [`${owner}/artifact.html`]: "<!doctype html><title>Public artifact</title>\n",
    [`authoring/evidence/${owner}/qa-paths.json`]: "{}\n",
    "authoring/tools/qa/harness.mjs": "// public harness\n",
    "authoring/tools/qa/python-answer-scan.py": "# public scanner\n",
    "authoring/tools/checks/T08-html-static.mjs": "// public static check\n",
  };
  try {
    for (const [file, contents] of Object.entries(publicFiles)) {
      await mkdir(path.dirname(path.join(root, file)), { recursive: true });
      await writeFile(path.join(root, file), contents);
    }
    for (const args of [["init", "-q", "-b", "main"], ["add", "."], ["-c", "user.name=QA", "-c", "user.email=qa@example.invalid", "commit", "-qm", "public bytes"]]) {
      const result = spawnSync("git", args, { cwd: root, encoding: "utf8" });
      assert.equal(result.status, 0, result.stderr);
    }
    const commit = spawnSync("git", ["rev-parse", "HEAD"], { cwd: root, encoding: "utf8" }).stdout.trim();
    const proof = {
      record: `validated at ${commit} by run local-safe-1`, commit, runId: "local-safe-1",
      publicBindings: Object.entries(publicFiles).map(([file, contents]) => ({ file, reviewedSha256: createHash("sha256").update(contents).digest("hex") })),
    };
    const receiptRoot = path.join(root, "authoring/evidence/course");
    const receiptFile = path.join(root, `authoring/evidence/${owner}/qa-receipt.json`);
    await writeFile(receiptFile, `${JSON.stringify({ privateSuccessProof: proof })}\n`);
    for (const args of [["add", path.relative(root, receiptFile)], ["-c", "user.name=QA", "-c", "user.email=qa@example.invalid", "commit", "-qm", "record private proof"]]) {
      const result = spawnSync("git", args, { cwd: root, encoding: "utf8" });
      assert.equal(result.status, 0, result.stderr);
    }
    assert.deepEqual(await validateQaPrivateProofs(root, receiptRoot), []);
    await writeFile(path.join(root, `${owner}/artifact.html`), "changed public artifact\n");
    assert.match((await validateQaPrivateProofs(root, receiptRoot)).map((item) => item.message).join("; "), /stale private-success public binding/);
    proof.publicBindings.push({ file: `${owner}/correct-input.json`, reviewedSha256: "0".repeat(64) });
    await writeFile(receiptFile, `${JSON.stringify({ privateSuccessProof: proof })}\n`);
    assert.match((await validateQaPrivateProofs(root, receiptRoot)).map((item) => item.message).join("; "), /exact five approved public paths/);
    proof.publicBindings.pop();
    proof.publicBindings.pop();
    await writeFile(receiptFile, `${JSON.stringify({ privateSuccessProof: proof })}\n`);
    assert.match((await validateQaPrivateProofs(root, receiptRoot)).map((item) => item.message).join("; "), /exact five approved public paths/);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("qa-receipt schema records public-only private success metadata", async () => {
  const schema = JSON.parse(await readFile(path.resolve("authoring/schemas/qa-receipt.schema.json"), "utf8"));
  const validate = new Ajv2020({ allErrors: true, strict: false, formats: { "date-time": true } }).compile(schema);
  const commit = "1".repeat(40);
  const proof = {
    schemaVersion: 1,
    artifactHashes: { "artifact.html": "2".repeat(64) },
    viewports: [], checks: [], passCount: 0, toolVersions: { node: "v24" },
    privateSuccessProof: {
      record: `validated at ${commit} by run local-safe-1`, commit, runId: "local-safe-1",
      ranAt: "2026-10-15T20:00:00Z", environment: { os: "test" }, result: "pass", stagingRetired: true,
      publicBindings: Array.from({ length: 5 }, (_, index) => ({ file: `public/file-${index}.txt`, reviewedSha256: String(index).repeat(64) })),
    },
  };
  assert.equal(validate(proof), true, JSON.stringify(validate.errors));
  proof.privateSuccessProof.privateInputHash = "3".repeat(64);
  assert.equal(validate(proof), false);
  delete proof.privateSuccessProof.privateInputHash;
  proof.privateSuccessProof.publicBindings.push({ file: "public/correct-input.json", reviewedSha256: "3".repeat(64) });
  assert.equal(validate(proof), false);
});

test("private overlay runs success, retry, keyboard and sandbox without repository output", { timeout: 60000 }, async () => {
  const repository = await makeRepository("good.html");
  const staging = await mkdtemp(path.join(os.tmpdir(), "pep-private-overlay-"));
  const overlayFile = path.join(staging, "overlay.json");
  try {
    for (const file of ["authoring/tools/qa/harness.mjs", "authoring/tools/qa/python-answer-scan.py", "authoring/tools/checks/T08-html-static.mjs"]) {
      await mkdir(path.dirname(path.join(repository.root, file)), { recursive: true });
      await writeFile(path.join(repository.root, file), await readFile(path.resolve(file)));
    }
    for (const args of [["init", "-q", "-b", "main"], ["add", "."], ["-c", "user.name=QA", "-c", "user.email=qa@example.invalid", "commit", "-qm", "public fixture"]]) {
      const result = spawnSync("git", args, { cwd: repository.root, encoding: "utf8" });
      assert.equal(result.status, 0, result.stderr);
    }
    const overlay = {
      schemaVersion: 1,
      runId: "local-safe-fixture",
      topic: "course/module/topic",
      routes: {
        success: [{ do: "check", selector: "#action-local" }, { do: "click", selector: "#check-one" }],
        wrongFirst: [
          { do: "check", selector: "#action-external" }, { do: "click", selector: "#check-one" },
          { do: "check", selector: "#action-local" }, { do: "click", selector: "#check-one" },
        ],
        keyboard: [{ do: "check", selector: "#action-local" }, { do: "click", selector: "#check-one" }],
        sandbox: [{ do: "check", selector: "#action-local" }, { do: "click", selector: "#check-one" }],
      },
    };
    await writeFile(overlayFile, `${JSON.stringify(overlay)}\n`);
    await writeFile(path.join(repository.root, "untracked-private-proof.txt"), "dirty\n");
    await assert.rejects(runPrivateOverlay(context(repository.root), overlayFile), /clean public commit/);
    await rm(path.join(repository.root, "untracked-private-proof.txt"));
    const artifactFile = path.join(repository.root, "course/module/topic/artifact.html");
    const artifactBytes = await readFile(artifactFile);
    await writeFile(artifactFile, Buffer.concat([artifactBytes, Buffer.from("<!-- dirty -->\n")]));
    await assert.rejects(runPrivateOverlay(context(repository.root), overlayFile), /clean public commit/);
    await writeFile(artifactFile, artifactBytes);
    const result = await runPrivateOverlay(context(repository.root), overlayFile);
    assert.match(result.commit, /^[a-f0-9]{40}$/u);
    assert.equal(result.result, "pass");
    await assert.rejects(readFile(path.join(repository.root, "build", "qa", "qa-receipt.json")), { code: "ENOENT" });
  } finally {
    await rm(repository.root, { recursive: true, force: true });
    await rm(staging, { recursive: true, force: true });
  }
});

test("harness rejects guidance marker/spec mismatch before browser paths", { timeout: 60000 }, async () => {
  const spec = JSON.parse(await readFile(path.join(fixtures, "qa-paths.json"), "utf8"));
  const omitted = structuredClone(spec);
  delete omitted.guidance;
  let errors = await runFixture("T09", "good.html", { spec: omitted });
  assertPreciseFailure(errors, "T09", /must be present together/);
  errors = await runFixture("T09", "good.html", {
    transformHtml: (html) => html.replace(" data-pep-guidance-contract", ""),
    preserveGuidance: true,
  });
  assertPreciseFailure(errors, "T09", /must be present together/);
});

test("T09 writes a schema-shaped receipt only to gitignored output", { timeout: 60000 }, async () => {
  const repository = await makeRepository("good.html");
  try {
    assert.deepEqual(await runT09(context(repository.root)), []);
    const receiptFile = path.join(
      repository.root,
      "build",
      "qa",
      "course",
      "module",
      "topic",
      "qa-receipt.json",
    );
    const receipt = JSON.parse(await readFile(receiptFile, "utf8"));
    assert.equal(receipt.schemaVersion, 1);
    assert.equal(receipt.checks[0].id, "T09");
    assert.equal(receipt.passCount, 1);
    assert.match(receipt.artifactHashes["artifact.html"], /^[a-f0-9]{64}$/);
    assert.equal(receipt.toolVersions.playwright, "1.55.0");
    await assert.rejects(
      readFile(path.join(repository.root, "authoring", "evidence", "course", "module", "topic", "qa-receipt.json")),
      { code: "ENOENT" },
    );
  } finally {
    await rm(repository.root, { recursive: true, force: true });
  }
});

test("T09 reports a blocked remote load against the exact HTML file", { timeout: 60000 }, async () => {
  const errors = await runFixture("T09", "remote-load.html");
  assertPreciseFailure(errors, "T09", /network request: https:\/\/example\.invalid\/remote\.png/);
});

test("T09 reports a script-built sibling file load against the exact HTML file", { timeout: 60000 }, async () => {
  const errors = await runFixture("T09", "sibling-load.html");
  assertPreciseFailure(errors, "T09", /sibling file request: file:\/\/.*\/diagram\.png/);
});

test("T09 reports a console error against the exact HTML file", { timeout: 60000 }, async () => {
  const errors = await runFixture("T09", "console-error.html");
  assertPreciseFailure(errors, "T09", /console error: intentional fixture error/);
});

test("T09 catches every no-JavaScript anchor pair and per-page print restoration", { timeout: 60000 }, async () => {
  const mutations = [
    ["timeline", (html) => html.replace('href="#activity-2" data-pep-activity-link', 'href="#activity-3" data-pep-activity-link'), /timeline href\/id order mismatch/],
    ["back link", (html) => html.replace('href="#activity-1" data-pep-back-link', 'href="#activity-3" data-pep-back-link'), /back link does not resolve/],
    ["print completeness", (html) => html.replace("@media print {", "@media print { .activity-checks { display:none!important; }"), /print hides required|semantic guidance surfaces/],
    ["print objective body", (html) => html.replace("@media print {", "@media print { #objectives-body { display:none!important; }"), /objectives body/],
    ["print hint step", (html) => html.replace("@media print {", "@media print { [data-pep-hint-step] { display:none!important; }"), /hint reasoning step/],
    ["print optional cue", (html) => html.replace("@media print {", "@media print { .pep-optional__cue { display:none!important; }"), /pep-optional__cue/],
    ["print static alternative", (html) => html.replace("@media print {", "@media print { [data-static-alt] { display:none!important; }"), /static alternative/],
    ["print semantic rail", (html) => html.replace("</style>", "@media print { [data-pep-where-fits] { border-block-start-width:0!important; } }</style>"), /semantic guidance surfaces.*non-color rail/],
    ["print restoration", (html) => html.replace("printOpened.forEach(details => { details.open = false; });", "printOpened.forEach(details => { details.open = true; });"), /did not restore exact disclosure state/],
  ];
  for (const [name, transformHtml, pattern] of mutations) {
    const errors = await runFixture("T09", "good.html", { transformHtml });
    assertPreciseFailure(errors, "T09", pattern);
  }
});

test("T09 prints a singleton hint as concrete learner content", { timeout: 60000 }, async () => {
  const errors = await runFixture("T09", "good.html", {
    transformHtml: (html) => html
      .replace(/\s*<details class="pep-hint" data-pep-hint data-pep-hint-for="task-explain" data-pep-hint-order="2"[\s\S]*?<\/details>/u, "")
      .replaceAll("1 of 2", "1 of 1"),
  });
  assert.deepEqual(errors, []);
});

test("T10 catches a form-submission dependency in the strict sandbox", { timeout: 60000 }, async () => {
  const simple = JSON.parse(await readFile(path.join(fixtures, "qa-paths.json"), "utf8"));
  for (const name of Object.keys(simple.routes)) simple.routes[name] = [{ do: "click", selector: "#success" }];
  simple.progress = simple.completion;
  const errors = await runFixture("T10", "sandbox-form.html", { spec: simple });
  assertPreciseFailure(errors, "T10", /data-pep-complete|sandbox|did not load/i);
});

test("T11 catches duplicate credit after restart", { timeout: 60000 }, async () => {
  const errors = await runFixture("T11", "duplicate-credit.html");
  assertPreciseFailure(errors, "T11", /#progress text did not match/);
});

test("known-good fixture carries direct multi-owner hint coverage", async () => {
  const html = await readFile(path.join(fixtures, "good.html"), "utf8");
  const owners = [...html.matchAll(/data-pep-hint-for="([^"]+)" data-pep-hint-order="1"/gu)].map((match) => match[1]);
  assert.deepEqual(owners, ["task-explain", "task-recap"]);
});

test("T01 accepts YAML block lists while preserving scalar front matter", async () => {
  const errors = await runFrontmatter(`---
title: Terminal overview
channel: Example channel
url: https://example.com/video
runtimeMinutes: 4.5
embeddable: true
checkedAt: 2026-10-12
covers:
  - Shell navigation
gaps: []
cautions: []
alternates: []
rejected: []
---

# Video`);
  assert.deepEqual(errors, []);
});

test("T01 accepts block lists of mappings", async () => {
  const errors = await runFrontmatter(`---
title: Terminal overview
channel: Example channel
url: https://example.com/video
runtimeMinutes: 4.5
embeddable: true
checkedAt: 2026-10-12
covers: []
gaps: []
cautions: []
alternates:
  - title: Alternative video
    url: https://example.com/alternative
rejected:
  - title: Rejected video
    url: https://example.com/rejected
    reason: Too long
---

# Video`);
  assert.deepEqual(errors, []);
});

test("T01 rejects a malformed mapping in a block list", async () => {
  const errors = await runFrontmatter(`---
title: Terminal overview
channel: Example channel
url: https://example.com/video
runtimeMinutes: 4.5
embeddable: true
checkedAt: 2026-10-12
covers: []
gaps: []
cautions: []
alternates:
  - title: Alternative video
    url https://example.com/alternative
rejected: []
---

# Video`);
  assert.equal(errors.length, 1, JSON.stringify(errors));
  assert.match(errors[0].message, /\/alternates\/0 must have required property 'url'/);
});

test("T01 rejects a scalar where front matter requires a list", async () => {
  const errors = await runFrontmatter(`---
title: Terminal overview
channel: Example channel
url: https://example.com/video
runtimeMinutes: 4.5
embeddable: true
checkedAt: 2026-10-12
covers: Shell navigation
gaps: []
cautions: []
alternates: []
rejected: []
---

# Video`);
  assert.equal(errors.length, 1, JSON.stringify(errors));
  assert.match(errors[0].message, /\/covers must be array/);
});

test("T12 ignores fully transparent borders", { timeout: 60000 }, async () => {
  const errors = await runFixture("T12", "good.html", {
    transformHtml: (html) => html.replace(
      '<main id="lesson" data-pep-responsive data-pep-guidance-contract data-pep-complete="false" data-pep-current-activity="1" data-pep-unlocked-through="1" data-pep-required-minutes="14">',
      '<main id="lesson" data-pep-responsive data-pep-guidance-contract data-pep-complete="false" data-pep-current-activity="1" data-pep-unlocked-through="1" data-pep-required-minutes="14"><div style="border: 2px solid transparent"></div>',
    ),
  });
  assert.deepEqual(errors, []);
});

test("T12 catches a rendered low-contrast border", { timeout: 60000 }, async () => {
  const errors = await runFixture("T12", "good.html", {
    transformHtml: (html) => html.replace(
      '<main id="lesson" data-pep-responsive data-pep-guidance-contract data-pep-complete="false" data-pep-current-activity="1" data-pep-unlocked-through="1" data-pep-required-minutes="14">',
      '<main id="lesson" data-pep-responsive data-pep-guidance-contract data-pep-complete="false" data-pep-current-activity="1" data-pep-unlocked-through="1" data-pep-required-minutes="14"><div id="low-border" style="border: 2px solid #ddd">Bordered panel</div>',
    ),
  });
  assertPreciseFailure(errors, "T12", /light contrast: #low-border border .* < 3/);
});

test("T12 accepts a contrasting focus-within ancestor indicator", { timeout: 60000 }, async () => {
  const errors = await runFixture("T12", "good.html", {
    transformHtml: (html) => html
      .replace(
        "</style>",
        "#check-one:focus, #check-one:focus-visible { outline: none; } #focus-wrap:focus-within { box-shadow: 0 0 0 3px #005fcc; } </style>",
      )
      .replace(
        '<button id="check-one" type="button" data-essential data-pep-submit data-pep-complete-activity>Check choice</button>',
        '<div id="focus-wrap"><button id="check-one" type="button" data-essential data-pep-submit data-pep-complete-activity>Check choice</button></div>',
      ),
  });
  assert.deepEqual(errors, []);
});

test("T12 rejects keyboard focus with no indicator in its ancestor chain", { timeout: 60000 }, async () => {
  const errors = await runFixture("T12", "good.html", {
    transformHtml: (html) => html.replace(
      "</style>",
      "button:focus, button:focus-visible { outline: none; box-shadow: none; } </style>",
    ),
  });
  assertPreciseFailure(errors, "T12", /#check-one has no visible focus indicator/);
});

test("T12 catches low contrast in forced dark mode", { timeout: 60000 }, async () => {
  const simple = JSON.parse(await readFile(path.join(fixtures, "qa-paths.json"), "utf8"));
  for (const name of Object.keys(simple.routes)) simple.routes[name] = [{ do: "click", selector: "#success" }];
  simple.keyboard = [{ do: "click", selector: "#success" }];
  simple.progress = simple.completion;
  const errors = await runFixture("T12", "low-contrast-dark.html", { spec: simple });
  assertPreciseFailure(errors, "T12", /dark contrast|color-contrast|axe serious\/critical/);
});

test("T12 enforces stable semantic surface roles, contrast and non-color cues", { timeout: 240000 }, async () => {
  const mutations = [
    ["fit token role", (html) => html.replace(
      "[data-pep-where-fits] { background:var(--pep-card); border:1px solid var(--pep-line); border-block-start:4px solid var(--pep-accent);",
      "[data-pep-where-fits] { background:var(--pep-card); border:1px solid var(--pep-line); border-block-start:4px solid var(--pep-line-strong);",
    ), /does not use --pep-accent/],
    ["repeated check role", (html) => html.replace(
      "</style>",
      "#activity-2 [data-pep-activity-checks] { background:var(--pep-card)!important; }</style>",
    ), /activity checks 2 does not use --pep-accent-soft/],
    ["color-vision contrast", (html) => html.replace("--focus:#5b3fd6", "--focus:#f2f0fc"), /light contrast|contrast is below 3:1|loses 3:1/],
    ["non-color label", (html) => html.replace(">Where this fits</h2>", "></h2>"), /lacks its visible non-color label/],
    ["forced-color rail", (html) => html.replace(
      "</style>",
      "@media (forced-colors:active) { [data-pep-where-fits] { border-block-start-width:0!important; } }</style>",
    ), /lacks its non-color rail/],
    ["workspace hierarchy", (html) => html.replace(
      "[data-pep-workspace] { background:var(--pep-card); border:1px solid var(--pep-line-strong);",
      "[data-pep-workspace] { background:var(--pep-card); border:0;",
    ), /interactive workspace.*lacks its non-color boundary/],
    ["instruction success surface", (html) => html.replace(
      "</style>",
      "[data-pep-instructions] { background:#ebf4f0!important; }</style>",
    ), /instructions 1 does not resolve to --pep-page/],
    ["instruction success rail", (html) => html.replace(
      "</style>",
      "[data-pep-instructions] { border-block-start:4px solid #067647!important; }</style>",
    ), /instructions 1 has a decorative status surface\/rail/],
    ["instruction warning surface", (html) => html.replace(
      "</style>",
      "[data-pep-instructions] { background:#f9f0eb!important; }</style>",
    ), /instructions 1 does not resolve to --pep-page/],
    ["instruction warning rail", (html) => html.replace(
      "</style>",
      "[data-pep-instructions] { border-block-start:4px solid #b54708!important; }</style>",
    ), /instructions 1 has a decorative status surface\/rail/],
    ["instruction danger surface", (html) => html.replace(
      "</style>",
      "[data-pep-instructions] { background:#f9eded!important; }</style>",
    ), /instructions 1 does not resolve to --pep-page/],
    ["instruction danger rail", (html) => html.replace(
      "</style>",
      "[data-pep-instructions] { border-block-start:4px solid #b42318!important; }</style>",
    ), /instructions 1 has a decorative status surface\/rail/],
    ["forced-color transparent rail", (html) => html.replace(
      "</style>",
      "@media (forced-colors:active) { [data-pep-where-fits] { forced-color-adjust:none; border-block-start-color:transparent!important; } }</style>",
    ), /Where this fits.*invisible semantic rail\/boundary/],
    ["forced-color same-surface rail", (html) => html.replace(
      "</style>",
      "@media (forced-colors:active) { [data-pep-where-fits] { forced-color-adjust:none; background:#fff!important; border-block-start-color:#fff!important; } }</style>",
    ), /Where this fits.*indistinguishable semantic rail\/boundary/],
    ["forced-color all-transparent boundaries", (html) => html.replace(
      "</style>",
      "@media (forced-colors:active) { [data-pep-workspace] { forced-color-adjust:none; border-color:transparent!important; } }</style>",
    ), /interactive workspace.*invisible semantic rail\/boundary/],
  ];
  for (const [name, transformHtml, pattern] of mutations) {
    const errors = await runFixture("T12", "good.html", { transformHtml });
    assertPreciseFailure(errors, "T12", pattern);
  }
});

test("T13 keeps semantic rails through phone, tablet and zoom layouts", { timeout: 60000 }, async () => {
  const errors = await runFixture("T13", "good.html", {
    transformHtml: (html) => html.replace(
      "</style>",
      "@media (max-width:390px) { [data-pep-where-fits] { border-block-start-width:0!important; } }</style>",
    ),
  });
  assertPreciseFailure(errors, "T13", /semantic guidance surfaces.*non-color rail/);
});

test("T13 skips zero-size hidden live text and controls in closed details", { timeout: 60000 }, async () => {
  const errors = await runFixture("T13", "good.html", {
    transformHtml: (html) => html.replace(
      '<main id="lesson" data-pep-responsive data-pep-guidance-contract data-pep-complete="false" data-pep-current-activity="1" data-pep-unlocked-through="1" data-pep-required-minutes="14">',
      '<main id="lesson" data-pep-responsive data-pep-guidance-contract data-pep-complete="false" data-pep-current-activity="1" data-pep-unlocked-through="1" data-pep-required-minutes="14"><div id="empty-live" aria-live="polite" style="height:0;overflow:hidden"><span hidden>Old feedback</span></div><details><summary style="min-height:44px">Optional details</summary><button style="width:2000px">Closed action</button></details>',
    ),
  });
  assert.deepEqual(errors, []);
});

test("T13 catches visibly clipped essential text", { timeout: 60000 }, async () => {
  const errors = await runFixture("T13", "good.html", {
    transformHtml: (html) => html.replace(
      '<main id="lesson" data-pep-responsive data-pep-guidance-contract data-pep-complete="false" data-pep-current-activity="1" data-pep-unlocked-through="1" data-pep-required-minutes="14">',
      '<main id="lesson" data-pep-responsive data-pep-guidance-contract data-pep-complete="false" data-pep-current-activity="1" data-pep-unlocked-through="1" data-pep-required-minutes="14"><div style="width:120px;overflow:hidden"><p id="clipped-text" data-essential style="width:300px">Visible essential text is clipped</p></div>',
    ),
  });
  assertPreciseFailure(errors, "T13", /desktop clipped essentials: clipped-text/);
});

test("T13 covers phone, landscape, tablet, and 200% zoom contexts", () => {
  assert.deepEqual(VIEWPORTS.map(({ name, width, zoom }) => [name, width, zoom]), [
    ["desktop", 1366, 1],
    ["short", 1366, 1],
    ["phone-320", 320, 1],
    ["phone-390", 390, 1],
    ["phone-landscape", 844, 1],
    ["tablet-768", 768, 1],
    ["zoom-200", 1366, 2],
  ]);
});

test("T13 catches horizontal overflow at 320 px", { timeout: 60000 }, async () => {
  const errors = await runFixture("T13", "horizontal-overflow.html");
  assertPreciseFailure(errors, "T13", /phone-320 horizontal overflow: 500 > 320/);
});

test("T13 catches touch targets below 44 by 44 CSS pixels", { timeout: 60000 }, async () => {
  const errors = await runFixture("T13", "good.html", {
    transformHtml: (html) => html.replace(
      '<main id="lesson" data-pep-responsive data-pep-guidance-contract data-pep-complete="false" data-pep-current-activity="1" data-pep-unlocked-through="1" data-pep-required-minutes="14">',
      '<main id="lesson" data-pep-responsive data-pep-guidance-contract data-pep-complete="false" data-pep-current-activity="1" data-pep-unlocked-through="1" data-pep-required-minutes="14"><button id="tiny" aria-label="Tiny" style="box-sizing:border-box;width:20px;height:20px;min-height:20px;padding:0"></button>'
    ),
  });
  assertPreciseFailure(errors, "T13", /phone-320 touch targets below 44x44: #tiny 20x20/);
});

test("T13 opens guidance disclosures and sizes ordinary anchors on phones", { timeout: 60000 }, async () => {
  let errors = await runFixture("T13", "good.html", {
    transformHtml: (html) => html.replace(
      "Name the boundary your chosen effect does not cross.</p>",
      "Name the boundary your chosen effect does not cross.</p><span data-essential style=\"display:block;width:1000px\">Revealed overflow</span>",
    ),
  });
  assertPreciseFailure(errors, "T13", /horizontal overflow|clipped essentials/);
  errors = await runFixture("T13", "good.html", {
    transformHtml: (html) => html.replace("</style>", "a { min-height:20px!important; padding-block:0!important; }</style>"),
  });
  assertPreciseFailure(errors, "T13", /phone-320 touch targets below 44x44: .*a|timeline/);
});

test("optional disclosure hooks enforce native semantics and accounting boundaries", async () => {
  const html = await readFile(path.join(fixtures, "good.html"), "utf8");
  assert.deepEqual(await validateOptionalDisclosures(html), []);
  assert.match(
    (await validateOptionalDisclosures(html.replace(" data-section-skip>", ">")))[0],
    /must carry data-section-skip/,
  );
  assert.match(
    (await validateOptionalDisclosures(html.replace("<div class=\"pep-optional__body\" id=\"challenge-body\">", "<div class=\"pep-optional__body\" id=\"challenge-body\" data-interaction=\"challenge\">")))[0],
    /must not carry required objective, interaction, progress or completion hooks/,
  );
});

test("optional anecdotes use balanced parsed validation without magic cue words", async () => {
  const html = await readFile(path.join(fixtures, "good.html"), "utf8");
  const story = "A café worker can update the chalkboard beside them, but changing a supplier delivery means contacting another business.";
  assert.deepEqual(await validateOptionalDisclosures(html), []);
  const airport = html.replace(
    story,
    "A traveler waits at an airport terminal (near gate 4) and prints a paper itinerary before boarding.",
  );
  assert.deepEqual(await validateOptionalDisclosures(airport), []);
  const codeBearing = html.replace(
    story,
    "A shopper chooses <code>[entry for entry in aisle]</code>.",
  );
  assert.match((await validateOptionalDisclosures(codeBearing)).join("; "), /must be code-free/);
  const entitySyntax = html.replace(
    story,
    "A shopper chooses &#91;entry for entry in aisle&#93;.",
  );
  assert.match((await validateOptionalDisclosures(entitySyntax)).join("; "), /must not contain code/);
  const syntaxMap = html.replace(
    "A local action stays in one workspace; an external action crosses a system boundary.",
    "Use [entry for entry in aisle].",
  );
  assert.match((await validateOptionalDisclosures(syntaxMap)).join("; "), /must not contain code/);
  const commandBlock = html.replace("data-pep-anecdote-story", "data-pep-anecdote-story data-command");
  assert.match((await validateOptionalDisclosures(commandBlock)).join("; "), /must be code-free/);
  for (const technical of [
    "A clerk uses list.append(parcel) before lunch.",
    "A clerk writes sorted(parcels) on the wall.",
    "A clerk writes open(ledger) on the wall.",
    "A traveler runs curl https://example.invalid from a kiosk.",
    "A stocker types ls -la beside the shelf.",
    "A stocker types git status beside the shelf.",
    "A stocker types npm test beside the shelf.",
    "A stocker types python script.py beside the shelf.",
    "A stocker types pip install requests beside the shelf.",
    `A label reads ${Buffer.from("list.append(parcel)").toString("base64")}.`,
    `A label reads ${[...Buffer.from("git status")].map((value) => `%${value.toString(16).padStart(2, "0")}`).join("")}.`,
    `A label reads ${[...Buffer.from("NameError: missing")].map((value) => `0x${value.toString(16).padStart(2, "0")}`).join(",")}.`,
    "The sign reads NameError: name parcel is not defined.",
    "Traceback (most recent call last) appeared on the board.",
  ]) {
    const mutation = html.replace(story, technical);
    assert.match((await validateOptionalDisclosures(mutation)).join("; "), /must not contain code, API calls, commands or exact exception/);
  }
  const ordinary = html.replace(
    story,
    "At the airport terminal, a curled ribbon marks a parcel (fragile: keep upright) before the clerk prints its label.",
  );
  assert.deepEqual(await validateOptionalDisclosures(ordinary), []);
  for (const plain of [
    "A guide sorted parcels beside an open window before checking the garden status.",
    "A shopper asks arrange(items) while a clerk prints a label at the airport terminal.",
    `A label reads ${Buffer.from("A shopper uses a blue basket.").toString("base64")}.`,
  ]) {
    assert.deepEqual(await validateOptionalDisclosures(
      html.replace(story, plain),
    ), []);
  }
});

test("guidance contract parses objectives, conditional fit, checks and nested sequential hints", async () => {
  const html = await readFile(path.join(fixtures, "good.html"), "utf8");
  assert.deepEqual(await validateLearnerGuidance(html), []);
  assert.match((await validateLearnerGuidance(html.replace(" data-pep-previous", ""))).join("; "), /Previous activity and Continue\/Next/);
  assert.match((await validateLearnerGuidance(html.replace(" data-pep-fit-boundary", ""))).join("; "), /one non-empty decision/);
  assert.match((await validateLearnerGuidance(html.replace("data-pep-fit-good", "data-pep-fit-boundary-temp"))).join("; "), /one non-empty decision/);
  assert.match((await validateLearnerGuidance(html.replace(" data-pep-hint-step", ""))).join("; "), /exactly one non-empty target/);
  assert.match((await validateLearnerGuidance(html.replace('data-pep-hint-order="2"', 'data-pep-hint-order="3"'))).join("; "), /1\.\.N in DOM order/);
  assert.match((await validateLearnerGuidance(html.replace("Another hint, 2 of 2 for Activity 2", "Hint 1 of 2 for Activity 2"))).join("; "), /requires a unique ordinal|accessible names/);
  const duplicateClue = html
    .replace("Compare the Effect scope choice with your explanation.", "Start in the explanation field above the boundary checkbox.")
    .replace("Use the observed result location as evidence that both choices describe the same boundary.", "Name the boundary your chosen effect does not cross.");
  assert.match((await validateLearnerGuidance(duplicateClue)).join("; "), /must not duplicate normalized clue text/);
  const siblingHints = html.replace(
    /(<p data-pep-hint-step><strong>Next step:<\/strong> Name the boundary your chosen effect does not cross\.<\/p>)\s*(<details class="pep-hint" data-pep-hint data-pep-hint-for="task-explain" data-pep-hint-order="2"[\s\S]*?<\/details>)\s*<\/div>\s*<\/details>/u,
    "$1\n            </div>\n          </details>\n          $2",
  );
  assert.notEqual(siblingHints, html);
  assert.match((await validateLearnerGuidance(siblingHints)).join("; "), /must be nested inside its predecessor/);
  assert.match((await validateLearnerGuidance(html.replace('<p data-pep-hint-target><strong>Where to act:</strong> Start in the explanation field above the boundary checkbox.</p>', '<p data-pep-hint-target></p>'))).join("; "), /exactly one non-empty target/);
  assert.match((await validateLearnerGuidance(html.replace("You classify the in-page preview as local.", ""))).join("; "), /activity-check block/);
  assert.match((await validateLearnerGuidance(html.replace('aria-controls="objectives-body"', 'aria-controls="missing-objectives"'))).join("; "), /must resolve to a non-empty descendant/);
  const fitBlock = html.match(/\s*<section data-pep-where-fits[\s\S]*?<\/section>\n/u)?.[0] ?? "";
  const withoutFit = html.replace(fitBlock, "\n");
  assert.deepEqual(await validateLearnerGuidance(withoutFit), []);
  const misplacedFit = withoutFit.replace("    <section data-pep-recap>", `${fitBlock}    <section data-pep-recap>`);
  assert.match((await validateLearnerGuidance(misplacedFit)).join("; "), /must follow its teaching and precede/);
  const localFit = withoutFit.replace(' data-pep-workspace="activity"', "").replace(
    '        <div id="task-explain" data-pep-task data-pep-may-stall>',
    `${fitBlock}        <div id="task-explain" data-pep-task data-pep-may-stall>`,
  );
  assert.deepEqual(await validateLearnerGuidance(localFit), []);
  const emptyTask = html.replace(
    '<div id="task-recap" data-pep-task data-pep-may-stall>',
    '<div id="task-recap" data-pep-task data-pep-may-stall></div><div hidden>',
  );
  assert.match((await validateLearnerGuidance(emptyTask)).join("; "), /non-empty instructional text outside hints/);
  const hiddenChecks = html.replace(
    '<section class="activity-checks" data-pep-activity-checks aria-labelledby="checks-2">',
    '<details><summary>Other material</summary><section class="activity-checks" data-pep-activity-checks aria-labelledby="checks-2">',
  ).replace('</p></section>\n        <button type="button" id="check-two"', '</p></section></details>\n        <button type="button" id="check-two"');
  assert.match((await validateLearnerGuidance(hiddenChecks)).join("; "), /visible peer activity-check block/);
  const crossActivityHint = html.replaceAll('data-pep-hint-for="task-explain"', 'data-pep-hint-for="task-safe"');
  assert.match((await validateLearnerGuidance(crossActivityHint)).join("; "), /same activity|requires a native hint/);
  const detachedHint = html.replace(
    '          <details class="pep-hint" data-pep-hint data-pep-hint-for="task-explain"',
    '        </div>\n          <details class="pep-hint" data-pep-hint data-pep-hint-for="task-explain"',
  ).replace(
    '          </details>\n        </div>\n        <section class="activity-checks" data-pep-activity-checks aria-labelledby="checks-2">',
    '          </details>\n        <section class="activity-checks" data-pep-activity-checks aria-labelledby="checks-2">',
  );
  assert.match((await validateLearnerGuidance(detachedHint)).join("; "), /contained by its owning task/);
  const nestedFit = withoutFit.replace("    </section>\n\n    <div data-pep-workspace", `${fitBlock}    </section>\n\n    <div data-pep-workspace`);
  assert.match((await validateLearnerGuidance(nestedFit)).join("; "), /peer region/);
  const duplicateAria = html
    .replace("<summary><span>Need a hint?</span>", '<summary aria-label="Shared hint"><span>Need a hint?</span>')
    .replace("<summary><span>Another hint</span>", '<summary aria-label="Shared hint"><span>Another hint</span>');
  assert.match((await validateLearnerGuidance(duplicateAria)).join("; "), /browser-computed hint names/);
  const labelledCollision = html
    .replace("<body>", '<body><span id="shared-hint-name">Shared hint</span>')
    .replace("<summary><span>Need a hint?</span>", '<summary aria-labelledby="shared-hint-name"><span>Need a hint?</span>')
    .replace("<summary><span>Another hint</span>", '<summary aria-labelledby="shared-hint-name"><span>Another hint</span>');
  assert.match((await validateLearnerGuidance(labelledCollision)).join("; "), /browser-computed hint names/);
  const wrongPrefix = html.replace("<span>Need a hint?</span>", "<span>Help first. Need a hint?</span>");
  assert.match((await validateLearnerGuidance(wrongPrefix)).join("; "), /unique ordinal|visible prefix/);
  const commentOnly = html.replace('<details class="objectives" data-pep-objectives>', '<!-- <details data-pep-objectives><summary>Objectives</summary></details> -->\n      <details class="objectives">');
  assert.match((await validateLearnerGuidance(commentOnly)).join("; "), /one native objectives disclosure/);
});

test("target-aware Python AST scanning rejects complete generic answers in every public surface", async () => {
  const baseHtml = (await readFile(path.join(fixtures, "good.html"), "utf8")).replace(
    'id="task-safe" data-pep-task',
    'id="task-safe" data-pep-task data-pep-answer-sensitive="python-comprehension" data-pep-answer-targets="picked"',
  );
  const baseSpec = JSON.parse(await readFile(path.join(fixtures, "qa-paths.json"), "utf8"));
  baseSpec.answerSafety = { task: "#task-safe", language: "python-comprehension", targets: ["picked"] };
  assert.deepEqual(await validateLearnerGuidance(baseHtml, baseSpec), []);
  const prompt = "A note preview appears only in this practice page. Choose where that effect stays, then check your choice.";
  const expression = "picked = [entry for entry in records]";
  const bare = "[entry for entry in records]";
  const encoded = Buffer.from(expression).toString("base64");
  const percent = encodeURIComponent(expression);
  const hex = [...Buffer.from(expression)].map((value) => `0x${value.toString(16).padStart(2, "0")}`).join(",");
  const mutations = [
    baseHtml.replace("<style>", `<style>/* ${expression} */`),
    baseHtml.replace("<style>", `<style>.answer::before { content: ${JSON.stringify(expression)}; }`),
    baseHtml.replace("<title>", `<meta data-answer=${JSON.stringify(expression)}><title>`),
    baseHtml.replace("  <script>", `  <p hidden>${expression}</p>\n  <script>`),
    baseHtml.replace("  <script>", `  <p>${expression}</p>\n  <script>`),
    baseHtml.replace("  <script>", `  <div data-answer=${JSON.stringify(expression)}>Outside the lesson</div>\n  <script>`),
    baseHtml.replace(prompt, `<style>/* ${expression} */</style>${prompt}`),
    baseHtml.replace(prompt, `${expression}. ${prompt}`),
    baseHtml.replace(prompt, `picked = &#91;entry for entry in records&#93;. ${prompt}`),
    baseHtml.replace("Name the boundary your chosen effect does not cross.", `Use ${expression}.`),
    baseHtml.replace("<script>", `<script>// ${expression}\n`),
    baseHtml.replace("<script>", `<script>const publicExample = "picked = [entry " + "for entry in records]";`),
    baseHtml.replace("<script>", '<script>const escaped = "\\u0070icked = [entry for entry in records]";'),
    baseHtml.replace("<script>", `<script>const publicTemplate = \`${expression}\`;`),
    baseHtml.replace("Explain in the field below why your first action stays local.", `${expression}. Explain in the field below why your first action stays local.`),
    baseHtml.replace('<textarea id="activity-two-input"></textarea>', `<textarea id="activity-two-input" data-answer=${JSON.stringify(expression)}></textarea>`),
    baseHtml.replace("The work must contact another system or coordinate several dependent steps.", expression),
    baseHtml.replace("    <section data-pep-recap>", `    <section data-pep-recap><h2>Recap answer</h2><p>${expression}</p></section>\n    <section data-pep-recap>`),
    baseHtml.replace("    <section data-pep-recap>", `    <!-- ${expression} -->\n    <section data-pep-recap>`),
    baseHtml.replace("    <section data-pep-recap>", `    <noscript>${expression}</noscript>\n    <section data-pep-recap>`),
    baseHtml.replace("    <section data-pep-recap>", `    <template>${expression}</template>\n    <section data-pep-recap>`),
    baseHtml.replace("    <section data-pep-recap>", `    <div data-static-alt=${JSON.stringify(expression)}>Static alternative</div>\n    <section data-pep-recap>`),
    baseHtml.replace(prompt, `picked = list(${bare}). ${prompt}`),
    baseHtml.replace(prompt, `(picked, spare) = (${bare}, 1). ${prompt}`),
    baseHtml.replace(prompt, `${encoded}. ${prompt}`),
    baseHtml.replace(prompt, `${percent}. ${prompt}`),
    baseHtml.replace(prompt, `${hex}. ${prompt}`),
  ];
  for (const [index, mutation] of mutations.entries()) {
    assert.match(
      (await validateLearnerGuidance(mutation, baseSpec)).join("; "),
      /complete target comprehension expression/,
      `answer-source mutation ${index} unexpectedly passed`,
    );
  }
  const qaMutation = structuredClone(baseSpec);
  qaMutation.simulatorEdges[0].actions[0].value = expression;
  assert.match((await validateLearnerGuidance(baseHtml, qaMutation)).join("; "), /complete target comprehension expression/);
  const qaBare = structuredClone(baseSpec);
  qaBare.simulatorEdges[0].actions[0] = { do: "fill", selector: "#activity-input", value: bare };
  assert.match((await validateLearnerGuidance(baseHtml, qaBare)).join("; "), /complete target comprehension expression/);
  const qaUnrelated = structuredClone(baseSpec);
  qaUnrelated.simulatorEdges[0].actions[0] = { do: "fill", selector: "#page-title", value: bare };
  assert.deepEqual(await validateLearnerGuidance(baseHtml, qaUnrelated), []);
  for (const obscured of [
    "picked = atob(encodedAnswer)",
    `picked digest ${"a".repeat(64)}`,
  ]) {
    const mutation = baseHtml.replace(prompt, `${obscured}. ${prompt}`);
    assert.match((await validateLearnerGuidance(mutation, baseSpec)).join("; "), /must not encode, assemble or hash/);
  }
  const scriptNearMiss = baseHtml.replace("<script>", '<script>const publicNearMiss = "picked = [entry for entry in records";');
  assert.deepEqual(await validateLearnerGuidance(scriptNearMiss, baseSpec), []);
  const unrelatedTeaching = baseHtml.replace(
    "A local effect stays within this page.",
    "A generic example is [item for item in values]. A local effect stays within this page.",
  );
  assert.deepEqual(await validateLearnerGuidance(unrelatedTeaching, baseSpec), []);
  const unrelatedAssignment = baseHtml.replace(
    prompt,
    `other = [entry for entry in records]. ${prompt}`,
  );
  assert.deepEqual(await validateLearnerGuidance(unrelatedAssignment, baseSpec), []);
  for (const ordinary of [
    baseHtml.replace("<style>", '<style>.status::before { content: "inventory ready"; }'),
    baseHtml.replace("  <script>", "  <p>Inventory remains ready outside the lesson.</p>\n  <script>"),
  ]) {
    assert.deepEqual(await validateLearnerGuidance(ordinary, baseSpec), []);
  }
});

test("Python Activity 3 recipe is bounded and delegates semantic transfer proof to reviewers", async () => {
  const design = await readFile(path.resolve("DESIGN.md"), "utf8");
  const recipe = design.match(/### Python comprehension activity correction recipe([\s\S]*?)### Editor workspace/)?.[1] ?? "";
  assert.match(recipe, /Name two edits in order:[\s\S]*result[\s\S]*list comprehension/i);
  assert.match(recipe, /\(2\)[\s\S]*doubled[\s\S]*set or dict comprehension/i);
  assert.match(recipe, /visits `prices`[\s\S]*keeps values over 10[\s\S]*produces `\[24, 24, 60\]`/i);
  assert.match(recipe, /collected value[\s\S]*`for`[\s\S]*source[\s\S]*optional[\s\S]*filter/i);
  assert.match(recipe, /bounded iterable already in memory[\s\S]*generator or iterator[\s\S]*side effect[\s\S]*exception handling[\s\S]*early exit/i);
  assert.match(recipe, /education review[\s\S]*what to type and where/i);
  assert.doesNotMatch(recipe, /\[\s*p\s*\*\s*2\s+for\s+p\s+in\s+prices/i);
});

test("optional disclosures expand for print and restore their closed state", { timeout: 60000 }, async () => {
  const browser = await launchChromium();
  try {
    const page = await browser.newPage();
    await page.goto(pathToFileURL(path.join(fixtures, "good.html")).href);
    assert.equal(await page.locator("#challenge-body").isVisible(), false);
    assert.equal(await page.locator("#objectives-body").isVisible(), false);
    await page.evaluate(() => dispatchEvent(new Event("beforeprint")));
    await page.emulateMedia({ media: "print" });
    assert.equal(await page.locator("#challenge-body").isVisible(), true);
    assert.equal(await page.locator("#objectives-body").isVisible(), true);
    await page.evaluate(() => dispatchEvent(new Event("afterprint")));
    await page.emulateMedia({ media: "screen" });
    assert.equal(await page.locator('[data-pep-optional="challenge"]').getAttribute("open"), null);
  } finally {
    await browser.close();
  }
});

test("optional disclosures do not change required timing inputs", async () => {
  const original = (await readFile(path.join(fixtures, "good.html"), "utf8"))
    .replace('data-interaction="practice"', 'data-interaction="mcq"');
  const withoutOptional = original.replace(/<details\b[^>]*\bdata-pep-optional=["'][^"']+["'][^>]*>[\s\S]*?<\/details\s*>/gi, "");
  const directory = await mkdtemp(path.join(os.tmpdir(), "pep-optional-time-"));
  try {
    const full = path.join(directory, "full.html");
    const core = path.join(directory, "core.html");
    await writeFile(full, original);
    await writeFile(core, withoutOptional);
    const estimator = path.resolve("authoring/tools/timing/estimate_reading.py");
    const estimate = (file) => JSON.parse(spawnSync("python3", [estimator, file], { encoding: "utf8" }).stdout);
    const fullResult = estimate(full);
    const coreResult = estimate(core);
    assert.deepEqual(
      { words: fullResult.words, code_lines: fullResult.code_lines, interactions: fullResult.interactions },
      { words: coreResult.words, code_lines: coreResult.code_lines, interactions: coreResult.interactions },
    );
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test("Markdown derivation preserves list items, table cells, and block boundaries", { timeout: 60000 }, async () => {
  const markdown = await markdownFromHtml(path.join(fixtures, "md-structure.html"));
  assert.match(markdown, /### Teaching sequence\n\nLegitimate repeated sentence\./);
  assert.match(markdown, /- First adjacent item\.\n- Second adjacent item\./);
  assert.match(markdown, /\| Command \| Meaning \|\n\| --- \| --- \|\n\| pwd \| print folder \|/);
  assert.match(markdown, /\|  \|  \|\n\| --- \| --- \|\n\| localhost \| this computer \|/);
  assert.match(markdown, /Static alternative remains present\./);
});

test("Markdown derivation preserves code lines and semantic rows", { timeout: 60000 }, async () => {
  const markdown = await markdownFromHtml(path.join(fixtures, "md-code-rows.html"));
  assert.match(markdown, /Run `npm test` before you continue\./);
  assert.doesNotMatch(markdown, /```(?:\w+)?\n(?:[^`]*\n)?npm test/u);
  assert.match(markdown, /```\n#!\/bin\/sh\n PORT="\$\{PORT:-8080\}"\n- PORT=8080\n\+ PORT=3000\n```/u);
  assert.match(markdown, /```diff\n #!\/bin\/sh\n- PORT="\$\{PORT:-8080\}"\n\+ PORT=3000\n```/u);
  assert.match(markdown, /- \*\*claim\*\*: Tested, works\.\n- \*\*evidence\*\*: No run yet\./u);
  assert.match(markdown, /- \*\*Workspace\*\*: course files\n- \*\*Status\*\*: not verified/u);
});

test("Markdown derivation separates flex siblings but preserves inline text runs", { timeout: 60000 }, async () => {
  const markdown = await markdownFromHtml(path.join(fixtures, "md-structure.html"));
  assert.match(markdown, /- API_KEY=demo-123 shell only/);
  assert.match(markdown, /- app\.sh/);
  assert.doesNotMatch(markdown, /app \.sh/);
});

test("Markdown derivation emits nested companion sections exactly once", { timeout: 60000 }, async () => {
  const markdown = await markdownFromHtml(path.join(fixtures, "md-structure.html"));
  for (const heading of ["Recap", "Cheat sheet", "Sources"]) {
    assert.equal(markdown.split(`## ${heading}`).length - 1, 1, markdown);
  }
  for (const text of ["Recap first point.", "localhost", "Official source one."]) {
    assert.equal(markdown.split(text).length - 1, 1, markdown);
  }
});

test("Markdown derivation keeps block code inside ordered list items", { timeout: 60000 }, async () => {
  const markdown = await markdownFromHtml(path.join(fixtures, "md-list-code.html"));
  assert.match(markdown, /1\. ```\n   app\.log\n   ```\n   10 lines/u);
  const tokens = new MarkdownIt().parse(markdown, {});
  const headings = tokens
    .filter((token, index) => token.type === "inline" && tokens[index - 1]?.type === "heading_open")
    .map((token) => token.content);
  assert.deepEqual(headings, [
    "List code Markdown fixture",
    "Objectives",
    "Model",
    "Pipeline model",
    "Recap",
    "Static interaction alternatives",
    "pipeline",
  ]);
  const code = tokens.filter((token) => token.type === "fence").map((token) => token.content);
  assert.deepEqual(code, ["app.log\n", "grep ERROR\n"]);
});

const pdftotext = spawnSync("pdftotext", ["-v"]).error ? undefined : "pdftotext";

test("PDF text extraction keeps inline code in sentence and table-row order", {
  timeout: 60000,
  skip: pdftotext ? false : "pdftotext is not installed",
}, async () => {
  const directory = await mkdtemp(path.join(os.tmpdir(), "pep-pdf-order-"));
  try {
    const markdown = path.join(directory, "artifact.md");
    const pdf = path.join(directory, "artifact.pdf");
    await writeFile(markdown, [
      "# Inline code order",
      "",
      "- `localhost` (`127.0.0.1`) always means the computer you are on.",
      "",
      "|  |  |",
      "| --- | --- |",
      "| `localhost`, `127.0.0.1` | this computer |",
      "",
    ].join("\n"));
    await pdfFromMarkdown(markdown, pdf);
    const text = spawnSync(pdftotext, [pdf, "-"], { encoding: "utf8" }).stdout.replace(/\s+/gu, " ");
    assert.match(text, /localhost \(127\.0\.0\.1\) always means the computer you are on\./u, text);
    assert.match(text, /localhost, 127\.0\.0\.1 this computer/u, text);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test("Markdown derivation is deterministic", { timeout: 60000 }, async () => {
  const fixture = path.join(fixtures, "md-structure.html");
  assert.equal(await markdownFromHtml(fixture), await markdownFromHtml(fixture));
});

test("Markdown derivation keeps legitimate repeated text in distinct sections", { timeout: 60000 }, async () => {
  const markdown = await markdownFromHtml(path.join(fixtures, "md-structure.html"));
  assert.equal(markdown.split("Legitimate repeated sentence.").length - 1, 2, markdown);
});

test("T18 accepts objective parity from a closed details disclosure", { timeout: 60000 }, async () => {
  const repository = await makeRepository("good.html", {
    transformHtml: (html) => html.replace(
      `<section class="objectives" data-pep-objectives>
      <h2>Objectives</h2>
      <ul><li>Complete a safe interaction.</li></ul>
    </section>`,
      `<details class="objectives" data-pep-objectives>
      <summary>Objectives</summary>
      <ul><li>Complete a safe interaction.</li></ul>
    </details>`,
    ),
  });
  try {
    const html = path.join(repository.topicRoot, "artifact.html");
    const markdown = path.join(repository.topicRoot, "artifact.md");
    await writeFile(markdown, await markdownFromHtml(html));
    assert.deepEqual(await runT18(context(repository.root)), []);
  } finally {
    await rm(repository.root, { recursive: true, force: true });
  }
});

test("T18 accepts deterministic Markdown", { timeout: 60000 }, async () => {
  const repository = await makeRepository("good.html");
  try {
    const html = path.join(repository.topicRoot, "artifact.html");
    const markdown = path.join(repository.topicRoot, "artifact.md");
    await writeFile(markdown, await markdownFromHtml(html));
    await pdfFromMarkdown(markdown, path.join(repository.topicRoot, "artifact.pdf"));
    const topicFile = path.join(repository.root, "authoring/catalog/course/module/topic/topic.json");
    const topic = JSON.parse(await readFile(topicFile, "utf8"));
    topic.artifacts.pdf.status = "present";
    await writeFile(
      topicFile,
      `${JSON.stringify(topic, null, 2)}\n`,
    );
    assert.deepEqual(await runT18(context(repository.root)), []);
  } finally {
    await rm(repository.root, { recursive: true, force: true });
  }
});

test("T18 catches Markdown parity mismatch against the exact file", { timeout: 60000 }, async () => {
  const mismatch = await readFile(path.join(fixtures, "md-parity-mismatch.md"), "utf8");
  const errors = await runFixture("T18", "good.html", { markdownText: mismatch });
  assertPreciseFailure(
    errors,
    "T18",
    /artifact\.md differs from deterministic HTML derivation/,
    "course/module/topic/artifact.md",
  );
});
