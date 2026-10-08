import path from "node:path";
import { error, findCourseRoots, readJson, walk, SLUG_RE } from "../lib/common.mjs";
export const id = "T02";
export const gate = 2;
export const description = "canonical course/module/topic tree";
export async function run(ctx) {
  const out = [];
  for (const root of ctx.scanRoots) {
    const w = await walk(root, { skip: ctx.skip });
    for (const d of w.directories)
      if (path.basename(d) === "topics")
        out.push(error(id, ctx.display(d), "topics/ directories are forbidden"));
  }
  for (const cr of await findCourseRoots(ctx)) {
    let c;
    try {
      c = await readJson(path.join(cr, "course.json"));
    } catch {
      continue;
    }
    if (path.basename(cr) !== c.id)
      out.push(
        error(id, ctx.display(path.join(cr, "course.json")), "course directory must equal id"),
      );
    for (const mid of c.moduleOrder ?? []) {
      const mr = path.join(cr, mid);
      let m;
      try {
        m = await readJson(path.join(mr, "module.json"));
      } catch {
        continue;
      }
      if (path.basename(mr) !== m.id)
        out.push(
          error(id, ctx.display(path.join(mr, "module.json")), "module directory must equal id"),
        );
      for (const tid of m.topicOrder ?? []) {
        const tr = path.join(mr, tid);
        let t;
        try {
          t = await readJson(path.join(tr, "topic.json"));
        } catch {
          continue;
        }
        if (path.basename(tr) !== t.id || !SLUG_RE.test(t.id))
          out.push(
            error(
              id,
              ctx.display(path.join(tr, "topic.json")),
              "topic directory must equal slug id",
            ),
          );
      }
    }
  }
  return out;
}
