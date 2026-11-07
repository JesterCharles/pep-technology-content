#!/usr/bin/env node
// Production-path regression for the four collections-in-depth pages whose objectives ask learners to write Java:
// generics (declare and use a generic class and a generic method), big-o-basics (rewrite a nested lookup and state its
// complexity), the-equals-and-hashcode-contract (implement equals and hashCode) and how-hashmap-works (count and group
// with getOrDefault, merge and computeIfAbsent). Every committed case is a starter, incomplete, malformed or
// unsupported-shape input and must earn no credit. Generics includes one structurally distant compile-but-wrong
// task-criterion miss; its compiler/type diagnostics stay unassessed. The other three editors still prove that three
// executed failing runs settle without credit. Successful inputs never appear here: when PEP_COLLECTIONS_PRIVATE_DIR names an absolute
// uncommitted directory outside the repository, its <topic>-positives.json files (JSON arrays of editor texts, or of
// [text, stated complexity] pairs for big-o-basics) are each required to earn the one credit, and its optional
// <topic>-private-negatives.json files ([name, text] pairs, complete bodies that cannot be committed) must not.
// Nothing private is printed.
// Run from the repository root: node authoring/evidence/collections-streams/collections-in-depth/production-regression.mjs
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { launchChromium } from "../../../tools/qa/harness.mjs";

