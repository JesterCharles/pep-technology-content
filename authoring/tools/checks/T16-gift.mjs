import { readFile } from "node:fs/promises";
import path from "node:path";
import { error, findCourseRoots, loadCourse, readJson } from "../lib/common.mjs";
import { validateGift } from "../gift/validate.mjs";

export const id = "T16";
export const gate = 16;
export const description = "formative GIFT syntax and policy";

export async function run(ctx) {
  const out = [];
  for (const courseRoot of await findCourseRoots(ctx)) {
    const course = await loadCourse(courseRoot);
    for (const module of course.modules) {
      for (const topicId of module.manifest.topicOrder ?? []) {
        const topicFile = path.join(module.root, topicId, "topic.json");
        const topic = await readJson(topicFile).catch(() => null);
        if (!topic || topic.artifacts?.gift?.status !== "present") {
          continue;
        }
        const gift = path.join(path.dirname(topicFile), "artifact.gift");
        try {
          validateGift(await readFile(gift), `${course.manifest.id}/${module.id}/${topic.id}`);
        } catch (issue) {
          out.push(error(id, ctx.display(gift), issue.message));
        }
      }
    }
  }
  return out;
}
