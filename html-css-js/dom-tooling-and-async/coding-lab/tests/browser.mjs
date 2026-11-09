// Opens starter/index.html in the lab's own headless Chromium for the tests.
import { createRequire } from "node:module";
import { existsSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { starterDir } from "./paths.mjs";

export async function launchDashboard() {
  process.env.PLAYWRIGHT_BROWSERS_PATH = "0";
  const manifest = path.join(starterDir, "node_modules", "playwright", "package.json");
  if (!existsSync(manifest)) {
    throw new Error("The test browser is not installed yet: run npm ci in starter/ once (README, Setup).");
  }
  const require = createRequire(path.join(starterDir, "package.json"));
  const { chromium } = require("playwright");
  const browser = await chromium.launch({ headless: true });
  const open = async () => {
    const page = await browser.newPage({ viewport: { width: 900, height: 800 } });
    await page.route(/^(?!file:)/, (route) => route.abort());
    await page.goto(pathToFileURL(path.join(starterDir, "index.html")).href);
    return page;
  };
  return { browser, open, close: () => browser.close() };
}
