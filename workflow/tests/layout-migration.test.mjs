import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile, readdir, stat } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import path from "node:path";
import test from "node:test";
import { trackRootForManifest } from "../tools/lib/common.mjs";

const repo = path.resolve(import.meta.dirname, "../..");
const baselineFile = path.join(repo, "workflow/migration/layout-baseline.json");
const courseIds = [
  "collections-streams",
  "containers-cicd",
  "git-linux-ai-foundations",
  "html-css-js",
  "java-foundations",
  "python",
  "react",
  "spring-boot",
  "sql-jdbc-foundations",
];
const trackRoots = ["foundational-track", "standard-fast-track"];
const sha256 = (bytes) => createHash("sha256").update(bytes).digest("hex");

async function json(file) {
  return JSON.parse(await readFile(file, "utf8"));
}

async function exists(file) {
  try {
    await stat(file);
    return true;
  } catch {
    return false;
  }
}

async function inventory() {
  const topicIds = [];
  const learnerFiles = {};
  const courses = [];
  const counts = { "foundational-track": 0, "standard-fast-track": 0 };
  for (const courseId of courseIds) {
    const course = await json(path.join(repo, "workflow/catalog", courseId, "course.json"));
    const trackRoot = trackRootForManifest(course);
    assert.ok(trackRoot, `${courseId} must derive one track root from curriculumSlice.jsonPointers`);
    assert.equal(await exists(path.join(repo, trackRoot, courseId)), true, `${courseId} learner root`);
    for (const otherRoot of trackRoots.filter((root) => root !== trackRoot)) {
      assert.equal(await exists(path.join(repo, otherRoot, courseId)), false, `${courseId} must not be duplicated`);
    }
    const modules = [];
    for (const moduleId of course.moduleOrder) {
      const module = await json(path.join(repo, "workflow/catalog", courseId, moduleId, "module.json"));
      const topics = [];
      for (const topicId of module.topicOrder) {
        topicIds.push(`${courseId}/${moduleId}/${topicId}`);
        const topic = await json(path.join(repo, "workflow/catalog", courseId, moduleId, topicId, "topic.json"));
        topics.push({
          id: topicId,
          kind: topic.kind,
          artifactTypes: Object.fromEntries(
            Object.entries(topic.artifacts).sort(([left], [right]) => left.localeCompare(right)).map(([name, declaration]) => [name, declaration.status]),
          ),
        });
      }
      modules.push({ id: moduleId, topics });
    }
    courses.push({ id: courseId, trackRoot, modules });
    counts[trackRoot] += topicIds.filter((id) => id.startsWith(`${courseId}/`)).length;
  }

  const baseline = await json(baselineFile);
  for (const canonicalPath of Object.keys(baseline.learnerFiles)) {
    const [courseId, ...relative] = canonicalPath.split("/");
    const course = await json(path.join(repo, "workflow/catalog", courseId, "course.json"));
    const file = path.join(repo, trackRootForManifest(course), courseId, ...relative);
    const bytes = await readFile(file);
    learnerFiles[canonicalPath] = { sha256: sha256(bytes), bytes: bytes.length };
  }
  return { topicIds: topicIds.sort(), learnerFiles, courses, counts };
}

test("the migration preserves the exact canonical topic set and learner bytes", async () => {
  const baseline = await json(baselineFile);
  const current = await inventory();
  assert.deepEqual(current.topicIds, baseline.topicIds);
  assert.deepEqual(current.courses, baseline.courses);
  assert.deepEqual(current.learnerFiles, baseline.learnerFiles);
  assert.deepEqual(
    { ...current.counts, deduplicatedTotal: current.topicIds.length },
    baseline.topicCounts,
  );
});

test("Standard and Fast share one base and AWS remains the only Fast-only technology", async () => {
  const calendar = await json(path.join(repo, "workflow/curriculum/snapshot/pep-calendar.json"));
  const technologies = Object.fromEntries(
    calendar.tracks.map((track) => [
      track.id,
      new Set(track.weeks.flatMap((week) => week.days.map((day) => day.technology?.id).filter(Boolean))),
    ]),
  );
  const fastOnly = [...technologies.fast]
    .filter((id) => !technologies.standard.has(id) && !technologies.foundation.has(id))
    .sort();
  const baseline = await json(baselineFile);
  assert.deepEqual(fastOnly, baseline.fastOnlyTechnologyIds);
  assert.deepEqual(fastOnly, ["aws"]);
  const standardFastEntries = await readdir(path.join(repo, "standard-fast-track"));
  assert.equal(standardFastEntries.includes("standard"), false);
  assert.equal(standardFastEntries.includes("fast"), false);
});

test("path-valued metadata uses the migrated roots", async () => {
  const stale = [];
  const visit = (value, file, key = null) => {
    if (Array.isArray(value)) return value.forEach((item) => visit(item, file, key));
    if (value && typeof value === "object") {
      return Object.entries(value).forEach(([childKey, item]) => visit(item, file, childKey));
    }
    if (typeof value !== "string") return;
    if (["reviewedPath", "file", "artifactPath", "path", "lab"].includes(key)) {
      if (courseIds.some((courseId) => value === courseId || value.startsWith(`${courseId}/`))) {
        stale.push(`${path.relative(repo, file)}:${key}:${value}`);
      }
    }
    if (key === "sourcesRef" && !value.startsWith("workflow/evidence/")) {
      stale.push(`${path.relative(repo, file)}:${key}:${value}`);
    }
  };
  const roots = [path.join(repo, "workflow/catalog"), path.join(repo, "workflow/evidence")];
  const queue = [...roots];
  while (queue.length) {
    const current = queue.pop();
    for (const entry of await readdir(current, { withFileTypes: true })) {
      const file = path.join(current, entry.name);
      if (entry.isDirectory()) queue.push(file);
      else if (entry.name.endsWith(".json")) visit(await json(file), file);
    }
  }
  assert.deepEqual(stale, []);
});

test("root ownership and required CLI/CI entrypoints stay discoverable", async () => {
  for (const root of ["workflow", "foundational-track", "standard-fast-track"]) {
    assert.equal(await exists(path.join(repo, root)), true, `${root}/ must exist`);
  }
  for (const obsolete of ["authoring", "components", "curriculum", ...courseIds]) {
    assert.equal(await exists(path.join(repo, obsolete)), false, `obsolete root ${obsolete}/`);
  }
  const agents = await readFile(path.join(repo, "AGENTS.md"), "utf8");
  const claude = await readFile(path.join(repo, "CLAUDE.md"), "utf8");
  assert.match(agents, /workflow\/AGENTS\.md/);
  assert.ok(agents.split("\n").length < 20, "root AGENTS.md must remain a thin pointer");
  assert.match(claude, /@AGENTS\.md/);
  assert.ok(claude.split("\n").length < 5, "root CLAUDE.md must remain a thin pointer");

  const help = spawnSync(path.join(repo, "workflow/tools/pep"), ["--help"], {
    cwd: repo,
    encoding: "utf8",
  });
  assert.equal(help.status, 0, help.stderr);
  assert.match(help.stdout, /^Usage: workflow\/tools\/pep/);
  const packageJson = await json(path.join(repo, "package.json"));
  assert.equal(packageJson.scripts.test, "node --test workflow/tests/*.test.mjs");
  assert.equal(packageJson.scripts.check, "node workflow/tools/pep check");
  const ci = await readFile(path.join(repo, ".github/workflows/ci.yml"), "utf8");
  assert.match(ci, /npm test/);
  assert.match(ci, /npm run check/);
  assert.doesNotMatch(ci, /authoring\/|migrate-catalog/);
});
