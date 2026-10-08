import { readFile } from "node:fs/promises";
import path from "node:path";
import { error, findForbiddenKeys, readJson, walk } from "../lib/common.mjs";
export const id = "T07";
export const gate = 4;
export const description = "forbidden content and secrets";
const fileRe =
  /(^|[-_.])(answer[-_ ]?key|rubric|reference[-_ ]?solution|instructor[-_ ]?solution|hidden[-_ ]?tests?)([-_.]|$)/i;
const secrets = [
  /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
  /AKIA[0-9A-Z]{16}/,
  /ghp_[A-Za-z0-9]{36}/,
  /(?:api[_-]?key|secret[_-]?key|password)\s*[:=]\s*["']?[A-Za-z0-9_\/-]{12,}/i,
];
export async function run(ctx) {
  const out = [];
  for (const root of ctx.scanRoots) {
    const w = await walk(root, { skip: ctx.skip });
    for (const f of w.files) {
      const rel = ctx.display(f);
      if (path.basename(f) !== "artifact.gift" && fileRe.test(path.basename(f)))
        out.push(error(id, rel, "forbidden assessment or solution filename"));
      let text;
      try {
        text = await readFile(f, "utf8");
      } catch {
        continue;
      }
      for (const re of secrets)
        if (re.test(text)) out.push(error(id, rel, `secret pattern detected (${re.source})`));
      if (/(?:blueprint|lab)\.json$/.test(f)) {
        try {
          for (const key of findForbiddenKeys(JSON.parse(text)))
            out.push(error(id, rel, `forbidden key ${key}`));
        } catch {}
      }
    }
  }
  return out;
}
