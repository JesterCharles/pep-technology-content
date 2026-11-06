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
import { run as runT08, validateLearnerGuidance, validateOptionalDisclosures } from "../tools/checks/T08-html-static.mjs";
import { run as runT09 } from "../tools/checks/T09-offline.mjs";
import { run as runT10 } from "../tools/checks/T10-sandbox.mjs";
import { run as runT11 } from "../tools/checks/T11-behavior.mjs";
import { run as runT12 } from "../tools/checks/T12-accessibility.mjs";
import { run as runT13 } from "../tools/checks/T13-responsive.mjs";
import { run as runT18 } from "../tools/checks/T18-markdown-pdf.mjs";
import { markdownFromHtml } from "../tools/qa/md-from-html.mjs";
import { pdfFromMarkdown } from "../tools/qa/pdf-from-md.mjs";
import { launchChromium, resolvePrivateActionValues, runPrivateOverlay, validateQaPrivateProofs, VIEWPORTS } from "../tools/qa/harness.mjs";

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

async function makeT08Repository(html, spec) {
  const repository = await makeRepository("answer-sensitive-private.html", { spec, preserveGuidance: true });
  const artifact = path.join(repository.topicRoot, "artifact.html");
  const metadata = [
    '<meta name="pep:course" content="course">',
    '<meta name="pep:module" content="module">',
    '<meta name="pep:topic" content="QA fixture">',
    '<meta name="pep:topic-id" content="topic">',
    '<meta name="pep:budget-minutes" content="10">',
    '<meta name="pep:source" content="authoring/evidence/course/module/topic/sources.json">',
  ].join("\n  ");
  await writeFile(artifact, html
    .replace("<head>", `<head>\n  ${metadata}`)
    .replace("<main ", "<main data-interaction "));
  await writeFile(path.join(repository.root, "authoring/catalog/course/module/topic/topic.json"), `${JSON.stringify({
    id: "topic",
    title: "QA fixture",
    artifacts: {
      html: { status: "present" },
      md: { status: "absent", reason: "Synthetic T08 fixture" },
      pdf: { status: "absent", reason: "Synthetic T08 fixture" },
    },
    minutes: { budget: 10 },
    freshness: { sourcesRef: "authoring/evidence/course/module/topic/sources.json" },
  }, null, 2)}\n`);
  return repository;
}

async function runT08Document(html, spec) {
  const repository = await makeT08Repository(html, spec);
  try {
    return await runT08(context(repository.root));
  } finally {
    await rm(repository.root, { recursive: true, force: true });
  }
}

function nonGuidanceScaffoldHtml(options = {}) {
  const adapter = options.adapter === undefined ? "python-scaffold@3" : options.adapter;
  const adapterAttribute = adapter === null ? "" : ` data-lesson-editor-adapter="${adapter}"`;
  const language = options.language ?? "python-scaffold";
  const extension = options.extension ?? "py";
  const target = options.target ?? "placeholder";
  const declaration = options.declaration === false ? "" :
    `<section id="task-sensitive" data-pep-answer-sensitive="${language}" data-pep-answer-targets="${target}"><p>Complete the private activity.</p></section>`;
  const scoped = options.outsideTarget ?
    `<section${adapterAttribute}><span class="le-file">practice.${extension}</span></section>${declaration}` :
    `<section${adapterAttribute}><span class="le-file">practice.${extension}</span>${declaration}</section>`;
  const duplicate = options.duplicateDeclaration ? declaration : "";
  return `<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>QA fixture</title></head>
<body><main id="lesson">${scoped}${duplicate}</main></body>
</html>`;
}

function nonGuidanceScaffoldSpec(overrides = {}) {
  return { answerSafety: { privateSuccessProof: true, tasks: [{
    task: "#task-sensitive",
    language: "python-scaffold",
    targets: ["placeholder"],
    scan: "none",
    ...overrides,
  }] } };
}

