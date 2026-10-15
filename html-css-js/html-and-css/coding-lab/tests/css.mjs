// Small, dependency-free reader for the lab's own styles.css and index.html.
// It understands plain rules and @media blocks, which is all this lab uses.
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const here = path.dirname(fileURLToPath(import.meta.url));
export const starterDir = path.join(here, "..", "starter");

export function readStarter(name) {
  return readFileSync(path.join(starterDir, name), "utf8");
}

const clean = (value) => value.replace(/\s+/g, " ").trim();

// Equivalent spellings of one value compare equal: "repeat(2,1fr )" reads as "repeat(2, 1fr)".
const cleanValue = (value) => clean(value).replace(/\(\s+/g, "(").replace(/\s+\)/g, ")").replace(/\s*,\s*/g, ", ");

// Equivalent spellings of one media condition compare equal: "screen and (min-width:600px)" and
// "(width >= 600px)" both read as "(min-width: 600px)". Other conditions keep their own meaning.
export function cleanMedia(value) {
  return cleanValue(value.toLowerCase())
    .replace(/^(only\s+)?(screen|all)\s+and\s+/, "")
    .replace(/\s*:\s*/g, ": ")
    .replace(/^\(width\s*>=\s*([^\s()]+)\)$/, "(min-width: $1)")
    .replace(/^\(([^\s()]+)\s*<=\s*width\)$/, "(min-width: $1)");
}

function parseRules(text, media, out) {
  let i = 0;
  while (i < text.length) {
    const open = text.indexOf("{", i);
    if (open < 0) break;
    const prelude = clean(text.slice(i, open));
    let depth = 1;
    let j = open + 1;
    while (j < text.length && depth > 0) {
      if (text[j] === "{") depth++;
      else if (text[j] === "}") depth--;
      j++;
    }
    const body = text.slice(open + 1, j - 1);
    if (prelude.startsWith("@media")) {
      parseRules(body, cleanMedia(prelude.slice(6)), out);
    } else if (prelude) {
      const decls = {};
      for (const part of body.split(";")) {
        const colon = part.indexOf(":");
        if (colon < 0) continue;
        decls[clean(part.slice(0, colon)).toLowerCase()] = cleanValue(part.slice(colon + 1));
      }
      out.push({ media, selectors: prelude.split(",").map(clean), decls });
    }
    i = j;
  }
  return out;
}

export function parseCss(text) {
  return parseRules(text.replace(/\/\*[\s\S]*?\*\//g, ""), null, []);
}

export function mediaQueries(text) {
  return [...text.replace(/\/\*[\s\S]*?\*\//g, "").matchAll(/@media\s*([^{]+)\{/g)].map((m) => cleanMedia(m[1]));
}

// The value a selector gets for a property under one media condition (null for the base styles).
// Later rules win, as in the cascade, for rules with the same selector.
export function valueOf(rules, selector, property, media = null) {
  let value;
  for (const rule of rules) {
    if (rule.media === media && rule.selectors.includes(selector) && property in rule.decls) value = rule.decls[property];
  }
  return value;
}

export function areaRows(value) {
  return value ? [...value.matchAll(/"([^"]*)"/g)].map((m) => clean(m[1]).split(" ")) : [];
}

export function viewportContent(html) {
  for (const tag of html.match(/<meta\b[^>]*>/gi) ?? []) {
    if (/name\s*=\s*["']viewport["']/i.test(tag)) return tag.match(/content\s*=\s*["']([^"']*)["']/i)?.[1] ?? "";
  }
  return null;
}
