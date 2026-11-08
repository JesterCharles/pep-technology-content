import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import {
  error,
  evidencePath,
  exists,
  findCourses,
  readJson,
  relative,
  resolveRepositoryPath,
  sha256,
  walk,
} from "../lib/common.mjs";
import { bindingsForEvidenceFile } from "../lib/locks.mjs";

export const id = "T25";
export const gate = 18;
export const description = "independent critic coverage and finding closure";

const criticName =
  /^(?:[a-z0-9]+(?:-[a-z0-9]+)*-)?critic-(education|sme)(-recheck)?\.json$/;
const reconciliationName =
  /^(?:[a-z0-9]+(?:-[a-z0-9]+)*-)?reconciliation\.json$/;
const roles = ["education", "sme"];
// Minimum acceptance profile: a topic may opt in only through its own
// owner-essential-qa.json. That record never stands in for a critic verdict;
// it states that independent critic approval was not required or performed,
// and it counts only while it binds every reviewable file's current bytes.
const ownerName = "owner-essential-qa.json";
const ownerApproval = "not-required-not-performed";

async function ownerEvidence(ctx, scope) {
  if (scope.kind !== "topic") return { errors: [], covered: null };
  const file = path.join(scope.evidenceRoot, ownerName);
  if (!(await exists(file))) return { errors: [], covered: null };
  const errors = [];
  const fail = (message) => errors.push(error(id, ctx.display(file), message));
  let data;
  try {
    data = await readJson(file);
  } catch (cause) {
    fail(`invalid JSON: ${cause.message}`);
    return { errors, covered: new Set() };
  }
  if (data?.acceptanceProfile !== "minimum") fail("owner essential QA requires acceptanceProfile minimum");
  if (data?.independentCriticApproval !== ownerApproval)
    fail(`owner essential QA must state independentCriticApproval ${ownerApproval}`);
  for (const field of ["owner", "provenance", "statement", "checkedAt"]) {
    if (typeof data?.[field] !== "string" || !data[field].trim()) fail(`owner essential QA requires ${field}`);
  }
  if (!Array.isArray(data?.checks) || !data.checks.length ||
      data.checks.some((item) => typeof item !== "string" || !item.trim())) {
    fail("owner essential QA requires a non-empty checks list");
  }
  if (!Array.isArray(data?.artifacts) || !data.artifacts.length) fail("owner essential QA requires artifacts");
  let bindings = [];
  try {
    bindings = await bindingsForEvidenceFile(scope.repoRoot, file, bindingOptions(scope.repoRoot, scope));
  } catch (cause) {
    fail(cause.message);
  }
  const covered = new Set();
  if (!errors.length) {
    for (const binding of bindings) {
      if (binding.current) covered.add(binding.artifactPath);
      else fail(`owner essential QA binding ${binding.field} is stale for ${binding.artifactPath}`);
    }
  }
  return { errors, covered: errors.length ? new Set() : covered };
}

// Module-scope deferral (minimum profile only): pre-existing coding-lab
// lab.json/README.md files explicitly outside a minimum-profile release may be
// named in the module's deferred-reviewable.json with their exact current
// hash. A current entry is excluded and not counted; it carries no critic or
// owner release approval. Any other path, or a stale/missing hash, fails.
const deferralName = "deferred-reviewable.json";
const deferralConstants = {
  schemaVersion: 1,
  acceptanceProfile: "minimum",
  status: "deferred-excluded-not-counted",
  independentCriticApproval: "not-performed",
  ownerReleaseApproval: "not-granted",
};
const labReviewable = /\/coding-lab\/(?:lab\.json|README\.md)$/;

async function moduleDeferral(ctx, repoRoot, evidenceRoot, moduleRoot) {
  const file = path.join(evidenceRoot, deferralName);
  if (!(await exists(file))) return { errors: [], deferred: new Set() };
  const errors = [];
  const fail = (message) => errors.push(error(id, ctx.display(file), message));
  let data;
  try {
    data = await readJson(file);
  } catch (cause) {
    fail(`invalid JSON: ${cause.message}`);
    return { errors, deferred: new Set() };
  }
  for (const [field, value] of Object.entries(deferralConstants)) {
    if (data?.[field] !== value) fail(`deferred reviewable record requires ${field} ${value}`);
  }
  for (const field of ["owner", "statement", "recordedAt"]) {
    if (typeof data?.[field] !== "string" || !data[field].trim())
      fail(`deferred reviewable record requires ${field}`);
  }
  if (!Array.isArray(data?.files) || !data.files.length)
    fail("deferred reviewable record requires files");
  const deferred = new Set();
  const moduleLocal = `${relative(repoRoot, moduleRoot)}/`;
  for (const [index, entry] of (Array.isArray(data?.files) ? data.files : []).entries()) {
    const deferredPath = entry?.deferredPath;
    if (typeof deferredPath !== "string" || !deferredPath.startsWith(moduleLocal) ||
        !labReviewable.test(deferredPath) || deferredPath.includes("..")) {
      fail(`files[${index}].deferredPath must name a coding-lab lab.json or README.md in this module`);
      continue;
    }
    if (typeof entry?.reason !== "string" || !entry.reason.trim())
      fail(`files[${index}] requires a reason`);
    let bytes;
    try {
      bytes = await readFile(path.join(repoRoot, deferredPath));
    } catch {
      fail(`files[${index}] deferred file ${deferredPath} is missing`);
      continue;
    }
    if (sha256(bytes) !== entry?.deferredSha256) {
      fail(`files[${index}] deferred hash is stale for ${deferredPath}`);
      continue;
    }
    deferred.add(deferredPath);
  }
  return { errors, deferred: errors.length ? new Set() : deferred };
}

