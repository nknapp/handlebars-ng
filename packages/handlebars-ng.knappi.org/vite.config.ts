/// <reference types="vitest" />
import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve("src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        entryFileNames: "entry.[hash].js",
        chunkFileNames: "chunks/chunk.[hash].js",
        assetFileNames: "assets/asset.[hash][extname]",
      },
    },
  },
  test: {
    globals: true,
  },
});
