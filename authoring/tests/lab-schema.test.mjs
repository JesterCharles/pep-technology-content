import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";

const repo = path.resolve(import.meta.dirname, "../..");
const schema = JSON.parse(
  await readFile(path.join(repo, "authoring/schemas/lab.schema.json"), "utf8"),
);
const labId = new RegExp(schema.properties.id.pattern);

test("lab ids accept course, module, and topic scopes", () => {
  for (const id of [
    "demo-course/coding-lab",
    "demo-course/demo-module/coding-lab",
    "demo-course/demo-module/demo-topic/coding-lab",
  ]) {
    assert.match(id, labId);
  }
});

test("lab ids reject malformed paths", () => {
  for (const id of [
    "demo-course//coding-lab",
    "/demo-course/coding-lab",
    "demo-course/Demo-module/coding-lab",
    "demo-course/demo-module",
    "demo-course/coding-lab/",
  ]) {
    assert.doesNotMatch(id, labId);
  }
});
