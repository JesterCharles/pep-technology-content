import path from "node:path";
import { error, exists, findCourseRoots, readJson, stableJson } from "../lib/common.mjs";
import { createCourseLock, createModuleLock } from "../lib/locks.mjs";
export const id = "T06";
export const gate = 3;
export const description = "current generated locks and evidence bindings";
export async function run(ctx) {
  const out = [];
  for (const cr of await findCourseRoots(ctx)) {
    let c;
    try {
      c = await readJson(path.join(cr, "course.json"));
    } catch {
      continue;
    }
    const cid = c.id,
      cf = path.join(cr, "course.lock.json");
    try {
      const expected = await createCourseLock(ctx.root, cid);
      if (!(await exists(cf))) out.push(error(id, ctx.display(cf), "course lock is missing"));
      else if (stableJson(await readJson(cf)) !== stableJson(await expected))
        out.push(error(id, ctx.display(cf), "course lock is stale"));
    } catch (e) {
      out.push(error(id, ctx.display(cf), e.message));
    }
    for (const mid of c.moduleOrder ?? []) {
      const f = path.join(cr, mid, "module.lock.json");
      try {
        const expected = await createModuleLock(ctx.root, cid, mid);
        if (!(await exists(f))) out.push(error(id, ctx.display(f), "module lock is missing"));
        else if (stableJson(await readJson(f)) !== stableJson(expected))
          out.push(error(id, ctx.display(f), "module lock is stale"));
      } catch (e) {
        out.push(error(id, ctx.display(f), e.message));
      }
    }
  }
  return out;
}
