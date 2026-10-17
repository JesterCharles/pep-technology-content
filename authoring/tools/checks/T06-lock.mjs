import path from "node:path";
import { error, evidencePath, exists, findCourses, readJson, stableJson } from "../lib/common.mjs";
import { createCourseLock, createModuleLock } from "../lib/locks.mjs";
import { validateSolvedRuns } from "../lib/solved-runs.mjs";
import { validateQaPrivateProofs } from "../qa/harness.mjs";
export const id = "T06";
export const gate = 3;
export const description = "current generated locks and evidence bindings";
export async function run(ctx) {
  const out = [];
  for (const course of await findCourses(ctx)) {
    const c = course.manifest;
    const cid = c.id,
      cf = path.join(course.catalogRoot, "course.lock.json");
    try {
      const expected = await createCourseLock(course.repoRoot, cid);
      if (!(await exists(cf))) out.push(error(id, ctx.display(cf), "course lock is missing"));
      else if (stableJson(await readJson(cf)) !== stableJson(await expected))
        out.push(error(id, ctx.display(cf), "course lock is stale"));
    } catch (e) {
      out.push(error(id, ctx.display(cf), e.message));
    }
    for (const mid of c.moduleOrder ?? []) {
      const f = path.join(course.catalogRoot, mid, "module.lock.json");
      try {
        const expected = await createModuleLock(course.repoRoot, cid, mid);
        if (!(await exists(f))) out.push(error(id, ctx.display(f), "module lock is missing"));
        else if (stableJson(await readJson(f)) !== stableJson(expected))
          out.push(error(id, ctx.display(f), "module lock is stale"));
      } catch (e) {
        out.push(error(id, ctx.display(f), e.message));
      }
    }
    const courseEvidence = evidencePath(course.repoRoot, cid);
    out.push(...(await validateSolvedRuns(course.repoRoot, courseEvidence)));
    out.push(...(await validateQaPrivateProofs(course.repoRoot, courseEvidence)));
  }
  return out;
}
