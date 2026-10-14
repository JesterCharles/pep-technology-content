// Public tests for the HTML and CSS layout lab. They read starter/index.html and
// starter/styles.css and check the stated layout rules. They do not render the page:
// check how it looks in a browser yourself (README, "Check it in a browser").
import { test } from "node:test";
import assert from "node:assert/strict";
import { areaRows, mediaQueries, parseCss, readStarter, valueOf, viewportContent } from "./css.mjs";

const css = readStarter("styles.css");
const rules = parseCss(css);
const html = readStarter("index.html");
const MQ600 = "(min-width: 600px)";
const MQ1000 = "(min-width: 1000px)";

test("task 1: index.html has the viewport meta element", () => {
  const content = viewportContent(html);
  assert.ok(content !== null, "Add <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\"> inside <head>.");
  const parts = content.split(",").map((p) => p.replace(/\s+/g, ""));
  assert.ok(parts.includes("width=device-width"), "The viewport content needs width=device-width.");
  assert.ok(parts.includes("initial-scale=1"), "The viewport content needs initial-scale=1.");
});

test("task 2: .site-header puts the name and nav at opposite ends, centred vertically", () => {
  assert.equal(valueOf(rules, ".site-header", "display"), "flex", ".site-header needs display: flex in the base styles.");
  assert.equal(valueOf(rules, ".site-header", "justify-content"), "space-between", ".site-header needs justify-content: space-between.");
  assert.equal(valueOf(rules, ".site-header", "align-items"), "center", ".site-header needs align-items: center.");
});

test("task 3: .site-nav ul is a flex row with a gap", () => {
  assert.equal(valueOf(rules, ".site-nav ul", "display"), "flex", ".site-nav ul needs display: flex.");
  const dir = valueOf(rules, ".site-nav ul", "flex-direction");
  assert.ok(dir === undefined || dir === "row", ".site-nav ul should stay a row: remove flex-direction or set it to row.");
  const gap = valueOf(rules, ".site-nav ul", "gap");
  assert.ok(gap && !/^0(px)?$/.test(gap), ".site-nav ul needs a gap, for example gap: 16px.");
});

test("task 4: .cards is one column in the base styles and two from 600px", () => {
  assert.equal(valueOf(rules, ".cards", "display"), "grid", ".cards needs display: grid in the base styles.");
  const base = valueOf(rules, ".cards", "grid-template-columns");
  assert.ok(["1fr", "repeat(1, 1fr)", "minmax(0, 1fr)"].includes(base), `The base .cards should be one column (1fr); found ${JSON.stringify(base)}.`);
  const wide = valueOf(rules, ".cards", "grid-template-columns", MQ600);
  assert.ok(["1fr 1fr", "repeat(2, 1fr)", "repeat(2, minmax(0, 1fr))", "minmax(0, 1fr) minmax(0, 1fr)"].includes(wide),
    `Inside @media ${MQ600}, .cards should have two equal columns; found ${JSON.stringify(wide)}.`);
});

test("task 5: from 1000px, .page places the regions with grid-template-areas", () => {
  const display = valueOf(rules, ".page", "display", MQ1000) ?? valueOf(rules, ".page", "display");
  assert.equal(display, "grid", `.page needs display: grid, in the base styles or inside @media ${MQ1000}.`);
  assert.deepEqual(areaRows(valueOf(rules, ".page", "grid-template-areas", MQ1000)),
    [["header", "header"], ["main", "aside"], ["footer", "footer"]],
    `Inside @media ${MQ1000}, .page needs grid-template-areas: "header header" "main aside" "footer footer".`);
  assert.ok(valueOf(rules, ".page", "grid-template-columns", MQ1000), `Inside @media ${MQ1000}, give .page two columns with grid-template-columns, for example 1fr 300px.`);
  for (const [selector, area] of [[".site-header", "header"], [".site-main", "main"], [".site-aside", "aside"], [".site-footer", "footer"]]) {
    const got = valueOf(rules, selector, "grid-area") ?? valueOf(rules, selector, "grid-area", MQ1000);
    assert.equal(got, area, `${selector} needs grid-area: ${area}.`);
  }
});

test("task 4 and 5: every media query is min-width, written from small to large", () => {
  const queries = mediaQueries(css);
  assert.ok(queries.length >= 2, "Expected at least two media queries: 600px and 1000px.");
  const widths = queries.map((q) => {
    const m = q.match(/^\(min-width:\s*(\d+)px\)$/);
    assert.ok(m, `Mobile-first CSS uses only min-width queries; found @media ${q}.`);
    return Number(m[1]);
  });
  assert.deepEqual(widths, [...widths].sort((a, b) => a - b), `Write min-width queries from small to large; found ${widths.join(", ")}.`);
});

test("task 6: nothing in the base styles is wider than 400px, and the hero picture shrinks to fit", () => {
  for (const rule of rules.filter((r) => r.media === null)) {
    for (const prop of ["width", "min-width"]) {
      const px = rule.decls[prop]?.match(/^(\d+)px$/);
      assert.ok(!px || Number(px[1]) <= 400, `${rule.selectors.join(", ")} has ${prop}: ${rule.decls[prop]} in the base styles, wider than a 400px screen.`);
    }
  }
  const selectors = [".hero svg", "svg", "img, svg", ".hero img, .hero svg"];
  const maxWidth = rules.filter((r) => r.media === null && r.selectors.some((s) => selectors.includes(s) || s === "img")).map((r) => r.decls["max-width"]).find(Boolean);
  assert.equal(maxWidth, "100%", "Give the hero picture max-width: 100% (for example .hero svg { max-width: 100%; height: auto; }).");
});
