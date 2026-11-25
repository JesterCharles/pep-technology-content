// Public tests for the HTML and CSS layout lab. Tasks 1 to 3 read starter/index.html and
// starter/styles.css. Tasks 4 to 6 also open the page in the lab's own pinned headless Chromium
// so valid CSS indirection is judged by its rendered layout at the documented widths. Task 11
// measures the four box-model areas of two boxes in the same browser.
import { test } from "node:test";
import assert from "node:assert/strict";
import { areaRows, mediaQueries, parseCss, readStarter, valueOf, viewportContent } from "./css.mjs";
import { measureAt, measureManyAt, withPage } from "./browser.mjs";

const css = readStarter("styles.css");
const rules = parseCss(css);
const html = readStarter("index.html");
const MQ1000 = "(min-width: 1000px)";
const supportedMinimumWidths = mediaQueries(css).flatMap((query) => {
  const match = query.match(/^\(min-width:\s*((?:\d+(?:\.\d*)?|\.\d+))px\)$/);
  if (!match) return [];
  const width = Number(match[1]);
  return Number.isFinite(width) ? [width] : [];
});

function probeWidths(fixed, minimum) {
  const authored = supportedMinimumWidths
    .filter((width) => width >= minimum)
    .flatMap((width) => [Math.ceil(width), Math.ceil(width) + 1])
    .filter((width) => width <= 10_000_000);
  return [...new Set([...fixed, ...authored])];
}

function assertTwoEqualCardColumns(width, measured) {
  assert.equal(measured.cardColumns, 2, `At ${width}px wide, the cards are not two equal columns yet.`);
  assert.ok(Math.max(...measured.cardWidths) - Math.min(...measured.cardWidths) <= 0.5, `At ${width}px wide, the two card columns are not equal yet.`);
}

function assertRequiredPageLayout(width, measured) {
  const { header, main, aside, footer } = measured.regions;
  assert.equal(measured.pageDisplay, "grid", `At ${width}px wide, the page is not laid out as a grid yet.`);
  assert.ok(header && main && aside && footer, `At ${width}px wide, one or more required page regions could not be measured.`);
  assert.ok(aside.left >= main.right - 0.5 && aside.top < main.bottom, `At ${width}px wide, the gear checklist is not beside the trails yet.`);
  assert.ok(header.left <= main.left + 0.5 && header.right >= aside.right - 0.5, `At ${width}px wide, the header does not span both content columns yet.`);
  assert.ok(footer.left <= main.left + 0.5 && footer.right >= aside.right - 0.5, `At ${width}px wide, the footer does not span both content columns yet.`);
}

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

  const widths = probeWidths([599, 600, 700], 600);
  const measurements = await measureManyAt(widths);
  const byWidth = new Map(widths.map((width, index) => [width, measurements[index]]));
  assert.equal(byWidth.get(599).cardColumns, 1, "Below 600px wide, the cards are not one column yet.");
  for (const width of widths.filter((value) => value >= 600)) assertTwoEqualCardColumns(width, byWidth.get(width));
});

