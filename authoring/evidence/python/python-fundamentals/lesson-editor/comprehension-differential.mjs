// Differential test: the comprehension adapter vs real CPython on generated variants of the slicing exercise.
// Usage: node comprehension-differential.mjs [cases=3000] [seed=20261015]. Needs python3 (3.10 or later) on PATH.
import { readFileSync, writeFileSync, mkdtempSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { tmpdir } from "node:os";
import path from "node:path";
const DIR = path.dirname(new URL(import.meta.url).pathname);
const A = new Function(readFileSync(path.join(DIR, "comprehension-adapter.js"), "utf8") + "\nreturn LESSON_EDITOR_COMPREHENSION;")();
let seed = +(process.argv[3] || 20261015);
const rnd = (n) => { seed = (seed + 0x6D2B79F5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return (((t ^ (t >>> 14)) >>> 0) % n); };
const pick = (a) => a[rnd(a.length)];
const rare = (good, badList, n = 6) => (rnd(n) === 0 ? pick(badList) : good());
const atom = (v) => rare(() => pick([v, v, v, String(rnd(12)), `(${v} + ${rnd(5)})`, `-${v}`, `-(${v} - ${rnd(20)})`]), ["0" + rnd(9), "x", "True"], 12);
const exprs = (v) => rare(() => pick([v, `${atom(v)} * 2`, `${atom(v)} + ${atom(v)}`, `${atom(v)} - ${rnd(40)}`, `${atom(v)} // ${rnd(4) - 1}`, `${atom(v)} % ${rnd(4) - 1}`, `(${atom(v)} * ${rnd(3)}) % 7`, `${atom(v)} * ${atom(v)} - ${atom(v)} // 3`]), [`${v} / 2`, `${v} ** 2`]);
const conds = (v) => rare(() => pick(["", "", ` if ${exprs(v)} > ${rnd(30)}`, ` if ${exprs(v)} == ${rnd(30)}`, ` if ${v} != 12`, ` if ${v} <= ${rnd(30)}`, ` if ${exprs(v)} % 2 == 0`, ` if ${rnd(20)} < ${exprs(v)}`]), [` if ${v} = 10`, ` if ${v} > 1 and ${v} < 20`, ` if 0 < ${v} < 20`, ` if ${v}`]);
function comp(kind) {
  const v = pick(["p", "p", "price", "n"]);
  const c = conds(v), e = exprs(v);
  const forPart = rare(() => ` for ${v} in prices`, [` for ${v} in range(5)`, ` for ${v} prices`, ` for x in prices`]);
  if (kind === "list") return rare(() => `[${e}${forPart}${c}]`, [`[${v}: ${e}${forPart}${c}]`, `[${e}${forPart}${c}`, `[${e} if ${v} > 1]`, "[24, 24, 60]", `{${e}${forPart}${c}}`]);
  return rare(() => pick([`{${e}${forPart}${c}}`, `{${v}: ${e}${forPart}${c}}`, `{${exprs(v)}: ${e}${forPart}${c}}`]), [`{${e}${forPart}${c}`, `{${e}, ${rnd(9)}}`, `[${e}${forPart}${c}]`]);
}
const N = +(process.argv[2] || 3000), cases = [];
for (let i = 0; i < N; i++) {
  const src = `prices = [4, 12, 12, 30]\n\nresult = ${comp("list")}\ndoubled = ${comp("set")}\n`;
  if (!cases.includes(src)) cases.push(src);
}
const dir = mkdtempSync(path.join(tmpdir(), "compr-"));
writeFileSync(path.join(dir, "cases.json"), JSON.stringify(cases));
const ref = JSON.parse(execFileSync("python3", ["-I", path.join(DIR, "comprehension-oracle.py"), path.join(dir, "cases.json")], { encoding: "utf8", maxBuffer: 1 << 26 }));
const stats = { error: 0, limit: 0, ran: 0, runtime: 0 }; let bad = 0;
cases.forEach((src, i) => {
  const r = ref[i], c = A.check(src), kinds = new Set(c.problems.map((p) => p.kind));
  if (kinds.has("error")) { stats.error++; if (r.compiled) { bad++; console.log("FALSE ERROR\n" + src); } return; }
  if (kinds.has("limit")) { stats.limit++; return; }
  if (!r.compiled) { bad++; console.log("MISSED SYNTAX ERROR\n" + src + r.err); return; }
  const run = A.run(c.program);
  if (run.status === "stopped") return;
  if (run.status === "runtime") {
    stats.runtime++;
    const msg = run.lines.at(-1).replace(/^Traceback: /, "").replace(/ \(while building \w+\)$/, "");
    if (msg !== r.err) { bad++; console.log("RUNTIME MISMATCH\n" + src + "JS " + msg + "\nPY " + r.err); }
    return;
  }
  stats.ran++;
  if (r.err) { bad++; console.log("JS RAN, PY RAISED\n" + src + r.err); return; }
  for (const name of ["result", "doubled"]) {
    const js = A.evalComp(c.program[name].comp), py = r.res[name];
    const same = js.kind === "set" ? py.kind === "set" && JSON.stringify([...js.items].sort((a, b) => a - b)) === JSON.stringify(py.items) : py.kind === js.kind && A.show(js) === py.repr;
    if (!same) { bad++; console.log("VALUE MISMATCH\n" + src + JSON.stringify(js) + " vs " + JSON.stringify(py)); }
  }
});
console.log(JSON.stringify(stats), "cases", cases.length, "mismatches", bad);
process.exit(bad ? 1 : 0);
