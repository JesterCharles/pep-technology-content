#!/usr/bin/env node
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const guidePath = path.join(here, "index.html");
const diagramPath = path.join(here, "golden-path.svg");
const start = "<!-- diagram:start -->";
const end = "<!-- diagram:end -->";
const [guide, diagram] = await Promise.all([readFile(guidePath, "utf8"), readFile(diagramPath, "utf8")]);
const startAt = guide.indexOf(start);
const endAt = guide.indexOf(end);
if (startAt < 0 || endAt < startAt || guide.indexOf(start, startAt + start.length) >= 0 || guide.indexOf(end, endAt + end.length) >= 0) {
  throw new Error("index.html must contain one ordered diagram marker pair");
}
const bound = `${guide.slice(0, startAt + start.length)}\n${diagram.trim()}\n${guide.slice(endAt)}`;
if (process.argv.includes("--check")) {
  if (bound !== guide) {
    console.error("content-workflow guide: embedded diagram is stale; run bind-diagram.mjs");
    process.exit(1);
  }
  console.log("content-workflow guide: diagram binding passed");
} else {
  await writeFile(guidePath, bound);
  console.log("content-workflow guide: embedded diagram updated");
}
