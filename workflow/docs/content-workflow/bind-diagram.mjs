#!/usr/bin/env node
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const guidePath = path.join(here, "index.html");
const bindings = [
  { name: "simple", file: "golden-path.svg", start: "<!-- diagram:start -->", end: "<!-- diagram:end -->" },
  { name: "detailed", file: "detailed-architecture.svg", start: "<!-- detailed-diagram:start -->", end: "<!-- detailed-diagram:end -->" }
];

let guide = await readFile(guidePath, "utf8");
for (const binding of bindings) {
  const diagram = await readFile(path.join(here, binding.file), "utf8");
  const startAt = guide.indexOf(binding.start);
  const endAt = guide.indexOf(binding.end);
  if (
    startAt < 0 ||
    endAt < startAt ||
    guide.indexOf(binding.start, startAt + binding.start.length) >= 0 ||
    guide.indexOf(binding.end, endAt + binding.end.length) >= 0
  ) {
    throw new Error(`index.html must contain one ordered ${binding.name} diagram marker pair`);
  }
  guide = `${guide.slice(0, startAt + binding.start.length)}\n${diagram.trim()}\n${guide.slice(endAt)}`;
}

const current = await readFile(guidePath, "utf8");
if (process.argv.includes("--check")) {
  if (guide !== current) {
    console.error("content-workflow guide: an embedded diagram is stale; run bind-diagram.mjs");
    process.exit(1);
  }
  console.log("content-workflow guide: simple and detailed diagram bindings passed");
} else {
  await writeFile(guidePath, guide);
  console.log("content-workflow guide: embedded diagrams updated");
}
