// Public test harness configuration. The suite also runs the learner-authored
// test inside ../starter/src (task 8). The aliases make every file - public
// tests, the learner test and the starter sources - resolve React, the router
// and Testing Library from this harness install, so the suite never runs with
// two copies of anything.
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

const here = path.dirname(fileURLToPath(import.meta.url));
const dep = (name) => path.resolve(here, "node_modules", name);

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: /^react$/, replacement: dep("react") },
      { find: /^react\/(.*)$/, replacement: `${dep("react")}/$1` },
      { find: /^react-dom$/, replacement: dep("react-dom") },
      { find: /^react-dom\/(.*)$/, replacement: `${dep("react-dom")}/$1` },
      { find: /^react-router$/, replacement: dep("react-router") },
      {
        find: /^@testing-library\/react$/,
        replacement: dep("@testing-library/react"),
      },
      {
        find: /^@testing-library\/user-event$/,
        replacement: dep("@testing-library/user-event"),
      },
      {
        find: /^@testing-library\/jest-dom\/(.*)$/,
        replacement: `${dep("@testing-library/jest-dom")}/$1`,
      },
    ],
  },
  server: { fs: { allow: [".."] } },
  test: {
    environment: "jsdom",
    include: ["t*.test.jsx", "../starter/src/**/*.test.jsx"],
    setupFiles: ["./setup.js"],
    reporters: "verbose",
    fileParallelism: false,
  },
});
