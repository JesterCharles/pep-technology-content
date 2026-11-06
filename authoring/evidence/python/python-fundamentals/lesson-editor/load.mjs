// Loads the Python adapter into Node for the differential test.
import { readFileSync } from "node:fs";
import path from "node:path";
const src = readFileSync(path.join(path.dirname(new URL(import.meta.url).pathname), "python-adapter.js"), "utf8");
const A = new Function(src + "\nreturn LESSON_EDITOR_PYTHON;")();
export const PYED = { check: A.parse, run: A.exec, adapter: A };
