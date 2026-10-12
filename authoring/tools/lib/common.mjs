import { createHash } from "node:crypto";
import { lstat, readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";

export const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export const AUTHORING_ROOT = "authoring";
export const RESERVED_ROOTS = new Set([
  ".git",
  ".github",
  AUTHORING_ROOT,
  "build",
  "components",
  "curriculum",
  "evidence",
  "node_modules",
  "tracks",
]);

export function posix(value) {
  return value.split(path.sep).join("/");
}
export function relative(root, value) {
  return posix(path.relative(root, value)) || ".";
}
export function stableJson(value) {
  return `${JSON.stringify(value, null, 2)}\n`;
}
export function sha256(bytes) {
  return createHash("sha256").update(bytes).digest("hex");
}
export async function fileRecord(root, file) {
  const bytes = await readFile(file);
  return { path: relative(root, file), sha256: sha256(bytes), bytes: bytes.length };
}
export async function readJson(file) {
  return JSON.parse(await readFile(file, "utf8"));
}
export async function exists(file) {
  try {
    await stat(file);
    return true;
  } catch {
    return false;
  }
}

export function authoringPath(root, ...parts) {
  return path.join(root, AUTHORING_ROOT, ...parts);
}

export function evidencePath(root, ...parts) {
  return authoringPath(root, "evidence", ...parts);
}

// Course 1 and its review records predate the authoring/ layout. Preserve their
// attested bytes while resolving only the old evidence/ namespace. A reference
// that exists at its root path always wins, which keeps the alias narrow.
export async function resolveRepositoryPath(root, reference) {
  const direct = path.resolve(root, reference);
  if (path.isAbsolute(reference) || (await exists(direct))) return direct;
  const rel = relative(root, direct);
  if (rel !== "evidence" && !rel.startsWith("evidence/")) return direct;
  return authoringPath(root, rel);
}

export async function isDirectory(file) {
  try {
    return (await stat(file)).isDirectory();
  } catch {
    return false;
  }
}

export async function walk(root, options = {}) {
  const files = [];
  const directories = [];
  const symlinks = [];
  if (!(await exists(root))) return { files, directories, symlinks };
  const visit = async (current) => {
    const info = await lstat(current);
    if (info.isSymbolicLink()) {
      symlinks.push(current);
      return;
    }
    if (!info.isDirectory()) {
      files.push(current);
      return;
    }
    directories.push(current);
    const names = (await readdir(current)).sort();
    for (const name of names) {
      if (options.skip?.(path.join(current, name), name)) continue;
      await visit(path.join(current, name));
    }
  };
  await visit(root);
  return { files, directories, symlinks };
}

export function defaultSkip(root) {
  return (full, name) => {
    const rel = relative(root, full);
    return (
      name === ".git" ||
      name === "node_modules" ||
      rel === "build" ||
      rel.startsWith("build/") ||
      rel === "authoring/tests/fixtures" ||
      rel.startsWith("authoring/tests/fixtures/")
    );
  };
}

export async function findCourseRoots(ctx) {
  const found = new Set();
  const roots = ctx.explicit ? ctx.targets : [ctx.root];
  for (const target of roots) {
    let start = target;
    try {
      if (!(await stat(start)).isDirectory()) start = path.dirname(start);
    } catch {
      continue;
    }
    let ancestor = start;
    while (ancestor.startsWith(ctx.root)) {
      if (await exists(path.join(ancestor, "course.json"))) {
        found.add(ancestor);
        break;
      }
      if (ancestor === ctx.root) break;
      ancestor = path.dirname(ancestor);
    }
    const walked = await walk(start, { skip: ctx.explicit ? undefined : defaultSkip(ctx.root) });
    for (const file of walked.files)
      if (path.basename(file) === "course.json") found.add(path.dirname(file));
  }
  return [...found].sort();
}

export async function loadCourse(courseRoot) {
  const course = await readJson(path.join(courseRoot, "course.json"));
  const modules = [];
  for (const id of course.moduleOrder ?? []) {
    const root = path.join(courseRoot, id);
    if (!(await exists(path.join(root, "module.json")))) continue;
    const manifest = await readJson(path.join(root, "module.json"));
    modules.push({ id, root, manifest });
  }
  return { root: courseRoot, manifest: course, modules };
}

export function error(rule, file, message) {
  return { rule, file, message };
}
export function formatError(item) {
  return `${item.rule} ${item.file}: ${item.message}`;
}
export function forbiddenKey(name) {
  return (
    /(answer|correct|rubric|solution|hidden)/i.test(name) ||
    /scor(?:e|ing)[-_ ]?(?:key|secret|guide)/i.test(name)
  );
}
export function findForbiddenKeys(value, prefix = "$") {
  const found = [];
  if (Array.isArray(value))
    value.forEach((item, i) => found.push(...findForbiddenKeys(item, `${prefix}[${i}]`)));
  else if (value && typeof value === "object")
    for (const [key, item] of Object.entries(value)) {
      if (forbiddenKey(key)) found.push(`${prefix}.${key}`);
      found.push(...findForbiddenKeys(item, `${prefix}.${key}`));
    }
  return found;
}
