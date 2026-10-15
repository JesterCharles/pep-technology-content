// Public tests for the HTML and CSS layout lab. Tasks 1 to 3 read starter/index.html and
// starter/styles.css. Tasks 4 to 6 also open the page in the lab's own pinned headless Chromium
// so valid CSS indirection is judged by its rendered layout at the documented widths.
import { test } from "node:test";
import assert from "node:assert/strict";
import { areaRows, mediaQueries, parseCss, readStarter, valueOf, viewportContent } from "./css.mjs";
import { measureAt, measureManyAt } from "./browser.mjs";

const css = readStarter("styles.css");
const rules = parseCss(css);
const html = readStarter("index.html");
const MQ1000 = "(min-width: 1000px)";

test("task 1: a phone lays the page out at its own width, at normal zoom", () => {
  const content = viewportContent(html);
  assert.ok(content !== null, "index.html has no viewport meta element yet, so a phone lays the page out at about 980px and shrinks it.");
  const parts = content.split(",").map((p) => p.replace(/\s+/g, ""));
  assert.ok(parts.includes("width=device-width"), "The viewport meta element does not yet set the layout width to the phone's own width.");
  assert.ok(parts.includes("initial-scale=1"), "The viewport meta element does not yet start the page at normal zoom.");
});

test("task 2: the site name and the nav sit at opposite ends of the header, centred vertically", () => {
  assert.equal(valueOf(rules, ".site-header", "display"), "flex", "The header does not lay out its children with Flexbox yet.");
  assert.equal(valueOf(rules, ".site-header", "justify-content"), "space-between", "The site name and the nav are not pushed to opposite ends of the header yet.");
  assert.equal(valueOf(rules, ".site-header", "align-items"), "center", "The site name and the nav are not centred vertically in the header yet.");
});

test("task 3: the nav links sit side by side with space between them", () => {
  assert.equal(valueOf(rules, ".site-nav ul", "display"), "flex", "The nav list does not lay out its links with Flexbox yet.");
  const dir = valueOf(rules, ".site-nav ul", "flex-direction");
  assert.ok(dir === undefined || dir === "row", "The nav links are stacked, not side by side.");
  const gap = valueOf(rules, ".site-nav ul", "gap");
  assert.ok(gap && !/^0(px)?$/.test(gap), "There is no space between the nav links yet.");
});

test("task 4: the trail cards are one column on phones and two columns from 600px", async () => {
  assert.equal(valueOf(rules, ".cards", "display"), "grid", "The cards are not laid out as a grid in the base styles.");

  // Regression guard: source inspection must never rewrite quoted custom-property token contents.
  const tokenRule = parseCss(':root { --reader-token: "a,b"; }');
  assert.equal(valueOf(tokenRule, ":root", "--reader-token"), '"a,b"', "The lab checker could not preserve a quoted CSS token while reading the stylesheet.");

  const [below, boundary, documented] = await measureManyAt([599, 600, 700]);
  assert.equal(below.cardColumns, 1, "Below 600px wide, the cards are not one column yet.");
  assert.equal(boundary.cardColumns, 2, "At 600px wide, the cards are not two equal columns yet.");
  assert.ok(Math.max(...boundary.cardWidths) - Math.min(...boundary.cardWidths) <= 0.5, "At 600px wide, the two card columns are not equal yet.");
  assert.equal(documented.cardColumns, 2, "At 700px wide, the cards are not two equal columns yet.");
  assert.ok(Math.max(...documented.cardWidths) - Math.min(...documented.cardWidths) <= 0.5, "At 700px wide, the two card columns are not equal yet.");
});

test("task 5: from 1000px, the header and footer span the page and the gear checklist sits beside the trails", async () => {
  assert.deepEqual(areaRows(valueOf(rules, ".page", "grid-template-areas", MQ1000)),
    [["header", "header"], ["main", "aside"], ["footer", "footer"]],
    "From 1000px wide, the named regions do not yet form the required page layout.");
  for (const [selector, area] of [[".site-header", "header"], [".site-main", "main"], [".site-aside", "aside"], [".site-footer", "footer"]]) {
    const got = valueOf(rules, selector, "grid-area") ?? valueOf(rules, selector, "grid-area", MQ1000);
    assert.equal(got, area, `${selector} is not placed in the ${area} area yet.`);
  }

  const [below, boundary, documented] = await measureManyAt([999, 1000, 1100]);
  assert.ok(below.regions.aside.top >= below.regions.main.bottom - 0.5, "Below 1000px wide, the gear checklist is not stacked after the trails.");
  for (const [width, measured] of [[1000, boundary], [1100, documented]]) {
    const { header, main, aside, footer } = measured.regions;
    assert.equal(measured.pageDisplay, "grid", `At ${width}px wide, the page is not laid out as a grid yet.`);
    assert.ok(aside.left >= main.right - 0.5 && aside.top < main.bottom, `At ${width}px wide, the gear checklist is not beside the trails yet.`);
    assert.ok(header.left <= main.left + 0.5 && header.right >= aside.right - 0.5, `At ${width}px wide, the header does not span both content columns yet.`);
    assert.ok(footer.left <= main.left + 0.5 && footer.right >= aside.right - 0.5, `At ${width}px wide, the footer does not span both content columns yet.`);
  }
});

test("task 4 and 5: the stylesheet is mobile-first, adding wider-screen rules from small to large", () => {
  const queries = mediaQueries(css);
  assert.ok(queries.length >= 2, "The stylesheet does not add rules for wider screens yet.");
  const widths = queries.map((q) => {
    const m = q.match(/^\(min-width:\s*((?:\d+(?:\.\d*)?|\.\d+))px\)$/);
    assert.ok(m, `A media query targets narrower screens or something other than one minimum width. Mobile-first CSS only adds rules for wider screens.`);
    const width = Number(m[1]);
    assert.ok(Number.isFinite(width), "A wider-screen rule does not use a finite pixel width.");
    return width;
  });
  assert.deepEqual(widths, [...widths].sort((a, b) => a - b), "The wider-screen rules are not written from small to large, so a smaller breakpoint can override a larger one.");
});

test("task 6: at 400px wide the page does not scroll sideways, and the hero picture stays inside its box", async () => {
  const m = await measureAt(400);
  assert.ok(m.heroFound, "The hero picture was not found inside .hero; keep the hero markup from the starter.");
  assert.ok(m.pageWidth <= m.viewportWidth, `At 400px wide the page is ${m.pageWidth}px wide, so it scrolls sideways.`);
  assert.ok(m.heroFits, "At 400px wide the hero picture sticks out of its box.");
});
