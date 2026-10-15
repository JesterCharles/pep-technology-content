// Runs once from `npm ci` in starter/: downloads the pinned headless Chromium into
// starter/node_modules, so the tests never use a browser from outside this lab folder.
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import path from "node:path";
import { starterDir } from "./css.mjs";

const require = createRequire(path.join(starterDir, "package.json"));
const cli = path.join(path.dirname(require.resolve("playwright/package.json")), "cli.js");
const run = spawnSync(process.execPath, [cli, "install", "--only-shell", "chromium"], {
  cwd: starterDir,
  stdio: "inherit",
  env: { ...process.env, PLAYWRIGHT_BROWSERS_PATH: "0" },
});
process.exit(run.status ?? 1);
