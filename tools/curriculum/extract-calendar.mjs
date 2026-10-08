#!/usr/bin/env node
import { readFile, writeFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";

export const extractionToolVersion = "1.0.0";

function sorted(value) {
  if (Array.isArray(value)) {
    return value.map(sorted);
  }
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.keys(value)
        .sort()
        .map((key) => [key, sorted(value[key])]),
    );
  }
  return value;
}

export function canonicalJson(value) {
  return `${JSON.stringify(sorted(value), null, 2)}\n`;
}

export function extractCalendar(html) {
  const declaration = /\bconst\s+J\s*=\s*/g;
  const matches = [...html.matchAll(declaration)];
  if (matches.length !== 1) {
    throw new Error(`expected exactly one const J declaration; found ${matches.length}`);
  }

  let index = matches[0].index + matches[0][0].length;
  while (/\s/.test(html[index] ?? "")) {
    index += 1;
  }
  if (html[index] !== "{") {
    throw new Error("const J must be assigned a JSON object");
  }

  const start = index;
  let depth = 0;
  let inString = false;
  let escaped = false;
  for (; index < html.length; index += 1) {
    const character = html[index];
    if (inString) {
      if (escaped) {
        escaped = false;
      } else if (character === "\\") {
        escaped = true;
      } else if (character === '"') {
        inString = false;
      }
      continue;
    }
    if (character === '"') {
      inString = true;
    } else if (character === "{") {
      depth += 1;
    } else if (character === "}") {
      depth -= 1;
      if (depth === 0) {
        const source = html.slice(start, index + 1);
        let parsed;
        try {
          parsed = JSON.parse(source);
        } catch (error) {
          throw new Error(`const J is not valid JSON: ${error.message}`);
        }
        return parsed;
      }
    }
  }
  throw new Error("const J object is not terminated");
}

async function main() {
  const [input, output] = process.argv.slice(2);
  if (!input || process.argv.includes("--help")) {
    console.log("Usage: node tools/curriculum/extract-calendar.mjs <calendar.html> [output.json]");
    return;
  }
  const result = canonicalJson(extractCalendar(await readFile(input, "utf8")));
  if (output) {
    await writeFile(output, result);
  } else {
    process.stdout.write(result);
  }
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  main().catch((error) => {
    console.error(`extract-calendar: ${error.message}`);
    process.exitCode = 1;
  });
}
