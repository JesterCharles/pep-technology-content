// Vitest configuration that tests/your-test.test.mjs uses to run your
// starter/format-distance.test.mjs on its own. Do not edit.
// TASK7_VARIANT picks the formatDistance your tests run against: "real" keeps
// the shipped function; "wrong-label" and "wrong-km" swap in a broken copy,
// which your tests must catch.
import path from "node:path";
import { fileURLToPath } from "node:url";

const labDir = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const starterDir = path.join(labDir, "starter");
const realModule = path.join(starterDir, "format-distance.mjs");
// Windows paths may differ only in drive-letter or other letter case, so the
// comparison folds case there; elsewhere paths compare exactly.
const fold = (value) => (process.platform === "win32" ? value.toLowerCase() : value);
const isRealModule = (id) => fold(path.resolve(id)) === fold(realModule);
const variant = process.env.TASK7_VARIANT ?? "real";
const brokenId = "\0task7-broken-format-distance";

const brokenSource = {
  "wrong-label": "export function formatDistance(km) { return { km, label: `${km}km` }; }\n",
  "wrong-km": "export function formatDistance(km) { return { km: km + 1, label: `${km} km` }; }\n",
};

const swapFormatDistance = {
  name: "task7-swap-format-distance",
  enforce: "pre",
  async resolveId(source, importer, options) {
    if (variant === "real" || !importer || !source.includes("format-distance")) return null;
    const resolved = await this.resolve(source, importer, { ...options, skipSelf: true });
    if (resolved && isRealModule(resolved.id.split("?")[0])) return brokenId;
    return null;
  },
  load(id) {
    return id === brokenId ? brokenSource[variant] : null;
  },
};

const resultReporter = {
  onTestRunEnd(testModules, unhandledErrors) {
    const tests = [];
    const errors = unhandledErrors.map((error) => error.message);
    for (const testModule of testModules) {
      for (const error of testModule.errors()) errors.push(error.message);
      for (const testCase of testModule.children.allTests()) {
        tests.push({ name: testCase.fullName, state: testCase.result().state });
      }
    }
    process.stdout.write(`\nTASK7_RESULT ${JSON.stringify({ tests, errors })}\n`);
  },
};

export default {
  root: labDir,
  cacheDir: path.join(starterDir, "node_modules", `.vite-task7-${variant}`),
  plugins: [swapFormatDistance],
  test: {
    include: ["starter/format-distance.test.mjs"],
    watch: false,
    reporters: [resultReporter],
  },
};
