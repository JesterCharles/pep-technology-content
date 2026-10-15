import { readFile } from "node:fs/promises";
import path from "node:path";
import { error, findCourses, readJson } from "../lib/common.mjs";
export const id = "T08";
export const gate = 8;
export const description = "static HTML contract";
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

function attribute(attributes, name) {
  return attributes.match(new RegExp(`\\b${name}=["']([^"']+)["']`, "i"))?.[1] ?? "";
}

function detailBlocks(html, marker) {
  return [...html.matchAll(new RegExp(`<details\\b([^>]*\\b${marker}(?=\\s|=|>)[^>]*)>([\\s\\S]*?)<\\/details\\s*>`, "gi"))];
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
    if (kind === "anecdote") {
      const content = body.replace(/<summary\b[^>]*>[\s\S]*?<\/summary\s*>/i, "");
      const stories = [...content.matchAll(/<p\b[^>]*\bdata-pep-anecdote-story(?=\s|=|>)[^>]*>([\s\S]*?)<\/p\s*>/gi)];
      const maps = [...content.matchAll(/<p\b[^>]*\bdata-pep-anecdote-map(?=\s|=|>)[^>]*>([\s\S]*?)<\/p\s*>/gi)];
      if (stories.length !== 1) problems.push("optional anecdote requires exactly one data-pep-anecdote-story paragraph");
      const story = textContent(stories[0]?.[1] ?? "");
      if (story && !/\b(?:like|imagine|picture|suppose|when|think of)\b/i.test(story)) {
        problems.push("optional anecdote story must use a concrete everyday story, analogy or mental model");
      }
      if (/<(?:pre|code|kbd|samp|textarea)\b/i.test(content)) {
        problems.push("optional anecdote must be code-free");
      }
      if (/\b(?:api|terminal|command|exact output|prints?|syntax|pseudocode|reference implementation)\b/i.test(textContent(content)) || /(?:=>|===|\+\+|--|\{[^}]*\}|\[[^\]]*\]|\b[A-Za-z_$][\w$]*\s*\([^)]*\)|\b[A-Za-z_]\w*\.[A-Za-z_]\w*\b)/.test(textContent(content))) {
        problems.push("optional anecdote must not contain syntax, API names, commands or exact program output");
      }
      if (/\b(?:comprehension|expression|for loop|while loop|method call|function call|variable assignment|operator|placeholder)\b/i.test(story)) {
        problems.push("optional anecdote story must not repeat the ordinary technical explanation");
      }
      if (maps.length > 1) problems.push("optional anecdote may have at most one data-pep-anecdote-map sentence");
      const map = textContent(maps[0]?.[1] ?? "");
      if (map && (map.split(/\s+/).length > 25 || (map.match(/[.!?](?:\s|$)/g) ?? []).length > 1)) {
        problems.push("optional anecdote concept mapping must be one short plain-language sentence");
      }
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

