/// <reference types="vitest" />

import { defineConfig } from "vite";
import path from "node:path";

// This is the vite.config for scripts ran with "vite-node"
// For the website-config look at "astro.config.mjs"
export default defineConfig({
  plugins: [],
  test: {
    globals: true,
  },
  resolve: {
    alias: { "@": path.resolve("src") },
  },
});
