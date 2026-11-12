// Public tests for the Trail Guides dashboard lab. Run from coding-lab/ with:
//   node --test --test-reporter=spec
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { launchDashboard } from "./browser.mjs";
import { starterDir } from "./paths.mjs";

const appSource = readFileSync(path.join(starterDir, "app.js"), "utf8");
// Strings are stripped before comment markers so a "//" inside a string never
// truncates the line, and multi-line template literals are stripped too.
const bareSource = appSource.replace(
  /("(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*'|`(?:\\.|[^`\\])*`)|\/\/[^\n]*|\/\*[\s\S]*?\*\//g,
  (match, stringLiteral) => (stringLiteral ? "\"\"" : ""),
);

const session = await launchDashboard();
test.after(() => session.close());

const listState = (page) =>
  page.evaluate(() => ({
    count: document.querySelectorAll("#trail-list li").length,
    names: [...document.querySelectorAll("#trail-list .trail-name")].map((el) => el.textContent),
    firstText: document.querySelector("#trail-list li")?.textContent ?? "",
  }));

test("task 1: renderTrails rebuilds the list without duplicating items", async () => {
  const page = await session.open();
  let state = await listState(page);
  assert.equal(state.count, 6, "the six trails from data.js render as six list items");
  assert.equal(state.names[0], "Lake Loop", "each item names its trail in .trail-name");
  assert.ok(state.firstText.includes("5 km"), "each item shows the trail's distance");
  await page.evaluate(() => window.app.renderTrails(window.trailData));
  state = await listState(page);
  assert.equal(
    state.count,
    6,
    "rendering again must replace the list, not append to it: clear it first",
  );
  await page.close();
});

test("task 2: the search box filters the list as you type", async () => {
  const page = await session.open();
  await page.fill("#search", "walk");
  let state = await listState(page);
  assert.deepEqual(
    state.names,
    ["Ridge Walk"],
    "typing \"walk\" must leave only Ridge Walk (matching ignores case)",
  );
  await page.fill("#search", "");
  state = await listState(page);
  assert.equal(state.count, 6, "clearing the box must show every trail again");
  await page.close();
});

test("task 3: one delegated click listener marks trails hiked without navigating", async () => {
  // Comments are stripped but strings are kept, so the scan can see which
  // element the listener was looked up on.
  const commentStripped = appSource.replace(
    /("(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*'|`(?:\\.|[^`\\])*`)|\/\/[^\n]*|\/\*[\s\S]*?\*\//g,
    (match, stringLiteral) => stringLiteral ?? "",
  );
  assert.ok(
    /(?:trailList|querySelector\s*\(\s*["']#trail-list["']\s*\)|getElementById\s*\(\s*["']trail-list["']\s*\))\s*\.addEventListener\s*\(/.test(
      commentStripped,
    ),
    "attach the click listener to the trail list element itself (event delegation)",
  );
  const page = await session.open();
  await page.click('#trail-list li[data-name="Lake Loop"] .mark-hiked');
  assert.equal(
    await page.evaluate(() => document.querySelector('li[data-name="Lake Loop"]').classList.contains("hiked")),
    true,
    "clicking Mark hiked must add the hiked class to that trail's list item",
  );
  assert.ok(
    !new URL(page.url()).hash,
    "the link must not navigate: call preventDefault() in the handler",
  );
  await page.click('#trail-list li[data-name="Lake Loop"] .mark-hiked');
  assert.equal(
    await page.evaluate(() => document.querySelector('li[data-name="Lake Loop"]').classList.contains("hiked")),
    false,
    "clicking again must toggle the class off",
  );
  await page.fill("#search", "summit");
  await page.click('#trail-list li[data-name="Summit Climb"] .mark-hiked');
  assert.equal(
    await page.evaluate(() => document.querySelector('li[data-name="Summit Climb"]').classList.contains("hiked")),
    true,
    "items rendered after the listener was attached must still respond: that is what delegation gives you",
  );
  await page.close();
});

test("task 4: visitor notes render as text, never as HTML", async () => {
  const page = await session.open();
  const result = await page.evaluate(() => ({
    xss: window.__xss === true,
    injected: document.querySelectorAll("#trail-list img").length,
    noteText: document.querySelector('li[data-name="Forest Path"] .trail-note')?.textContent ?? "",
  }));
  assert.equal(result.xss, false, "the payload in Forest Path's note ran: an unsafe sink turned visitor text into HTML");
  assert.equal(result.injected, 0, "no element from a visitor note may enter the page");
  assert.ok(
    result.noteText.includes("<img src=x"),
    "the note must appear exactly as typed, as plain text, via textContent",
  );
  await page.close();
});

test("task 5: showConditions chains then and catch, and showAllConditions uses Promise.all", async () => {
  assert.ok(/\.then\s*\(/.test(bareSource), "showConditions must chain .then on the promise");
  assert.ok(/\.catch\s*\(/.test(bareSource), "handle the rejection with .catch");
  assert.ok(/Promise\.all\s*\(/.test(bareSource), "showAllConditions must combine the promises with Promise.all");
  const page = await session.open();
  const statusIs = async (expected, hint) => {
    await page
      .waitForFunction(
        (text) => document.querySelector("#status").textContent === text,
        expected,
        { timeout: 3000 },
      )
      .catch(async () => {
        assert.equal(await page.evaluate(() => document.querySelector("#status").textContent), expected, hint);
      });
  };
  await page.evaluate(() => window.app.showConditions("Ridge Walk"));
  await statusIs("Ridge Walk: strong wind above the treeline", "a fulfilled report shows NAME: REPORT");
  await page.evaluate(() => window.app.showConditions("Canyon Route"));
  await statusIs("Conditions unavailable for Canyon Route.", "a rejected report shows the unavailable message");
  await page.evaluate(() => window.app.showAllConditions(["Lake Loop", "Forest Path", "River Trail"]));
  await statusIs("3 condition reports loaded.", "when every promise fulfils, report the count");
  await page.evaluate(() => window.app.showAllConditions(["Lake Loop", "Canyon Route"]));
  await statusIs(
    "Some condition reports are unavailable.",
    "one rejection makes Promise.all reject: catch it",
  );
  await page.close();
});

test("task 6: refreshDashboard is an async function that awaits and recovers", async () => {
  assert.ok(
    /async\s+function\s+refreshDashboard|refreshDashboard\s*=\s*async/.test(bareSource),
    "declare refreshDashboard with the async keyword",
  );
  assert.ok(/\bawait\b/.test(bareSource), "await the conditions inside refreshDashboard");
  const page = await session.open();
  const returnsPromise = await page.evaluate(() => {
    const result = window.app.refreshDashboard();
    return typeof result?.then === "function";
  });
  assert.ok(returnsPromise, "an async function always returns a promise");
  await page.waitForFunction(
    () => document.querySelector("#status").textContent === "Featured today: Summit Climb (snow on the final ascent).",
    undefined,
    { timeout: 3000 },
  ).catch(async () => {
    assert.equal(
      await page.evaluate(() => document.querySelector("#status").textContent),
      "Featured today: Summit Climb (snow on the final ascent).",
      "after awaiting the report, show the featured message",
    );
  });
  const recovered = await page.evaluate(async () => {
    const original = window.trailApi.fetchConditions;
    window.trailApi.fetchConditions = () => Promise.reject(new Error("offline"));
    try {
      await window.app.refreshDashboard();
    } catch {
      return { rejected: true };
    } finally {
      window.trailApi.fetchConditions = original;
    }
    return { rejected: false, status: document.querySelector("#status").textContent };
  });
  assert.equal(recovered.rejected, false, "catch the rejection with try/catch instead of letting it escape");
  assert.equal(
    recovered.status,
    "Featured conditions are unavailable right now.",
    "the catch branch shows the unavailable message",
  );
  await page.close();
});
