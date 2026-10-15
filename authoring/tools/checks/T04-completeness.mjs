import { readFile } from "node:fs/promises";
import path from "node:path";
import { error, findCourses, readJson } from "../lib/common.mjs";
export const id = "T04";
export const gate = 2;
export const description = "nonempty artifacts and honest absences";
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
      let m;
      try {
        m = await readJson(path.join(course.catalogRoot, mid, "module.json"));
      } catch {
        continue;
      }
      for (const tid of m.topicOrder ?? []) {
        const tr = path.join(cr, mid, tid);
        let t;
        try {
          t = await readJson(path.join(course.catalogRoot, mid, tid, "topic.json"));
        } catch {
          continue;
        }
        for (const [kind, decl] of Object.entries(t.artifacts ?? {})) {
          if (decl.status === "absent" && !decl.reason?.trim())
            out.push(
              error(
                id,
                ctx.display(path.join(course.catalogRoot, mid, tid, "topic.json")),
                `absent artifact ${kind} requires a reason`,
              ),
            );
          if (decl.status === "present" && kind !== "lab") {
            const f = path.join(tr, names[kind]);
            let text = "";
            try {
              text = await readFile(f, "utf8");
            } catch {
              continue;
            }
            if (!text.trim()) out.push(error(id, ctx.display(f), "artifact is empty"));
            else if (/^(?:todo|tbd|placeholder|coming soon|lorem ipsum)[.!\s]*$/i.test(text.trim()))
              out.push(error(id, ctx.display(f), "artifact is placeholder content"));
          }
        }
      }
    }
  }
  return out;
}
