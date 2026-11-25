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
${body.replace(/\{\{MINUTES\}\}/g, String(topic.minutes.aboutLabel))}<script>
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
