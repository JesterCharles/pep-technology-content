import path from "node:path";
import { error, findCourses, readJson } from "../lib/common.mjs";
import { readdir as rd } from "node:fs/promises";
export const id = "T03";
export const gate = 2;
export const description = "allowed course, module, topic, and lab entries";
const topicAllowed = new Set([
  "artifact.html",
  "artifact.md",
  "artifact.pdf",
  "artifact.gift",
  "video-artifact.md",
  "coding-lab",
]);
const labAllowed = new Set(["lab.json", "README.md", "starter", "tests", "fixtures", "expected"]);
async function checkLab(ctx, out, lr) {
  for (const name of await rd(lr).catch(() => []))
    if (!labAllowed.has(name))
      out.push(error(id, ctx.display(path.join(lr, name)), "entry is not allowed at the lab root"));
}
export async function run(ctx) {
  const out = [];
  for (const course of await findCourses(ctx)) {
    const c = course.manifest;
    const cr = course.contentRoot;
    const courseAllowed = new Set(["assessments", "coding-lab", ...(c.moduleOrder ?? [])]);
    for (const name of await rd(cr).catch(() => []))
      if (!courseAllowed.has(name))
        out.push(
          error(id, ctx.display(path.join(cr, name)), "entry is not allowed at the course root"),
        );
    await checkLab(ctx, out, path.join(cr, "coding-lab"));
    for (const mid of c.moduleOrder ?? []) {
      const mr = path.join(cr, mid);
      let m;
      try {
        m = await readJson(path.join(course.catalogRoot, mid, "module.json"));
      } catch {
        continue;
      }
      const moduleAllowed = new Set([
        "assessments",
        "coding-lab",
        ...(m.topicOrder ?? []),
      ]);
      for (const name of await rd(mr).catch(() => []))
        if (!moduleAllowed.has(name))
          out.push(
            error(id, ctx.display(path.join(mr, name)), "entry is not allowed at the module root"),
          );
      await checkLab(ctx, out, path.join(mr, "coding-lab"));
      for (const tid of m.topicOrder ?? []) {
        const tr = path.join(mr, tid);
        for (const name of await rd(tr).catch(() => []))
          if (!topicAllowed.has(name))
            out.push(
              error(id, ctx.display(path.join(tr, name)), "filename is not allowed in a topic"),
            );
        await checkLab(ctx, out, path.join(tr, "coding-lab"));
      }

      const catalogModuleAllowed = new Set(["module.json", "module.lock.json", ...(m.topicOrder ?? [])]);
      const catalogModuleRoot = path.join(course.catalogRoot, mid);
      for (const name of await rd(catalogModuleRoot).catch(() => []))
        if (!catalogModuleAllowed.has(name))
          out.push(error(id, ctx.display(path.join(catalogModuleRoot, name)), "entry is not allowed in a module catalog"));
      for (const tid of m.topicOrder ?? []) {
        const catalogTopicRoot = path.join(catalogModuleRoot, tid);
        for (const name of await rd(catalogTopicRoot).catch(() => []))
          if (name !== "topic.json")
            out.push(error(id, ctx.display(path.join(catalogTopicRoot, name)), "entry is not allowed in a topic catalog"));
      }
    }
    const catalogCourseAllowed = new Set(["course.json", "course.lock.json", ...(c.moduleOrder ?? [])]);
    for (const name of await rd(course.catalogRoot).catch(() => []))
      if (!catalogCourseAllowed.has(name))
        out.push(error(id, ctx.display(path.join(course.catalogRoot, name)), "entry is not allowed at the course catalog root"));
  }
  return out;
}
