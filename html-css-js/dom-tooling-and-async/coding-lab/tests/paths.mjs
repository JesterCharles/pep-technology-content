// Shared paths for the dashboard lab tests.
import path from "node:path";
import { fileURLToPath } from "node:url";

export const labDir = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
export const starterDir = path.join(labDir, "starter");
