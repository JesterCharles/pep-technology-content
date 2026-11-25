// Task 8 check configuration: runs only the learner-authored test(s), with
// every runtime import of the learner's ServiceForm module replaced by one
// controlled behaviour variant (see task8-variant.jsx). The swap keys on which
// module is loaded (its resolved file), never on how the import is written.
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";
import baseConfig from "./vitest.config.js";

const here = path.dirname(fileURLToPath(import.meta.url));
const variant = process.env.TASK8_VARIANT;
const reportFile = process.env.TASK8_REPORT;
delete process.env.TASK8_VARIANT;
delete process.env.TASK8_REPORT;
const VARIANTS = [
  "control",
  "blank-ignored",
  "blank-saves",
  "complete-ignored",
  "complete-never-saves",
  "complete-wrong-name",
  "complete-wrong-team",
];
if (!VARIANTS.includes(variant) || !reportFile) {
  throw new Error("Task 8 behaviour variant is required.");
}

const norm = (id) => {
  const p = path.resolve(id.split("?")[0]).replace(/\\/g, "/");
  return process.platform === "win32" ? p.toLowerCase() : p;
};
const posix = (p) => p.replace(/\\/g, "/");
const realFormFile = posix(path.resolve(here, "../starter/src/components/ServiceForm.jsx"));
const coreFile = posix(path.resolve(here, "task8-variant.jsx"));
const realForm = norm(realFormFile);
const core = norm(coreFile);
const VIRTUAL = "\0task8-variant";

const variantPlugin = {
  name: "task-8-behaviour-variant",
  enforce: "pre",
  async resolveId(source, importer, options) {
    if (source === VIRTUAL) return VIRTUAL;
    if (!importer || importer === VIRTUAL || norm(importer) === core) return null;
    const resolved = await this.resolve(source, importer, { ...options, skipSelf: true });
    if (resolved && !resolved.external && norm(resolved.id) === realForm) return VIRTUAL;
    return null;
  },
  load(id) {
    if (id !== VIRTUAL) return null;
    const real = JSON.stringify(realFormFile);
    const coreId = JSON.stringify(coreFile);
    return `export * from ${real};\nimport { makeVariant } from ${coreId};\nexport default makeVariant(${JSON.stringify(variant)}, ${JSON.stringify(reportFile)});\n`;
  },
};

export default defineConfig({
  ...baseConfig,
  plugins: [...(baseConfig.plugins ?? []), variantPlugin],
  test: {
    ...baseConfig.test,
    include: ["../starter/src/**/*.test.jsx"],
  },
});
