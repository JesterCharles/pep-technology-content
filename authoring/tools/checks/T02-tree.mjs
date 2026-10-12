import path from "node:path";
import { error, findCourseRoots, readJson, walk, SLUG_RE } from "../lib/common.mjs";
export const id = "T02";
export const gate = 2;
export const description = "canonical course/module/topic tree";
const topicReviewName =
  /^(?:critic-(?:education|sme)(?:-recheck)?|reconciliation)\.json$/;
const scopedReviewName =
  /^(?:[a-z0-9]+(?:-[a-z0-9]+)*-)?(?:critic-(?:education|sme)(?:-recheck)?|reconciliation)\.json$/;

function looksLikeReviewEvidence(name) {
  return name.includes("critic-") || name.includes("reconciliation");
}

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

    const evidenceRoot = path.join(ctx.root, "evidence", c.id);
    const moduleIds = new Set(c.moduleOrder ?? []);
    const topicIds = new Map();
    for (const mid of c.moduleOrder ?? []) {
      try {
        const module = await readJson(path.join(cr, mid, "module.json"));
        topicIds.set(mid, new Set(module.topicOrder ?? []));
      } catch {
        topicIds.set(mid, new Set());
      }
    }
    for (const file of (await walk(evidenceRoot)).files) {
      const parts = path.relative(evidenceRoot, file).split(path.sep);
      const name = parts.at(-1);
      if (!looksLikeReviewEvidence(name)) continue;
      const topicLevel =
        parts.length === 3 &&
        moduleIds.has(parts[0]) &&
        topicIds.get(parts[0])?.has(parts[1]);
      const scopedLevel =
        parts.length === 1 || (parts.length === 2 && moduleIds.has(parts[0]));
      const valid =
        (topicLevel && topicReviewName.test(name)) ||
        (scopedLevel && scopedReviewName.test(name));
      if (!valid)
        out.push(error(id, ctx.display(file), "invalid review evidence filename or location"));
    }

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
