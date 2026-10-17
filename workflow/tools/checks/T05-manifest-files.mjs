import path from "node:path";
import { error, exists, findCourses, readJson } from "../lib/common.mjs";
export const id = "T05";
export const gate = 2;
export const description = "manifest and file set agree";
const names = {
  html: "artifact.html",
  md: "artifact.md",
  pdf: "artifact.pdf",
  gift: "artifact.gift",
  video: "video-artifact.md",
  lab: "coding-lab",
};
export async function run(ctx) {
  const out = [];
  for (const course of await findCourses(ctx)) {
    const c = course.manifest;
    const cr = course.contentRoot;
    for (const mid of c.moduleOrder ?? []) {
      const mf = path.join(course.catalogRoot, mid, "module.json");
      if (!(await exists(mf))) {
        out.push(error(id, ctx.display(mf), "moduleOrder entry has no module.json"));
        continue;
      }
      const m = await readJson(mf);
      for (const tid of m.topicOrder ?? []) {
        const tf = path.join(course.catalogRoot, mid, tid, "topic.json");
        if (!(await exists(tf))) {
          out.push(error(id, ctx.display(tf), "topicOrder entry has no topic.json"));
          continue;
        }
        const t = await readJson(tf);
        for (const [kind, name] of Object.entries(names)) {
          const p = path.join(cr, mid, tid, name),
            present = await exists(p),
            wanted = t.artifacts?.[kind]?.status === "present";
          if (present !== wanted)
            out.push(
              error(
                id,
                ctx.display(p),
                wanted
                  ? "declared present but missing"
                  : "file exists but manifest declares absent",
              ),
            );
        }
      }
    }
  }
  return out;
}
