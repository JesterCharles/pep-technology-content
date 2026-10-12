import { readdir } from "node:fs/promises";
import path from "node:path";
import {
  error,
  exists,
  findCourseRoots,
  readJson,
  relative,
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

async function scopesForCourse(repoRoot, courseRoot, course) {
  const courseReviewable = [
    ...(await assessmentFiles(courseRoot)),
    ...(await labFiles(courseRoot)),
  ];
  const scopes = [
    {
      kind: "course",
      contentRoot: courseRoot,
      evidenceRoot: path.join(repoRoot, "evidence", course.id),
      reviewable: courseReviewable,
      historicalRoots: (course.moduleOrder ?? []).map((moduleId) =>
        path.join(courseRoot, moduleId),
      ),
    },
  ];

  for (const moduleId of course.moduleOrder ?? []) {
    const moduleRoot = path.join(courseRoot, moduleId);
    const module = await readJson(path.join(moduleRoot, "module.json")).catch(() => null);
    scopes.push({
      kind: "module",
      contentRoot: moduleRoot,
      evidenceRoot: path.join(repoRoot, "evidence", course.id, moduleId),
      reviewable: [
        ...(await assessmentFiles(moduleRoot)),
        ...(await labFiles(moduleRoot)),
      ],
    });
    for (const topicId of module?.topicOrder ?? []) {
      const topicRoot = path.join(moduleRoot, topicId);
      const reviewable = [];
      for (const name of ["artifact.html", "artifact.gift", "video-artifact.md"]) {
        const file = path.join(topicRoot, name);
        if (await exists(file)) reviewable.push(file);
      }
      reviewable.push(...(await labFiles(topicRoot)));
      scopes.push({
        kind: "topic",
        contentRoot: topicRoot,
        evidenceRoot: path.join(repoRoot, "evidence", course.id, moduleId, topicId),
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
          ctx.root,
          file,
          bindingOptions(ctx.root, scope),
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
        evidencePath: relative(ctx.root, file),
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
    const original = reportsByPath.get(report.data.recheck?.of);
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

  for (const reviewable of scope.reviewable) {
    const reviewablePath = relative(ctx.root, reviewable);
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
    const hasOpenRecheck = recheckItems.some(({ item }) => item.status === "open");
    const resolved =
      !hasOpenRecheck &&
      recheckItems.some(({ item, current }) => item.status === "resolved" && current);
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
  for (const courseRoot of await findCourseRoots(ctx)) {
    let course;
    try {
      course = await readJson(path.join(courseRoot, "course.json"));
    } catch {
      continue;
    }
    for (const scope of await scopesForCourse(ctx.root, courseRoot, course)) {
      reviewableCount += scope.reviewable.length;
      errors.push(...(await checkScope(ctx, scope)));
    }
  }
  if (!reviewableCount) console.log("T25: no reviewable files");
  return errors;
}
