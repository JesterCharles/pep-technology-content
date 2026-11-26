#!/usr/bin/env node
// Assembles each crud-aggregates-and-joins artifact.html from shared module bytes and the topic's own sources:
//   engine.css      the page stylesheet, including the unchanged lesson-editor shell.css block;
//   engine.js       the lesson-editor@3 shell.js block and the sql-practice@1 adapter, copied unchanged;
//   controller.js   the sql-practice@1 page controller shared by every page of this module;
//   src/<topic>.body.html  the topic's learner markup (main and the no-JavaScript banner);
//   src/<topic>.topic.js   the topic's SQL_TABLES and TOPIC data.
// Metadata comes from the catalog topic.json and course.json; each fragment's sha256 is stamped in a meta tag.
// Body macros: {{MINUTES}} is the topic's aboutLabel. Run from the repository root:
//   node authoring/evidence/sql-jdbc-foundations/crud-aggregates-and-joins/page-build/build.mjs [--check]
import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "../../../../..");
const course = "sql-jdbc-foundations";
const moduleId = "crud-aggregates-and-joins";
const check = process.argv.includes("--check");
const sha = (s) => createHash("sha256").update(s).digest("hex");
const read = (f) => readFile(path.join(here, f), "utf8");
const escAttr = (s) => String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

const css = await read("engine.css");
const engine = await read("engine.js");
const controller = await read("controller.js");
const shellOpen = "/* lesson-editor@3 shell.js head */\n";
const shellClose = "/* /lesson-editor shell.js */\n";
const shell = engine.slice(0, engine.indexOf(shellClose) + shellClose.length);
const adapter = engine.slice(shell.length);
if (!shell.startsWith(shellOpen)) throw new Error("engine.js must start with the lesson-editor shell block");

