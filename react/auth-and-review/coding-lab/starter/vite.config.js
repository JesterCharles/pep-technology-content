import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { mockApiPlugin } from "./mock-api.js";

export default defineConfig({
  plugins: [react(), mockApiPlugin()],
});
