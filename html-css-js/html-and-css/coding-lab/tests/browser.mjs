// Opens starter/index.html in the lab's own headless Chromium and measures the layout.
import { createRequire } from "node:module";
import { existsSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { starterDir } from "./css.mjs";

export async function measureAt(width) {
  process.env.PLAYWRIGHT_BROWSERS_PATH = "0";
  const manifest = path.join(starterDir, "node_modules", "playwright", "package.json");
  if (!existsSync(manifest)) throw new Error("The test browser is not installed yet: run npm ci in starter/ once (README, Setup).");
  const require = createRequire(path.join(starterDir, "package.json"));
  const { chromium } = require("playwright");
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage({ viewport: { width, height: 800 } });
    await page.route(/^(?!file:)/, (route) => route.abort());
    await page.goto(pathToFileURL(path.join(starterDir, "index.html")).href);
    return await page.evaluate(() => {
      // Hiding or clipping overflow on the root would only hide the problem, so measure with it visible.
      for (const el of [document.documentElement, document.body]) {
        el.style.setProperty("overflow", "visible", "important");
        el.style.setProperty("overflow-x", "visible", "important");
      }
      let widest = 0;
      for (const el of document.body.querySelectorAll("*")) widest = Math.max(widest, el.getBoundingClientRect().right);
      const hero = document.querySelector(".hero");
      const picture = hero?.querySelector("svg, img");
      const box = hero?.getBoundingClientRect();
      const pic = picture?.getBoundingClientRect();
      return {
        pageWidth: Math.max(document.documentElement.scrollWidth, Math.ceil(widest)),
        viewportWidth: window.innerWidth,
        heroFits: !!(box && pic) && pic.left >= box.left - 0.5 && pic.right <= box.right + 0.5,
        heroFound: !!(box && pic),
      };
    });
  } finally {
    await browser.close();
  }
}
