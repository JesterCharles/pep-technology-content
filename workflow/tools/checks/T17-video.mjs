import { readFile } from "node:fs/promises";
import path from "node:path";
import {
  error,
  evidencePath,
  exists,
  findCourses,
  loadCourse,
  readJson,
  sha256,
} from "../lib/common.mjs";
import { parseVideoFrontmatter } from "../net/check-video.mjs";
import { freshnessIssue } from "../net/receipts.mjs";

export const id = "T17";
export const gate = 17;
export const description = "video liveness receipts and budget";

export async function run(ctx) {
  const out = [];
  for (const courseDescriptor of await findCourses(ctx)) {
    const course = await loadCourse(courseDescriptor);
    for (const module of course.modules) {
      for (const topicId of module.manifest.topicOrder ?? []) {
        const topicFile = path.join(module.catalogRoot, topicId, "topic.json");
        const topic = await readJson(topicFile).catch(() => null);
        if (!topic || topic.artifacts?.video?.status !== "present") {
          continue;
        }
        const artifact = path.join(module.contentRoot, topicId, "video-artifact.md");
        let metadata;
        try {
          metadata = parseVideoFrontmatter(await readFile(artifact, "utf8"));
        } catch (issue) {
          out.push(error(id, ctx.display(artifact), issue.message));
          continue;
        }
        const metadataFreshness = freshnessIssue(metadata.checkedAt);
        if (metadataFreshness) {
          out.push(error(id, ctx.display(artifact), metadataFreshness));
        }
        if (metadata.embeddable !== true) {
          out.push(error(id, ctx.display(artifact), "video metadata must mark the selection embeddable"));
        }
        const receiptFile = evidencePath(
          course.repoRoot,
          course.manifest.id,
          module.id,
          topic.id,
          "video.json",
        );
        if (!(await exists(receiptFile))) {
          out.push(error(id, ctx.display(artifact), "video liveness receipt does not exist"));
          continue;
        }
        const receipt = await readJson(receiptFile).catch(() => null);
        if (!receipt) {
          out.push(error(id, ctx.display(receiptFile), "video liveness receipt is invalid JSON"));
          continue;
        }
        if (receipt.artifactSha256 !== sha256(await readFile(artifact))) {
          out.push(error(id, ctx.display(receiptFile), "receipt does not bind current video bytes"));
        }
        const receiptFreshness = freshnessIssue(receipt.checkedAt);
        if (receiptFreshness) {
          out.push(error(id, ctx.display(receiptFile), receiptFreshness));
        }
        if (
          receipt.url !== metadata.url ||
          receipt.oEmbedStatus !== 200 ||
          receipt.public !== true ||
          receipt.embeddable !== true
        ) {
          out.push(error(id, ctx.display(receiptFile), "video is not confirmed live, public, and embeddable"));
        }
        if (!(receipt.runtimeSeconds > 0)) {
          out.push(error(id, ctx.display(receiptFile), "receipt has no positive runtime"));
        } else {
          if (Math.abs(receipt.runtimeSeconds / 60 - metadata.runtimeMinutes) > 1) {
            out.push(error(id, ctx.display(receiptFile), "receipt runtime disagrees with video metadata"));
          }
          if (receipt.runtimeSeconds > topic.minutes.budget * 60) {
            out.push(error(id, ctx.display(receiptFile), "video runtime exceeds the topic minute budget"));
          }
        }
      }
    }
  }
  return out;
}
