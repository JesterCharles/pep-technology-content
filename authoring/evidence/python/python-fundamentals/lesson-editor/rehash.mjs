// Records the current sha256 of every fragment in contract.json. Run after a reviewed source change, then rebuild pages.
import { readFileSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import path from "node:path";
const DIR = path.dirname(new URL(import.meta.url).pathname);
const p = path.join(DIR, "contract.json");
const c = JSON.parse(readFileSync(p, "utf8"));
for (const f of Object.values(c.fragments)) f.sha256 = createHash("sha256").update(readFileSync(path.join(DIR, f.file), "utf8")).digest("hex");
writeFileSync(p, JSON.stringify(c, null, 2) + "\n");
console.log(Object.entries(c.fragments).map(([n, f]) => `${n} ${f.sha256}`).join("\n"));
