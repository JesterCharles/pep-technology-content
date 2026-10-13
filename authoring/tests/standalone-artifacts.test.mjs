import assert from "node:assert/strict";
import { cp, mkdtemp, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";

const repo = path.resolve(import.meta.dirname, "../..");
const pep = path.join(repo, "authoring/tools/pep");
const fixtures = path.join(repo, "authoring/tests/fixtures/standalone");

function check(target, cwd = repo) {
  return spawnSync(process.execPath, [pep, "check", "--only", "T20", target], {
    cwd,
    encoding: "utf8",
  });
}

const negatives = [
  ["html-remote-stylesheet", /<link> href must be embedded/],
  ["html-relative-stylesheet", /<link> href must be embedded/],
  ["html-google-font", /<link> href must be embedded/],
  ["html-remote-script", /<script> src must be embedded/],
  ["html-relative-script", /<script> src must be embedded/],
  ["html-remote-img", /<img> src must be embedded/],
  ["html-relative-img", /<img> src must be embedded/],
  ["html-source", /<source> src must be embedded/],
  ["html-video-poster", /<video> poster must be embedded/],
  ["html-object", /<object> data must be embedded/],
  ["html-iframe", /<iframe> src must be embedded/],
  ["html-embed", /<embed> src must be embedded/],
  ["html-srcset", /srcset contains a non-embedded resource/],
  ["html-svg-image", /<image> href must be embedded/],
  ["html-svg-use", /<use> href must be embedded/],
  ["css-remote-url", /CSS url\(\) must be embedded/],
  ["css-relative-url", /CSS url\(\) must be embedded/],
  ["css-import", /CSS @import creates an external dependency/],
  ["css-font-face", /web fonts are not standalone/],
  ["js-fetch", /global fetch\(\) is forbidden/],
  ["js-xhr", /XMLHttpRequest is forbidden/],
  ["js-dynamic-import", /dynamic import\(\) is forbidden/],
  ["js-static-import", /external module imports are forbidden/],
  ["js-worker", /workers are forbidden/],
  ["js-shared-worker", /workers are forbidden/],
  ["js-event-source", /EventSource is forbidden/],
  ["js-websocket", /WebSocket is forbidden/],
  ["js-beacon", /sendBeacon is forbidden/],
  ["markdown-inline-image", /Markdown image must be embedded/],
  ["markdown-reference-image", /Markdown image must be embedded/],
  ["markdown-raw-html-image", /<img> src must be embedded/],
  ["markdown-core-relative-link", /relative link must be marked/],
  ["gift-pluginfile", /@@PLUGINFILE@@ dependency is forbidden/],
  ["gift-image-reference", /image or media filename is forbidden/],
  ["pdf-javascript", /PDF JavaScript action is forbidden/],
  ["pdf-launch", /PDF launch action is forbidden/],
  ["pdf-remote-goto", /PDF remote-goto action is forbidden/],
  ["pdf-unembedded-font", /PDF contains an unembedded font/],
  ["lab-missing-readme", /README\.md is the required learner entrypoint/],
  ["lab-path-traversal", /escapes the coding-lab bundle/],
  ["lab-absolute-reference", /escapes the coding-lab bundle/],
  ["lab-missing-file", /names a missing file/],
  ["lab-symlink-escape", /must not contain symlinks/],
  ["lab-outside-import", /import escapes the coding-lab bundle/],
];

for (const [name, diagnostic] of negatives) {
  test(`T20 rejects ${name}`, () => {
    const result = check(path.join(fixtures, name));
    assert.notEqual(result.status, 0, result.stdout);
    assert.match(result.stderr, new RegExp(`^T20 .*standalone/${name.replaceAll("-", "\\-")}/`, "m"));
    assert.match(result.stderr, diagnostic);
  });
}

test("T20 permits citations, optional navigation, video URLs, embedded resources, and shadowed fetch", () => {
  const result = check(path.join(fixtures, "positive"));
  assert.equal(result.status, 0, result.stderr);
});

test("T20 accepts a self-contained lab after it is copied in isolation", async () => {
  const temporary = await mkdtemp(path.join(os.tmpdir(), "pep-standalone-lab-"));
  const lab = path.join(temporary, "coding-lab");
  await cp(path.join(fixtures, "positive/self-contained-lab/coding-lab"), lab, { recursive: true });
  const result = check(lab);
  assert.equal(result.status, 0, result.stderr);
  for (const script of ["tests/setup.py", "tests/test.py"]) {
    const execution = spawnSync("python3", [script], { cwd: lab, encoding: "utf8" });
    assert.equal(execution.status, 0, execution.stderr);
  }
});

test("T20 verifies an exported lab digest inventories every shipped regular file", async () => {
  const temporary = await mkdtemp(path.join(os.tmpdir(), "pep-standalone-digest-"));
  const lab = path.join(temporary, "coding-lab");
  await cp(path.join(fixtures, "positive/self-contained-lab/coding-lab"), lab, { recursive: true });
  await writeFile(path.join(lab, "unlisted.txt"), "not in the digest\n");
  const result = check(lab);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /digest does not inventory unlisted\.txt/);
});

test("T20 scans tracked learner artifacts without relying on topic.json status", async () => {
  const temporary = await mkdtemp(path.join(os.tmpdir(), "pep-standalone-tracked-"));
  const artifact = path.join(temporary, "demo-course/demo-module/demo-topic/artifact.html");
  await cp(path.join(fixtures, "html-relative-script/artifact.html"), artifact, { recursive: true });
  for (const args of [["init", "-q"], ["add", "."]]) {
    const git = spawnSync("git", args, { cwd: temporary, encoding: "utf8" });
    assert.equal(git.status, 0, git.stderr);
  }
  const result = spawnSync(process.execPath, [pep, "check", "--only", "T20"], {
    cwd: temporary,
    encoding: "utf8",
  });
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /demo-course\/demo-module\/demo-topic\/artifact\.html:1/);
});