const module = "collections-streams/collections-in-depth";
const CASES = {
  "generics": {
    "activity": 2,
    "stated": null,
    "settles": false,
    "assessed": [
      ["unchecked raw relationships compile but miss the generic objective", "class Crate<Item> {\n    private Object item;\n    void fill(Object item) { this.item = item; }\n    Item take() { return (Item) item; }\n}\n\nstatic <Result> Result middle(List list) {\n    return (Result) list.get(list.size() / 2);\n}"]
    ],
    "unassessed": [
      ["wildcard-bearing form remains incomplete outside the bounded parser", "class Crate<T> {\n    private Object item;\n    void fill(Object item) { this.item = item; }\n    Object take() { return item; }\n}\n\nstatic Object middle(List<? extends Object> list) {\n    return list.get(list.size() / 2);\n}"],
      ["legal type bound outside the bounded parser", "class Crate<T extends Object> {\n    private Object item;\n    void fill(Object item) { this.item = item; }\n    Object take() { return item; }\n}\n\nstatic Object middle(List<Object> list) {\n    return list.get(list.size() / 2);\n}"],
      ["fixed Main type-check failure", "class Crate<T> {\n    private String item;\n    void fill(String item) { this.item = item; }\n    String take() { return item; }\n}\n\nstatic Object middle(List<Object> list) {\n    return list.get(list.size() / 2);\n}"]
    ],
    "refused": [
      {
        "name": "untouched starter",
        "code": null
      },
      {
        "name": "a type variable used but never declared",
        "code": "class Crate {\n    private Thing item;\n    void fill(Thing item) { this.item = item; }\n    Thing take() { return item; }\n}\n\nstatic Thing middle(List<Thing> list) {\n    return list.get(list.size() / 2);\n}"
      },
      {
        "name": "two type parameters and a List<Integer> middle",
        "code": "class Crate<A, B> {\n    private A item;\n    void fill(A item) { this.item = item; }\n    A take() { return item; }\n}\n\nstatic Integer middle(List<Integer> list) {\n    return list.get(list.size() / 2);\n}"
      },
      {
        "name": "String everywhere in Crate, Object in middle",
        "code": "class Crate<T> {\n    private String item;\n    void fill(String item) { this.item = item; }\n    String take() { return item; }\n}\n\nstatic Object middle(List<Object> list) {\n    return list.get(list.size() / 2);\n}"
      },
      {
        "name": "element type left as Object in middle, Crate unchanged",
        "code": "class Crate {\n    private Object item;\n    void fill(Object item) { this.item = item; }\n    Object take() { return item; }\n}\n\nstatic <T> T middle(List<Object> list) {\n    return list.get(list.size() / 2);\n}"
      },
      {
        "name": "body edited (outside the practice)",
        "code": "class Crate {\n    private Object item;\n    void fill(Object item) { item = item; }\n    Object take() { return item; }\n}\n\nstatic Object middle(List<Object> list) {\n    return list.get(list.size() / 2);\n}"
      }
    ]
  },
  "big-o-basics": {
    "activity": 4,
    "stated": "O(n)",
    "unassessed": [
      ["valid constructor argument outside the bounded parser", "static boolean hasRepeat(List<Integer> nums) {\n    Set<Integer> seen = new HashSet<>(nums.size());\n    return false;\n}"],
      ["compiler diagnostic missing semicolon", "static boolean hasRepeat(List<Integer> nums) {\n    return false\n}"],
      ["compiler-proven missing return", "static boolean hasRepeat(List<Integer> nums) {\n}"],
      ["compiler-proven unreachable statement", "static boolean hasRepeat(List<Integer> nums) {\n    return false;\n    return true;\n}"],
      ["compiler-proven top-level missing return", "static boolean hasRepeat(List<Integer> nums) {\n    if (nums.size() == nums.size()) return true;\n}"],
      ["legal final parameter outside the bounded parser", "static boolean hasRepeat(final List<Integer> nums) {\n    return false;\n}"],
      ["legal parenthesized return outside the bounded parser", "static boolean hasRepeat(List<Integer> nums) {\n    return (false);\n}"],
      ["unsupported keyword or literal form is not guessed as an unknown variable", "static boolean hasRepeat(List<Integer> nums) {\n    return null;\n}"],
      ["unsupported qualified call is not guessed as an unknown variable", "static boolean hasRepeat(List<Integer> nums) {\n    return nums.isEmpty();\n}"],
      ["unsupported legal empty statement stays outside the bounded parser", "static boolean hasRepeat(List<Integer> nums) {\n    ;\n    return false;\n}"],
      ["unsupported in-scope parameter used in an unmodelled comparison", "static boolean hasRepeat(List<Integer> nums) {\n    if (nums == null) return true;\n    return false;\n}"],
      ["unsupported declared collection used in an unmodelled comparison", "static boolean hasRepeat(List<Integer> nums) {\n    Set<Integer> seen = new HashSet<Integer>();\n    if (seen == null) return true;\n    return false;\n}"],
      ["unsupported in-scope parameter passed to contains", "static boolean hasRepeat(List<Integer> nums) {\n    Set<Integer> seen = new HashSet<Integer>();\n    return seen.contains(nums);\n}"],
      ["legal nums.add receiver mistake stays outside the bounded parser", "static boolean hasRepeat(List<Integer> nums) {\n    return nums.add(1);\n}"],
      ["legal nums.contains receiver mistake stays outside the bounded parser", "static boolean hasRepeat(List<Integer> nums) {\n    return nums.contains(1);\n}"],
      ["compiler-proven unknown plain identifier", "static boolean hasRepeat(List<Integer> nums) {\n    for (Integer n : nums) {\n        if (n == mystery) return true;\n    }\n    return false;\n}"]
    ],
    "refused": [
      {
        "name": "untouched starter",
        "code": null
      },
      {
        "name": "returns true for every list",
        "code": "static boolean hasRepeat(List<Integer> nums) {\n    return true;\n}"
      },
      {
        "name": "missing semicolon",
        "code": "static boolean hasRepeat(List<Integer> nums) {\n    return false\n}"
      },
      {
        "name": "classifies the input only by length",
        "code": "static boolean hasRepeat(List<Integer> nums) {\n    return nums.size() > 3;\n}"
      },
      {
        "name": "collects every value but always returns false",
        "code": "static boolean hasRepeat(List<Integer> nums) {\n    Set<Integer> seen = new HashSet<Integer>();\n    for (Integer n : nums) {\n        seen.add(n);\n    }\n    return false;\n}"
      },
      {
        "name": "a wrong-answer stream form outside the practice",
        "code": "static boolean hasRepeat(List<Integer> nums) {\n    return nums.stream().allMatch(n -> n > 0);\n}"
      }
    ]
  },
  "the-equals-and-hashcode-contract": {
    "activity": 4,
    "stated": null,
    "unassessed": [
      ["compiler diagnostic missing semicolon", "final class Course {\n    private final String code;\n    private final String term;\n    Course(String code, String term) { this.code = code; this.term = term; }\n    @Override public boolean equals(Object o) { return false }\n    @Override public int hashCode() { return 0; }\n}"],
      ["legal annotation outside the bounded parser", "@SuppressWarnings(\"all\")\nfinal class Course {\n    private final String code;\n    private final String term;\n    Course(String code, String term) { this.code = code; this.term = term; }\n    @Override public boolean equals(Object o) { return false; }\n    @Override public int hashCode() { return 0; }\n}"],
      ["compiler-proven unreachable statement", "final class Course {\n    private final String code;\n    private final String term;\n    Course(String code, String term) { this.code = code; this.term = term; }\n    @Override public boolean equals(Object o) { return false; return true; }\n    @Override public int hashCode() { return 0; }\n}"],
      ["legal final equals parameter outside the bounded parser", "final class Course {\n    private final String code;\n    private final String term;\n    Course(String code, String term) { this.code = code; this.term = term; }\n    @Override public boolean equals(final Object o) { return false; }\n    @Override public int hashCode() { return 0; }\n}"],
      ["legal parenthesized equals return outside the bounded parser", "final class Course {\n    private final String code;\n    private final String term;\n    Course(String code, String term) { this.code = code; this.term = term; }\n    @Override public boolean equals(Object o) { return (false); }\n    @Override public int hashCode() { return 0; }\n}"],
      ["unsupported qualified field call is not guessed as an unknown variable", "final class Course {\n    private final String code;\n    private final String term;\n    Course(String code, String term) { this.code = code; this.term = term; }\n    @Override public boolean equals(Object o) { return Objects.equals(this.missing(), code); }\n    @Override public int hashCode() { return 0; }\n}"],
      ["unsupported null field form is not guessed as an unknown variable", "final class Course {\n    private final String code;\n    private final String term;\n    Course(String code, String term) { this.code = code; this.term = term; }\n    @Override public boolean equals(Object o) { return Objects.equals(null, code); }\n    @Override public int hashCode() { return 0; }\n}"],
      ["unsupported in-scope equals parameter in an identity comparison", "final class Course {\n    private final String code;\n    private final String term;\n    Course(String code, String term) { this.code = code; this.term = term; }\n    @Override public boolean equals(Object o) { return o == this; }\n    @Override public int hashCode() { return 0; }\n}"],
      ["unsupported in-scope equals parameter passed to a field call", "final class Course {\n    private final String code;\n    private final String term;\n    Course(String code, String term) { this.code = code; this.term = term; }\n    @Override public boolean equals(Object o) { return code.equals(o); }\n    @Override public int hashCode() { return 0; }\n}"],
      ["unsupported in-scope equals parameter passed to Objects.equals", "final class Course {\n    private final String code;\n    private final String term;\n    Course(String code, String term) { this.code = code; this.term = term; }\n    @Override public boolean equals(Object o) { return Objects.equals(code, o); }\n    @Override public int hashCode() { return 0; }\n}"],
      ["compiler-proven unknown plain field identifier", "final class Course {\n    private final String code;\n    private final String term;\n    Course(String code, String term) { this.code = code; this.term = term; }\n    @Override public boolean equals(Object o) { return missing; }\n    @Override public int hashCode() { return 0; }\n}"]
    ],
    "refused": [
      {
        "name": "untouched starter",
        "code": null
      },
      {
        "name": "identity only, constant hash",
        "code": "final class Course {\n    private final String code;\n    private final String term;\n    Course(String code, String term) { this.code = code; this.term = term; }\n\n    @Override public boolean equals(Object o) {\n        return this == o;\n    }\n\n    @Override public int hashCode() {\n        return 0;\n    }\n}"
      },
      {
        "name": "any course equals any other, constant hash",
        "code": "final class Course {\n    private final String code;\n    private final String term;\n    Course(String code, String term) { this.code = code; this.term = term; }\n\n    @Override public boolean equals(Object o) {\n        return true;\n    }\n\n    @Override public int hashCode() {\n        return 1;\n    }\n}"
      },
      {
        "name": "equals stays false while hash changes",
        "code": "final class Course {\n    private final String code;\n    private final String term;\n    Course(String code, String term) { this.code = code; this.term = term; }\n\n    @Override public boolean equals(Object o) {\n        return false;\n    }\n\n    @Override public int hashCode() {\n        return 1;\n    }\n}"
      },
      {
        "name": "the record shortcut is not credited",
        "code": "record Course(String code, String term) { }"
      },
      {
        "name": "a missing semicolon",
        "code": "final class Course {\n    private final String code;\n    private final String term;\n    Course(String code, String term) { this.code = code; this.term = term; }\n\n    @Override public boolean equals(Object o) {\n        return false\n    }\n\n    @Override public int hashCode() {\n        return 0;\n    }\n}"
      }
    ]
  },
  "how-hashmap-works": {
    "activity": 4,
    "stated": null,
    "unassessed": [
      ["valid local variable outside the bounded parser", "static void add(Visit v) {\n    String n = v.name();\n}"],
      ["legal final parameter outside the bounded parser", "static void add(final Visit v) {\n}"],
      ["unsupported legal empty statement stays outside the bounded parser", "static void add(Visit v) {\n    ;\n}"],
      ["unsupported qualified map call is not guessed as an unknown variable", "static void add(Visit v) {\n    archive.put(v.name(), 1);\n}"],
      ["unsupported qualified combiner call is not guessed as an unknown variable", "static void add(Visit v) {\n    total.merge(v.name(), v.minutes(), (a, b) -> combine(a, b));\n}"],
      ["unsupported null combiner is not guessed as an unknown variable", "static void add(Visit v) {\n    total.merge(v.name(), v.minutes(), (a, b) -> null);\n}"],
      ["unsupported in-scope parameter assignment", "static void add(Visit v) {\n    v = null;\n}"],
      ["unsupported Visit local declaration", "static void add(Visit v) {\n    Visit w = v;\n}"],
      ["unsupported generic List local declaration", "static void add(Visit v) {\n    List<Integer> l = times.get(v.name());\n}"],
      ["unsupported in-scope parameter returned from a numeric combiner", "static void add(Visit v) {\n    total.merge(v.name(), v.minutes(), (a, b) -> v);\n}"],
      ["unsupported Object local declaration", "static void add(Visit v) {\n    Object w = v;\n}"],
      ["legal visits assignment fallback stays outside the bounded parser", "static void add(Visit v) {\n    visits = null;\n}"],
      ["legal visits lambda fallback stays outside the bounded parser", "static void add(Visit v) {\n    total.merge(v.name(), v.minutes(), (a, b) -> visits);\n}"],
      ["compiler-proven unknown plain map identifier", "static void add(Visit v) {\n    mystery = 1;\n}"],
      ["compiler-proven unknown plain combiner identifier", "static void add(Visit v) {\n    total.merge(v.name(), v.minutes(), (a, b) -> mystery);\n}"]
    ],
    "refused": [
      {
        "name": "untouched starter",
        "code": null
      },
      {
        "name": "count is always 1",
        "code": "static void add(Visit v) {\n    count.put(v.name(), 1);\n}"
      },
      {
        "name": "total is overwritten by each visit",
        "code": "static void add(Visit v) {\n    total.put(v.name(), v.minutes());\n}"
      },
      {
        "name": "get on a missing name returns null",
        "code": "static void add(Visit v) {\n    times.get(v.name()).add(v.minutes());\n}"
      },
      {
        "name": "an int cannot go into the list map",
        "code": "static void add(Visit v) {\n    times.put(v.name(), v.minutes());\n}"
      },
      {
        "name": "a missing semicolon",
        "code": "static void add(Visit v) {\n    count.put(v.name(), 1)\n}"
      },
      {
        "name": "a forEach form outside the practice",
        "code": "static void add(Visit v) {\n    visits.forEach(x -> count.put(x.name(), 1));\n}"
      }
    ]
  }
};
const privateDir = process.env.PEP_COLLECTIONS_PRIVATE_DIR;
if (privateDir && (!path.isAbsolute(privateDir) || !path.relative(process.cwd(), privateDir).startsWith(".."))) {
  console.error("PEP_COLLECTIONS_PRIVATE_DIR must be an absolute path outside the repository");
  process.exit(1);
}
const readPrivate = (name) => {
  if (!privateDir) return [];
  const file = path.join(privateDir, name);
  return fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, "utf8")) : [];
};
const failures = [];
let refused = 0, credited = 0, privateRefused = 0;
const browser = await launchChromium();
try {
  for (const [topic, spec] of Object.entries(CASES)) {
    const qa = JSON.parse(fs.readFileSync(path.join("authoring/evidence", module, topic, "qa-paths.json"), "utf8"));
    const reach = [];
    let nexts = 0;
    for (const action of qa.routes.success) {
      if (nexts >= spec.activity - 1) break;
      reach.push(action);
      if (action.do === "click" && action.selector === "#next") nexts++;
    }
    const page = await browser.newPage();
    page.on("pageerror", (error) => failures.push(`${topic}: page error ${error.message}`));
    await page.goto(pathToFileURL(path.join(module, topic, "artifact.html")).href);
    for (const action of reach) {
      const target = action.selector ? page.locator(action.selector).first() : null;
      if (action.do === "click") await target.click();
      else if (action.do === "check") await target.check();
      else if (action.do === "fill") await target.fill(action.value);
    }
    if (!(await page.locator("#ed-run").count()) || !(await page.locator(`#activity-${spec.activity}`).count())) {
      failures.push(`${topic}: activity ${spec.activity} has no practice editor where the learner writes the Java the objective names`);
      await page.close();
      continue;
    }
    const section = page.locator(`#activity-${spec.activity}`);
    if (await page.locator('input[name="ed-conf"]').count()) await page.locator('input[name="ed-conf"][value="medium"]').check();
    const run = async (code, stated) => {
      if (code != null) await page.locator("#ed").fill(code);
      if (stated != null) await page.locator("#cx").fill(stated);
      const attemptsBefore = await section.getAttribute("data-pep-attempts");
      await page.locator("#ed-run").click();
      const state = { credit: await section.getAttribute("data-pep-credit"), completed: await section.getAttribute("data-pep-completed"),
        settled: await section.getAttribute("data-pep-settled"), grade: await section.getAttribute("data-pep-grade"),
        cont: await section.getAttribute("data-pep-continue"), status: await page.locator("#ed-status").innerText(),
        attemptsBefore, attemptsAfter: await section.getAttribute("data-pep-attempts"), problems: await page.locator("#ed-prob").innerText() };
      await page.locator("#reset").click();
      if (await page.locator('input[name="ed-conf"]').count()) await page.locator('input[name="ed-conf"][value="medium"]').check();
      return state;
    };
    for (const [name, code] of spec.unassessed) {
      const state = await run(code, spec.stated);
      if (!/not assessed|outside what this practice editor/i.test(state.status)) failures.push(`${topic}: unassessed case "${name}" was not reported as unassessed (${state.status})`);
      if (/valid|legal|unsupported/.test(name) && !/Not supported/.test(state.problems)) failures.push(`${topic}: legal-unmodeled case "${name}" did not use truthful Not supported Problems text (${state.problems})`);
      if (/compiler-proven unknown plain/.test(name) && (!/Error/.test(state.problems) || !/cannot find symbol/.test(state.problems))) failures.push(`${topic}: known-undeclared case "${name}" did not use the bounded compiler diagnostic (${state.problems})`);
      if (state.attemptsAfter !== state.attemptsBefore) failures.push(`${topic}: unassessed case "${name}" consumed an assessed attempt`);
      if (/(?:receiver mistake|visits .* fallback)/.test(name) && JSON.stringify({ attempts: state.attemptsAfter, settled: state.settled, completed: state.completed, credit: state.credit, grade: state.grade, cont: state.cont }) !==
          JSON.stringify({ attempts: "0", settled: "false", completed: "false", credit: "0", grade: "0", cont: "false" })) {
        failures.push(`${topic}: legal neutral control "${name}" mutated activity state or credit`);
      }
    }
    for (const [name, code] of spec.assessed || []) {
      const state = await run(code, spec.stated);
      refused++;
      if (!/generic relationships do not meet the task/i.test(state.status)) failures.push(`${topic}: assessed case "${name}" did not report the task-criterion miss (${state.status})`);
      if (state.attemptsAfter !== String(Number(state.attemptsBefore) + 1)) failures.push(`${topic}: assessed case "${name}" did not consume exactly one attempt`);
      if (state.credit !== "0" || state.completed !== "false" || state.settled !== "false") failures.push(`${topic}: assessed case "${name}" changed completion, credit or settlement`);
    }
    for (const item of spec.refused) {
      const state = await run(item.code, spec.stated);
      refused++;
      if (state.credit !== "0" || state.completed !== "false") failures.push(`${topic}: committed case "${item.name}" was credited`);
    }
    if (topic === "generics") {
      const code = spec.assessed[0][1];
      for (let n = 0; n < 3; n++) {
        await page.locator("#ed").fill(code);
        await page.locator("#ed-run").click();
      }
      const settled = { attempts: await section.getAttribute("data-pep-attempts"), settled: await section.getAttribute("data-pep-settled"),
        completed: await section.getAttribute("data-pep-completed"), credit: await section.getAttribute("data-pep-credit"),
        grade: await section.getAttribute("data-pep-grade"), cont: await section.getAttribute("data-pep-continue") };
      if (JSON.stringify(settled) !== JSON.stringify({ attempts: "3", settled: "true", completed: "false", credit: "0", grade: "0", cont: "true" })) {
        failures.push(`generics: three assessed misses did not settle incomplete at 0/0 (${JSON.stringify(settled)})`);
      }
      if (!(await page.locator("#ed-run").isDisabled())) failures.push("generics: fitting rerun was not locked after settlement");
      await page.locator('[data-pep-activity-link][href="#activity-2"]').click();
      const afterNoop = await section.getAttribute("data-pep-attempts");
      await page.locator("#next").click();
      await page.locator("#prev").click();
      const afterNavigation = { attempts: await section.getAttribute("data-pep-attempts"), settled: await section.getAttribute("data-pep-settled"), credit: await section.getAttribute("data-pep-credit") };
      if (afterNoop !== "3" || JSON.stringify(afterNavigation) !== JSON.stringify({ attempts: "3", settled: "true", credit: "0" })) {
        failures.push(`generics: no-op or navigation changed settled state (${afterNoop}; ${JSON.stringify(afterNavigation)})`);
      }
      await page.locator("#reset").click();
      const restarted = { attempts: await section.getAttribute("data-pep-attempts"), settled: await section.getAttribute("data-pep-settled"),
        completed: await section.getAttribute("data-pep-completed"), credit: await section.getAttribute("data-pep-credit"), cont: await section.getAttribute("data-pep-continue") };
      if (JSON.stringify(restarted) !== JSON.stringify({ attempts: "0", settled: "false", completed: "false", credit: "0", cont: "false" })) {
        failures.push(`generics: Restart did not clear settlement (${JSON.stringify(restarted)})`);
      }
    }
    // The other three editors with repeated executed-but-wrong outcomes settle after three assessed misses.
    if (spec.settles !== false) {
      const assessed = spec.refused.filter((item) => !/untouched|type variable used|missing semicolon|outside|record|stream|forEach|edited/.test(item.name));
      const fails = assessed.length ? [assessed[0], assessed[0], assessed[0]] : [];
      if (fails.length !== 3) failures.push(`${topic}: expected a genuine assessed failing case for three-run settlement, found ${assessed.length}`);
      for (const item of fails) {
        if (item.code != null) await page.locator("#ed").fill(item.code);
        if (spec.stated != null) await page.locator("#cx").fill(spec.stated);
        await page.locator("#ed-run").click();
      }
      const after = { settled: await section.getAttribute("data-pep-settled"), completed: await section.getAttribute("data-pep-completed"),
        credit: await section.getAttribute("data-pep-credit"), cont: await section.getAttribute("data-pep-continue"),
        complete: await page.locator("#lesson").getAttribute("data-pep-complete") };
      if (after.settled !== "true" || after.cont !== "true" || after.completed !== "false" || after.credit !== "0" || after.complete !== "false") {
        failures.push(`${topic}: three failing runs did not settle without credit (${JSON.stringify(after)})`);
      }
    }
    await page.locator("#reset").click();
    for (const [index, entry] of readPrivate(`${topic}-positives.json`).entries()) {
      const [code, stated] = Array.isArray(entry) ? entry : [entry, spec.stated];
      const state = await run(code, stated);
      if (state.credit === "1" && state.completed === "true") credited++; else failures.push(`${topic}: private positive #${index + 1} not credited`);
    }
    for (const [index, entry] of readPrivate(`${topic}-private-negatives.json`).entries()) {
      const state = await run(entry[1], spec.stated);
      privateRefused++;
      if (state.credit !== "0") failures.push(`${topic}: private negative #${index + 1} was credited`);
    }
    await page.close();
  }
} finally {
  await browser.close();
}
console.log(`production regression: ${refused} committed failing cases refused, all-fail settles without credit on 4 editors; Generics assessed misses settle incomplete and Restart clears them while diagnostics stay unassessed` +
  (privateDir ? `; ${credited} private successful inputs credited, ${privateRefused} private failing inputs refused` : "; private inputs not supplied (set PEP_COLLECTIONS_PRIVATE_DIR)"));
if (failures.length) {
  console.error(failures.join("\n"));
  process.exitCode = 1;
}