function answerSensitiveSpec() {
  return {
    schemaVersion: 1,
    completion: { selector: "#lesson", attribute: "data-pep-complete", equals: "false" },
    progress: { selector: "#progress", text: "^0 of 1$" },
    routes: {
      success: [
        { do: "click", selector: "#starter" },
        { do: "expectText", selector: "#feedback", text: "incomplete; no credit" },
      ],
      wrongFirst: [
        { do: "click", selector: "#malformed" },
        { do: "expectText", selector: "#feedback", text: "incomplete; no credit" },
      ],
      wrongTwice: [
        { do: "click", selector: "#wrong" },
        { do: "click", selector: "#wrong" },
        { do: "expectText", selector: "#feedback", text: "accepted, but still incomplete; no credit" },
      ],
    },
    simulatorEdges: [{
      name: "empty attempt remains incomplete",
      actions: [
        { do: "fill", selector: "#private-input", value: "" },
        { do: "click", selector: "#private-complete" },
        { do: "expectText", selector: "#feedback", text: "completed private attempt is required" },
      ],
    }],
    restart: {
      actions: [
        { do: "click", selector: "#wrong" },
        { do: "click", selector: "#restart" },
        { do: "click", selector: "#wrong" },
      ],
      credit: { selector: "#progress", text: "^0 of 1$" },
    },
    keyboard: [
      { do: "click", selector: "#malformed" },
      { do: "expectText", selector: "#feedback", text: "incomplete; no credit" },
    ],
    answerSafety: {
      privateSuccessProof: true,
      tasks: [{ task: "#task-sensitive", language: "python-comprehension", targets: ["result"] }],
    },
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

for (const rule of ["T10", "T11", "T12", "T13"]) {
  test(`${rule} keeps answer-sensitive public attempts incomplete and at zero credit`, { timeout: 120000 }, async () => {
    assert.deepEqual(await runFixture(rule, "answer-sensitive-private.html", { spec: answerSensitiveSpec() }), []);
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
  const privateValue = structuredClone(good);
  privateValue.routes.success[0] = { do: "fill", selector: "#activity-input", valueFrom: "private:sql-success" };
  assert.equal(validate(privateValue), true, JSON.stringify(validate.errors));
  const answerSensitive = answerSensitiveSpec();
  assert.equal(validate(answerSensitive), true, JSON.stringify(validate.errors));
  answerSensitive.answerSafety.privateSuccessProof = false;
  assert.equal(validate(answerSensitive), false, "private success opt-in must be explicit true");
  const multiLanguage = answerSensitiveSpec();
  multiLanguage.answerSafety.tasks = [
    { task: "#task-2", language: "java", targets: ["reverse"] },
    { task: "#task-3", language: "java", targets: ["summarize"] },
    { task: "#task-4", language: "python-scaffold", targets: ["placeholder"], scan: "none" },
    { task: "#task-5", language: "jsx-editor", targets: ["App"], scan: "none" },
    { task: "#task-6", language: "javascript-editor", targets: ["loadBooks"], scan: "none" },
  ];
  assert.equal(validate(multiLanguage), true, JSON.stringify(validate.errors));
  for (const mutateAnswer of [
    (value) => { value.answerSafety = { task: "#task-2", language: "python-comprehension", targets: ["result"], privateSuccessProof: true }; },
    (value) => { value.answerSafety.tasks = []; },
    (value) => { value.answerSafety.tasks[0].language = "ruby"; },
    (value) => { value.answerSafety.tasks[0].scan = "none"; },
    (value) => { delete value.answerSafety.tasks[2].scan; },
    (value) => { value.answerSafety.tasks[2].scan = "python"; },
    (value) => { delete value.answerSafety.tasks[3].scan; },
    (value) => { value.answerSafety.tasks[3].scan = "python"; },
    (value) => { value.answerSafety.tasks[0].targets = []; },
  ]) {
    const invalid = structuredClone(multiLanguage);
    mutateAnswer(invalid);
    assert.equal(validate(invalid), false, "answerSafety mutation unexpectedly matched qa-paths schema");
  }
  for (const mutate of [
    (value) => { value.guidance = {}; },
    (value) => { delete value.guidance.objectivesTouch; },
    (value) => { value.guidance.hints = []; },
    (value) => { value.routes.success = [{ do: "fill", selector: "#command" }]; },
    (value) => { value.routes.success = [{ do: "goBack", selector: "body" }]; },
    (value) => { value.routes.success = [{ do: "expectText", selector: "#feedback" }]; },
    (value) => { value.routes.success = [{ do: "click", selector: "#success", value: "irrelevant" }]; },
    (value) => { value.routes.success = [{ do: "fill", selector: "#command", valueFrom: "secret:answer" }]; },
    (value) => { value.routes.success = [{ do: "fill", selector: "#command", value: "literal", valueFrom: "private:answer" }]; },
  ]) {
    const invalid = structuredClone(good);
    mutate(invalid);
    assert.equal(validate(invalid), false, "mutation unexpectedly matched qa-paths schema");
  }
});

test("private QA action values resolve only from an environment-selected external JSON file", async () => {
  const repository = await mkdtemp(path.join(os.tmpdir(), "pep-private-values-repo-"));
  const staging = await mkdtemp(path.join(os.tmpdir(), "pep-private-values-source-"));
  const source = path.join(staging, "inputs.json");
  const environment = { PEP_QA_PRIVATE_INPUTS_FILE: source };
  const secret = "SELECT private_fixture_value";
  try {
    await writeFile(source, `${JSON.stringify({ correctSql: secret, count: 3 })}\n`);
    const actions = [
      { do: "fill", selector: "#query", valueFrom: "private:correctSql" },
      { do: "fill", selector: "#note", value: "committed literal" },
    ];
    assert.deepEqual(await resolvePrivateActionValues(actions, { environment, repoRoot: repository }), [
      { do: "fill", selector: "#query", value: secret },
      actions[1],
    ]);
    assert.equal(actions[0].valueFrom, "private:correctSql", "resolution must not mutate the QA path");
    const literalActions = [actions[1]];
    assert.strictEqual(
      await resolvePrivateActionValues(literalActions, { environment: {}, repoRoot: repository }),
      literalActions,
      "committed literal actions must not require or change a private source",
    );

    await assert.rejects(
      resolvePrivateActionValues([actions[0]], { environment: {}, repoRoot: repository }),
      /PEP_QA_PRIVATE_INPUTS_FILE is required/,
    );
    await assert.rejects(
      resolvePrivateActionValues([actions[0]], {
        environment: { PEP_QA_PRIVATE_INPUTS_FILE: path.join(staging, "missing.json") },
        repoRoot: repository,
      }),
      /source is unreadable/,
    );
    const trackedLocation = path.join(repository, "inputs.json");
    await writeFile(trackedLocation, `${JSON.stringify({ correctSql: secret })}\n`);
    await assert.rejects(
      resolvePrivateActionValues([actions[0]], {
        environment: { PEP_QA_PRIVATE_INPUTS_FILE: trackedLocation },
        repoRoot: repository,
      }),
      /not outside the repository/,
    );
    await writeFile(source, `{ "correctSql": ${JSON.stringify(secret)} trailing }`);
    await assert.rejects(
      resolvePrivateActionValues([actions[0]], { environment, repoRoot: repository }),
      /must contain valid JSON/,
    );
    await writeFile(source, `${JSON.stringify({ other: secret })}\n`);
    await assert.rejects(
      resolvePrivateActionValues([actions[0]], { environment, repoRoot: repository }),
      /required private QA input is missing or is not a string/,
    );
    await writeFile(source, `${JSON.stringify({ correctSql: 7 })}\n`);
    await assert.rejects(
      resolvePrivateActionValues([actions[0]], { environment, repoRoot: repository }),
      /required private QA input is missing or is not a string/,
    );
    await assert.rejects(
      resolvePrivateActionValues(
        [{ do: "fill", selector: "#query", valueFrom: "vault:correctSql" }],
        { environment, repoRoot: repository },
      ),
      /reference syntax is unsupported/,
    );
  } finally {
    await rm(repository, { recursive: true, force: true });
    await rm(staging, { recursive: true, force: true });
  }
});

test("QA private-success proof binds only current public bytes", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "pep-private-qa-"));
  const owner = "course/module/topic";
  const publicFiles = {
    [`${owner}/artifact.html`]: "<!doctype html><title>Public artifact</title>\n",
    [`authoring/evidence/${owner}/qa-paths.json`]: `${JSON.stringify({ answerSafety: { privateSuccessProof: true } })}\n`,
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
    assert.match(
      (await validateQaPrivateProofs(root, receiptRoot)).map((item) => item.message).join("; "),
      /opt-in requires a current private success receipt/,
    );
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

test("private overlay owns success postconditions without recording resolved values", { timeout: 180000 }, async () => {
  const repository = await makeRepository("answer-sensitive-private.html", { spec: answerSensitiveSpec() });
  const staging = await mkdtemp(path.join(os.tmpdir(), "pep-private-overlay-"));
  const overlayFile = path.join(staging, "overlay.json");
  const inputsFile = path.join(staging, "inputs.json");
  const environment = { PEP_QA_PRIVATE_INPUTS_FILE: inputsFile };
  const privateValue = `runtime-only-${process.pid}`;
  try {
    for (const file of ["authoring/tools/qa/harness.mjs", "authoring/tools/qa/python-answer-scan.py", "authoring/tools/checks/T08-html-static.mjs"]) {
      await mkdir(path.dirname(path.join(repository.root, file)), { recursive: true });
      await writeFile(path.join(repository.root, file), await readFile(path.resolve(file)));
    }
    for (const args of [["init", "-q", "-b", "main"], ["add", "."], ["-c", "user.name=QA", "-c", "user.email=qa@example.invalid", "commit", "-qm", "public fixture"]]) {
      const result = spawnSync("git", args, { cwd: repository.root, encoding: "utf8" });
      assert.equal(result.status, 0, result.stderr);
    }
    const completedRoute = [
      { do: "fill", selector: "#private-input", valueFrom: "private:activityValue" },
      { do: "click", selector: "#private-complete" },
    ];
    const overlay = {
      schemaVersion: 1,
      runId: "local-safe-fixture",
      topic: "course/module/topic",
      completion: { selector: "#lesson", attribute: "data-pep-complete", equals: "true" },
      progress: { selector: "#progress", text: "^1 of 1$" },
      routes: {
        success: completedRoute,
        wrongFirst: [
          { do: "click", selector: "#wrong" },
          ...completedRoute,
        ],
        keyboard: completedRoute,
        sandbox: completedRoute,
      },
    };
    await writeFile(overlayFile, `${JSON.stringify(overlay)}\n`);
    await writeFile(inputsFile, `${JSON.stringify({ activityValue: privateValue })}\n`);
    await writeFile(path.join(repository.root, "untracked-private-proof.txt"), "dirty\n");
    await assert.rejects(runPrivateOverlay(context(repository.root), overlayFile, { environment }), /clean public commit/);
    await rm(path.join(repository.root, "untracked-private-proof.txt"));
    const artifactFile = path.join(repository.root, "course/module/topic/artifact.html");
    const artifactBytes = await readFile(artifactFile);
    await writeFile(artifactFile, Buffer.concat([artifactBytes, Buffer.from("<!-- dirty -->\n")]));
    await assert.rejects(runPrivateOverlay(context(repository.root), overlayFile, { environment }), /clean public commit/);
    await writeFile(artifactFile, artifactBytes);
    const result = await runPrivateOverlay(context(repository.root), overlayFile, { environment });
    assert.match(result.commit, /^[a-f0-9]{40}$/u);
    assert.equal(result.result, "pass");
    assert.doesNotMatch(JSON.stringify(result), new RegExp(privateValue));
    await assert.rejects(readFile(path.join(repository.root, "build", "qa", "qa-receipt.json")), { code: "ENOENT" });

    for (const routeName of ["success", "keyboard", "sandbox"]) {
      const failing = structuredClone(overlay);
      failing.routes[routeName] = [{ do: "fill", selector: "#private-input", valueFrom: "private:activityValue" }];
      await writeFile(overlayFile, `${JSON.stringify(failing)}\n`);
      await assert.rejects(
        runPrivateOverlay(context(repository.root), overlayFile, { environment }),
        (error) => /private success route failed; no private values were recorded/.test(error.message) && !error.message.includes(privateValue),
      );
    }
    const malformed = structuredClone(overlay);
    delete malformed.progress;
    await writeFile(overlayFile, `${JSON.stringify(malformed)}\n`);
    await assert.rejects(runPrivateOverlay(context(repository.root), overlayFile, { environment }), /postconditions do not match/);
  } finally {
    await rm(repository.root, { recursive: true, force: true });
    await rm(staging, { recursive: true, force: true });
  }
});

test("private overlay refuses a topic without the explicit opt-in", async () => {
  const spec = answerSensitiveSpec();
  delete spec.answerSafety.privateSuccessProof;
  const repository = await makeRepository("answer-sensitive-private.html", { spec });
  const staging = await mkdtemp(path.join(os.tmpdir(), "pep-private-overlay-refusal-"));
  const overlayFile = path.join(staging, "overlay.json");
  try {
    for (const file of ["authoring/tools/qa/harness.mjs", "authoring/tools/qa/python-answer-scan.py", "authoring/tools/checks/T08-html-static.mjs"]) {
      await mkdir(path.dirname(path.join(repository.root, file)), { recursive: true });
      await writeFile(path.join(repository.root, file), await readFile(path.resolve(file)));
    }
    await writeFile(overlayFile, `${JSON.stringify({
      schemaVersion: 1,
      runId: "no-opt-in",
      topic: "course/module/topic",
      completion: { selector: "#lesson", attribute: "data-pep-complete", equals: "true" },
      progress: { selector: "#progress", text: "^1 of 1$" },
      routes: Object.fromEntries(["success", "wrongFirst", "keyboard", "sandbox"].map((name) => [name, [{ do: "click", selector: "#private-complete" }]])),
    })}\n`);
    for (const args of [["init", "-q", "-b", "main"], ["add", "."], ["-c", "user.name=QA", "-c", "user.email=qa@example.invalid", "commit", "-qm", "public fixture"]]) {
      const result = spawnSync("git", args, { cwd: repository.root, encoding: "utf8" });
      assert.equal(result.status, 0, result.stderr);
    }
    await assert.rejects(runPrivateOverlay(context(repository.root), overlayFile), /requires the answer-sensitive private-success opt-in/);
  } finally {
    await rm(repository.root, { recursive: true, force: true });
    await rm(staging, { recursive: true, force: true });
  }
});

function guidedSetupActions(label) {
  return [
    { do: "check", selector: "#predict-grows" },
    { do: "click", selector: "#check-1" },
    { do: "click", selector: "#next-activity" },
    { do: "fill", selector: "#editor-2", value: `// TODO ${label} setup attempt` },
    { do: "click", selector: "#check-2" },
  ];
}

function guidedSpec(mode = "settle") {
  const wrongPredict = [
    { do: "check", selector: "#predict-grows" },
    { do: "click", selector: "#check-1" },
  ];
  const missEditorTwice = (editor, check, value) => [
    { do: "fill", selector: editor, value },
    { do: "click", selector: check },
    { do: "click", selector: check },
  ];
  const negativeRoute = (label) => [
    ...wrongPredict,
    { do: "click", selector: "#next-activity" },
    ...missEditorTwice("#editor-2", "#check-2", `// TODO ${label} reverse attempt`),
    { do: "click", selector: "#next-activity" },
    ...missEditorTwice("#editor-3", "#check-3", `// TODO ${label} summarize attempt`),
    { do: "click", selector: "#next-activity" },
    { do: "fill", selector: "#recap-input", value: `${label} recap sentence` },
    { do: "click", selector: "#check-4" },
  ];
  const done = mode === "strict" ? 1 : 2;
  return {
    schemaVersion: 1,
    completion: { selector: "#lesson", attribute: "data-pep-complete", equals: "false" },
    progress: { selector: "#progress", text: `^${done} of 4 done$` },
    routes: {
      success: negativeRoute("success"),
      wrongFirst: negativeRoute("wrong-first"),
      wrongTwice: [
        ...negativeRoute("wrong-twice"),
        { do: "expectText", selector: "#activity-4 [data-pep-feedback]", text: "Recap recorded" },
      ],
    },
    simulatorEdges: [{
      name: "unselected prediction remains incomplete",
      actions: [
        { do: "click", selector: "#check-1" },
        { do: "expectText", selector: "#activity-1 [data-pep-feedback]", text: "Choose a prediction first" },
        { do: "expectAttribute", selector: "#lesson", attribute: "data-pep-complete", equals: "false" },
      ],
    }],
    restart: {
      actions: [
        ...wrongPredict,
        { do: "click", selector: "#restart" },
        ...wrongPredict,
      ],
      credit: { selector: "#progress", text: mode === "strict" ? "^0 of 4 done$" : "^1 of 4 done$" },
    },
    keyboard: negativeRoute("keyboard"),
    guidance: {
      activityNavigation: guidedSetupActions("pointer"),
      activityNavigationKeyboard: guidedSetupActions("keyboard"),
      activityNavigationTouch: guidedSetupActions("touch"),
      objectives: [
        { do: "click", selector: "[data-pep-objectives] > summary" },
        { do: "expectVisible", selector: "#objectives-body" },
        { do: "press", selector: "[data-pep-objectives] > summary", key: "Escape" },
        { do: "expectHidden", selector: "#objectives-body" },
        { do: "click", selector: "[data-pep-objectives] > summary" },
        { do: "click", selector: "#page-title" },
        { do: "expectHidden", selector: "#objectives-body" },
      ],
      objectivesTouch: [
        { do: "click", selector: "[data-pep-objectives] > summary" },
        { do: "expectVisible", selector: "#objectives-body" },
        { do: "click", selector: "#page-title" },
        { do: "expectHidden", selector: "#objectives-body" },
      ],
    },
  };
}

function declareAnswerTasks(html, declarations) {
  return declarations.reduce((out, [task, language, targets]) => out.replace(
    `id="${task}" data-pep-task`,
    `id="${task}" data-pep-task data-pep-answer-sensitive="${language}" data-pep-answer-targets="${targets}"`,
  ), html);
}

function declarePythonScaffold(html, options = {}) {
  const adapter = options.adapter === undefined ? "python-scaffold@3" : options.adapter;
  const extension = options.extension ?? "py";
  const labelClass = options.labelClass ?? "le-file";
  const language = options.language ?? "python-scaffold";
  const adapterAttribute = adapter === null ? "" : ` data-lesson-editor-adapter="${adapter}"`;
  return html.replace(
    'id="task-safe" data-pep-task',
    `id="task-safe" data-pep-task data-pep-answer-sensitive="${language}" data-pep-answer-targets="placeholder"${adapterAttribute}`,
  ).replace(
    '<label for="activity-input">Observation</label>',
    `<span class="${labelClass}">practice.${extension}</span><label for="activity-input">Observation</label>`,
  );
}

function pythonScaffoldSpec() {
  return { answerSafety: { privateSuccessProof: true, tasks: [
    { task: "#task-safe", language: "python-scaffold", targets: ["placeholder"], scan: "none" },
  ] } };
}

const JAVA_GUIDED_TASKS = [
  { task: "#task-2", language: "java", targets: ["reverse"] },
  { task: "#task-3", language: "java", targets: ["summarize"] },
];

function guidedOverlayRoutes(editorTwoActions, editorThreeActions) {
  return [
    { do: "check", selector: "#predict-same" },
    { do: "click", selector: "#check-1" },
    { do: "click", selector: "#next-activity" },
    ...editorTwoActions,
    { do: "click", selector: "#next-activity" },
    ...editorThreeActions,
    { do: "click", selector: "#next-activity" },
    { do: "fill", selector: "#recap-input", value: "both methods recapped" },
    { do: "click", selector: "#check-4" },
  ];
}

async function makeOverlayRepository(page, options) {
  const repository = await makeRepository(page, options);
  for (const file of ["authoring/tools/qa/harness.mjs", "authoring/tools/qa/python-answer-scan.py", "authoring/tools/checks/T08-html-static.mjs"]) {
    await mkdir(path.dirname(path.join(repository.root, file)), { recursive: true });
    await writeFile(path.join(repository.root, file), await readFile(path.resolve(file)));
  }
  for (const args of [["init", "-q", "-b", "main"], ["add", "."], ["-c", "user.name=QA", "-c", "user.email=qa@example.invalid", "commit", "-qm", "public fixture"]]) {
    const result = spawnSync("git", args, { cwd: repository.root, encoding: "utf8" });
    assert.equal(result.status, 0, result.stderr);
  }
  return repository;
}

test("private overlay accepts an adapter-scoped python-scaffold declaration", { timeout: 300000 }, async () => {
  const spec = answerSensitiveSpec();
  spec.answerSafety.tasks = [
    { task: "#task-sensitive", language: "python-scaffold", targets: ["placeholder"], scan: "none" },
  ];
  const repository = await makeOverlayRepository("answer-sensitive-private.html", {
    spec,
    transformHtml: (html) => html.replace(
      '<section id="task-sensitive" data-pep-answer-sensitive="python-comprehension" data-pep-answer-targets="result">',
      '<section id="task-sensitive" data-pep-answer-sensitive="python-scaffold" data-pep-answer-targets="placeholder" data-lesson-editor-adapter="python-scaffold@3"><span class="le-file">practice.py</span>',
    ),
  });
  const staging = await mkdtemp(path.join(os.tmpdir(), "pep-private-overlay-python-scaffold-"));
  const overlayFile = path.join(staging, "overlay.json");
  const inputsFile = path.join(staging, "inputs.json");
  const route = [
    { do: "fill", selector: "#private-input", valueFrom: "private:activityValue" },
    { do: "click", selector: "#private-complete" },
  ];
  try {
    await writeFile(overlayFile, `${JSON.stringify({
      schemaVersion: 1,
      runId: "local-safe-python-scaffold",
      topic: "course/module/topic",
      completion: { selector: "#lesson", attribute: "data-pep-complete", equals: "true" },
      progress: { selector: "#progress", text: "^1 of 1$" },
      routes: { success: route, wrongFirst: route, keyboard: route, sandbox: route },
    })}\n`);
    await writeFile(inputsFile, `${JSON.stringify({ activityValue: `runtime-placeholder-${process.pid}` })}\n`);
    const result = await runPrivateOverlay(context(repository.root), overlayFile, {
      environment: { PEP_QA_PRIVATE_INPUTS_FILE: inputsFile },
    });
    assert.equal(result.result, "pass");
    assert.equal(result.publicBindings.length, 5);
  } finally {
    await rm(repository.root, { recursive: true, force: true });
    await rm(staging, { recursive: true, force: true });
  }
});

test("T10 runs the guided answer-sensitive fixture with a settled incomplete prior in sandbox", { timeout: 300000 }, async () => {
  assert.deepEqual(await runFixture("T10", "guided-answer-sensitive.html", {
    spec: guidedSpec("strict"),
    transformHtml: (html) => html.replace('data-pep-predict="settle"', 'data-pep-predict="strict"'),
  }), []);
});

test("T11 accepts guided setup with a completed non-credit prediction prior", { timeout: 300000 }, async () => {
  assert.deepEqual(await runFixture("T11", "guided-answer-sensitive.html", { spec: guidedSpec("settle") }), []);
});

test("T11 accepts guided setup whose prior settled miss stays incomplete at zero credit", { timeout: 300000 }, async () => {
  assert.deepEqual(await runFixture("T11", "guided-answer-sensitive.html", {
    spec: guidedSpec("strict"),
    transformHtml: (html) => html.replace('data-pep-predict="settle"', 'data-pep-predict="strict"'),
  }), []);
});

test("T11 rejects an incoherent settled grade-zero completion/credit pair", { timeout: 300000 }, async () => {
  const errors = await runFixture("T11", "guided-answer-sensitive.html", {
    spec: guidedSpec("settle"),
    transformHtml: (html) => html.replace('data-pep-predict="settle"', 'data-pep-predict="false-credit"'),
  });
  assertPreciseFailure(errors, "T11", /incoherent completion\/credit pair/);
});

test("Java answer scanning and language-to-editor matching guard declared tasks", { timeout: 120000 }, async () => {
  const baseHtml = await readFile(path.join(fixtures, "guided-answer-sensitive.html"), "utf8");
  const javaHtml = declareAnswerTasks(baseHtml, [["task-2", "java", "reverse"], ["task-3", "java", "summarize"]]);
  const spec = { answerSafety: { privateSuccessProof: true, tasks: structuredClone(JAVA_GUIDED_TASKS) } };
  assert.deepEqual(await validateLearnerGuidance(javaHtml, spec), []);

  const completed = "int[] reverse(int[] values) { int[] out = new int[values.length]; for (int i = 0; i < values.length; i++) { out[values.length - 1 - i] = values[i]; } return out; }";
  const assignmentBody = "void summarize(int[] values) { total += values.length; }";
  for (const [index, mutation] of [
    javaHtml.replace("Complete the reverse method", `${completed}. Complete the reverse method`),
    javaHtml.replace("<section data-pep-recap>", `<!-- ${completed} -->\n    <section data-pep-recap>`),
    javaHtml.replace("  <script>", `  <p hidden>${completed}</p>\n  <script>`),
    javaHtml.replace("  <script>", `  <p>${Buffer.from(completed).toString("base64")}</p>\n  <script>`),
    javaHtml.replace("(() => {", `(() => {\n      const publicExample = ${JSON.stringify(completed)};`),
    javaHtml.replace("Complete the summarize method", `${assignmentBody}. Complete the summarize method`),
  ].entries()) {
    assert.match(
      (await validateLearnerGuidance(mutation, spec)).join("; "),
      /complete target method implementation/,
      `Java answer mutation ${index} unexpectedly passed`,
    );
  }
  const specWithRoutes = { routes: { success: [{ do: "fill", selector: "#editor-2", value: completed }] }, ...structuredClone(spec) };
  assert.match(
    (await validateLearnerGuidance(javaHtml, specWithRoutes)).join("; "),
    /complete target method implementation/,
    "a completed method in QA strings must fail",
  );
  for (const [index, harmless] of [
    javaHtml.replace("Complete the reverse method", "int[] reverse(int[] values) { return null; }. Complete the reverse method"),
    javaHtml.replace("Complete the reverse method", "int[] helper(int[] values) { int[] out = values.clone(); for (int i = 0; i < out.length; i++) { out[i] += 1; } return out; }. Complete the reverse method"),
    javaHtml.replace("Complete the reverse method", "Call reverse(values) and look at the result. Complete the reverse method"),
  ].entries()) {
    assert.deepEqual(await validateLearnerGuidance(harmless, spec), [], `harmless Java mutation ${index} unexpectedly failed`);
  }

  const pythonLabel = declareAnswerTasks(baseHtml, [["task-2", "python-comprehension", "reverse"]]);
  const pythonSpec = { answerSafety: { tasks: [{ task: "#task-2", language: "python-comprehension", targets: ["reverse"] }] } };
  assert.match((await validateLearnerGuidance(pythonLabel, pythonSpec)).join("; "), /false language label/,
    "a Python label on a Java editor must be rejected");
  const jsxLabel = declareAnswerTasks(baseHtml, [["task-2", "jsx-editor", "App"]]);
  const jsxSpec = { answerSafety: { tasks: [{ task: "#task-2", language: "jsx-editor", targets: ["App"], scan: "none" }] } };
  assert.match((await validateLearnerGuidance(jsxLabel, jsxSpec)).join("; "), /false language label/,
    "a JSX label on a Java editor must be rejected");
  const noEditor = declareAnswerTasks(baseHtml, [["task-4", "java", "reverse"]]);
  const noEditorSpec = { answerSafety: { tasks: [{ task: "#task-4", language: "java", targets: ["reverse"] }] } };
  assert.match((await validateLearnerGuidance(noEditor, noEditorSpec)).join("; "), /requires a matched java editor/,
    "a Java declaration without a Java editor must be rejected");
  const unsupported = declareAnswerTasks(baseHtml, [["task-2", "ruby", "reverse"]]);
  const unsupportedSpec = { answerSafety: { tasks: [{ task: "#task-2", language: "ruby", targets: ["reverse"] }] } };
  assert.match((await validateLearnerGuidance(unsupported, unsupportedSpec)).join("; "),
    /supported, uniquely identified task declarations/,
    "an unsupported language label must be rejected");

  const editorsRenamed = baseHtml.replace("Reverse.java", "App.jsx").replace("Report.java", "load.js");
  const matchedJs = declareAnswerTasks(editorsRenamed, [["task-2", "jsx-editor", "App"], ["task-3", "javascript-editor", "loadBooks"]]);
  const matchedJsSpec = { answerSafety: { privateSuccessProof: true, tasks: [
    { task: "#task-2", language: "jsx-editor", targets: ["App"], scan: "none" },
    { task: "#task-3", language: "javascript-editor", targets: ["loadBooks"], scan: "none" },
  ] } };
  assert.deepEqual(await validateLearnerGuidance(matchedJs, matchedJsSpec), []);
});

test("T08 admits a value-free non-guidance declaration only in the exact python scaffold scope", { timeout: 120000 }, async () => {
  assert.deepEqual(await runT08Document(nonGuidanceScaffoldHtml(), nonGuidanceScaffoldSpec()), []);
});

test("T08 rejects every mismatched non-guidance answer declaration through real intake", { timeout: 180000 }, async () => {
  const duplicateSpec = nonGuidanceScaffoldSpec();
  duplicateSpec.answerSafety.tasks.push(structuredClone(duplicateSpec.answerSafety.tasks[0]));
  const cases = [
    ["missing adapter", nonGuidanceScaffoldHtml({ adapter: null }), nonGuidanceScaffoldSpec(), /exact python-scaffold@3 adapter scope/],
    ["wrong adapter version", nonGuidanceScaffoldHtml({ adapter: "python-scaffold@2" }), nonGuidanceScaffoldSpec(), /exact python-scaffold@3 adapter scope/],
    ["legacy adapter attribute", nonGuidanceScaffoldHtml().replace("data-lesson-editor-adapter", "data-pep-adapter"), nonGuidanceScaffoldSpec(), /exact python-scaffold@3 adapter scope/],
    ["adapter outside target", nonGuidanceScaffoldHtml({ outsideTarget: true }), nonGuidanceScaffoldSpec(), /exact python-scaffold@3 adapter scope/],
    ["missing declaration", nonGuidanceScaffoldHtml({ declaration: false }), nonGuidanceScaffoldSpec(), /HTML and QA must declare/],
    ["duplicate declaration", nonGuidanceScaffoldHtml({ duplicateDeclaration: true }), nonGuidanceScaffoldSpec(), /uniquely identified task declarations/],
    ["missing task id", nonGuidanceScaffoldHtml().replace('id="task-sensitive" ', ""), nonGuidanceScaffoldSpec(), /uniquely identified task declarations/],
    ["duplicate task id", nonGuidanceScaffoldHtml().replace("</main>", '<div id="task-sensitive"></div></main>'), nonGuidanceScaffoldSpec(), /uniquely identified task declarations/],
    ["mismatched target", nonGuidanceScaffoldHtml({ target: "different" }), nonGuidanceScaffoldSpec(), /match one-to-one and exactly/],
    ["mismatched task", nonGuidanceScaffoldHtml(), nonGuidanceScaffoldSpec({ task: "#other-task" }), /match one-to-one and exactly/],
    ["missing spec", nonGuidanceScaffoldHtml(), {}, /HTML and QA must declare/],
    ["duplicate spec", nonGuidanceScaffoldHtml(), duplicateSpec, /match one-to-one and exactly/],
    ["wrong extension", nonGuidanceScaffoldHtml({ extension: "java" }), nonGuidanceScaffoldSpec(), /false language label/],
    ["unknown extension", nonGuidanceScaffoldHtml({ extension: "txt" }), nonGuidanceScaffoldSpec(), /requires a matched python-scaffold editor/],
    ["wrong language", nonGuidanceScaffoldHtml({ language: "python-comprehension" }), {
      answerSafety: { tasks: [{ task: "#task-sensitive", language: "python-comprehension", targets: ["placeholder"] }] },
    }, /exact python-scaffold@3 adapter scope/],
    ["unrelated unenrolled declaration", nonGuidanceScaffoldHtml({ adapter: null, language: "java", extension: "java" }), {
      answerSafety: { tasks: [{ task: "#task-sensitive", language: "java", targets: ["placeholder"] }] },
    }, /exact python-scaffold@3 adapter scope/],
    ["public answer encoding", nonGuidanceScaffoldHtml().replace("Complete the private activity.", "placeholder uses atob(input)."), nonGuidanceScaffoldSpec(), /must not encode, assemble or hash/],
  ];
  for (const [name, html, spec, pattern] of cases) {
    const errors = await runT08Document(html, spec);
    assert.ok(errors.some((item) => pattern.test(item.message)), `${name} unexpectedly passed: ${JSON.stringify(errors)}`);
  }
});

test("T08 preserves guidance-enrolled scaffold and python-comprehension intake", { timeout: 120000 }, async () => {
  const baseHtml = await readFile(path.join(fixtures, "good.html"), "utf8");
  const baseSpec = JSON.parse(await readFile(path.join(fixtures, "qa-paths.json"), "utf8"));
  const scaffoldSpec = structuredClone(baseSpec);
  scaffoldSpec.answerSafety = pythonScaffoldSpec().answerSafety;
  assert.deepEqual(await runT08Document(declarePythonScaffold(baseHtml), scaffoldSpec), []);

  const comprehensionSpec = structuredClone(baseSpec);
  comprehensionSpec.answerSafety = { tasks: [
    { task: "#task-safe", language: "python-comprehension", targets: ["placeholder"] },
  ] };
  const slicingHtml = declareAnswerTasks(baseHtml, [["task-safe", "python-comprehension", "placeholder"]]);
  assert.deepEqual(await runT08Document(slicingHtml, comprehensionSpec), []);
});

test("python-scaffold answer declarations are limited to the identified adapter shell", { timeout: 120000 }, async () => {
  const baseHtml = await readFile(path.join(fixtures, "good.html"), "utf8");
  const scaffoldHtml = declarePythonScaffold(baseHtml);
  const scaffoldSpec = pythonScaffoldSpec();
  assert.deepEqual(await validateLearnerGuidance(scaffoldHtml, scaffoldSpec), []);

  for (const [name, mutation, pattern] of [
    ["missing adapter", declarePythonScaffold(baseHtml, { adapter: null }), /requires the python-scaffold@3 adapter root/],
    ["wrong adapter", declarePythonScaffold(baseHtml, { adapter: "python-scaffold@2" }), /requires the python-scaffold@3 adapter root/],
    ["wrong extension", declarePythonScaffold(baseHtml, { extension: "java" }), /false language label/],
    ["unknown extension", declarePythonScaffold(baseHtml, { extension: "txt" }), /requires a matched python-scaffold editor/],
    ["wrong shell label", declarePythonScaffold(baseHtml, { labelClass: "pep-editor__file" }), /requires a matched python-scaffold editor/],
    ["duplicate adapter root", scaffoldHtml.replace(
      '<span class="le-file">practice.py</span>',
      '<span data-lesson-editor-adapter="python-scaffold@3"><span class="le-file">other.py</span></span><span class="le-file">practice.py</span>',
    ), /requires the python-scaffold@3 adapter root/],
  ]) {
    assert.match((await validateLearnerGuidance(mutation, scaffoldSpec)).join("; "), pattern, `${name} unexpectedly passed`);
  }

  const comprehensionHtml = declarePythonScaffold(baseHtml, { language: "python-comprehension" });
  const comprehensionSpec = { answerSafety: { tasks: [
    { task: "#task-safe", language: "python-comprehension", targets: ["placeholder"] },
  ] } };
  assert.match(
    (await validateLearnerGuidance(comprehensionHtml, comprehensionSpec)).join("; "),
    /false language label for its adapter/,
    "the scaffold adapter must not masquerade as python-comprehension",
  );

  const slicingHtml = declareAnswerTasks(baseHtml, [["task-safe", "python-comprehension", "placeholder"]]);
  assert.deepEqual(await validateLearnerGuidance(slicingHtml, comprehensionSpec), [], "python-comprehension behavior must remain unchanged");
  assert.match((await validateLearnerGuidance(scaffoldHtml)).join("; "), /HTML and QA must declare/);
  assert.match((await validateLearnerGuidance(baseHtml, scaffoldSpec)).join("; "), /HTML and QA must declare/);
  const mismatchedSpec = pythonScaffoldSpec();
  mismatchedSpec.answerSafety.tasks[0].task = "#task-explain";
  assert.match((await validateLearnerGuidance(scaffoldHtml, mismatchedSpec)).join("; "), /match one-to-one and exactly/);
  const duplicateDeclaration = scaffoldHtml.replace(
    '<span class="le-file">practice.py</span>',
    '<span id="task-safe" data-pep-answer-sensitive="python-scaffold" data-pep-answer-targets="placeholder"></span><span class="le-file">practice.py</span>',
  );
  assert.match((await validateLearnerGuidance(duplicateDeclaration, scaffoldSpec)).join("; "), /uniquely identified task declarations/);

  const unenrolled = scaffoldHtml.replace(" data-pep-guidance-contract", "");
  assert.match((await validateLearnerGuidance(unenrolled)).join("; "), /HTML and QA must declare/,
    "a non-guidance scaffold declaration must still have a matching QA spec");
});

test("private overlay proves multi-task Java success only when every declared editor genuinely passes", { timeout: 360000 }, async () => {
  const spec = guidedSpec("strict");
  spec.answerSafety = { privateSuccessProof: true, tasks: structuredClone(JAVA_GUIDED_TASKS) };
  const repository = await makeOverlayRepository("guided-answer-sensitive.html", {
    spec,
    transformHtml: (html) => declareAnswerTasks(
      html.replace('data-pep-predict="settle"', 'data-pep-predict="strict"'),
      [["task-2", "java", "reverse"], ["task-3", "java", "summarize"]],
    ),
  });
  const staging = await mkdtemp(path.join(os.tmpdir(), "pep-private-overlay-java-"));
  const overlayFile = path.join(staging, "overlay.json");
  const inputsFile = path.join(staging, "inputs.json");
  const environment = { PEP_QA_PRIVATE_INPUTS_FILE: inputsFile };
  const privateReverse = `int[] out = values.clone(); runtime only ${process.pid}`;
  const privateSummarize = `return totalOf(values); runtime only ${process.pid}`;
  try {
    const passRoute = guidedOverlayRoutes(
      [{ do: "fill", selector: "#editor-2", valueFrom: "private:reverse" }, { do: "click", selector: "#check-2" }],
      [{ do: "fill", selector: "#editor-3", valueFrom: "private:summarize" }, { do: "click", selector: "#check-3" }],
    );
    const overlay = {
      schemaVersion: 1,
      runId: "local-safe-java-multi",
      topic: "course/module/topic",
      completion: { selector: "#lesson", attribute: "data-pep-complete", equals: "true" },
      progress: { selector: "#progress", text: "^4 of 4 done$" },
      routes: {
        success: passRoute,
        wrongFirst: guidedOverlayRoutes(
          [
            { do: "fill", selector: "#editor-2", value: "// TODO wrong overlay attempt" },
            { do: "click", selector: "#check-2" },
            { do: "fill", selector: "#editor-2", valueFrom: "private:reverse" },
            { do: "click", selector: "#check-2" },
          ],
          [{ do: "fill", selector: "#editor-3", valueFrom: "private:summarize" }, { do: "click", selector: "#check-3" }],
        ),
        keyboard: passRoute,
        sandbox: passRoute,
      },
    };
    await writeFile(overlayFile, `${JSON.stringify(overlay)}\n`);
    await writeFile(inputsFile, `${JSON.stringify({ reverse: privateReverse, summarize: privateSummarize })}\n`);

    await assert.rejects(
      runPrivateOverlay(context(repository.root), overlayFile, { environment: {} }),
      /PEP_QA_PRIVATE_INPUTS_FILE is required/,
      "a missing private input source must be refused before any browser run",
    );

    const result = await runPrivateOverlay(context(repository.root), overlayFile, { environment });
    assert.equal(result.result, "pass");
    assert.equal(result.publicBindings.length, 5);
    const serialized = JSON.stringify(result);
    assert.ok(!serialized.includes(privateReverse) && !serialized.includes(privateSummarize), "overlay result must not echo private values");

    const receiptFile = path.join(repository.root, "authoring/evidence/course/module/topic/qa-receipt.json");
    await writeFile(receiptFile, `${JSON.stringify({
      privateSuccessProof: {
        record: `validated at ${result.commit} by run ${result.runId}`,
        commit: result.commit,
        runId: result.runId,
        result: "pass",
        publicBindings: result.publicBindings,
      },
    })}\n`);
    for (const args of [["add", "."], ["-c", "user.name=QA", "-c", "user.email=qa@example.invalid", "commit", "-qm", "record private proof"]]) {
      const commitResult = spawnSync("git", args, { cwd: repository.root, encoding: "utf8" });
      assert.equal(commitResult.status, 0, commitResult.stderr);
    }
    assert.deepEqual(await validateQaPrivateProofs(repository.root, path.join(repository.root, "authoring/evidence/course")), []);
    const artifactFile = path.join(repository.root, "course/module/topic/artifact.html");
    const artifactBytes = await readFile(artifactFile);
    await writeFile(artifactFile, Buffer.concat([artifactBytes, Buffer.from("<!-- drift -->\n")]));
    assert.match(
      (await validateQaPrivateProofs(repository.root, path.join(repository.root, "authoring/evidence/course"))).map((item) => item.message).join("; "),
      /stale private-success public binding/,
      "public drift after the proof commit must invalidate the receipt",
    );
    await writeFile(artifactFile, artifactBytes);

    const mixed = structuredClone(overlay);
    const failEditorThree = [
      { do: "fill", selector: "#editor-3", value: "// TODO mixed overlay miss" },
      { do: "click", selector: "#check-3" },
      { do: "click", selector: "#check-3" },
    ];
    mixed.routes.success = guidedOverlayRoutes(
      [{ do: "fill", selector: "#editor-2", valueFrom: "private:reverse" }, { do: "click", selector: "#check-2" }],
      failEditorThree,
    );
    await writeFile(overlayFile, `${JSON.stringify(mixed)}\n`);
    await assert.rejects(
      runPrivateOverlay(context(repository.root), overlayFile, { environment }),
      (error) => /private success route failed; no private values were recorded/.test(error.message) &&
        !error.message.includes(privateReverse) && !error.message.includes(privateSummarize),
      "a mixed pass/fail run must be refused without echoing private values",
    );
  } finally {
    await rm(repository.root, { recursive: true, force: true });
    await rm(staging, { recursive: true, force: true });
  }
});

test("private overlay rejects settle-as-complete false credit even when the page claims completion", { timeout: 300000 }, async () => {
  const spec = guidedSpec("settle");
  spec.answerSafety = { privateSuccessProof: true, tasks: structuredClone(JAVA_GUIDED_TASKS) };
  const repository = await makeOverlayRepository("guided-answer-sensitive.html", {
    spec,
    transformHtml: (html) => declareAnswerTasks(
      html.replace('data-pep-editor-engine="strict"', 'data-pep-editor-engine="false-credit"'),
      [["task-2", "java", "reverse"], ["task-3", "java", "summarize"]],
    ),
  });
  const staging = await mkdtemp(path.join(os.tmpdir(), "pep-private-overlay-false-credit-"));
  const overlayFile = path.join(staging, "overlay.json");
  const inputsFile = path.join(staging, "inputs.json");
  const environment = { PEP_QA_PRIVATE_INPUTS_FILE: inputsFile };
  const privateReverse = `int[] out = values.clone(); runtime only ${process.pid}`;
  try {
    await writeFile(inputsFile, `${JSON.stringify({ reverse: privateReverse })}\n`);
    const missTwice = (editor, check) => [
      { do: "fill", selector: editor, value: "// TODO settled overlay miss" },
      { do: "click", selector: check },
      { do: "click", selector: check },
    ];
    const allEditorsFail = guidedOverlayRoutes(missTwice("#editor-2", "#check-2"), missTwice("#editor-3", "#check-3"));
    const overlay = {
      schemaVersion: 1,
      runId: "local-safe-false-credit",
      topic: "course/module/topic",
      completion: { selector: "#lesson", attribute: "data-pep-complete", equals: "true" },
      progress: { selector: "#progress", text: "^4 of 4 done$" },
      routes: { success: allEditorsFail, wrongFirst: allEditorsFail, keyboard: allEditorsFail, sandbox: allEditorsFail },
    };
    await writeFile(overlayFile, `${JSON.stringify(overlay)}\n`);
    await assert.rejects(
      runPrivateOverlay(context(repository.root), overlayFile, { environment }),
      /private success route failed; no private values were recorded/,
      "an all-editor-fail run must be refused even when page completion claims success",
    );
    const mixed = structuredClone(overlay);
    mixed.routes.success = guidedOverlayRoutes(
      [{ do: "fill", selector: "#editor-2", valueFrom: "private:reverse" }, { do: "click", selector: "#check-2" }],
      missTwice("#editor-3", "#check-3"),
    );
    mixed.routes.wrongFirst = mixed.routes.success;
    mixed.routes.keyboard = mixed.routes.success;
    mixed.routes.sandbox = mixed.routes.success;
    await writeFile(overlayFile, `${JSON.stringify(mixed)}\n`);
    await assert.rejects(
      runPrivateOverlay(context(repository.root), overlayFile, { environment }),
      (error) => /private success route failed; no private values were recorded/.test(error.message) && !error.message.includes(privateReverse),
      "false credit on a failed declared editor must be caught",
    );
  } finally {
    await rm(repository.root, { recursive: true, force: true });
    await rm(staging, { recursive: true, force: true });
  }
});

test("private overlay accepts matched jsx/javascript declarations and blocks exact private-value leaks", { timeout: 300000 }, async () => {
  const jsTasks = [
    { task: "#task-2", language: "jsx-editor", targets: ["App"], scan: "none" },
    { task: "#task-3", language: "javascript-editor", targets: ["loadBooks"], scan: "none" },
  ];
  const transformHtml = (html) => declareAnswerTasks(
    html.replace('data-pep-predict="settle"', 'data-pep-predict="strict"')
      .replace("Reverse.java", "App.jsx").replace("Report.java", "load.js"),
    [["task-2", "jsx-editor", "App"], ["task-3", "javascript-editor", "loadBooks"]],
  );
  const makeSpec = () => {
    const spec = guidedSpec("strict");
    spec.answerSafety = { privateSuccessProof: true, tasks: structuredClone(jsTasks) };
    return spec;
  };
  const privateApp = `export function App() { return <Done pid={${process.pid}} />; }`;
  const privateLoad = `return fetch("/books").then((response) => response.json()); // runtime only ${process.pid}`;
  const passRoute = guidedOverlayRoutes(
    [{ do: "fill", selector: "#editor-2", valueFrom: "private:app" }, { do: "click", selector: "#check-2" }],
    [{ do: "fill", selector: "#editor-3", valueFrom: "private:load" }, { do: "click", selector: "#check-3" }],
  );
  const overlay = {
    schemaVersion: 1,
    runId: "local-safe-js-editors",
    topic: "course/module/topic",
    completion: { selector: "#lesson", attribute: "data-pep-complete", equals: "true" },
    progress: { selector: "#progress", text: "^4 of 4 done$" },
    routes: { success: passRoute, wrongFirst: passRoute, keyboard: passRoute, sandbox: passRoute },
  };
  const staging = await mkdtemp(path.join(os.tmpdir(), "pep-private-overlay-js-"));
  const overlayFile = path.join(staging, "overlay.json");
  const inputsFile = path.join(staging, "inputs.json");
  const environment = { PEP_QA_PRIVATE_INPUTS_FILE: inputsFile };
  await writeFile(overlayFile, `${JSON.stringify(overlay)}\n`);
  await writeFile(inputsFile, `${JSON.stringify({ app: privateApp, load: privateLoad })}\n`);
  const repository = await makeOverlayRepository("guided-answer-sensitive.html", { spec: makeSpec(), transformHtml });
  try {
    const result = await runPrivateOverlay(context(repository.root), overlayFile, { environment });
    assert.equal(result.result, "pass");
    assert.ok(!JSON.stringify(result).includes(privateApp), "overlay result must not echo private values");
  } finally {
    await rm(repository.root, { recursive: true, force: true });
  }
  const leaking = await makeOverlayRepository("guided-answer-sensitive.html", {
    spec: makeSpec(),
    transformHtml,
    markdownText: `# Companion notes\n\nReference: ${privateApp}\n`,
  });
  try {
    await assert.rejects(
      runPrivateOverlay(context(leaking.root), overlayFile, { environment }),
      (error) => /appears in public topic bytes; no private values were recorded/.test(error.message) &&
        !error.message.includes(privateApp) && !error.message.includes(privateLoad),
      "an exact private value in a committed companion surface must be refused without echoing it",
    );
  } finally {
    await rm(leaking.root, { recursive: true, force: true });
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
  baseSpec.answerSafety = { tasks: [{ task: "#task-safe", language: "python-comprehension", targets: ["picked"] }] };
  assert.deepEqual(await validateLearnerGuidance(baseHtml, baseSpec), []);
  const optedInSpec = structuredClone(baseSpec);
  optedInSpec.answerSafety.privateSuccessProof = true;
  assert.deepEqual(await validateLearnerGuidance(baseHtml, optedInSpec), []);
  const multiHtml = baseHtml.replace(
    'id="task-explain" data-pep-task',
    'id="task-explain" data-pep-task data-pep-answer-sensitive="python-comprehension" data-pep-answer-targets="explained"',
  );
  const multiSpec = structuredClone(baseSpec);
  multiSpec.answerSafety.tasks.push({ task: "#task-explain", language: "python-comprehension", targets: ["explained"] });
  assert.deepEqual(await validateLearnerGuidance(multiHtml, multiSpec), []);
  assert.match(
    (await validateLearnerGuidance(multiHtml, baseSpec)).join("; "),
    /must match one-to-one and exactly/,
    "an undeclared second HTML answer-sensitive task must fail the one-to-one comparison",
  );
  assert.match(
    (await validateLearnerGuidance(baseHtml, multiSpec)).join("; "),
    /must match one-to-one and exactly/,
    "a QA declaration without its HTML marker must fail the one-to-one comparison",
  );
  const secondTargetLeak = multiHtml.replace(
    "Explain in the field below why your first action stays local.",
    "explained = [entry for entry in records]. Explain in the field below why your first action stays local.",
  );
  assert.match(
    (await validateLearnerGuidance(secondTargetLeak, multiSpec)).join("; "),
    /complete target comprehension expression/,
    "the second declaration must scan its own targets",
  );
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

test("Python answer scanner handles annotation-only target candidates", () => {
  const scanner = path.resolve("authoring/tools/qa/python-answer-scan.py");
  const scan = (value, answerBearing = false) => {
    const result = spawnSync("python3", [scanner], {
      input: JSON.stringify({
        targets: ["result"],
        sources: [{ value, answerBearing }],
      }),
      encoding: "utf8",
    });
    assert.equal(result.status, 0, result.stderr);
    return JSON.parse(result.stdout).findings;
  };

  for (const source of [
    "result: int",
    "Expected result: all techniques found.",
    "result: int = 0",
    "other: int",
    "result = [p: p for p in prices]",
  ]) {
    assert.deepEqual(scan(source), [], `${source} must remain a normal non-finding`);
  }
  assert.deepEqual(scan("result = [x for x in values]"), [0]);
  assert.deepEqual(scan("result: list[int] = [x for x in values]"), [0]);
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

function steppedOptionalSpec() {
  const success = [
    { do: "click", selector: "#check-one" },
    { do: "click", selector: "#next" },
    { do: "click", selector: "#check-two" },
  ];
  return {
    schemaVersion: 1,
    completion: { selector: "#lesson", attribute: "data-pep-complete", equals: "true" },
    progress: { selector: "#progress", text: "^2 of 2$" },
    routes: {
      success,
      wrongFirst: [{ do: "click", selector: "#wrong-one" }, ...success],
      wrongTwice: [{ do: "click", selector: "#wrong-one" }, { do: "click", selector: "#wrong-one" }, ...success],
    },
    simulatorEdges: [{
      name: "a wrong answer leaves the step open",
      actions: [
        { do: "click", selector: "#wrong-one" },
        { do: "expectAttribute", selector: "#lesson", attribute: "data-pep-complete", equals: "false" },
      ],
    }],
    restart: {
      actions: [{ do: "click", selector: "#check-one" }, { do: "click", selector: "#restart" }, { do: "click", selector: "#check-one" }],
      credit: { selector: "#progress", text: "^1 of 2$" },
    },
    keyboard: success,
  };
}

test("T11 reaches activity-owned optionals hidden in non-current stepped activities", { timeout: 120000 }, async () => {
  assert.deepEqual(await runFixture("T11", "stepped-optional.html", { spec: steppedOptionalSpec() }), []);
});

test("T11 rejects a later-step stepped optional whose action changes required state", { timeout: 120000 }, async () => {
  const errors = await runFixture("T11", "stepped-optional.html", {
    spec: steppedOptionalSpec(),
    transformHtml: (html) => html.replace(
      "<p data-pep-success-criteria>",
      "<button type=\"button\" onclick=\"document.getElementById('check-two').click()\">Mark done</button><p data-pep-success-criteria>",
    ),
  });
  assertPreciseFailure(errors, "T11", /optional disclosure changed required state/);
});

test("T11 refuses a stepped optional whose owning activity the success route never reaches", { timeout: 120000 }, async () => {
  const errors = await runFixture("T11", "stepped-optional.html", {
    spec: steppedOptionalSpec(),
    transformHtml: (html) => html.replace(
      "    <p id=\"feedback\" aria-live=\"polite\"></p>",
      "    <section data-step=\"3\" aria-labelledby=\"step-3-h\" hidden><h2 id=\"step-3-h\">Never shown</h2><details class=\"pep-optional pep-optional--challenge\" data-pep-optional=\"challenge\" data-section-skip><summary>Challenge (optional)</summary><div class=\"pep-optional__body\"><p data-pep-optional-time>Optional time: about 1 minute</p><p data-pep-success-criteria>Success criteria: none.</p></div></details></section>\n    <p id=\"feedback\" aria-live=\"polite\"></p>",
    ),
  });
  assertPreciseFailure(errors, "T11", /owner step 3 is never reached by the success route/);
});

// Syntax-aware leak comparison. Every value here is a sentinel generated for this run: it answers no task,
// and neither the value nor anything derived from it may reach an error, log or file outside the temporary repository.
function leakSentinel() {
  const id = `${process.pid}${Date.now().toString(36)}`;
  return `const sentinel${id} = (n) => n > 1 && "s<${id}>&";\nconsole.log(sentinel${id}(2));`;
}

function characterReferences(value, form) {
  const named = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" };
  return [...value].map((char) => {
    if (form === "named") return named[char] ?? char;
    if (!/[&<>"=\n]/u.test(char)) return char;
    const code = char.codePointAt(0);
    return form === "decimal" ? `&#${code};` : `&#x${code.toString(16)};`;
  }).join("");
}

async function leakOutcome(value, options = {}) {
  const repository = await makeOverlayRepository("answer-sensitive-private.html", { spec: options.spec ?? answerSensitiveSpec(), transformHtml: options.transformHtml });
  const staging = await mkdtemp(path.join(os.tmpdir(), "pep-private-overlay-leak-"));
  const overlayFile = path.join(staging, "overlay.json");
  const inputsFile = path.join(staging, "inputs.json");
  const route = [{ do: "fill", selector: "#private-input", valueFrom: "private:value" }, { do: "click", selector: "#private-complete" }];
  await writeFile(overlayFile, `${JSON.stringify({
    schemaVersion: 1,
    runId: "local-leak-comparison",
    topic: "course/module/topic",
    completion: { selector: "#lesson", attribute: "data-pep-complete", equals: "true" },
    progress: { selector: "#progress", text: "^1 of 1$" },
    routes: { success: route, wrongFirst: route, keyboard: route, sandbox: route },
  })}\n`);
  await writeFile(inputsFile, `${JSON.stringify({ value })}\n`);
  try {
    await runPrivateOverlay(context(repository.root), overlayFile, { environment: { PEP_QA_PRIVATE_INPUTS_FILE: inputsFile } });
    return "passed";
  } catch (cause) {
    assert.ok(!cause.message.includes(value), "a refusal must not echo the private value");
    return /appears in public topic bytes; no private values were recorded/u.test(cause.message) ? "refused" : "failed";
  } finally {
    await rm(repository.root, { recursive: true, force: true });
    await rm(staging, { recursive: true, force: true });
  }
}

const inPage = (text) => (html) => html.replace("</main>", `${text}</main>`);

test("private overlay refuses a private value written as HTML character references in the page", { timeout: 300000 }, async () => {
  const value = leakSentinel();
  for (const form of ["named", "decimal", "hex"]) {
    const encoded = characterReferences(value, form);
    assert.notEqual(encoded, value);
    assert.ok(!encoded.includes(value));
    for (const [surface, markup] of [
      ["text", `<pre>${encoded}</pre>`],
      ["attribute", `<p title="${encoded}">note</p>`],
      ["template", `<template><pre>${encoded}</pre></template>`],
      ["noscript", `<noscript><pre>${encoded}</pre></noscript>`],
    ]) {
      assert.equal(await leakOutcome(value, { transformHtml: inPage(markup) }), "refused", `${form} references in page ${surface}`);
    }
  }
});

test("private overlay refuses a multiline private value JSON-escaped in qa-paths", { timeout: 180000 }, async () => {
  const value = leakSentinel();
  const asString = answerSensitiveSpec();
  asString.simulatorEdges[0].name = value;
  assert.ok(!JSON.stringify(asString).includes(value));
  assert.equal(await leakOutcome(value, { spec: asString }), "refused", "escaped in a string value");
  const nested = answerSensitiveSpec();
  nested.routes.success.push({ do: "expectText", selector: "#feedback", text: value });
  assert.equal(await leakOutcome(value, { spec: nested }), "refused", "escaped in a nested route string");
});

test("private leak comparison keeps raw exact scanning and claims no transformed leakage", { timeout: 300000 }, async () => {
  const value = leakSentinel();
  assert.equal(await leakOutcome(value), "passed", "a clean topic passes");
  assert.equal(await leakOutcome(value, { transformHtml: inPage(`<!-- ${value} -->`) }), "refused", "raw value in a comment");
  assert.equal(await leakOutcome(value, { transformHtml: inPage(`<script>/* ${value} */</script>`) }), "refused", "raw value in a script");
  // These stay with independent review: decoding runs once, by syntax, and normalizes nothing else.
  const doubled = characterReferences(characterReferences(value, "named"), "named");
  assert.equal(await leakOutcome(value, { transformHtml: inPage(`<pre>${doubled}</pre>`) }), "passed", "doubly encoded text decodes only once");
  const renamed = value.replaceAll("sentinel", "renamed");
  assert.equal(await leakOutcome(value, { transformHtml: inPage(`<pre>${characterReferences(renamed, "named")}</pre>`) }), "passed", "a renamed form is not an exact match");
  assert.equal(await leakOutcome(value, { transformHtml: inPage(`<pre>${Buffer.from(value).toString("base64")}</pre>`) }), "passed", "an alternate encoding is not decoded");
});
