import { readFile } from "node:fs/promises";
import path from "node:path";
import { error, readJson, walk } from "../lib/common.mjs";

export const id = "T24";
export const gate = 24;
export const description = "embedded component copies match declared versions";

const OPEN_RE = /^(<!--|\/\*) pep:component ([a-z0-9]+(?:-[a-z0-9]+)*)@([^\s]+) (html|css|js) (?:-->|\*\/)\r?\n/gm;

function closeMarker(delimiter, name, kind) {
  if (delimiter === "<!--") return `<!-- /pep:component ${name} ${kind} -->`;
  return `/* /pep:component ${name} ${kind} */`;
}

function parseBlocks(text) {
  const blocks = [];
  let match;
  OPEN_RE.lastIndex = 0;
  while ((match = OPEN_RE.exec(text))) {
    const [opening, delimiter, name, version, kind] = match;
    const closing = closeMarker(delimiter, name, kind);
    const end = text.indexOf(closing, OPEN_RE.lastIndex);
    if (end < 0) {
      blocks.push({ name, version, kind, malformed: `missing ${closing}` });
      continue;
    }
    blocks.push({
      name,
      version,
      kind,
      payload: text.slice(OPEN_RE.lastIndex, end),
      opening,
    });
    OPEN_RE.lastIndex = end + closing.length;
  }
  return blocks;
}

async function loadCanonical(ctx, name, kind) {
  const componentRoot = path.join(ctx.root, "components", name);
  const metadata = await readJson(path.join(componentRoot, "component.json"));
  const fragment = metadata.fragments?.[kind];
  if (!fragment) throw new Error(`component ${name} has no ${kind} fragment`);
  return {
    metadata,
    payload: await readFile(path.join(componentRoot, fragment), "utf8"),
  };
}

export async function run(ctx) {
  const out = [];
  const seenFiles = new Set();
  for (const target of ctx.scanRoots) {
    const walked = await walk(target, { skip: ctx.skip });
    for (const file of walked.files) {
      if (path.basename(file) !== "artifact.html" || seenFiles.has(file)) continue;
      seenFiles.add(file);
      const display = ctx.display(file);
      const text = await readFile(file, "utf8");
      const blocks = parseBlocks(text);
      let topic;
      try {
        topic = await readJson(path.join(path.dirname(file), "topic.json"));
      } catch (cause) {
        if (blocks.length) out.push(error(id, display, `cannot read topic.json: ${cause.message}`));
        continue;
      }
      const declared = topic.components ?? {};
      const marked = new Set();
      const parts = new Set();
      for (const block of blocks) {
        const key = `${block.name}:${block.kind}`;
        if (parts.has(key)) {
          out.push(error(id, display, `duplicate ${block.name} ${block.kind} component block`));
          continue;
        }
        parts.add(key);
        marked.add(block.name);
        if (block.malformed) {
          out.push(error(id, display, block.malformed));
          continue;
        }
        if (!(block.name in declared)) {
          out.push(error(id, display, `component ${block.name}@${block.version} is not declared`));
          continue;
        }
        if (String(declared[block.name]) !== block.version) {
          out.push(
            error(
              id,
              display,
              `component ${block.name} marker version ${block.version} does not match topic.json ` +
                `version ${declared[block.name]}`,
            ),
          );
          continue;
        }
        try {
          const canonical = await loadCanonical(ctx, block.name, block.kind);
          if (String(canonical.metadata.version) !== block.version) {
            out.push(
              error(id, display, `component ${block.name}@${block.version} is not available`),
            );
          } else if (canonical.payload !== block.payload) {
            out.push(
              error(id, display, `${block.name}@${block.version} ${block.kind} block has drifted`),
            );
          }
        } catch (cause) {
          out.push(error(id, display, cause.message));
        }
      }
      for (const name of Object.keys(declared)) {
        if (!marked.has(name)) {
          out.push(error(id, display, `declared component ${name}@${declared[name]} has no marker`));
        }
      }
    }
  }
  return out;
}