export function validateLearnerGuidance(html) {
  const problems = [];
  if (!/\bdata-pep-guidance-contract(?:\s|=|>)/i.test(html)) return problems;

  const objectiveDetails = detailBlocks(html, "data-pep-objectives");
  if (objectiveDetails.length !== 1) {
    problems.push("guidance-contract pages require one native details[data-pep-objectives]");
  } else {
    const [match] = objectiveDetails;
    const label = textContent(match[2].match(/<summary\b[^>]*>([\s\S]*?)<\/summary\s*>/i)?.[1] ?? "");
    if (!/^(?:Objectives|What you’ll learn|What you'll learn)$/.test(label)) {
      problems.push("course objectives must be labeled “Objectives” or “What you’ll learn”");
    }
    const detailIndex = match.index;
    const topicbarStart = html.lastIndexOf("<header", detailIndex);
    const topicbarEnd = html.indexOf("</header", detailIndex);
    if (topicbarStart < 0 || topicbarEnd < detailIndex || !/\bpep-topicbar\b/i.test(html.slice(topicbarStart, detailIndex))) {
      problems.push("course objectives must be a compact information affordance in the topic bar");
    }
  }
  if (/<(?:h[1-3]|p|legend)\b[^>]*>\s*Goals\s*<\//i.test(html)) {
    problems.push("guidance-contract pages must not label course objectives or activity checks as Goals");
  }
  const activities = [...html.matchAll(/<section\b([^>]*\bdata-pep-activity(?=\s|=|>)[^>]*)>([\s\S]*?)<\/section\s*>/gi)];
  if (!activities.length || activities.some((activity) =>
    !/\bdata-pep-activity-checks(?:\s|=|>)/i.test(activity[2]) ||
    !/\b(?:What success looks like|Activity checks)\b/i.test(activity[2])
  )) {
    problems.push("each guided activity needs nearby “What success looks like” or “Activity checks” completion criteria");
  }
  if (activities.some((activity) => !/<h2\b[^>]*>[\s\S]*?Your task[\s\S]*?<\/h2\s*>/i.test(activity[2]))) {
    problems.push("each guided activity needs a Your task heading naming the action and location");
  }
  const fit = html.match(/<section\b[^>]*\bdata-pep-where-fits(?=\s|=|>)[^>]*>([\s\S]*?)<\/section\s*>/i)?.[1] ?? "";
  if (!fit || !/\bdata-pep-fit-decision(?:\s|=|>)/i.test(fit) || !/\bdata-pep-fit-good(?:\s|=|>)/i.test(fit) || !/\bdata-pep-fit-boundary(?:\s|=|>)/i.test(fit)) {
    problems.push("guided teaching requires a separate Where this fits pattern with a decision, good fit and when-not-to-use boundary");
  }

  if (!/<button\b[^>]*\bdata-pep-previous(?:\s|=|>)/i.test(html) || !/<button\b[^>]*\bdata-pep-next(?:\s|=|>)/i.test(html)) {
    problems.push("guided activities require Previous activity and Continue/Next button actions");
  }
  if (!/<a\b[^>]*\bhref=["']#activity-[^"']+["'][^>]*\bdata-pep-activity-link(?:\s|=|>)/i.test(html) ||
      !/<a\b[^>]*\bhref=["']#activity-[^"']+["'][^>]*\bdata-pep-back-link(?:\s|=|>)/i.test(html)) {
    problems.push("guided activities require ordinary section anchors and back links for no-JavaScript reading");
  }

  const tasks = [...html.matchAll(/<[^>]*\bdata-pep-task(?=\s|=|>)[^>]*>/gi)]
    .filter((match) => /\bdata-pep-may-stall(?:\s|=|>)/i.test(match[0]))
    .map((match) => attribute(match[0], "id"))
    .filter(Boolean);
  const hints = detailBlocks(html, "data-pep-hint");
  for (const task of tasks) {
    if (!hints.some((hint) => attribute(hint[1], "data-pep-hint-for") === task)) {
      problems.push(`task ${JSON.stringify(task)} may stall and requires a native Need a hint? disclosure`);
    }
  }
  const orders = new Map();
  for (const hint of hints) {
    const attributes = hint[1];
    const body = hint[2];
    const task = attribute(attributes, "data-pep-hint-for");
    const order = Number(attribute(attributes, "data-pep-hint-order"));
    const label = textContent(body.match(/<summary\b[^>]*>([\s\S]*?)<\/summary\s*>/i)?.[1] ?? "");
    if (label !== "Need a hint?") problems.push("hint summary must be exactly “Need a hint?”");
    if (!task || !html.includes(`id="${task}"`) && !html.includes(`id='${task}'`)) problems.push("hint must identify its task with data-pep-hint-for");
    if (!/\bdata-section-skip(?:\s|=|$)/i.test(attributes)) problems.push("hint must carry data-section-skip");
    if (!/\bdata-pep-hint-target(?:\s|=|>)/i.test(body) || !/\bdata-pep-hint-step(?:\s|=|>)/i.test(body)) {
      problems.push("hint must name where to act and reveal one next reasoning step");
    }
    if (/\b(?:data-interaction|data-confidence|data-pep-objectives|data-pep-progress|data-pep-complete)(?:\s|=|>)/i.test(body)) {
      problems.push("hints must not carry required objective, interaction, progress or completion hooks");
    }
    if (/\bdata-(?:pep-)?(?:solution|answer|answer-key|rubric|secret-test|reference-implementation)(?:\s|=|>)/i.test(body) || /\b(?:the answer is|complete answer|hidden solution|private test)\b/i.test(textContent(body))) {
      problems.push("hints must not expose an answer, solution, reference implementation or private test");
    }
    if (!Number.isInteger(order) || order < 1) problems.push("hints require a positive data-pep-hint-order");
    const taskOrders = orders.get(task) ?? [];
    taskOrders.push(order);
    orders.set(task, taskOrders);
  }
  for (const taskOrders of orders.values()) {
    taskOrders.sort((a, b) => a - b);
    if (taskOrders.some((order, index) => order !== index + 1)) {
      problems.push("multiple hints for one task must use strictly increasing contiguous data-pep-hint-order values");
    }
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
        for (const problem of [...validateOptionalDisclosures(html), ...validateLearnerGuidance(html)]) {
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
          if (got[name] !== val)
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
