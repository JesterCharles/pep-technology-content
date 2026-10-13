#!/usr/bin/env node
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { defaultSkip, findCourses, loadCourse, resolveRepositoryPath } from "../lib/common.mjs";
import { artifactSha256, fetchBytes, sha256 } from "./receipts.mjs";

async function topics(root, inputs) {
  const targets = (inputs.length ? inputs : [root]).map((input) => path.resolve(root, input));
  const ctx = {
    root,
    explicit: inputs.length > 0,
    targets,
    scanRoots: targets,
    skip: inputs.length ? undefined : defaultSkip(root),
  };
  const found = [];
  for (const descriptor of await findCourses(ctx)) {
    const course = await loadCourse(descriptor);
    for (const module of course.modules) {
      for (const topicId of module.manifest.topicOrder ?? []) {
        const manifestFile = path.join(module.catalogRoot, topicId, "topic.json");
        const contentRoot = path.join(module.contentRoot, topicId);
        if (
          ctx.explicit &&
          !targets.some(
            (target) =>
              target === manifestFile ||
              target === contentRoot ||
              target.startsWith(`${contentRoot}${path.sep}`) ||
              contentRoot.startsWith(`${target}${path.sep}`) ||
              manifestFile.startsWith(`${target}${path.sep}`),
          )
        ) continue;
        found.push({ course, manifestFile, contentRoot });
      }
    }
  }
  return found;
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
  for (const entry of await topics(root, inputs)) {
    const topicFile = entry.manifestFile;
    const topic = JSON.parse(await readFile(topicFile, "utf8"));
    if (topic.artifacts?.html?.status !== "present") {
      continue;
    }
    const receiptFile = await resolveRepositoryPath(entry.course.repoRoot, topic.freshness.sourcesRef);
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
    const artifact = path.join(entry.contentRoot, "artifact.html");
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
