#!/usr/bin/env node
// Assembles each arrays-lists-and-maps artifact.html from the shared engine bytes (engine.css, jmini.js,
// engine.js, copied unchanged between alm-engine markers) and the topic's own body and TOPIC data in src/.
// Metadata comes from the catalog topic.json. Run from the repository root:
//   node authoring/evidence/java-foundations/arrays-lists-and-maps/page-build/build.mjs [--check]
import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "../../../../..");
const course = "java-foundations";
const moduleId = "arrays-lists-and-maps";
const check = process.argv.includes("--check");
const sha = (s) => createHash("sha256").update(s).digest("hex");
const read = (f) => readFile(path.join(here, f), "utf8");
const escAttr = (s) => String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

const engine = { "engine.css": await read("engine.css"), "jmini.js": await read("jmini.js"), "engine.js": await read("engine.js") };
const block = (name, open, close) => `${open} alm-engine@1 ${name} ${close}\n${engine[name]}${engine[name].endsWith("\n") ? "" : "\n"}${open} /alm-engine ${name} ${close}`;
const moduleManifest = JSON.parse(await readFile(path.join(root, "authoring/catalog", course, moduleId, "module.json"), "utf8"));
const courseManifest = JSON.parse(await readFile(path.join(root, "authoring/catalog", course, "course.json"), "utf8"));
let stale = 0;
for (const topicId of moduleManifest.topicOrder) {
  const topic = JSON.parse(await readFile(path.join(root, "authoring/catalog", course, moduleId, topicId, "topic.json"), "utf8"));
  const body = await read(`src/${topicId}.body.html`).catch(() => null);
  if (body === null) { console.log(`skip ${topicId}: no source yet`); continue; }
  const data = await read(`src/${topicId}.topic.js`);
  const metas = [
    ["pep:course", course], ["pep:module", moduleId], ["pep:topic", topic.title], ["pep:topic-id", topic.id],
    ["pep:budget-minutes", String(topic.minutes.budget)], ["pep:source", topic.freshness.sourcesRef],
    ["alm-engine", `engine.css sha256:${sha(engine["engine.css"])}`],
    ["alm-engine", `jmini.js sha256:${sha(engine["jmini.js"])}`],
    ["alm-engine", `engine.js sha256:${sha(engine["engine.js"])}`],
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
${block("engine.css", "/*", "*/")}
</style>
</head>
<body>
<noscript><div class="nojs"><p>JavaScript is off. Every activity below is still readable in order, with its task, a static result and the recap; the checks, the explorer and the practice editor do not run.</p></div></noscript>
${body.trim().replace(/\{\{MINUTES\}\}/g, String(topic.minutes.aboutLabel))}
<script>
${block("jmini.js", "/*", "*/")}
${data.trim()}
${block("engine.js", "/*", "*/")}
</script>
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
for (const [name, bytes] of Object.entries(engine)) console.log(`${name} sha256:${sha(bytes)}`);
if (stale) process.exitCode = 1;
