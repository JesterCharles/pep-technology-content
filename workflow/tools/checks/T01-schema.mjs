import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";
import { readFile } from "node:fs/promises";
import path from "node:path";
import {
  workflowPath,
  error,
  findCourseCandidates,
  findForbiddenKeys,
  readJson,
  walk,
} from "../lib/common.mjs";

export const id = "T01";
export const gate = 1;
export const description = "JSON schemas";
const mapping = [
  [/\/course\.json$/, "course"],
  [/\/module\.json$/, "module"],
  [/\/topic\.json$/, "topic"],
  [/\/course\.lock\.json$/, "course-lock"],
  [/\/module\.lock\.json$/, "module-lock"],
  [/\/lab\.json$/, "lab"],
  [/\/(?:lab-run|[a-z0-9]+(?:-[a-z0-9]+)*-solved-run)\.json$/, "solved-run"],
  [/\/blueprint\.json$/, "assessment-blueprint"],
  [/\/tracks\/[^/]+\.json$/, "track"],
  [/\/source-snapshot\.json$/, "source-snapshot"],
  [
    /\/(?:[a-z0-9]+(?:-[a-z0-9]+)*-)?critic-(?:education|sme)(?:-recheck)?\.json$/,
    "critic-report",
  ],
  [/\/(?:[a-z0-9]+(?:-[a-z0-9]+)*-)?reconciliation\.json$/, "reconciliation"],
  [/\/qa-receipt\.json$/, "qa-receipt"],
  [/\/qa-paths\.json$/, "qa-paths"],
  [/\/curriculum\.lock\.json$/, "curriculum-lock"],
  [/\/evidence\/legacy\/course-1-packages\.json$/, "legacy-course-packages"],
  [/\/evidence\/legacy\/tournament\.json$/, "legacy-tournament"],
];
async function objectiveExists(course, match) {
  try {
    const topic = await readJson(
      path.join(course.catalogRoot, match[2], match[3], "topic.json"),
    );
    return (topic.objectives ?? []).some((objective) => objective.id === match[4]);
  } catch {
    return false;
  }
}

async function checkBlueprintReferences(ctx, file, data, courses) {
  const errors = [];
  const owner = courses.find(
    (candidate) =>
      file === candidate.contentRoot || file.startsWith(`${candidate.contentRoot}${path.sep}`),
  );
  if (!owner) return errors;

  const objectives = Array.isArray(data.objectives) ? data.objectives : [];
  for (const reference of objectives) {
    if (typeof reference !== "string") continue;
    const match = reference.match(
      /^([a-z0-9]+(?:-[a-z0-9]+)*)\/([a-z0-9]+(?:-[a-z0-9]+)*)\/([a-z0-9]+(?:-[a-z0-9]+)*)#(o[1-9][0-9]*)$/,
    );
    if (!match) {
      errors.push(error(id, ctx.display(file), `objective ${reference} does not resolve`));
      continue;
    }

    const matches = new Set();
    for (const course of courses) {
      if (course.manifest?.id === match[1] && (await objectiveExists(course, match)))
        matches.add(course.catalogRoot);
    }
    if (matches.size === 0) {
      errors.push(error(id, ctx.display(file), `objective ${reference} does not resolve`));
    } else if (matches.size > 1) {
      errors.push(
        error(
          id,
          ctx.display(file),
          `objective ${reference} is ambiguous across courses: ${[...matches]
            .map((root) => ctx.display(root))
            .join(", ")}`,
        ),
      );
    }
  }

  if (data.objectiveFormats && typeof data.objectiveFormats === "object") {
    for (const [reference, formats] of Object.entries(data.objectiveFormats)) {
      if (!objectives.includes(reference)) {
        errors.push(
          error(id, ctx.display(file), `objectiveFormats key ${reference} is not in objectives`),
        );
      }
      if (Array.isArray(formats)) {
        for (const format of formats) {
          if (!(data.formats ?? []).includes(format))
            errors.push(
              error(id, ctx.display(file), `objectiveFormats value ${format} is not in formats`),
            );
        }
      }
    }
  }
  return errors;
}

