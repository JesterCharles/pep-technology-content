#!/usr/bin/env node
import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { resolveRepositoryPath, walk } from "../lib/common.mjs";
import { artifactSha256, fetchBytes, sha256 } from "./receipts.mjs";

async function topicFiles(root, inputs) {
  const found = new Set();
  for (const input of inputs.length ? inputs : [root]) {
    const resolved = path.resolve(root, input);
    const info = await stat(resolved);
    if (info.isFile() && path.basename(resolved) === "topic.json") {
      found.add(resolved);
      continue;
    }
    const directory = info.isDirectory() ? resolved : path.dirname(resolved);
    for (const file of (await walk(directory)).files) {
      if (path.basename(file) === "topic.json") {
        found.add(file);
      }
    }
  }
  return [...found].sort();
}

async function main() {
  const inputs = process.argv.slice(2);
  if (inputs.includes("--help")) {
    console.log(
      "Usage: node authoring/tools/net/check-links.mjs [topic-or-course-path ...]",
    );
    return;
  }
  const root = process.cwd();
  let failed = false;
  for (const topicFile of await topicFiles(root, inputs)) {
    const topic = JSON.parse(await readFile(topicFile, "utf8"));
    if (topic.artifacts?.html?.status !== "present") {
      continue;
    }
    const receiptFile = await resolveRepositoryPath(root, topic.freshness.sourcesRef);
    let prior;
    try {
      prior = JSON.parse(await readFile(receiptFile, "utf8"));
    } catch {
      throw new Error(`${path.relative(root, receiptFile)} must exist with source URLs before checking`);
    }
    const checkedAt = new Date().toISOString();
    const sources = [];
    if (!Array.isArray(prior.sources) || prior.sources.length === 0) {
      failed = true;
    }
    for (const source of prior.sources ?? []) {
      if (!Array.isArray(source.sectionsUsed) || source.sectionsUsed.length === 0) {
        failed = true;
      }
      try {
        const { response, bytes } = await fetchBytes(source.url);
        sources.push({
          url: source.url,
          retrievedAt: checkedAt,
          status: response.status,
          finalUrl: response.url,
          sha256: sha256(bytes),
          sectionsUsed: source.sectionsUsed ?? [],
        });
        if (response.status !== 200) {
          failed = true;
        }
      } catch (issue) {
        sources.push({
          url: source.url,
          retrievedAt: checkedAt,
          status: 0,
          finalUrl: source.url,
          sha256: "0".repeat(64),
          sectionsUsed: source.sectionsUsed ?? [],
          error: issue.message,
        });
        failed = true;
      }
    }
    const artifact = path.join(path.dirname(topicFile), "artifact.html");
    const receipt = {
      schemaVersion: 1,
      reviewedSha256: await artifactSha256(artifact),
      checkedAt,
      sources,
    };
    await mkdir(path.dirname(receiptFile), { recursive: true });
    await writeFile(receiptFile, `${JSON.stringify(receipt, null, 2)}\n`);
    console.log(path.relative(root, receiptFile));
  }
  if (failed) {
    process.exitCode = 1;
  }
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  main().catch((error) => {
    console.error(`check-links: ${error.message}`);
    process.exitCode = 1;
  });
}
