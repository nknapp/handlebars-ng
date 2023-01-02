/// <reference types="vitest" />

import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [dts({ include: "src/index.ts" })],
  build: {
    outDir: "dist",
    lib: {
      entry: {
        index: "src/index.ts",
      },
      formats: ["es", "cjs"],
      name: "handlebars-parser",
    },

    sourcemap: true,
    minify: false,
    target: "esnext",
  },
  test: {
    globals: true,
  },
});
