import { readFile } from "node:fs/promises";
import path from "node:path";
import {
  catalogPath,
  evidencePath,
  fileRecord,
  posix,
  readJson,
  relative,
  resolveCatalogMetadataPath,
  resolveRepositoryPath,
  sha256,
  walk,
} from "./common.mjs";

async function records(root, files) {
  const result = [];
  for (const file of [...files].sort()) result.push(await fileRecord(root, file));
  return result;
}

export function jsonBindings(value, defaultTarget = null) {
  const result = [];
  const visit = (item, field = "$", ancestorReviewedPath = null) => {
    if (Array.isArray(item)) {
      item.forEach((entry, index) => visit(entry, `${field}[${index}]`, ancestorReviewedPath));
      return;
    }
    if (!item || typeof item !== "object") return;

    const ownReviewedPath =
      typeof item.reviewedPath === "string" ? item.reviewedPath : null;
    const inheritedReviewedPath = ownReviewedPath ?? ancestorReviewedPath;
    const ownTarget =
      ownReviewedPath ??
      (typeof item.file === "string" ? item.file : null) ??
      (typeof item.location?.file === "string" ? item.location.file : null) ??
      ancestorReviewedPath ??
      defaultTarget;

    for (const [key, child] of Object.entries(item)) {
      const here = field === "$" ? key : `${field}.${key}`;
      if (
        (key === "reviewedSha256" || key === "artifactSha256") &&
        typeof child === "string"
      ) {
        result.push({
          field: here,
          target: ownTarget,
          sha256: child,
          relativeToArtifact: false,
        });
      } else if (
        key === "artifactHashes" &&
        child &&
        typeof child === "object" &&
        !Array.isArray(child)
      ) {
        for (const [artifact, hash] of Object.entries(child)) {
          if (typeof hash === "string") {
            result.push({
              field: `${here}.${artifact}`,
              target: artifact,
              sha256: hash,
              relativeToArtifact: true,
            });
          }
        }
      } else {
        visit(child, here, inheritedReviewedPath);
      }
    }
  };
  visit(value);
  return result;
}

async function bindingTarget(repoRoot, binding, artifactRoot) {
  if (!binding.target) return null;
  if (!binding.relativeToArtifact && path.isAbsolute(binding.target)) return null;
  const base = binding.relativeToArtifact ? artifactRoot : repoRoot;
  if (!base) return null;
  const candidate = binding.relativeToArtifact
    ? path.resolve(base, binding.target)
    : await resolveRepositoryPath(repoRoot, binding.target);
  const target = await resolveCatalogMetadataPath(repoRoot, candidate);
  const root = path.resolve(repoRoot);
  if (target !== root && !target.startsWith(`${root}${path.sep}`)) return null;
  return target;
}

export async function bindingsForEvidenceFile(
  repoRoot,
  evidenceFile,
  { artifactRoot = null, defaultTarget = null, historicalRoots = [] } = {},
) {
  const value = await readJson(evidenceFile);
  const output = [];
  const resolvedHistoricalRoots = historicalRoots.map((root) => path.resolve(root));
  for (const binding of jsonBindings(value, defaultTarget)) {
    if (!binding.target) {
      throw new Error(
        `${relative(repoRoot, evidenceFile)}: binding has no target at ${binding.field}`,
      );
    }
    const artifactFile = await bindingTarget(repoRoot, binding, artifactRoot);
    if (!artifactFile) {
      throw new Error(
        `${relative(repoRoot, evidenceFile)}: binding ${binding.field} names missing target ${binding.target}`,
      );
    }
    let historical = resolvedHistoricalRoots.some(
      (root) => artifactFile === root || artifactFile.startsWith(`${root}${path.sep}`),
    );
    let current = false;
    let missing = false;
    if (!historical) {
      try {
        current = sha256(await readFile(artifactFile)) === binding.sha256;
      } catch (cause) {
        if (cause.code !== "ENOENT") throw cause;
        historical = true;
        missing = true;
      }
    }
    output.push({
      evidencePath: relative(repoRoot, evidenceFile),
      field: binding.field,
      artifactPath: relative(repoRoot, artifactFile),
      sha256: binding.sha256,
      current,
      ...(historical ? { historical: true } : {}),
      ...(missing ? { missing: true } : {}),
    });
  }
  return output;
}

