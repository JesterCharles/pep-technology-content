import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import {
  error,
  exists,
  readJson,
  relative,
  sha256,
  walk,
} from "../lib/common.mjs";
import {
  canonicalJson,
  extractCalendar,
  extractionToolVersion,
} from "../curriculum/extract-calendar.mjs";

export const id = "T19";
export const gate = 19;
export const description = "curriculum snapshot fidelity";

function days(value) {
  return (value.tracks ?? []).flatMap((track) =>
    (track.weeks ?? []).flatMap((week) =>
      (week.days ?? []).map((day) => ({
        track: track.track ?? track.name,
        day: day.id ?? day.day,
        topics: day.topics,
      })),
    ),
  );
}

function compareTopics(calendar, curriculum) {
  const rich = days(calendar);
  const simple = days(curriculum);
  const issues = [];
  if (rich.length !== 105 || simple.length !== 105) {
    issues.push(`expected 105 days; calendar has ${rich.length}, curriculum has ${simple.length}`);
  }
  const length = Math.max(rich.length, simple.length);
  for (let index = 0; index < length; index += 1) {
    const left = rich[index];
    const right = simple[index];
    if (!left || !right || JSON.stringify(left.topics) !== JSON.stringify(right.topics)) {
      issues.push(`topics differ on day ${left?.day ?? right?.day ?? index + 1}`);
    }
  }
  return issues;
}

async function verifyRecord(base, record) {
  const file = path.isAbsolute(record.path) ? record.path : path.join(base, record.path);
  if (!(await exists(file))) {
    return path.isAbsolute(record.path) ? null : `locked file is missing: ${record.path}`;
  }
  const bytes = await readFile(file);
  if (bytes.length !== record.bytes || sha256(bytes) !== record.sha256) {
    return `locked bytes disagree for ${record.path}`;
  }
  return null;
}

async function checkSnapshot(lockFile, display) {
  const out = [];
  let lock;
  try {
    lock = await readJson(lockFile);
  } catch (issue) {
    return [error(id, display(lockFile), `invalid lock JSON: ${issue.message}`)];
  }
  const base = path.dirname(path.dirname(lockFile));
  for (const record of lock.files ?? []) {
    const issue = await verifyRecord(base, record);
    if (issue) {
      out.push(error(id, display(lockFile), issue));
    }
  }

  const snapshotDir = path.join(path.dirname(lockFile), "snapshot");
  const calendarFile = path.join(snapshotDir, "pep-calendar.json");
  const curriculumFile = path.join(snapshotDir, "pep-curriculum.json");
  const sumsFile = path.join(snapshotDir, "SHA256SUMS");
  let calendar;
  let curriculum;
  try {
    calendar = await readJson(calendarFile);
    curriculum = await readJson(curriculumFile);
  } catch (issue) {
    out.push(error(id, display(lockFile), `snapshot JSON cannot be read: ${issue.message}`));
    return out;
  }

  if (calendar.program?.curriculumVersion !== lock.curriculumVersion) {
    out.push(error(id, display(lockFile), "curriculumVersion disagrees with calendar snapshot"));
  }
  if (lock.extractionToolVersion !== extractionToolVersion) {
    out.push(error(id, display(lockFile), "extraction tool version disagrees with current tool"));
  }
  for (const issue of compareTopics(calendar, curriculum)) {
    out.push(error(id, display(curriculumFile), issue));
  }

  try {
    const sums = await readFile(sumsFile, "utf8");
    const expected = new Map(
      sums
        .trim()
        .split("\n")
        .map((line) => {
          const match = line.match(/^([a-f0-9]{64})  (.+)$/);
          return match ? [match[2], match[1]] : [line, null];
        }),
    );
    for (const name of ["pep-calendar.json", "pep-curriculum.json"]) {
      const actual = sha256(await readFile(path.join(snapshotDir, name)));
      if (expected.get(name) !== actual) {
        out.push(error(id, display(sumsFile), `checksum disagrees for ${name}`));
      }
    }
  } catch (issue) {
    out.push(error(id, display(sumsFile), `cannot verify checksums: ${issue.message}`));
  }

  const sourceCalendar = (lock.files ?? []).find((record) => record.path.endsWith("pep-calendar.html"));
  const sourceCurriculum = (lock.files ?? []).find(
    (record) =>
      path.isAbsolute(record.path) && record.path.endsWith("pep-curriculum.json"),
  );
  if (sourceCalendar && (await exists(sourceCalendar.path))) {
    try {
      const extracted = canonicalJson(extractCalendar(await readFile(sourceCalendar.path, "utf8")));
      if (extracted !== (await readFile(calendarFile, "utf8"))) {
        out.push(error(id, display(calendarFile), "snapshot differs from local calendar re-extraction"));
      }
    } catch (issue) {
      out.push(error(id, display(calendarFile), `local calendar re-extraction failed: ${issue.message}`));
    }
  }
  if (sourceCurriculum && (await exists(sourceCurriculum.path))) {
    if (!(await readFile(sourceCurriculum.path)).equals(await readFile(curriculumFile))) {
      out.push(error(id, display(curriculumFile), "snapshot differs from local curriculum source"));
    }
  }
  return out;
}

export async function run(ctx) {
  const lockFiles = new Set();
  for (const target of ctx.scanRoots) {
    let info;
    try {
      info = await stat(target);
    } catch {
      continue;
    }
    if (info.isFile() && path.basename(target) === "curriculum.lock.json") {
      lockFiles.add(target);
      continue;
    }
    const root = info.isDirectory() ? target : path.dirname(target);
    for (const file of (await walk(root, { skip: ctx.skip })).files) {
      if (path.basename(file) === "curriculum.lock.json") {
        lockFiles.add(file);
      }
    }
  }
  const out = [];
  for (const file of [...lockFiles].sort()) {
    out.push(...(await checkSnapshot(file, ctx.display)));
  }
  return out;
}
