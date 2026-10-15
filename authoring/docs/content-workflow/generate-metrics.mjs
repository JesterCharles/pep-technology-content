#!/usr/bin/env node
import { readdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const outputPath = path.join(here, "metrics.json");
const args = process.argv.slice(2);
function option(name) {
  const index = args.indexOf(name);
  if (index < 0) return undefined;
  const value = args[index + 1];
  if (!value || value.startsWith("--")) throw new Error(`${name} requires a value`);
  return value;
}
const write = args.includes("--write");
const root = path.resolve(option("--root") ?? path.resolve(here, "../../.."));
const capturedOn = option("--captured-on") ?? new Date().toISOString().slice(0, 10);
if (!/^\d{4}-\d{2}-\d{2}$/.test(capturedOn) || Number.isNaN(Date.parse(`${capturedOn}T00:00:00Z`))) {
  throw new Error("--captured-on must be an ISO date (YYYY-MM-DD)");
}
if (write && option("--root")) throw new Error("--write only records a snapshot of this repository; omit --root");

async function json(relative) {
  return JSON.parse(await readFile(path.join(root, relative), "utf8"));
}
async function exists(relative) {
  return stat(path.join(root, relative)).then((entry) => entry.isFile()).catch(() => false);
}
async function filesBelow(relative) {
  const directory = path.join(root, relative);
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true }).catch(() => [])) {
    const child = path.join(relative, entry.name);
    if (entry.isDirectory()) files.push(...await filesBelow(child));
    else if (entry.isFile()) files.push(child.split(path.sep).join("/"));
  }
  return files;
}

const catalogRoot = "authoring/catalog";
const courseIds = (await readdir(path.join(root, catalogRoot), { withFileTypes: true }))
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort();
const repository = {
  courses: courseIds.length,
  modules: 0,
  catalogTopics: 0,
  topicsWithHtml: 0,
  modulesWithAllHtml: 0,
  learnerArtifacts: { html: 0, markdown: 0, pdf: 0, gift: 0, video: 0 },
  labs: 0,
  assessmentBlueprints: 0,
  contractGates: 0,
  implementedCheckModules: 0
};

for (const courseId of courseIds) {
  const course = await json(`${catalogRoot}/${courseId}/course.json`);
  repository.modules += course.moduleOrder.length;
  for (const moduleId of course.moduleOrder) {
    const module = await json(`${catalogRoot}/${courseId}/${moduleId}/module.json`);
    repository.catalogTopics += module.topicOrder.length;
    let moduleHtml = 0;
    for (const topicId of module.topicOrder) {
      const base = `${courseId}/${moduleId}/${topicId}`;
      for (const [key, name] of Object.entries({ html: "artifact.html", markdown: "artifact.md", pdf: "artifact.pdf", gift: "artifact.gift", video: "video-artifact.md" })) {
        if (await exists(`${base}/${name}`)) repository.learnerArtifacts[key] += 1;
      }
      if (await exists(`${base}/artifact.html`)) {
        repository.topicsWithHtml += 1;
        moduleHtml += 1;
      }
    }
    if (module.topicOrder.length > 0 && moduleHtml === module.topicOrder.length) repository.modulesWithAllHtml += 1;
  }
}

const trackedContentFiles = (await Promise.all(courseIds.map(filesBelow))).flat();
repository.labs = trackedContentFiles.filter((file) => file.endsWith("/coding-lab/lab.json")).length;
repository.assessmentBlueprints = trackedContentFiles.filter((file) => /\/assessments\/[^/]+\/blueprint\.json$/.test(file)).length;
repository.implementedCheckModules = (await readdir(path.join(root, "authoring/tools/checks"))).filter((name) => /^T\d+-.+\.mjs$/.test(name)).length;
const workflow = await readFile(path.join(root, "authoring/docs/workflow.md"), "utf8");
const gateSection = workflow.split("### 2.5 Machine gates")[1]?.split("### 2.6 Evidence")[0] ?? "";
repository.contractGates = (gateSection.match(/^\d+\./gm) ?? []).length;