async function directJsonFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true }).catch(() => []);
  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".json"))
    .map((entry) => path.join(directory, entry.name))
    .sort();
}

async function assessmentFiles(root) {
  const files = [];
  for (const file of (await walk(path.join(root, "assessments"))).files) {
    const local = relative(root, file);
    if (/^assessments\/[^/]+\/blueprint\.json$/.test(local)) files.push(file);
  }
  return files;
}

async function labFiles(root) {
  const files = [];
  for (const name of ["lab.json", "README.md"]) {
    const file = path.join(root, "coding-lab", name);
    if (await exists(file)) files.push(file);
  }
  return files;
}

async function scopesForCourse(ctx, course, deferralErrors) {
  const repoRoot = course.repoRoot;
  const courseRoot = course.contentRoot;
  const manifest = course.manifest;
  const courseReviewable = [
    ...(await assessmentFiles(courseRoot)),
    ...(await labFiles(courseRoot)),
  ];
  const scopes = [
    {
      kind: "course",
      repoRoot,
      contentRoot: courseRoot,
      evidenceRoot: evidencePath(repoRoot, course.id),
      reviewable: courseReviewable,
      historicalRoots: (manifest.moduleOrder ?? []).flatMap((moduleId) => [
        path.join(courseRoot, moduleId),
        path.join(course.catalogRoot, moduleId),
      ]),
    },
  ];

  for (const moduleId of manifest.moduleOrder ?? []) {
    const moduleRoot = path.join(courseRoot, moduleId);
    const module = await readJson(path.join(course.catalogRoot, moduleId, "module.json")).catch(() => null);
    const moduleEvidenceRoot = evidencePath(repoRoot, course.id, moduleId);
    const deferral = await moduleDeferral(ctx, repoRoot, moduleEvidenceRoot, moduleRoot);
    deferralErrors.push(...deferral.errors);
    const notDeferred = (files) =>
      files.filter((file) => !deferral.deferred.has(relative(repoRoot, file)));
    scopes.push({
      kind: "module",
      repoRoot,
      contentRoot: moduleRoot,
      evidenceRoot: moduleEvidenceRoot,
      reviewable: [
        ...(await assessmentFiles(moduleRoot)),
        ...notDeferred(await labFiles(moduleRoot)),
      ],
    });
    for (const topicId of module?.topicOrder ?? []) {
      const topicRoot = path.join(moduleRoot, topicId);
      const reviewable = [];
      for (const name of ["artifact.html", "artifact.gift", "video-artifact.md"]) {
        const file = path.join(topicRoot, name);
        if (await exists(file)) reviewable.push(file);
      }
      reviewable.push(...notDeferred(await labFiles(topicRoot)));
      scopes.push({
        kind: "topic",
        repoRoot,
        contentRoot: topicRoot,
        evidenceRoot: evidencePath(repoRoot, course.id, moduleId, topicId),
        reviewable,
      });
    }
  }
  return scopes;
}

function bindingOptions(repoRoot, scope) {
  return {
    artifactRoot: scope.contentRoot,
    defaultTarget:
      scope.kind === "topic"
        ? relative(repoRoot, path.join(scope.contentRoot, "artifact.html"))
        : null,
    historicalRoots: scope.historicalRoots ?? [],
  };
}

function currentItemBinding(report, index) {
  return report.bindings.some(
    (binding) =>
      binding.field === `recheck.items[${index}].reviewedSha256` &&
      !binding.missing &&
      (binding.current || binding.historical),
  );
}

