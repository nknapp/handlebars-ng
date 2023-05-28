/// <reference types="vitest" />
/// <reference types="vite/client" />

import solidPlugin from "vite-plugin-solid";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import path from "node:path";

const srcDir = "src";

export default defineConfig({
  plugins: [
    dts({
      include: srcDir,
      copyDtsFiles: true,
      compilerOptions: {
        paths: {
          "@/*": ["dist/*"],
        },
      },
    }),
    solidPlugin(),
  ],
  server: {
    port: 3001,
  },
  resolve: {
    alias: {
      "@": srcDir,
    },
  },
  build: {
    outDir: "dist",
    lib: {
      entry: {
        index: path.join(srcDir, "index.ts"),
      },
      formats: ["es", "cjs"],
      name: "handlebars-ng-playground",
    },
    sourcemap: true,
    target: "esnext",
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["src/setup-tests.ts"],
    // otherwise, solid would be loaded twice:
    deps: { registerNodeLoader: true },
  },
});