// Body macros, expanded at build time so every page carries the same editor and navigation markup:
//   {{MINUTES}}                      the topic's aboutLabel;
//   <!--pep:nav-->                   the activity navigation group (Restart, Previous, Next) that script moves
//                                    to the foot of the current workspace;
//   <!--pep:editor n="2" file="x.sql" legend="..." alt="..."-->  one lesson-editor fieldset for activity n.
const attrs = (s) => Object.fromEntries([...s.matchAll(/(\w+)="([^"]*)"/g)].map((m) => [m[1], m[2]]));
const LIMITS = [
  "Runs SELECT (with JOIN or LEFT JOIN ... ON, WHERE, GROUP BY, HAVING, ORDER BY and DISTINCT), INSERT with VALUES or a SELECT, UPDATE and DELETE, each with optional RETURNING, on the sample tables shown on this page. Functions: count, sum, avg, min, max, coalesce, round, lower, upper, length, and generate_series in FROM.",
  "Every Run starts again from the starting rows. Statements run in order, like a script file in psql: an ERROR stops only its own statement.",
  "ERROR and DETAIL lines use PostgreSQL's own wording; psql's LINE pointer and most HINT lines are left out.",
  "Anything else is marked <em>Not in this practice editor</em>: a limit of this page, not a sign that your SQL is wrong. psql commands such as <code>\\copy</code>, transactions and CREATE TABLE are not available here.",
  "Text sorts by character code here; a real server sorts by its collation, so mixed-case text can sort differently.",
  "Run is deterministic and bounded: no network, no files and no real database.",
];
function editor({ n, file, legend, alt }) {
  if (!n || !file || !legend || !alt) throw new Error("pep:editor needs n, file, legend and alt");
  const e = `ed${n}`;
  return `<div class="pep-js-only">
<fieldset class="le" id="${e}" data-interaction="explore" data-pep-explore aria-describedby="task-${n}" data-lesson-editor="3" data-lesson-editor-adapter="sql-practice@1" data-lesson-editor-source="head" data-le-state="loading" data-static-alt="${alt}">
<legend>${legend}</legend>
<div class="le-bar"><span class="le-file">${file}</span><span class="le-badge">Practice editor: follows PostgreSQL on this page's sample tables</span></div>
<div class="le-main"><pre class="le-gutter" aria-hidden="true">1</pre><label class="vh" for="${e}-code">Code editor for ${file}</label><textarea id="${e}-code" class="le-code" spellcheck="false" autocapitalize="off" autocomplete="off" autocorrect="off" wrap="off" aria-describedby="${e}-keys"></textarea></div>
<div class="le-actions"><button type="button" class="primary le-run" id="${e}-run">Run</button><button type="button" class="ghost le-reset" id="${e}-reset">Reset code</button><p class="le-keys" id="${e}-keys">In the editor: Tab indents, Shift+Tab outdents, Ctrl+Enter (Cmd+Enter on a Mac) runs. To leave it, press Escape, then Tab.</p></div>
<div class="le-tabs" role="tablist" aria-label="Editor panels for ${file}"><button type="button" role="tab" id="${e}-tab-p" aria-controls="${e}-p" aria-selected="true">Problems</button><button type="button" role="tab" id="${e}-tab-o" aria-controls="${e}-o" aria-selected="false" tabindex="-1">Output</button></div>
<div class="le-problems" role="tabpanel" id="${e}-p" aria-labelledby="${e}-tab-p" tabindex="0"><ul><li class="p-none">Loading the editor...</li></ul></div>
<div class="le-output" role="tabpanel" id="${e}-o" aria-labelledby="${e}-tab-o" tabindex="0" hidden><pre>Loading the editor...</pre></div>
<div class="le-status"><span class="le-pos">Ln 1, Col 1</span><span class="le-count"></span><span>Spaces: 4</span><span>SQL practice editor</span><span class="le-escnote">Tab now leaves the editor</span><span class="le-live" aria-live="polite"></span></div>
<details class="le-limits" data-section-skip><summary>What this practice editor can and cannot do</summary><ul>${LIMITS.map((item) => `<li>${item}</li>`).join("")}</ul></details>
</fieldset>
</div>`;
}
const NAV = `<div class="pep-activity-actions pep-js-only" role="group" aria-label="Activity navigation" data-pep-activity-nav><button type="button" class="ghost" id="reset" data-pep-reset aria-describedby="reset-help">Restart activity</button><span class="vh" id="reset-help">Clears only this activity; your other activities keep their work.</span><button type="button" class="ghost" id="previous-activity" data-pep-previous disabled>Previous activity</button><button type="button" class="primary" id="next-activity" data-pep-next disabled>Next activity</button></div>`;
const ICON = '<svg class="pep-objectives__icon" viewBox="0 0 20 20" aria-hidden="true" focusable="false"><circle cx="10" cy="10" r="8.25" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M10 9v5" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/><circle cx="10" cy="6.25" r="1.1" fill="currentColor"/></svg>';
//   <!--pep:topicbar n="4"-->         the topic bar: title, progress and the Topic objectives from topic.json;
//   <!--pep:path titles="A|B|C|D"-->  the lesson path, authored after the topic bar as the no-JavaScript contents;
//   <!--pep:before--> <!--pep:after--> <!--pep:navslot-->  the per-activity slots that script fills;
//   <!--pep:predict-confidence--> <!--pep:apply-confidence-->  the confidence row and its check button.
function topicbar(topic, { n }) {
  const count = Number(n);
  const segs = Array.from({ length: count }, (_, i) => `<span class="seg${i ? "" : " is-current"}"></span>`).join("");
  return `<header class="pep-topicbar">
<h1 id="page-title">${topic.title}</h1>
<div class="pep-topicbar__progress" id="progress" data-pep-progress><span id="prog-text">Activity 1 of ${count} · 0 of ${count} done · about ${topic.minutes.aboutLabel} min</span><span class="pep-progress" aria-hidden="true">${segs}</span></div>
<details class="pep-objectives" data-pep-objectives><summary aria-controls="objectives-body">${ICON}Topic objectives</summary><div id="objectives-body"><ul>${topic.objectives.map((o) => `<li>${o.text}</li>`).join("")}</ul></div></details>
</header>`;
}
function lessonPath({ titles }) {
  const rows = titles.split("|").map((title, i) => `<li class="pep-path__row" data-pep-path-row><a class="pep-path__link" id="step-link-${i + 1}" href="#activity-${i + 1}" data-pep-activity-link${i ? "" : ' aria-current="step"'}><span class="pep-path__n" aria-hidden="true"><span>${i + 1}</span></span><span class="pep-path__title">${title}</span><span class="pep-path__status" data-pep-path-status></span></a></li>`);
  return `<nav class="pep-path-toc" aria-label="Lesson path" data-pep-path-toc><p class="pep-path-toc__label">Lesson path</p><ol class="pep-path" data-pep-path>${rows.join("")}</ol></nav>`;
}
const CONF = (name, id, legend, help) => `<fieldset class="conf" id="${id}" ${id === "pconf" ? "data-pep-predict-confidence" : "data-pep-confidence"} aria-describedby="${help}"><legend id="${help}">${legend}</legend><label class="opt"><input type="radio" name="${name}" value="low"> <span>Low</span></label><label class="opt"><input type="radio" name="${name}" value="medium"> <span>Medium</span></label><label class="opt"><input type="radio" name="${name}" value="high"> <span>High</span></label></fieldset>`;
function expand(body, topic) {
  return body
    .replace(/\{\{MINUTES\}\}/g, String(topic.minutes.aboutLabel))
    .replace(/<!--pep:topicbar ([^>]*?)-->/g, (_, a) => topicbar(topic, attrs(a)))
    .replace(/<!--pep:path ([^>]*?)-->/g, (_, a) => lessonPath(attrs(a)))
    .replace(/<!--pep:before-->/g, '<ol class="pep-path pep-path--before" data-pep-path data-pep-path-slot="before" aria-label="Lesson path: done and current"></ol>')
    .replace(/<!--pep:after-->/g, '<ol class="pep-path pep-path--after" data-pep-path data-pep-path-slot="after" aria-label="Lesson path: later activities"></ol>')
    .replace(/<!--pep:navslot-->/g, '<div class="pep-nav-slot" data-pep-nav-slot></div>')
    .replace(/<!--pep:predict-confidence-->/g, `<div class="row">${CONF("pconf", "pconf", "Confidence, then check", "pconf-help")}<button type="button" class="primary" id="predict-check" data-pep-predict-check disabled aria-describedby="task-1 pconf-help">Check my prediction</button></div>`)
    .replace(/<!--pep:apply-confidence-->/g, `<div class="row">${CONF("conf", "conf", "Confidence, then check", "conf-help")}<button type="button" class="primary" id="apply-check" data-pep-apply-check disabled aria-describedby="task-apply conf-help">Check answer</button></div>`)
    .replace(/<!--pep:nav-->/g, NAV)
    .replace(/<!--pep:editor ([^>]*?)-->/g, (_, a) => editor(attrs(a)));
}

const moduleManifest = JSON.parse(await readFile(path.join(root, "authoring/catalog", course, moduleId, "module.json"), "utf8"));
const courseManifest = JSON.parse(await readFile(path.join(root, "authoring/catalog", course, "course.json"), "utf8"));
let stale = 0;
for (const topicId of moduleManifest.topicOrder) {
  const topic = JSON.parse(await readFile(path.join(root, "authoring/catalog", course, moduleId, topicId, "topic.json"), "utf8"));
  const body = await read(`src/${topicId}.body.html`);
  const data = await read(`src/${topicId}.topic.js`);
  const metas = [
    ["pep:course", course], ["pep:module", moduleId], ["pep:topic", topic.title], ["pep:topic-id", topic.id],
    ["pep:budget-minutes", String(topic.minutes.budget)], ["pep:source", topic.freshness.sourcesRef],
    ["lesson-editor-fragment", `shell.js sha256:${sha(shell)}`],
    ["lesson-editor-fragment", `sql-practice-adapter.js sha256:${sha(adapter)}`],
    ["lesson-editor-fragment", `sql-practice-controller.js sha256:${sha(controller)}`],
  ].map(([n, c]) => `<meta name="${n}" content="${escAttr(c)}">`).join("\n");
  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
${metas}
<title>${escAttr(topic.title)} · ${escAttr(courseManifest.title)}</title>
<script>document.documentElement.classList.add('pep-js');</script>
<style>
${css}</style>
</head>
<body>
${expand(body, topic)}<script>
${engine}${data}${controller}</script>
</body>
</html>
`;
  const target = path.join(root, course, moduleId, topicId, "artifact.html");
  const current = await readFile(target, "utf8").catch(() => null);
  if (check) {
    if (current !== html) { stale++; console.log(`stale: ${path.relative(root, target)}`); }
  } else if (current !== html) {
    await writeFile(target, html);
    console.log(`wrote ${path.relative(root, target)} sha256:${sha(html)}`);
  }
}
console.log(`shell.js sha256:${sha(shell)}\nsql-practice-adapter.js sha256:${sha(adapter)}\nsql-practice-controller.js sha256:${sha(controller)}`);
if (stale) process.exitCode = 1;
