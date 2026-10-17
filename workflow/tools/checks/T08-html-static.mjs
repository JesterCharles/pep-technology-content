import { readFile } from "node:fs/promises";
import path from "node:path";
import { error, findCourses, readJson } from "../lib/common.mjs";
export const id = "T08";
export const gate = 8;
export const description = "static HTML contract";

// Learner HTML bytes predate the repository layout migration. Keep their
// embedded provenance identifier byte-stable while catalog references use the
// physical workflow/ owner; this does not resolve or recreate the old path.
function sameMetadataValue(name, actual, expected) {
  if (actual === expected) return true;
  return (
    name === "pep:source" &&
    actual?.startsWith("authoring/evidence/") &&
    expected === actual.replace(/^authoring\//, "workflow/")
  );
}

function metas(html) {
  const out = {};
  for (const m of html.matchAll(/<meta\s+[^>]*name=["'](pep:[^"']+)["'][^>]*>/gi)) {
    const c = m[0].match(/content=["']([^"']*)["']/i);
    if (c) out[m[1].toLowerCase()] = c[1];
  }
  return out;
}

function textContent(html) {
  return html.replace(/<[^>]*>/g, " ").replace(/&nbsp;/gi, " ").replace(/\s+/g, " ").trim();
}

export function validateOptionalDisclosures(html) {
  const problems = [];
  const seen = new Set();
  const disclosures = [...html.matchAll(/<details\b([^>]*\bdata-pep-optional=["']([^"']+)["'][^>]*)>([\s\S]*?)<\/details\s*>/gi)];
  const markers = [...html.matchAll(/data-pep-optional=["']([^"']+)["']/gi)];
  if (markers.length !== disclosures.length) {
    problems.push("every data-pep-optional marker must be on a complete native <details> disclosure");
  }
  for (const match of disclosures) {
    const attributes = match[1];
    const kind = match[2].toLowerCase();
    const body = match[3];
    if (!new Set(["anecdote", "challenge"]).has(kind)) {
      problems.push(`unknown optional disclosure kind ${JSON.stringify(kind)}`);
      continue;
    }
    if (seen.has(kind)) problems.push(`optional ${kind} disclosure must not be duplicated`);
    seen.add(kind);
    const classes = attributes.match(/\bclass=["']([^"']*)["']/i)?.[1].split(/\s+/) ?? [];
    if (!classes.includes("pep-optional") || !classes.includes(`pep-optional--${kind}`)) {
      problems.push(`optional ${kind} disclosure must use pep-optional and pep-optional--${kind} classes`);
    }
    if (!/\bdata-section-skip(?:\s|=|$)/i.test(attributes)) {
      problems.push(`optional ${kind} disclosure must carry data-section-skip`);
    }
    if (/\bopen(?:\s|=|$)/i.test(attributes)) {
      problems.push(`optional ${kind} disclosure must be closed by default`);
    }
    const summary = body.match(/<summary\b[^>]*>([\s\S]*?)<\/summary\s*>/i);
    const label = summary ? textContent(summary[1]) : "";
    if (!summary) problems.push(`optional ${kind} disclosure requires a summary`);
    if (kind === "anecdote" && (!label.includes("Another way to think about it") || !label.includes("Optional example"))) {
      problems.push("optional anecdote summary must include “Another way to think about it” and “Optional example”");
    }
    if (kind === "challenge" && label !== "Challenge (optional)") {
      problems.push("optional challenge summary must be exactly “Challenge (optional)”");
    }
    if (kind === "challenge" && !/\bdata-pep-optional-time(?:\s|=|>)/i.test(body)) {
      problems.push("optional challenge requires data-pep-optional-time");
    }
    if (kind === "challenge" && !/\bdata-pep-success-criteria(?:\s|=|>)/i.test(body)) {
      problems.push("optional challenge requires data-pep-success-criteria");
    }
    if (/\b(?:data-interaction|data-confidence|data-pep-objectives|data-pep-progress|data-pep-complete)(?:\s|=|>)/i.test(body)) {
      problems.push(`optional ${kind} disclosure must not carry required objective, interaction, progress or completion hooks`);
    }
    if (/\bdata-(?:pep-)?(?:solution|answer-key|rubric|secret-test|reference-implementation)(?:\s|=|>)/i.test(body)) {
      problems.push(`optional ${kind} disclosure must not expose answer or scoring material`);
    }
  }
  const instructions = html.search(/\bdata-pep-instructions(?:\s|=|>)/i);
  const workspace = html.search(/\bdata-pep-workspace(?:\s|=|>)/i);
  const responsive = /\bdata-pep-responsive(?:\s|=|>)/i.test(html);
  if ((instructions >= 0) !== (workspace >= 0) || (workspace >= 0 && instructions > workspace) || (responsive && instructions < 0)) {
    problems.push("data-pep-instructions and data-pep-workspace must both exist, with instructions first");
  }
  if (/\bdata-pep-workspace=["']code["']/i.test(html) && !/<noscript\b[^>]*\bdata-pep-no-js(?:\s|=|>)/i.test(html)) {
    problems.push("a code workspace requires a noscript[data-pep-no-js] reading");
  }
  return problems;
}
export async function run(ctx) {
  const out = [];
  for (const course of await findCourses(ctx)) {
    const c = course.manifest;
    const cr = course.contentRoot;
    for (const mid of c.moduleOrder ?? []) {
      const m = await readJson(path.join(course.catalogRoot, mid, "module.json")).catch(() => null);
      if (!m) continue;
      for (const tid of m.topicOrder ?? []) {
        const tf = path.join(course.catalogRoot, mid, tid, "topic.json"),
          t = await readJson(tf).catch(() => null);
        if (!t || t.artifacts?.html?.status !== "present") continue;
        const f = path.join(cr, mid, tid, "artifact.html"),
          html = await readFile(f, "utf8").catch(() => null);
        if (html == null) continue;
        if (
          /<(?:script|img|link|source|video|audio|iframe|object|embed)\b[^>]*(?:src|href|data)=["'](?:https?:|\/\/|data:)/i.test(
            html,
          ) ||
          /url\(\s*["']?(?:https?:|\/\/|data:)/i.test(html) ||
          /@font-face/i.test(html)
        )
          out.push(error(id, ctx.display(f), "remote or data resource load is forbidden"));
        if (/<form\b|type=["']submit["']|\.requestSubmit\s*\(|\.submit\s*\(/i.test(html))
          out.push(error(id, ctx.display(f), "form submission dependency is forbidden"));
        if (!/data-interaction(?:\s|=|>)/i.test(html))
          out.push(error(id, ctx.display(f), "data-interaction marker is required"));
        for (const problem of validateOptionalDisclosures(html)) {
          out.push(error(id, ctx.display(f), problem));
        }
        const got = metas(html),
          want = {
            "pep:course": c.id,
            "pep:module": m.id,
            "pep:topic": t.title,
            "pep:topic-id": t.id,
            "pep:budget-minutes": String(t.minutes?.budget),
            "pep:source": t.freshness?.sourcesRef,
          };
        for (const [name, val] of Object.entries(want))
          if (!sameMetadataValue(name, got[name], val))
            out.push(
              error(
                id,
                ctx.display(f),
                `${name} must equal topic.json value ${JSON.stringify(val)}`,
              ),
            );
      }
    }
  }
  return out;
}
