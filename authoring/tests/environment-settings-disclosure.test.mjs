import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import test from "node:test";
import { launchChromium } from "../tools/qa/harness.mjs";

// Activity 2's completed .env line and api.js are withheld construction work. This test derives the line's shape
// from public task bytes at run time and never writes either answer into the repository. Cases that need the real
// answers read them from an external file named by PEP_ENV_SETTINGS_INPUTS_FILE, and skip without it.
const topicRoot = path.resolve("html-css-js/fetch-and-browser-client/environment-settings-for-the-api-address");
const qaFile = path.resolve("authoring/evidence/html-css-js/fetch-and-browser-client/environment-settings-for-the-api-address/qa-paths.json");
const skip = !existsSync(topicRoot);
const read = (name) => readFileSync(path.join(topicRoot, name), "utf8");
const collapse = (text) => text.replace(/\s+/gu, " ");
const decodeHtml = (text) => text
  .replace(/&#x([0-9a-f]+);/giu, (_, code) => String.fromCodePoint(Number.parseInt(code, 16)))
  .replace(/&#(\d+);/gu, (_, code) => String.fromCodePoint(Number(code)))
  .replace(/&lt;/gu, "<").replace(/&gt;/gu, ">").replace(/&quot;/gu, '"').replace(/&#39;/gu, "'").replace(/&amp;/gu, "&");
const decodeGift = (text) => text.replace(/\\([~=#{}:\\])/gu, "$1");
const holds = (text, value) => text.includes(value) || collapse(text).includes(collapse(value));

function publicFacts() {
  const html = read("artifact.html");
  const section = (n) => html.slice(html.indexOf(`id="activity-${n}"`), html.indexOf(`id="activity-${n + 1}"`));
  const activity2 = section(2);
  const activity3 = section(3);
  const starter = decodeHtml(activity2.match(/<textarea[^>]*data-file="\.env"[^>]*>([^<]*)<\/textarea>/u)[1]).trim();
  const name = activity2.match(/rename the variable so Vite will expose it\. Name it <code>(\w+)<\/code>/u)[1];
  const activity2Address = starter.slice(starter.indexOf("=") + 1);
  const scripts = html.slice(html.indexOf("<script"));
  const labStart = scripts.indexOf("a3: { lab:");
  const model = scripts.slice(labStart, scripts.indexOf("\n</script>", labStart));
  const [developmentLine, alternateName, alternate] = activity3.match(/>(VITE_(?!PAY_KEY)(\w+)=(\S+))/u).map((part, index) => (index === 2 ? `VITE_${part}` : part)).slice(1);
  return { html, activity2, activity3, starter, name, target: `${name}=${activity2Address}`, activity2Address, model, developmentLine, alternateName, alternate };
}

test("Activity 2's .env target and its trivial remappings stay out of later surfaces and companions", { skip }, () => {
  const facts = publicFacts();
  assert.ok(!facts.starter.startsWith(facts.name), "Activity 2 still asks the learner to construct the line");
  assert.notEqual(facts.alternateName, facts.name, "Activity 3 must not reuse the variable Activity 2 constructs");
  for (const [surface, text] of [
    ["page bytes", facts.html],
    ["decoded page bytes", decodeHtml(facts.html)],
    ["Markdown companion", read("artifact.md")],
    ["GIFT bytes", read("artifact.gift")],
    ["decoded GIFT", decodeGift(read("artifact.gift"))],
  ]) {
    assert.equal(holds(text, facts.target), false, `the Activity 2 target appears in ${surface}`);
    assert.equal(text.includes(`${facts.name}=`), false, `an assignment to the Activity 2 variable appears in ${surface}`);
    assert.equal(text.includes(`${facts.name}\\=`), false, `an escaped assignment to the Activity 2 variable appears in ${surface}`);
  }
  for (const [surface, text] of [["Activity 3", decodeHtml(facts.activity3)], ["Activity 3 model", facts.model]]) {
    assert.equal(text.includes(facts.activity2Address), false, `the Activity 2 address appears in ${surface}`);
    assert.equal(text.includes(facts.name), false, `the Activity 2 variable appears in ${surface}`);
  }
  const recap = facts.html.slice(facts.html.indexOf("data-pep-cheat-sheet"), facts.html.indexOf("data-pep-sources"));
  assert.equal(recap.includes(`.${facts.name}`), false, "the cheat sheet must not mirror the withheld read of the Activity 2 variable");
});

test("Activity 3 uses one different example across readout, model, static text and Markdown", { skip }, () => {
  const facts = publicFacts();
  assert.notEqual(facts.alternate, facts.activity2Address);
  assert.ok(facts.model.includes(`'${facts.alternate}'`), "model resolves the alternate address");
  const staticText = facts.activity3.match(/<div class="pep-static"[^>]*>(.*?)<\/div>/su)[1];
  const sentence = `In development, ${facts.alternateName} is ${facts.alternate} from .env.`;
  assert.ok(decodeHtml(staticText).includes(sentence), "static alternative names the alternate example");
  assert.ok(read("artifact.md").includes(sentence), "Markdown companion names the alternate example");
});

test("Activity 2 keeps its address and expected output", { skip }, () => {
  const facts = publicFacts();
  assert.ok(facts.activity2.includes(`${facts.activity2Address}/api/books`), "Activity 2 task still expects its own address");
  assert.ok(facts.html.includes(`r.lines[0] !== '${facts.activity2Address}/api/books'`), "Activity 2 grading is unchanged");
});

// Real page behavior, in one browser page per case.
async function activity2State(browser, drive) {
  const page = await browser.newPage();
  try {
    await page.goto(pathToFileURL(path.join(topicRoot, "artifact.html")).href);
    await page.locator("#a1-opt-1").check();
    await page.locator("#a1-check").click();
    await page.locator("#next-activity").click();
    await drive(page);
    return await page.evaluate(() => {
      const activity = document.querySelector("#activity-2");
      return {
        attempts: activity.dataset.pepAttempts,
        settled: activity.dataset.pepSettled,
        completed: activity.dataset.pepCompleted,
        credit: activity.dataset.pepCredit,
        grade: activity.dataset.pepGrade,
        complete: document.querySelector("#lesson").dataset.pepComplete,
      };
    });
  } finally {
    await page.close();
  }
}

async function runEditors(page, env, api) {
  const before = await page.locator("#activity-2").getAttribute("data-pep-attempts");
  await page.locator("#a2-file-1").click();
  await page.locator('#activity-2 textarea[data-file=".env"]').fill(env);
  await page.locator("#a2-file-2").click();
  await page.locator('#activity-2 textarea[data-file="api.js"]').fill(api);
  await page.locator("#a2-run").click();
  await page.waitForFunction((count) => document.querySelector("#activity-2").dataset.pepAttempts !== count || document.querySelector("#activity-2").dataset.pepCompleted === "true", before, { timeout: 15000 });
}

test("Activity 2's public failed attempts stay incomplete and uncredited", { skip, timeout: 120000 }, async () => {
  const qa = JSON.parse(readFileSync(qaFile, "utf8"));
  const edge = qa.simulatorEdges.find((item) => /second settles with no completion or credit/u.test(item.name));
  const failing = edge.actions.find((action) => action.do === "fill" && action.selector.includes("api.js")).value;
  const facts = publicFacts();
  const browser = await launchChromium();
  try {
    const state = await activity2State(browser, async (page) => {
      await runEditors(page, facts.starter, failing);
      await runEditors(page, facts.starter, failing);
    });
    assert.deepEqual(state, { attempts: "2", settled: "true", completed: "false", credit: "0", grade: "0", complete: "false" });
  } finally {
    await browser.close();
  }
});

const inputsFile = process.env.PEP_ENV_SETTINGS_INPUTS_FILE;
test("Activity 3's example fails Activity 2's real check while the external answer passes", {
  skip: skip || !inputsFile ? "needs PEP_ENV_SETTINGS_INPUTS_FILE outside the repository" : false,
  timeout: 180000,
}, async () => {
  assert.ok(path.isAbsolute(inputsFile) && path.relative(process.cwd(), inputsFile).startsWith(".."), "inputs must stay outside the repository");
  const inputs = JSON.parse(readFileSync(inputsFile, "utf8"));
  const facts = publicFacts();
  const browser = await launchChromium();
  const verdicts = {};
  try {
    for (const [label, env] of [
      ["Activity 3 example", facts.developmentLine],
      ["Activity 2 variable with the Activity 3 address", `${facts.name}=${facts.alternate}`],
    ]) {
      const state = await activity2State(browser, (page) => runEditors(page, env, inputs.api));
      verdicts[label] = [state.completed, state.credit, state.grade].join("/");
    }
    const genuine = await activity2State(browser, (page) => runEditors(page, inputs.env, inputs.api));
    verdicts.genuine = [genuine.completed, genuine.credit, genuine.grade].join("/");
  } catch {
    throw new Error("a private-input case failed; details are withheld so no private value is recorded");
  } finally {
    await browser.close();
  }
  assert.deepEqual(verdicts, {
    "Activity 3 example": "false/0/0",
    "Activity 2 variable with the Activity 3 address": "false/0/0",
    genuine: "true/1/1",
  });
});