const exampleRoot = "git-linux-ai-foundations/linux-foundations";
const exampleEvidence = `authoring/evidence/${exampleRoot}`;
const module = await json(`authoring/catalog/${exampleRoot}/module.json`);
const exampleFiles = await filesBelow(exampleRoot);
const firstEducation = await json(`${exampleEvidence}/module-critic-education.json`);
const firstSme = await json(`${exampleEvidence}/module-critic-sme.json`);
const firstEducationRecheck = await json(`${exampleEvidence}/module-critic-education-recheck.json`);
const firstSmeRecheck = await json(`${exampleEvidence}/module-critic-sme-recheck.json`);
const secondEducationRecheck = await json(`${exampleEvidence}/module-2-critic-education-recheck.json`);
const secondSmeRecheck = await json(`${exampleEvidence}/module-2-critic-sme-recheck.json`);
const reconciliations = [
  await json(`${exampleEvidence}/module-reconciliation.json`),
  await json(`${exampleEvidence}/module-recheck-reconciliation.json`)
];
const originalFindings = [...firstEducation.findings, ...firstSme.findings];
const newFindings = [...firstEducationRecheck.findings, ...firstSmeRecheck.findings];
const allFindings = [...originalFindings, ...newFindings];
const decisionById = new Map(reconciliations.flatMap((record) => record.decisions).map((decision) => [decision.findingId, decision.decision]));
const firstStatuses = [...firstEducationRecheck.recheck.items, ...firstSmeRecheck.recheck.items];
const secondStatuses = [...secondEducationRecheck.recheck.items, ...secondSmeRecheck.recheck.items];
const uniqueSecondStatuses = new Map(secondStatuses.map((item) => [item.findingId, item.status]));
const severity = Object.fromEntries(["critical", "high", "medium", "low"].map((value) => [value, allFindings.filter((finding) => finding.severity === value).length]));

const metrics = {
  schemaVersion: 1,
  label: "Tracked repository snapshot, not production or learner telemetry",
  capturedOn,
  regeneration: "point-in-time; regenerated on demand with generate-metrics.mjs --write, not a live content check",
  sources: [
    "authoring/catalog/*/course.json",
    "authoring/catalog/*/*/module.json",
    "<course>/<module>/<topic>/artifact.*",
    "authoring/tools/checks/T*.mjs",
    "authoring/docs/workflow.md#25-machine-gates",
    `authoring/evidence/${exampleRoot}/module-*.json`
  ],
  repository,
  example: {
    id: exampleRoot,
    topics: module.topicOrder.length,
    learnerArtifacts: {
      html: exampleFiles.filter((file) => file.endsWith("/artifact.html")).length,
      markdown: exampleFiles.filter((file) => file.endsWith("/artifact.md")).length,
      pdf: exampleFiles.filter((file) => file.endsWith("/artifact.pdf")).length,
      gift: exampleFiles.filter((file) => file.endsWith("/artifact.gift")).length,
      video: exampleFiles.filter((file) => file.endsWith("/video-artifact.md")).length
    },
    sourceReceipts: (await filesBelow(exampleEvidence)).filter((file) => file.endsWith("/sources.json")).length,
    videoReceipts: (await filesBelow(exampleEvidence)).filter((file) => file.endsWith("/video.json")).length,
    qaPathFiles: (await filesBelow(exampleEvidence)).filter((file) => file.endsWith("/qa-paths.json")).length,
    moduleReview: {
      uniqueFindings: new Set(allFindings.map((finding) => finding.id)).size,
      severity,
      acceptedFindings: [...new Set(allFindings.map((finding) => finding.id))].filter((id) => decisionById.get(id) === "accept").length,
      firstRecheck: {
        resolved: firstStatuses.filter((item) => item.status === "resolved").length,
        open: firstStatuses.filter((item) => item.status === "open").length
      },
      secondRecheckUnique: {
        resolved: [...uniqueSecondStatuses.values()].filter((status) => status === "resolved").length,
        open: [...uniqueSecondStatuses.values()].filter((status) => status === "open").length
      },
      correctionCyclesUsed: 2,
      thirdCycle: "not used; the contract requires escalation before one"
    }
  },
  unavailable: [
    "authoring and review duration",
    "model token or cost data",
    "learner usage, completion, or performance telemetry"
  ]
};
const serialized = `${JSON.stringify(metrics, null, 2)}\n`;
if (write) {
  await writeFile(outputPath, serialized);
  console.error(`wrote ${path.relative(root, outputPath)}`);
} else {
  process.stdout.write(serialized);
}
