import { readFile } from "node:fs/promises";
import path from "node:path";
import {
  exists,
  fileRecord,
  posix,
  readJson,
  relative,
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

function bindingTarget(repoRoot, binding, artifactRoot) {
  if (!binding.target) return null;
  if (!binding.relativeToArtifact && path.isAbsolute(binding.target)) return null;
  const base = binding.relativeToArtifact ? artifactRoot : repoRoot;
  if (!base) return null;
  const target = path.resolve(base, binding.target);
  const root = path.resolve(repoRoot);
  if (target !== root && !target.startsWith(`${root}${path.sep}`)) return null;
  return target;
}

export async function bindingsForEvidenceFile(
  repoRoot,
  evidenceFile,
  { artifactRoot = null, defaultTarget = null } = {},
) {
  const value = await readJson(evidenceFile);
  const output = [];
  for (const binding of jsonBindings(value, defaultTarget)) {
    if (!binding.target) {
      throw new Error(
        `${relative(repoRoot, evidenceFile)}: binding has no target at ${binding.field}`,
      );
    }
    const artifactFile = bindingTarget(repoRoot, binding, artifactRoot);
    if (!artifactFile || !(await exists(artifactFile))) {
      throw new Error(
        `${relative(repoRoot, evidenceFile)}: binding ${binding.field} names missing target ${binding.target}`,
      );
    }
    let bytes;
    try {
      bytes = await readFile(artifactFile);
    } catch {
      throw new Error(
        `${relative(repoRoot, evidenceFile)}: binding ${binding.field} names missing target ${binding.target}`,
      );
    }
    const currentSha256 = sha256(bytes);
    output.push({
      evidencePath: relative(repoRoot, evidenceFile),
      field: binding.field,
      artifactPath: relative(repoRoot, artifactFile),
      sha256: binding.sha256,
      current: currentSha256 === binding.sha256,
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
  const moduleWalk = await walk(moduleRoot);
  const moduleFiles = moduleWalk.files.filter(
    (file) => path.basename(file) !== "module.lock.json",
  );
  const evidenceRoot = path.join(repoRoot, "evidence", courseId, moduleId);
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
    schemaVersion: 1,
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
  const courseManifest = await readJson(path.join(courseRoot, "course.json"));
  const files = [path.join(courseRoot, "course.json")];
  for (const name of ["assessments", "coding-lab"])
    files.push(...(await walk(path.join(courseRoot, name))).files);
  const evidenceRoot = path.join(repoRoot, "evidence", courseId);
  const evidenceWalk = await walk(evidenceRoot);
  const moduleIds = new Set(courseManifest.moduleOrder ?? []);
  const courseEvidence = evidenceWalk.files.filter((file) => {
    const first = path.relative(evidenceRoot, file).split(path.sep)[0];
    return !moduleIds.has(first);
  });
  files.push(...courseEvidence);
  const bindings = await evidenceBindings(repoRoot, courseEvidence, () => ({
    artifactRoot: courseRoot,
  }));
  return {
    schemaVersion: 1,
    course: courseId,
    files: await records(repoRoot, files),
    evidenceBindings: bindings.sort((a, b) =>
      `${a.evidencePath}:${a.field}`.localeCompare(`${b.evidencePath}:${b.field}`),
    ),
  };
}

export function sameLock(actual, expected) {
  return JSON.stringify(actual) === JSON.stringify(expected);
}
