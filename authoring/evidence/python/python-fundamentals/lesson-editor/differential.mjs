// Differential test: lesson checker/simulator vs real CPython on generated variants of the describe() exercise.
// Usage: node differential.mjs [cases=3000] [mutation-rate=4]. Needs python3 (3.10 or later) on PATH.
import { PYED } from "./load.mjs";
import { execFileSync } from "node:child_process";
import { writeFileSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
const L = [
  ["def describe(n):", "def describe(int n):", "def describe(n)", "def describe(n) {", "String describe(n):", "def describe(n: int) -> str:", "def describe(n, k=2):", "def describe(k=2, n):", "def describe():"],
  ["    steps = 0", "    int steps = 0", "    steps = 0;", "    var steps = 0", "steps = 0", "    steps = 0;;", "    steps=0", "        steps = 0", "    steps = null", "    steps = '0'"],
  ["    while n > 1:", "    while (n > 1) {", "    while n > 1", "    while (n > 1):", "    while n > 1 and n != 0:", "    while n > 1 && n != 0:", "    while n >= 1:", "    while not n <= 1:", "    while n > 1: n = n // 2", "    while true:"],
  ["        n = n // 2", "        n = n / 2", "        n /= 2", "        n //= 2", "        n = n / 2;", "        n = n >> 1", "        n = n - n // 2", "    n = n // 2", "        n = int(n / 2)", "        n = n % 2"],
  ["        steps += 1", "        steps++", "        steps++;", "        steps =+ 1", "        steps = steps + 1", "        steps -= -1", "        ++steps", "      steps += 1", "        steps += 1.0", "        steps += '1'"],
  ["    if steps == 0:", "    if (steps == 0) {", "    if steps == 0", "    if steps is 0:", "    if not steps:", "    if steps = 0:", "    if steps == 0: return 'tiny'", "    if steps === 0:"],
  ["        return \"tiny\"", "        return 'tiny'", "        return \"tiny\";", "    return \"tiny\"", "        return tiny", "        return"],
  ["    elif steps < 4:", "    else if steps < 4:", "    } else if (steps < 4) {", "    elif steps < 4", "    elif (steps < 4):", "    elif steps <= 3:", "    if steps < 4:"],
  ["        return \"small\"", "        return 'small'", "        return \"small\"", "        return \"sm\" + \"all\"", "        return \"small\" * 1"],
  ["    else:", "    else", "    } else {", "    else :", "    elif True:"],
  ["        return \"large\"", "        return 'large'", "        return \"large\"", "        print(\"large\")", "        return None"],
];
const TAIL = ["", "print(describe(10))", "print(describe(1), describe(100))", "print(7 / 2, 7 // 2, -7 // 2, -7 % 2, 2 ** 10)", "x = 5\nprint(x / 2, x // 2, 0.1 + 0.2)", "print(describe(\"10\"))", "print(describe(0) + 1)", "print(1 / 0)"];
let seed = 12345; const rnd = (n) => ((seed = (seed * 1103515245 + 12345) % 2147483648) % n);
const calls = [["describe(1)", 1, "'tiny'"], ["describe(10)", 10, "'small'"], ["describe(100)", 100, "'large'"]].map(([call, a, expect]) => ({ fn: "describe", call, args: [a], expect }));
const cases = [];
const N = +(process.argv[2] || 3000);
for (let i = 0; i < N; i++) {
  const lines = L.map((opts) => opts[rnd(+(process.argv[3] || 4)) === 0 ? rnd(opts.length) : 0]);
  if (rnd(8) === 0) lines.splice(rnd(lines.length), 1);
  const src = lines.join("\n") + "\n" + TAIL[rnd(TAIL.length)];
  if (cases.some((c) => c.src === src)) continue;
  const c = PYED.check(src);
  const k = { src, kinds: [...new Set(c.problems.map((p) => p.kind))] };
  if (c.body) { const r = PYED.run(c.body, calls); k.run = r; }
  cases.push(k);
}
const dir = mkdtempSync(path.join(tmpdir(), "pyed-"));
writeFileSync(path.join(dir, "cases.json"), JSON.stringify(cases));
const py = execFileSync("python3", ["-I", new URL("./cpython-oracle.py", import.meta.url).pathname, path.join(dir, "cases.json")], { encoding: "utf8", maxBuffer: 1 << 26 });
const ref = JSON.parse(py);
let bad = 0, stats = { error: 0, limit: 0, clean: 0, ran: 0 };
cases.forEach((c, i) => {
  const r = ref[i];
  const isErr = c.kinds.includes("error"), isLim = c.kinds.includes("limit");
  if (isErr) { stats.error++; if (r.compiled) { bad++; console.log("FALSE ERROR:\n" + c.src + "\n", c.kinds); } return; }
  if (isLim) { stats.limit++; return; }
  stats.clean++;
  if (!r.compiled) { bad++; console.log("MISSED SYNTAX ERROR:\n" + c.src + "\n" + r.err); return; }
  if (c.run.error && c.run.error.kind === "limit") return;
  stats.ran++;
  const js = { out: c.run.out, err: c.run.error ? c.run.error.type + ": " + c.run.error.msg : null, res: c.run.error ? null : c.run.results.map((x) => x.missing ? "missing" : x.error ? (x.error.type ? x.error.type + ": " + x.error.msg : "limit") : x.got) };
  if (js.res && js.res.includes("limit")) return;
  const same = JSON.stringify(js) === JSON.stringify(r.run);
  if (!same) { bad++; console.log("RUN MISMATCH:\n" + c.src + "\nJS " + JSON.stringify(js) + "\nPY " + JSON.stringify(r.run)); }
});
console.log(JSON.stringify(stats), "cases", cases.length, "mismatches", bad);
process.exit(bad ? 1 : 0);