async function checkScope(ctx, scope) {
  const errors = [];
  const reports = [];
  const reconciliations = [];

  for (const file of await directJsonFiles(scope.evidenceRoot)) {
    const name = path.basename(file);
    const criticMatch = name.match(criticName);
    if (criticMatch) {
      let data;
      try {
        data = await readJson(file);
      } catch (cause) {
        errors.push(error(id, ctx.display(file), `invalid JSON: ${cause.message}`));
        continue;
      }
      let bindings = [];
      try {
        bindings = await bindingsForEvidenceFile(
          scope.repoRoot,
          file,
          bindingOptions(scope.repoRoot, scope),
        );
      } catch (cause) {
        errors.push(error(id, ctx.display(file), cause.message));
      }
      const namedRole = criticMatch[1];
      const namedRecheck = Boolean(criticMatch[2]);
      if (data.role !== namedRole)
        errors.push(
          error(
            id,
            ctx.display(file),
            `filename role ${namedRole} differs from role ${data.role}`,
          ),
        );
      if (namedRecheck !== Boolean(data.recheck))
        errors.push(
          error(
            id,
            ctx.display(file),
            namedRecheck
              ? "recheck filename requires a recheck record"
              : "recheck records require a -recheck filename",
          ),
        );
      reports.push({
        file,
        evidencePath: relative(scope.repoRoot, file),
        role: data.role,
        data,
        bindings,
        isRecheck: namedRecheck,
      });
      continue;
    }
    if (reconciliationName.test(name)) {
      try {
        reconciliations.push({ file, data: await readJson(file) });
      } catch (cause) {
        errors.push(error(id, ctx.display(file), `invalid JSON: ${cause.message}`));
      }
    }
  }

  const reportsByPath = new Map(reports.map((report) => [report.evidencePath, report]));
  for (const report of reports.filter((candidate) => candidate.isRecheck)) {
    const originalReference = report.data.recheck?.of;
    const originalPath =
      typeof originalReference === "string"
        ? relative(scope.repoRoot, await resolveRepositoryPath(scope.repoRoot, originalReference))
        : null;
    const original = reportsByPath.get(originalPath);
    if (
      !original ||
      original.isRecheck ||
      original.role !== report.role ||
      path.dirname(original.file) !== path.dirname(report.file)
    ) {
      errors.push(
        error(
          id,
          ctx.display(report.file),
          `recheck of must name an existing ${report.role} critic report in this scope`,
        ),
      );
    }
  }

  const owner = await ownerEvidence(ctx, scope);
  errors.push(...owner.errors);
  for (const reviewable of scope.reviewable) {
    const reviewablePath = relative(scope.repoRoot, reviewable);
    if (owner.covered) {
      if (!owner.covered.has(reviewablePath)) {
        errors.push(error(id, reviewablePath, "missing current owner essential QA coverage"));
      }
      continue;
    }
    for (const role of roles) {
      const covered = reports.some(
        (report) =>
          report.role === role &&
          report.bindings.some(
            (binding) => binding.artifactPath === reviewablePath && binding.current,
          ),
      );
      if (!covered) {
        errors.push(error(id, reviewablePath, `missing current ${role} critic coverage`));
      }
    }
  }

  const findings = reports.flatMap((report) =>
    (Array.isArray(report.data.findings) ? report.data.findings : []).map((finding) => ({
      ...finding,
      report,
    })),
  );
  if (!findings.length) return errors;

  if (!reconciliations.length) {
    errors.push(
      error(id, ctx.display(scope.evidenceRoot), "findings require a reconciliation"),
    );
  }
  const validReconciliations = [];
  for (const reconciliation of reconciliations) {
    if (reconciliation.data.author === reconciliation.data.decidedBy) {
      errors.push(
        error(id, ctx.display(reconciliation.file), "decidedBy must differ from author"),
      );
    } else {
      validReconciliations.push(reconciliation);
    }
  }

  const decisions = new Map();
  for (const reconciliation of validReconciliations) {
    for (const decision of reconciliation.data.decisions ?? []) {
      const entries = decisions.get(decision.findingId) ?? [];
      entries.push(decision);
      decisions.set(decision.findingId, entries);
    }
  }

  for (const finding of findings) {
    const findingDecisions = decisions.get(finding.id) ?? [];
    if (!findingDecisions.length) {
      errors.push(
        error(id, ctx.display(finding.report.file), `finding ${finding.id} is not reconciled`),
      );
    }
    if (
      !roles.includes(finding.report.role) ||
      !["critical", "high"].includes(finding.severity)
    )
      continue;

    const escalated = findingDecisions.some((decision) => decision.decision === "escalate");
    const rejected = findingDecisions.some(
      (decision) => decision.decision === "reject-with-evidence",
    );
    const recheckItems = reports
      .filter((report) => report.isRecheck && report.role === finding.report.role)
      .flatMap((report) =>
        (report.data.recheck?.items ?? [])
          .map((item, index) => ({ item, current: currentItemBinding(report, index) }))
          .filter(({ item }) => item.findingId === finding.id),
      );
    const latestCurrentRecheck = recheckItems.find(({ current }) => current);
    const resolved = latestCurrentRecheck?.item.status === "resolved";
    const accepted = findingDecisions.some((decision) => decision.decision === "accept");
    const closed = !escalated && (rejected || (accepted && resolved));
    if (!closed) {
      errors.push(
        error(
          id,
          ctx.display(finding.report.file),
          `${finding.severity} finding ${finding.id} remains open`,
        ),
      );
    }
  }

  return errors;
}

export async function run(ctx) {
  const errors = [];
  let reviewableCount = 0;
  for (const course of await findCourses(ctx)) {
    for (const scope of await scopesForCourse(ctx, course, errors)) {
      reviewableCount += scope.reviewable.length;
      errors.push(...(await checkScope(ctx, scope)));
    }
  }
  if (!reviewableCount) console.log("T25: no reviewable files");
  return errors;
}
