/// <reference types="vitest" />

import { resolve } from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [dts({ include: "src" })],
  build: {
    outDir: "dist",
    lib: {
      entry: {
        index: resolve(__dirname, "src", "index.ts"),
      },
      formats: ["es", "cjs"],
      name: "specification",
    },
    sourcemap: true,
    minify: false,
    target: "esnext",
  },
  resolve: {
    alias: {
      src: "src",
    },
  },
  test: {
    globals: true,
  },
});
