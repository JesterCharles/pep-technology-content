// Public test harness configuration. The learner app under ../starter has its
// own node_modules for `npm run dev`; these aliases make every test and every
// imported starter file resolve React and the router from this harness
// install, so the suite never runs with two copies.
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
    ],
  },
  server: { fs: { allow: [".."] } },
  test: {
    environment: "jsdom",
    include: ["t*.test.jsx"],
    setupFiles: ["./setup.js"],
    reporters: "verbose",
    fileParallelism: false,
  },
});
