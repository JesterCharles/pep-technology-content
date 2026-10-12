import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { readFile } from "node:fs/promises";
import path from "node:path";
import {
  authoringPath,
  error,
  exists,
  findCourseRoots,
  loadCourse,
  readJson,
  sha256,
} from "../lib/common.mjs";

export const id = "T14";
export const gate = 14;
export const description = "reading time and calendar day budgets";

const runFile = promisify(execFile);
const estimatorSha256 = "0deca96bf5e367aeae51a82abdbd4b6ce0d0289ecc9868c9eff3701016edf96f";
const legacyCourseId = "git-linux-ai-foundations";
const legacyBasisPrefix = "legacy-label:";

function usesLegacyLabelBasis(course, minutes) {
  return course.manifest.id === legacyCourseId && minutes.basis?.startsWith(legacyBasisPrefix);
}

function requiredBudget(result, minutes) {
  return Math.ceil(Math.max(result.p50, minutes.modeledWorstPath));
}

async function estimate(root, file) {
  const tool = authoringPath(root, "tools", "timing", "estimate_reading.py");
  const { stdout } = await runFile("python3", [tool, file], {
    encoding: "utf8",
    timeout: 30_000,
  });
  return JSON.parse(stdout);
}

function calendarDays(calendar) {
  return new Map(
    (calendar.tracks ?? []).flatMap((track) =>
      (track.weeks ?? []).flatMap((week) =>
        (week.days ?? []).map((day) => [day.id, day]),
      ),
    ),
  );
}

export async function run(ctx) {
  const out = [];
  const estimator = authoringPath(
    ctx.root,
    "tools",
    "timing",
    "estimate_reading.py",
  );
  if (sha256(await readFile(estimator)) !== estimatorSha256) {
    out.push(error(id, ctx.display(estimator), "frozen estimator hash has changed"));
    return out;
  }

  const totals = new Map();
  for (const courseRoot of await findCourseRoots(ctx)) {
    const course = await loadCourse(courseRoot);
    for (const module of course.modules) {
      for (const topicId of module.manifest.topicOrder ?? []) {
        const topicFile = path.join(module.root, topicId, "topic.json");
        const topic = await readJson(topicFile).catch(() => null);
        if (!topic || topic.artifacts?.html?.status !== "present") {
          continue;
        }
        const artifact = path.join(path.dirname(topicFile), "artifact.html");
        let result;
        try {
          result = await estimate(ctx.root, artifact);
        } catch (issue) {
          out.push(error(id, ctx.display(artifact), `estimator failed: ${issue.message}`));
          continue;
        }
        const minutes = topic.minutes ?? {};
        const legacyLabelBasis = usesLegacyLabelBasis(course, minutes);
        if (!legacyLabelBasis && Number.isFinite(minutes.modeledWorstPath)) {
          const minimum = requiredBudget(result, minutes);
          if (minutes.budget < minimum) {
            out.push(
              error(
                id,
                ctx.display(topicFile),
                `budget ${minutes.budget} is below required ${minimum} minutes ` +
                  `(max of P50 ${result.p50} and worst path ${minutes.modeledWorstPath}, rounded up)`,
              ),
            );
          }
        } else if (legacyLabelBasis && result.p50 > minutes.aboutLabel) {
          out.push(
            error(
              id,
              ctx.display(artifact),
              `estimated P50 ${result.p50} exceeds approved ${minutes.aboutLabel} minute legacy label`,
            ),
          );
        }
        if (Math.abs(result.p50 - minutes.modeledP50) > 0.01) {
          out.push(
            error(
              id,
              ctx.display(topicFile),
              `modeledP50 ${minutes.modeledP50} does not match estimator ${result.p50}`,
            ),
          );
        }
        if (!Number.isFinite(minutes.modeledWorstPath)) {
          out.push(error(id, ctx.display(topicFile), "modeledWorstPath must be a number"));
        } else {
          if (minutes.modeledWorstPath < minutes.modeledP50) {
            out.push(
              error(id, ctx.display(topicFile), "modeledWorstPath must be at least modeledP50"),
            );
          }
          if (minutes.aboutLabel < minutes.modeledWorstPath) {
            out.push(error(id, ctx.display(topicFile), "aboutLabel does not cover modeledWorstPath"));
          }
        }
        if (typeof minutes.basis !== "string" || minutes.basis.trim() === "") {
          out.push(error(id, ctx.display(topicFile), "minutes.basis must be non-empty"));
        }
        for (const value of [minutes.aboutLabel, minutes.budget, minutes.modeledWorstPath]) {
          if (value > 15) {
            out.push(error(id, ctx.display(topicFile), "topic timing exceeds the 15 minute ceiling"));
            break;
          }
        }
        const dayIds = new Set(
          (topic.curriculum ?? []).flatMap((mapping) => mapping.calendarDayIds ?? []),
        );
        const dayBudget = legacyLabelBasis ? minutes.aboutLabel : minutes.budget;
        if (Number.isFinite(dayBudget)) {
          for (const dayId of dayIds) {
            totals.set(dayId, (totals.get(dayId) ?? 0) + dayBudget);
          }
        }
      }
    }
  }

  const calendarFile = path.join(ctx.root, "curriculum", "snapshot", "pep-calendar.json");
  if (await exists(calendarFile)) {
    const calendar = await readJson(calendarFile);
    const days = calendarDays(calendar);
    for (const [dayId, total] of totals) {
      const day = days.get(dayId);
      if (!day) {
        out.push(error(id, ctx.display(calendarFile), `topic mapping names unknown day ${dayId}`));
        continue;
      }
      const dayType = calendar.dayTypes?.[day.dayType];
      const blockMinutes = (dayType?.blocks ?? []).reduce(
        (sum, block) => sum + block.minutes,
        0,
      );
      if (!dayType || blockMinutes !== dayType.minutes) {
        out.push(error(id, ctx.display(calendarFile), `invalid block allocation for ${day.dayType}`));
      } else if (total > blockMinutes) {
        out.push(
          error(
            id,
            ctx.display(calendarFile),
            `${dayId} topic budgets total ${total.toFixed(2)} exceeds ${blockMinutes} minute day total ` +
              `by ${(total - blockMinutes).toFixed(2)} minutes; budgets were not compressed`,
          ),
        );
      }
    }
  }
  return out;
}