async function evidenceBindings(repoRoot, evidenceFiles, contextFor) {
  const output = [];
  for (const evidenceFile of [...evidenceFiles].sort()) {
    if (path.extname(evidenceFile) !== ".json") continue;
    let value;
    try {
      value = await readJson(evidenceFile);
    } catch {
      continue;
    }
    if (!jsonBindings(value).length) continue;
    output.push(
      ...(await bindingsForEvidenceFile(repoRoot, evidenceFile, contextFor(evidenceFile))),
    );
  }
  return output;
}

export async function createModuleLock(repoRoot, courseId, moduleId) {
  const moduleRoot = path.join(repoRoot, courseId, moduleId);
  const moduleCatalogRoot = catalogPath(repoRoot, courseId, moduleId);
  const contentWalk = await walk(moduleRoot);
  const catalogWalk = await walk(moduleCatalogRoot);
  const moduleFiles = [
    ...contentWalk.files,
    ...catalogWalk.files.filter((file) => path.basename(file) !== "module.lock.json"),
  ];
  const evidenceRoot = evidencePath(repoRoot, courseId, moduleId);
  const evidenceWalk = await walk(evidenceRoot);
  const allFiles = [...moduleFiles, ...evidenceWalk.files];
  const bindings = await evidenceBindings(repoRoot, evidenceWalk.files, (evidenceFile) => {
    const rel = path.relative(evidenceRoot, evidenceFile).split(path.sep);
    const topicRoot = rel.length === 2 ? path.join(moduleRoot, rel[0]) : null;
    return {
      artifactRoot: topicRoot ?? moduleRoot,
      defaultTarget: topicRoot
        ? relative(repoRoot, path.join(topicRoot, "artifact.html"))
        : null,
    };
  });
  return {
    schemaVersion: 2,
    course: courseId,
    module: moduleId,
    files: await records(repoRoot, allFiles),
    evidenceBindings: bindings
      .map((binding) => {
        const evidenceDirectory = path.relative(
          evidenceRoot,
          path.dirname(path.join(repoRoot, binding.evidencePath)),
        );
        return {
          ...(evidenceDirectory && evidenceDirectory !== "."
            ? { topic: evidenceDirectory.split(path.sep)[0] }
            : {}),
          ...binding,
        };
      })
      .sort((a, b) =>
        `${a.evidencePath}:${a.field}`.localeCompare(`${b.evidencePath}:${b.field}`),
      ),
  };
}

export async function createCourseLock(repoRoot, courseId) {
  const courseRoot = path.join(repoRoot, courseId);
  const courseManifestFile = catalogPath(repoRoot, courseId, "course.json");
  const courseManifest = await readJson(courseManifestFile);
  const courseFiles = [courseManifestFile];
  for (const name of ["assessments", "coding-lab"])
    courseFiles.push(...(await walk(path.join(courseRoot, name))).files);
  const evidenceRoot = evidencePath(repoRoot, courseId);
  const evidenceWalk = await walk(evidenceRoot);
  const moduleIds = new Set(courseManifest.moduleOrder ?? []);
  const courseEvidence = evidenceWalk.files.filter((file) => {
    const first = path.relative(evidenceRoot, file).split(path.sep)[0];
    return !moduleIds.has(first);
  });
  const files = [...courseFiles, ...courseEvidence];
  const bindings = await evidenceBindings(repoRoot, courseEvidence, () => ({
    artifactRoot: courseRoot,
    historicalRoots: [...moduleIds].flatMap((moduleId) => [
      path.join(courseRoot, moduleId),
      catalogPath(repoRoot, courseId, moduleId),
    ]),
  }));
  return {
    schemaVersion: 3,
    course: courseId,
    evidenceBindingScope: "course-level-files",
    files: await records(repoRoot, files),
    evidenceBindings: bindings
      .filter((binding) => !binding.historical || binding.missing)
      .sort((a, b) =>
        `${a.evidencePath}:${a.field}`.localeCompare(`${b.evidencePath}:${b.field}`),
      ),
  };
}

export function sameLock(actual, expected) {
  return JSON.stringify(actual) === JSON.stringify(expected);
}
