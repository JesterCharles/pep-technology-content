import { createHash } from "node:crypto";
import { lstat, readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";

export const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export const AUTHORING_ROOT = "authoring";
export const CATALOG_ROOT = "catalog";
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
export async function entryExists(file) {
  try {
    await lstat(file);
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

export function catalogPath(root, ...parts) {
  return authoringPath(root, CATALOG_ROOT, ...parts);
}

export function contentPath(root, ...parts) {
  return path.join(root, ...parts);
}

function movedMetadataRelativePath(value) {
  const parts = value.split("/");
  return (
    (parts.length === 2 && ["course.json", "course.lock.json"].includes(parts[1])) ||
    (parts.length === 3 && ["module.json", "module.lock.json"].includes(parts[2])) ||
    (parts.length === 4 && parts[3] === "topic.json")
  );
}

// Resolve immutable evidence references after the metadata-only catalog move.
// Existing paths always win. The alias is deliberately limited to the five
// moved metadata classes and only activates when the physical catalog file exists.
export async function resolveCatalogMetadataPath(root, file) {
  if (await exists(file)) return file;
  const rel = relative(root, file);
  if (!movedMetadataRelativePath(rel)) return file;
  const catalogFile = catalogPath(root, rel);
  return (await exists(catalogFile)) ? catalogFile : file;
}

// Course 1 and its review records predate the authoring/ layout. Preserve their
// attested bytes while resolving only the old evidence/ namespace. A reference
// that exists at its root path always wins, which keeps the alias narrow.
export async function resolveRepositoryPath(root, reference) {
  const direct = path.resolve(root, reference);
  if (path.isAbsolute(reference) || (await exists(direct))) return direct;
  const rel = relative(root, direct);
  if (rel === "evidence" || rel.startsWith("evidence/")) return authoringPath(root, rel);
  return resolveCatalogMetadataPath(root, direct);
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

export async function findCatalogScopes(ctx) {
  if (!ctx.explicit) return [ctx.root];
  const scopes = new Set();
  for (const target of ctx.targets) {
    let start = target;
    try {
      if (!(await stat(start)).isDirectory()) start = path.dirname(start);
    } catch {
      continue;
    }
    for (let ancestor = start; ancestor.startsWith(ctx.root); ancestor = path.dirname(ancestor)) {
      if (await isDirectory(catalogPath(ancestor))) scopes.add(ancestor);
      if (ancestor === ctx.root) break;
    }
    for (const file of (await walk(start)).files) {
      const normalized = posix(file);
      const marker = `/${AUTHORING_ROOT}/${CATALOG_ROOT}/`;
      const index = normalized.lastIndexOf(marker);
      if (index >= 0 && path.basename(file) === "course.json") {
        scopes.add(normalized.slice(0, index) || path.parse(normalized).root);
      }
    }
  }
  return [...scopes].sort();
}

function pathsIntersect(first, second) {
  return (
    first === second ||
    first.startsWith(`${second}${path.sep}`) ||
    second.startsWith(`${first}${path.sep}`)
  );
}

export async function findCourseCandidates(ctx, { allInScopes = false } = {}) {
  const found = [];
  for (const repoRoot of await findCatalogScopes(ctx)) {
    const root = catalogPath(repoRoot);
    for (const entry of await readdir(root, { withFileTypes: true }).catch(() => [])) {
      if (!entry.isDirectory()) continue;
      const catalogRoot = path.join(root, entry.name);
      const manifestFile = path.join(catalogRoot, "course.json");
      if (!(await exists(manifestFile))) continue;
      const contentRoot = contentPath(repoRoot, entry.name);
      const evidenceRoot = evidencePath(repoRoot, entry.name);
      if (
        ctx.explicit &&
        !allInScopes &&
        !ctx.targets.some(
          (target) =>
            target === repoRoot ||
            pathsIntersect(target, catalogRoot) ||
            pathsIntersect(target, contentRoot) ||
            pathsIntersect(target, evidenceRoot),
        )
      ) continue;
      found.push({
        id: entry.name,
        repoRoot,
        catalogRoot,
        contentRoot,
        manifestFile,
        manifest: await readJson(manifestFile).catch(() => null),
      });
    }
  }
  return found.sort((a, b) => a.manifestFile.localeCompare(b.manifestFile));
}

export async function findCourses(ctx) {
  return (await findCourseCandidates(ctx)).filter(
    (course) =>
      course.manifest &&
      SLUG_RE.test(course.id) &&
      !RESERVED_ROOTS.has(course.id) &&
      course.manifest.id === course.id,
  );
}

// Compatibility for callers that only need learner roots.
export async function findCourseRoots(ctx) {
  return (await findCourses(ctx)).map((course) => course.contentRoot);
}

export async function loadCourse(course) {
  const modules = [];
  for (const id of course.manifest.moduleOrder ?? []) {
    const catalogRoot = path.join(course.catalogRoot, id);
    const manifestFile = path.join(catalogRoot, "module.json");
    if (!(await exists(manifestFile))) continue;
    modules.push({
      id,
      catalogRoot,
      contentRoot: path.join(course.contentRoot, id),
      manifestFile,
      manifest: await readJson(manifestFile),
    });
  }
  return { ...course, modules };
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
