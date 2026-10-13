import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import MarkdownIt from "markdown-it";
import { run as runT01 } from "../tools/checks/T01-schema.mjs";
import { run as runT09 } from "../tools/checks/T09-offline.mjs";
import { run as runT10 } from "../tools/checks/T10-sandbox.mjs";
import { run as runT11 } from "../tools/checks/T11-behavior.mjs";
import { run as runT12 } from "../tools/checks/T12-accessibility.mjs";
import { run as runT13 } from "../tools/checks/T13-responsive.mjs";
import { run as runT18 } from "../tools/checks/T18-markdown-pdf.mjs";
import { markdownFromHtml } from "../tools/qa/md-from-html.mjs";
import { pdfFromMarkdown } from "../tools/qa/pdf-from-md.mjs";

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
  await writeFile(
    path.join(root, "course", "course.json"),
    `${JSON.stringify({ id: "course", moduleOrder: ["module"] }, null, 2)}\n`,
  );
  await writeFile(
    path.join(root, "course", "module", "module.json"),
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
  await writeFile(path.join(topicRoot, "topic.json"), `${JSON.stringify(topic, null, 2)}\n`);
  const spec = options.spec ?? JSON.parse(await readFile(path.join(fixtures, "qa-paths.json"), "utf8"));
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
  test(`${rule} accepts the known-good page`, { timeout: 60000 }, async () => {
    assert.deepEqual(await runFixture(rule, "good.html"), []);
  });
}

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
      '<main id="lesson" data-pep-complete="false">',
      '<main id="lesson" data-pep-complete="false"><div style="border: 2px solid transparent"></div>',
    ),
  });
  assert.deepEqual(errors, []);
});

test("T12 catches a rendered low-contrast border", { timeout: 60000 }, async () => {
  const errors = await runFixture("T12", "good.html", {
    transformHtml: (html) => html.replace(
      '<main id="lesson" data-pep-complete="false">',
      '<main id="lesson" data-pep-complete="false"><div id="low-border" style="border: 2px solid #ddd">Bordered panel</div>',
    ),
  });
  assertPreciseFailure(errors, "T12", /light contrast: #low-border border .* < 3/);
});

test("T12 accepts a contrasting focus-within ancestor indicator", { timeout: 60000 }, async () => {
  const errors = await runFixture("T12", "good.html", {
    transformHtml: (html) => html
      .replace(
        "</style>",
        "#success:focus, #success:focus-visible { outline: none; } #focus-wrap:focus-within { box-shadow: 0 0 0 3px #005fcc; } </style>",
      )
      .replace(
        '<button id="success" data-essential>Finish correctly</button>',
        '<div id="focus-wrap"><button id="success" data-essential>Finish correctly</button></div>',
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
  assertPreciseFailure(errors, "T12", /#success has no visible focus indicator/);
});

test("T12 catches low contrast in forced dark mode", { timeout: 60000 }, async () => {
  const simple = JSON.parse(await readFile(path.join(fixtures, "qa-paths.json"), "utf8"));
  for (const name of Object.keys(simple.routes)) simple.routes[name] = [{ do: "click", selector: "#success" }];
  simple.keyboard = [{ do: "click", selector: "#success" }];
  simple.progress = simple.completion;
  const errors = await runFixture("T12", "low-contrast-dark.html", { spec: simple });
  assertPreciseFailure(errors, "T12", /dark contrast|color-contrast|axe serious\/critical/);
});

test("T13 skips zero-size hidden live text and controls in closed details", { timeout: 60000 }, async () => {
  const errors = await runFixture("T13", "good.html", {
    transformHtml: (html) => html.replace(
      '<main id="lesson" data-pep-complete="false">',
      '<main id="lesson" data-pep-complete="false"><div id="empty-live" aria-live="polite" style="height:0;overflow:hidden"><span hidden>Old feedback</span></div><details><summary>Optional details</summary><button style="width:2000px">Closed action</button></details>',
    ),
  });
  assert.deepEqual(errors, []);
});

test("T13 catches visibly clipped essential text", { timeout: 60000 }, async () => {
  const errors = await runFixture("T13", "good.html", {
    transformHtml: (html) => html.replace(
      '<main id="lesson" data-pep-complete="false">',
      '<main id="lesson" data-pep-complete="false"><div style="width:120px;overflow:hidden"><p id="clipped-text" data-essential style="width:300px">Visible essential text is clipped</p></div>',
    ),
  });
  assertPreciseFailure(errors, "T13", /desktop clipped essentials: clipped-text/);
});

test("T13 catches horizontal overflow at 400 px", { timeout: 60000 }, async () => {
  const errors = await runFixture("T13", "horizontal-overflow.html");
  assertPreciseFailure(errors, "T13", /mobile horizontal overflow: 500 > 400/);
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
    const topic = JSON.parse(await readFile(path.join(repository.topicRoot, "topic.json"), "utf8"));
    topic.artifacts.pdf.status = "present";
    await writeFile(
      path.join(repository.topicRoot, "topic.json"),
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