test("task 5: from 1000px, the header and footer span the page and the gear checklist sits beside the trails", async () => {
  const areaMap = JSON.stringify(areaRows(valueOf(rules, ".page", "grid-template-areas", MQ1000)));
  assert.ok(areaMap === JSON.stringify([["header", "header"], ["main", "aside"], ["footer", "footer"]]),
    "From 1000px wide, the named regions do not yet form the required page layout.");
  for (const [selector, area] of [[".site-header", "header"], [".site-main", "main"], [".site-aside", "aside"], [".site-footer", "footer"]]) {
    const got = valueOf(rules, selector, "grid-area") ?? valueOf(rules, selector, "grid-area", MQ1000);
    assert.equal(got, area, `${selector} is not placed in the ${area} area yet.`);
  }

  const widths = probeWidths([999, 1000, 1100], 1000);
  const measurements = await measureManyAt(widths);
  const byWidth = new Map(widths.map((width, index) => [width, measurements[index]]));
  const below = byWidth.get(999);
  assert.ok(below.regions.aside.top >= below.regions.main.bottom - 0.5, "Below 1000px wide, the gear checklist is not stacked after the trails.");
  for (const width of widths.filter((value) => value >= 1000)) assertRequiredPageLayout(width, byWidth.get(width));
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

test("task 11: both pack tags are 200px wide border to border, one in each box-sizing model", async () => {
  // The tags stay where they are, inside .site-aside. At two window sizes (both width and
  // height differ), the test fixes that box at two widths of its own (no padding, border or
  // scaling), so each tag must be 200px wide because of its own width, padding and border, not
  // because of the space around it or the window. As a control, it then removes the tag's own
  // width, min-width and max-width for a moment: an ordinary block tag then fills the whole
  // checklist, which shows that the 200px came from the width set on the tag. Transitions are
  // switched off only while measuring and restored afterwards; finite animations are finished
  // first and an endless one is measured as drawn. The checklist itself must not be scaled.
  const windows = [
    { width: 800, height: 800 },
    { width: 1280, height: 1000 },
  ];
  const parentWidths = [480, 720];
  const runs = await withPage(async (page) => {
    const all = [];
    for (const size of windows) {
      await page.setViewportSize(size);
      const measured = await page.evaluate((widths) => {
        const aside = document.querySelector(".site-aside");
        const still = ["transition"];
        const quiet = [aside, ...document.querySelectorAll(".pack-tag-day, .pack-tag-overnight")].filter(Boolean);
        const before = quiet.map((el) => still.map((name) => [name, el.style.getPropertyValue(name), el.style.getPropertyPriority(name)]));
        for (const el of quiet) for (const name of still) el.style.setProperty(name, "none", "important");
        for (const el of quiet) {
          for (const animation of el.getAnimations()) {
            if (Number.isFinite(animation.effect?.getComputedTiming().endTime)) animation.finish();
          }
        }
        // With no animation left running, a held end value such as an identity matrix, scale 1,
        // a whole-turn rotate or translate 0px counts as unscaled. While an endless or paused
        // animation is still on the element, only the plain none and 1 values count, because
        // its value at this moment says nothing about the frames that follow.
        const turns = (angle) => {
          const value = parseFloat(angle);
          const unit = angle.replace(/^[-+\d.e]+/i, "");
          const degrees = unit === "turn" ? value * 360 : unit === "rad" ? (value * 180) / Math.PI : unit === "grad" ? value * 0.9 : value;
          return Math.abs(degrees % 360) < 1e-9;
        };
        const unscaledNow = (el) => {
          const cs = getComputedStyle(el);
          if (el.getAnimations().some((animation) => animation.playState !== "finished")) {
            return [cs.transform, cs.scale, cs.rotate, cs.translate].every((value) => value === "none") && String(cs.zoom) === "1";
          }
          return (
            (cs.transform === "none" || new DOMMatrixReadOnly(cs.transform).isIdentity) &&
            (cs.scale === "none" || cs.scale.split(/\s+/).every((part) => parseFloat(part) === 1)) &&
            (cs.rotate === "none" || turns(cs.rotate.split(/\s+/).pop())) &&
            (cs.translate === "none" || cs.translate.split(/\s+/).every((part) => parseFloat(part) === 0)) &&
            parseFloat(cs.zoom) === 1
          );
        };
        const asideUnscaled = !aside || unscaledNow(aside);
        const pinned = (width) => ({
          display: "block",
          "box-sizing": "content-box",
          width: `${width}px`,
          "min-width": `${width}px`,
          "max-width": `${width}px`,
          padding: "0px",
          "border-style": "none",
          "border-width": "0px",
          transform: "none",
          scale: "none",
          rotate: "none",
          translate: "none",
          zoom: "1",
        });
        const pinnedBefore = aside
          ? Object.keys(pinned(0)).map((name) => [name, aside.style.getPropertyValue(name), aside.style.getPropertyPriority(name)])
          : [];
        const own = ["width", "min-width", "max-width"];
        const out = widths.map((width) => {
          if (aside) for (const [name, value] of Object.entries(pinned(width))) aside.style.setProperty(name, value, "important");
          const tags = [".pack-tag-day", ".pack-tag-overnight"].map((selector) => {
            const el = document.querySelector(selector);
            if (!el || !aside || !aside.contains(el)) return { selector, found: false };
            const cs = getComputedStyle(el);
            const px = (name) => parseFloat(cs.getPropertyValue(name));
            const result = {
              selector,
              found: true,
              boxSizing: cs.boxSizing,
              ownReason:
                cs.display === "none"
                  ? "its display is none, so it is hidden"
                  : cs.display === "contents"
                    ? "its display is contents, so it has no box of its own"
                    : cs.display.startsWith("inline") || cs.display.startsWith("table")
                      ? `its display is ${cs.display}`
                      : cs.float !== "none"
                        ? "it is floated"
                        : ["absolute", "fixed"].includes(cs.position)
                          ? `it is positioned ${cs.position}`
                          : "",
              layout: el.offsetWidth,
              rendered: el.getBoundingClientRect().width,
              padding: [px("padding-top"), px("padding-right"), px("padding-bottom"), px("padding-left")],
              border: [px("border-top-width"), px("border-right-width"), px("border-bottom-width"), px("border-left-width")],
              margin: px("margin-bottom"),
              sideMargins: [px("margin-left"), px("margin-right")],
              unscaled: unscaledNow(el),
            };
            const saved = own.map((name) => [name, el.style.getPropertyValue(name), el.style.getPropertyPriority(name)]);
            el.style.setProperty("width", "auto", "important");
            el.style.setProperty("min-width", "0px", "important");
            el.style.setProperty("max-width", "none", "important");
            result.withoutOwnWidth = el.offsetWidth;
            for (const [name, value, priority] of saved) {
              if (value) el.style.setProperty(name, value, priority);
              else el.style.removeProperty(name);
            }
            return result;
          });
          return { width, asideUnscaled, tags };
        });
        if (aside) {
          for (const [name, value, priority] of pinnedBefore) {
            if (value) aside.style.setProperty(name, value, priority);
            else aside.style.removeProperty(name);
          }
        }
        quiet.forEach((el, i) => {
          for (const [name, value, priority] of before[i]) {
            if (value) el.style.setProperty(name, value, priority);
            else el.style.removeProperty(name);
          }
        });
        return out;
      }, parentWidths);
      all.push(...measured.map((run) => ({ ...run, window: `${size.width}x${size.height}` })));
    }
    return all;
  });
  for (const run of runs) {
    assert.ok(run.asideUnscaled, "The gear checklist itself is scaled, rotated, translated or zoomed; size the tags with the box model and leave the checklist unscaled.");
    for (const tag of run.tags) {
      assert.ok(tag.found, `${tag.selector} is missing from the gear checklist; keep the two pack tags from the starter inside .site-aside.`);
      assert.ok(tag.padding.every((v) => Math.abs(v - 12) < 0.5), `${tag.selector}: the padding area is not 12px on every side yet.`);
      assert.ok(tag.border.every((v) => Math.abs(v - 3) < 0.5), `${tag.selector}: the border area is not 3px on every side yet.`);
      assert.ok(Math.abs(tag.margin - 10) < 0.5, `${tag.selector}: the margin area below the box is not 10px yet.`);
      assert.ok(tag.sideMargins.every((v) => Math.abs(v) < 0.5), `${tag.selector}: keep its left and right margins at 0; this task sets only the margin below the box.`);
      assert.ok(tag.unscaled, `${tag.selector}: size the box with the box model, not by scaling, rotating, moving or zooming it.`);
    }
  }
  for (const run of runs) {
    const where = `when the gear checklist is ${run.width}px wide in a ${run.window} window`;
    const [day, overnight] = run.tags;
    assert.equal(day.boxSizing, "content-box", `.pack-tag-day must keep the default content-box sizing (${where}).`);
    assert.equal(overnight.boxSizing, "border-box", `.pack-tag-overnight is not using border-box sizing yet (${where}).`);
    for (const tag of run.tags) {
      const cause = tag.ownReason
        ? `the tag itself is not an ordinary block (${tag.ownReason}): remove that change from the tag`
        : "something around the tag (a wrapper, a float beside it, columns or positioning on the checklist) is giving it its size: keep the tag directly in the checklist and set the width on the tag itself";
      assert.equal(
        tag.withoutOwnWidth,
        run.width,
        `${tag.selector} is ${tag.withoutOwnWidth}px wide ${where} once its own width, min-width and max-width are removed, so it does not fill the checklist: ${cause}.`,
      );
      assert.equal(
        tag.layout,
        200,
        `${tag.selector} lays out ${tag.layout}px wide border to border ${where}, not 200px: check the width you calculated for its box-sizing model.`,
      );
      assert.ok(
        Math.abs(tag.rendered - 200) < 0.5,
        `${tag.selector} lays out 200px wide but is drawn ${Math.round(tag.rendered * 100) / 100}px wide ${where}: something around it is scaling it.`,
      );
    }
  }
});
