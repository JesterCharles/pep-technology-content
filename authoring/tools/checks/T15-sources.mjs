import { readFile } from "node:fs/promises";
import path from "node:path";
import {
  error,
  exists,
  findCourseRoots,
  loadCourse,
  readJson,
  sha256,
} from "../lib/common.mjs";
import { freshnessIssue } from "../net/receipts.mjs";

export const id = "T15";
export const gate = 15;
export const description = "source link receipts";

export async function run(ctx) {
  const out = [];
  for (const courseRoot of await findCourseRoots(ctx)) {
    const course = await loadCourse(courseRoot);
    for (const module of course.modules) {
      for (const topicId of module.manifest.topicOrder ?? []) {
        const topicFile = path.join(module.root, topicId, "topic.json");
        const topic = await readJson(topicFile).catch(() => null);
        if (!topic || topic.artifacts?.html?.status !== "present") {
          continue;
        }
        if (
          topic.freshness?.status !== "verified" &&
          !(topic.freshness?.unverifiedItems?.length > 0)
        ) {
          out.push(error(id, ctx.display(topicFile), "unverified source claims must be listed"));
        }
        const receiptFile = path.resolve(ctx.root, topic.freshness?.sourcesRef ?? "");
        if (!(await exists(receiptFile))) {
          out.push(error(id, ctx.display(topicFile), "source receipt does not exist"));
          continue;
        }
        let receipt;
        try {
          receipt = await readJson(receiptFile);
        } catch (issue) {
          out.push(error(id, ctx.display(receiptFile), `invalid receipt JSON: ${issue.message}`));
          continue;
        }
        const artifact = path.join(path.dirname(topicFile), "artifact.html");
        if (receipt.reviewedSha256 !== sha256(await readFile(artifact))) {
          out.push(error(id, ctx.display(receiptFile), "receipt does not bind current artifact bytes"));
        }
        const receiptFreshness = freshnessIssue(receipt.checkedAt);
        if (receiptFreshness) {
          out.push(error(id, ctx.display(receiptFile), receiptFreshness));
        }
        if (!Array.isArray(receipt.sources) || receipt.sources.length === 0) {
          out.push(error(id, ctx.display(receiptFile), "receipt must contain at least one source"));
          continue;
        }
        for (const [index, source] of receipt.sources.entries()) {
          if (source.status !== 200) {
            out.push(error(id, ctx.display(receiptFile), `source ${index + 1} did not return HTTP 200`));
          }
          const sourceFreshness = freshnessIssue(source.retrievedAt);
          if (sourceFreshness) {
            out.push(error(id, ctx.display(receiptFile), `source ${index + 1}: ${sourceFreshness}`));
          }
          if (!Array.isArray(source.sectionsUsed) || source.sectionsUsed.length === 0) {
            out.push(error(id, ctx.display(receiptFile), `source ${index + 1} has no sectionsUsed`));
          }
        }
      }
    }
  }
  return out;
}
