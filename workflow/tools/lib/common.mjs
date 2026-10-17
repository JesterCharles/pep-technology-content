import { createHash } from "node:crypto";
import { lstat, readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";

export const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export const WORKFLOW_ROOT = "workflow";
export const CATALOG_ROOT = "catalog";
export const FOUNDATIONAL_ROOT = "foundational-track";
export const STANDARD_FAST_ROOT = "standard-fast-track";
export const CONTENT_ROOTS = new Set([FOUNDATIONAL_ROOT, STANDARD_FAST_ROOT]);
export const RESERVED_ROOTS = new Set([
  ".git",
  ".github",
  WORKFLOW_ROOT,
  FOUNDATIONAL_ROOT,
  STANDARD_FAST_ROOT,
  "build",
  "node_modules",
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

export function workflowPath(root, ...parts) {
  return path.join(root, WORKFLOW_ROOT, ...parts);
}

export function evidencePath(root, ...parts) {
  return workflowPath(root, "evidence", ...parts);
}

export function catalogPath(root, ...parts) {
  return workflowPath(root, CATALOG_ROOT, ...parts);
}

export function trackRootForManifest(manifest) {
  const indexes = new Set(
    (manifest?.curriculumSlice?.jsonPointers ?? [])
      .map((pointer) => pointer.match(/^\/tracks\/(\d+)\//)?.[1])
      .filter(Boolean),
  );
  if (indexes.size === 1 && indexes.has("0")) return FOUNDATIONAL_ROOT;
  if (indexes.size > 0 && [...indexes].every((index) => index === "1" || index === "2")) {
    return STANDARD_FAST_ROOT;
  }
  return null;
}

export function contentPath(root, manifest, ...parts) {
  const trackRoot = trackRootForManifest(manifest);
  if (!trackRoot) return null;
  return path.join(root, trackRoot, manifest.id, ...parts);
}

export async function findContentPath(root, manifest, ...parts) {
  const derived = contentPath(root, manifest, ...parts);
  if (derived) return derived;
  const candidates = [...CONTENT_ROOTS]
    .map((trackRoot) => path.join(root, trackRoot, manifest?.id ?? "", ...parts))
    .filter((candidate) => candidate && candidate !== root);
  const existing = [];
  for (const candidate of candidates) if (await exists(candidate)) existing.push(candidate);
  return existing.length === 1 ? existing[0] : null;
}

export function resolveRepositoryPath(root, reference) {
  return path.resolve(root, reference);
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
      rel === `${WORKFLOW_ROOT}/tests/fixtures` ||
      rel.startsWith(`${WORKFLOW_ROOT}/tests/fixtures/`)
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
    let containingScope;
    for (let ancestor = start; ancestor.startsWith(ctx.root); ancestor = path.dirname(ancestor)) {
      if (await isDirectory(catalogPath(ancestor))) {
        containingScope = ancestor;
        scopes.add(ancestor);
        break;
      }
      if (ancestor === ctx.root) break;
    }
    if (containingScope) continue;
    for (const file of (await walk(start)).files) {
      const normalized = posix(file);
      const marker = `/${WORKFLOW_ROOT}/${CATALOG_ROOT}/`;
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
      const manifest = await readJson(manifestFile).catch(() => null);
      const contentRoot = await findContentPath(repoRoot, manifest);
      const evidenceRoot = evidencePath(repoRoot, entry.name);
      if (
        ctx.explicit &&
        !allInScopes &&
        !ctx.targets.some(
          (target) =>
            target === repoRoot ||
            pathsIntersect(target, catalogRoot) ||
            (contentRoot && pathsIntersect(target, contentRoot)) ||
            pathsIntersect(target, evidenceRoot),
        )
      ) continue;
      found.push({
        id: entry.name,
        repoRoot,
        catalogRoot,
        contentRoot,
        manifestFile,
        manifest,
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
      course.manifest.id === course.id &&
      course.contentRoot,
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
