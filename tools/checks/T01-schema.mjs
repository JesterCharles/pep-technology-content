import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { error, findForbiddenKeys, readJson, walk } from "../lib/common.mjs";

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
async function checkBlueprintReferences(ctx, file, data) {
  const errors = [];
  let courseRoot = path.dirname(file);
  while (courseRoot.startsWith(ctx.root)) {
    try {
      await readJson(path.join(courseRoot, "course.json"));
      break;
    } catch {
      if (courseRoot === ctx.root) return errors;
      courseRoot = path.dirname(courseRoot);
    }
  }

  const objectives = Array.isArray(data.objectives) ? data.objectives : [];
  for (const reference of objectives) {
    if (typeof reference !== "string") continue;
    const match = reference.match(
      /^([a-z0-9]+(?:-[a-z0-9]+)*)\/([a-z0-9]+(?:-[a-z0-9]+)*)\/([a-z0-9]+(?:-[a-z0-9]+)*)#(o[1-9][0-9]*)$/,
    );
    if (!match || match[1] !== path.basename(courseRoot)) {
      errors.push(error(id, ctx.display(file), `objective ${reference} does not resolve`));
      continue;
    }
    const topicFile = path.join(courseRoot, match[2], match[3], "topic.json");
    let topic;
    try {
      topic = await readJson(topicFile);
    } catch {
      errors.push(error(id, ctx.display(file), `objective ${reference} does not resolve`));
      continue;
    }
    if (!(topic.objectives ?? []).some((objective) => objective.id === match[4]))
      errors.push(error(id, ctx.display(file), `objective ${reference} does not resolve`));
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
  const out = {};
  let key;
  for (const line of text.slice(4, end).split("\n")) {
    if (/^\s*-\s+/.test(line)) {
      out[key] ??= [];
      out[key].push(line.replace(/^\s*-\s+/, ""));
      continue;
    }
    const m = line.match(/^([A-Za-z][\w-]*):\s*(.*)$/);
    if (!m) continue;
    key = m[1];
    let v = m[2];
    if (v === "true" || v === "false") v = v === "true";
    else if (/^\d+(\.\d+)?$/.test(v)) v = Number(v);
    else if (v === "[]") v = [];
    out[key] = v;
  }
  return out;
}
export async function run(ctx) {
  const ajv = new Ajv2020({ allErrors: true, strict: false });
  addFormats(ajv);
  const validators = {};
  for (const [, name] of mapping)
    validators[name] = ajv.compile(
      await readJson(path.join(ctx.root, "schemas", `${name}.schema.json`)),
    );
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
              path.join(ctx.root, "schemas", "video-artifact.frontmatter.schema.json"),
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
      if (["lab", "assessment-blueprint"].includes(pair[1]))
        for (const key of findForbiddenKeys(data))
          errors.push(error(id, ctx.display(file), `forbidden key ${key}`));
      if (pair[1] === "assessment-blueprint")
        errors.push(...(await checkBlueprintReferences(ctx, file, data)));
      if (pair[1] === "reconciliation" && data.author === data.decidedBy)
        errors.push(error(id, ctx.display(file), "decidedBy must differ from author"));
    }
  }
  return errors;
}
