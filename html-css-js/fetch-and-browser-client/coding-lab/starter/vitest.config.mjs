// Vitest configuration for the Trail API client lab. Do not edit.
// Runs the lab's public tests in ../tests and any test you write here.
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    root: "..",
    include: ["tests/**/*.test.mjs", "starter/**/*.test.mjs"],
    watch: false,
  },
});