function parseFrontmatter(text) {
  if (!text.startsWith("---\n")) throw new Error("missing opening ---");
  const end = text.indexOf("\n---\n", 4);
  if (end < 0) throw new Error("missing closing ---");
  const parseScalar = (value) => {
    if (value === "true" || value === "false") return value === "true";
    if (/^\d+(\.\d+)?$/.test(value)) return Number(value);
    if (value === "[]") return [];
    return value;
  };
  const out = {};
  let key;
  let listItem;
  for (const line of text.slice(4, end).split("\n")) {
    const listMatch = line.match(/^\s*-\s+(.+)$/);
    if (listMatch) {
      if (!Array.isArray(out[key])) out[key] = [];
      const mappingMatch = listMatch[1].match(/^([A-Za-z][\w-]*):\s*(.*)$/);
      listItem = mappingMatch
        ? { [mappingMatch[1]]: parseScalar(mappingMatch[2]) }
        : parseScalar(listMatch[1]);
      out[key].push(listItem);
      continue;
    }
    const continuationMatch = line.match(/^\s+([A-Za-z][\w-]*):\s*(.*)$/);
    if (continuationMatch && listItem && typeof listItem === "object") {
      listItem[continuationMatch[1]] = parseScalar(continuationMatch[2]);
      continue;
    }
    const m = line.match(/^([A-Za-z][\w-]*):\s*(.*)$/);
    if (!m) continue;
    key = m[1];
    listItem = undefined;
    out[key] = parseScalar(m[2]);
  }
  return out;
}
export async function run(ctx) {
  const ajv = new Ajv2020({ allErrors: true, strict: false });
  addFormats(ajv);
  const validators = {};
  for (const [, name] of mapping)
    validators[name] = ajv.compile(
      await readJson(workflowPath(ctx.root, "schemas", `${name}.schema.json`)),
    );
  const defaultCourses = ctx.explicit
    ? null
    : await findCourseCandidates(ctx, { allInScopes: true });
  const errors = [];
  for (const target of ctx.scanRoots) {
    const w = await walk(target, { skip: ctx.skip });
    for (const file of w.files) {
      const p = file.replaceAll("\\", "/");
      let pair = mapping.find(([re]) => re.test(p));
      let data;
      if (path.basename(file) === "video-artifact.md") {
        pair = [null, "video-artifact.frontmatter"];
        try {
          data = parseFrontmatter(await readFile(file, "utf8"));
        } catch (e) {
          errors.push(error(id, ctx.display(file), e.message));
          continue;
        }
        if (!validators[pair[1]])
          validators[pair[1]] = ajv.compile(
            await readJson(
              workflowPath(
                ctx.root,
                "schemas",
                "video-artifact.frontmatter.schema.json",
              ),
            ),
          );
      }
      if (!pair) continue;
      try {
        data ??= await readJson(file);
      } catch (e) {
        errors.push(error(id, ctx.display(file), `invalid JSON: ${e.message}`));
        continue;
      }
      if (!validators[pair[1]](data)) {
        for (const issue of validators[pair[1]].errors ?? [])
          errors.push(
            error(id, ctx.display(file), `${issue.instancePath || "/"} ${issue.message}`),
          );
      }
      if (["lab", "solved-run", "assessment-blueprint"].includes(pair[1]))
        for (const key of findForbiddenKeys(data))
          errors.push(error(id, ctx.display(file), `forbidden key ${key}`));
      if (pair[1] === "assessment-blueprint") {
        const courses =
          defaultCourses ??
          (await findCourseCandidates(
            { ...ctx, targets: [file], scanRoots: [file] },
            { allInScopes: true },
          ));
        errors.push(...(await checkBlueprintReferences(ctx, file, data, courses)));
      }
      if (pair[1] === "reconciliation" && data.author === data.decidedBy)
        errors.push(error(id, ctx.display(file), "decidedBy must differ from author"));
    }
  }
  return errors;
}
