import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { numericCodeNewlines, unsafeCodeLines } from "../tools/gift/code-newlines.mjs";
import { validateGift } from "../tools/gift/validate.mjs";

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

// The cumulative Standard/Fast final checkpoint (S43 / FT25), checked as the exact bytes that ship.
// It sits with the last shared course, whose prerequisites name every course it samples.
const COURSE = "containers-cicd";
const ID = "standard-fast-final-checkpoint";
const BANK = `${COURSE}/assessments/${ID}/checkpoint-mcq.gift`;
const BLUEPRINT = `${COURSE}/assessments/${ID}/blueprint.json`;
const CATEGORY = "standard-fast/final-checkpoint-mcq";
const QUESTIONS = 45;
const MINUTES_PER_QUESTION = 2;
const SHARED_COURSES = ["spring-boot", "python", "html-css-js", "react", "containers-cicd"];

const readJson = async (file) => JSON.parse(await readFile(path.join(repo, file), "utf8"));

test("the checkpoint bank is the only tracked checkpoint-mcq.gift", () => {
  const tracked = execFileSync("git", ["ls-files", "--", "*/assessments/*/checkpoint-mcq.gift"], {
    cwd: repo,
    encoding: "utf8",
  })
    .split("\n")
    .filter(Boolean);
  assert.deepEqual(tracked, [BANK]);
});

test("the course manifest registers the checkpoint and its blueprint states the contract", async () => {
  const manifest = await readJson(`authoring/catalog/${COURSE}/course.json`);
  assert.ok(manifest.assessments.includes(ID), "course.json registers the checkpoint");
  for (const course of SHARED_COURSES.filter((id) => id !== COURSE))
    assert.ok(manifest.prerequisites.includes(course), `${course} is a prerequisite of ${COURSE}`);
  const blueprint = await readJson(BLUEPRINT);
  assert.equal(blueprint.id, ID);
  assert.equal(blueprint.dayId, "S43");
  assert.deepEqual(blueprint.formats, ["MCQ"]);
  assert.equal(blueprint.itemCounts.MCQ, QUESTIONS);
  assert.equal(blueprint.durationMinutes, QUESTIONS * MINUTES_PER_QUESTION);
  assert.deepEqual(blueprint.weights, {}, "beta default: no weight in the published Final composite");
  for (const objective of blueprint.objectives)
    assert.ok(SHARED_COURSES.includes(objective.split("/")[0]), `${objective} is outside the shared courses`);
});

test("the checkpoint bank validates raw in [html] mode with import-safe code and spread keys", async () => {
  const bytes = await readFile(path.join(repo, BANK));
  assert.throws(() => validateGift(bytes, CATEGORY), /must not contain < or >/);
  const questions = validateGift(bytes, CATEGORY, { html: true });
  assert.equal(questions.length, QUESTIONS);
  assert.deepEqual(
    questions.map((question) => question.title),
    Array.from({ length: QUESTIONS }, (_, index) => `sfcp-q${String(index + 1).padStart(2, "0")}`),
  );
  const text = bytes.toString("ascii");
  assert.equal(Buffer.from(text, "ascii").equals(bytes), true, "bank is ASCII only");
  const lines = text.split("\n");
  const header = lines.findIndex((line) => !line.startsWith("//"));
  const dropped = lines
    .map((line, index) => (index >= header && line.trimStart().startsWith("//") ? index + 1 : 0))
    .filter(Boolean);
  assert.deepEqual(dropped, [], "question lines that GIFT import would drop as comments");
  assert.deepEqual(numericCodeNewlines(text), [], "numeric newline references in code");
  assert.deepEqual(unsafeCodeLines(text), [], "code lines that start or end with whitespace, are blank or start with //");
  const positions = {};
  let previous;
  let run = 0;
  let longest = 0;
  for (const question of questions) {
    assert.equal(question.options.length, 4, `${question.title} has four options`);
    assert.equal(question.options.filter((option) => option.correct).length, 1, `${question.title} has one key`);
    const letter = "ABCD"[question.options.findIndex((option) => option.correct)];
    positions[letter] = (positions[letter] ?? 0) + 1;
    run = letter === previous ? run + 1 : 1;
    previous = letter;
    longest = Math.max(longest, run);
  }
  for (const letter of "ABCD") assert.ok((positions[letter] ?? 0) >= 7, `${letter} keyed ${positions[letter] ?? 0} times`);
  assert.ok(longest <= 2, `longest repeated key run is ${longest}`);
});
