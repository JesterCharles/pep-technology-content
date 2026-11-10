#!/usr/bin/env node
// Assembles each java-basics artifact.html from the shared engine bytes (engine.css and engine.js, copied
// unchanged between jb-engine markers) and the topic's own body and TOPIC data in src/. The TOPIC data is the
// lesson code of the pre-DESIGN pages, carried over byte for byte with a Restart ownership map appended.
// Metadata comes from the catalog topic.json. Run from the repository root:
//   node authoring/evidence/java-foundations/java-basics/page-build/build.mjs [--check]
import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "../../../../..");
const course = "java-foundations";
const moduleId = "java-basics";
const check = process.argv.includes("--check");
const sha = (s) => createHash("sha256").update(s).digest("hex");
const read = (f) => readFile(path.join(here, f), "utf8");
const escAttr = (s) => String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

const engine = { "engine.css": await read("engine.css"), "engine.js": await read("engine.js") };
const block = (name, open, close) => `${open} jb-engine@1 ${name} ${close}\n${engine[name]}${engine[name].endsWith("\n") ? "" : "\n"}${open} /jb-engine ${name} ${close}`;
const moduleManifest = JSON.parse(await readFile(path.join(root, "authoring/catalog", course, moduleId, "module.json"), "utf8"));
const courseManifest = JSON.parse(await readFile(path.join(root, "authoring/catalog", course, "course.json"), "utf8"));
let stale = 0;
for (const topicId of moduleManifest.topicOrder) {
  const topic = JSON.parse(await readFile(path.join(root, "authoring/catalog", course, moduleId, topicId, "topic.json"), "utf8"));
  const body = await read(`src/${topicId}.body.html`).catch(() => null);
  if (body === null) { console.log(`skip ${topicId}: no source yet`); continue; }
  const data = await read(`src/${topicId}.topic.js`);
  // Optional topic-only CSS, appended after the shared engine block so sibling pages keep their bytes.
  const topicCss = await read(`src/${topicId}.topic.css`).catch(() => null);
  const metas = [
    ["pep:course", course], ["pep:module", moduleId], ["pep:topic", topic.title], ["pep:topic-id", topic.id],
    ["pep:budget-minutes", String(topic.minutes.budget)], ["pep:source", topic.freshness.sourcesRef],
    ["jb-engine", `engine.css sha256:${sha(engine["engine.css"])}`],
    ["jb-engine", `engine.js sha256:${sha(engine["engine.js"])}`],
  ].map(([n, c]) => `<meta name="${n}" content="${escAttr(c)}">`).join("\n");
  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
${metas}
<title>${escAttr(topic.title)} · ${escAttr(moduleManifest.title)}</title>
<script>document.documentElement.classList.add('pep-js');</script>
<style>
${block("engine.css", "/*", "*/")}${topicCss === null ? "" : `\n${topicCss.trim()}`}
</style>
</head>
<body>
<noscript><div class="nojs"><p>This topic needs JavaScript for its practice activities and checks. Turn JavaScript on to take part. Every activity below is still readable in order, with its task and the recap.</p></div></noscript>
${body.trim().replace(/\{\{MINUTES\}\}/g, String(topic.minutes.aboutLabel))}
<script>
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
