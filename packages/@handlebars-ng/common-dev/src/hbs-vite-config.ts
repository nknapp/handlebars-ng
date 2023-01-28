/// <reference types="vitest" />

import { defineConfig, UserConfigExport } from "vite";
import dts from "vite-plugin-dts";
import path from "node:path";

export interface HandlebarsDtsConfig {
  include?: string | string[];
  exclude?: string | string[];
}

export interface HandlebarsViteConfigArgs {
  name: string;
  srcDir: string;
  rollupExternal?: string | string[];
  dts?: HandlebarsDtsConfig;
}

export function hbsViteConfig({
  name,
  srcDir,
  rollupExternal,
  dts: dtsConfig = {},
}: HandlebarsViteConfigArgs): UserConfigExport {
  return defineConfig({
    plugins: [
      dts({
        include: dtsConfig.include ?? srcDir,
        exclude: dtsConfig.exclude,
        compilerOptions: {
          paths: {
            "@/*": ["dist/*"],
          },
        },
      }),
    ],
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
        name,
      },
      rollupOptions: {
        external: rollupExternal,
      },
      sourcemap: true,
      target: "esnext",
    },
    test: {
      globals: true,
    },
  });
}
