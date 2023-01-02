import { defineConfig } from "astro/config";
import { injectTestcases } from "./astro-plugins/remark-inject-testcase.mjs";

// https://astro.build/config
import tailwind from "@astrojs/tailwind";

// https://astro.build/config
import mdx from "@astrojs/mdx";
import path from "path";

// https://astro.build/config
import solidJs from "@astrojs/solid-js";
import { hbsSpec } from "./astro-plugins/sync-handlebars-spec.ts";

// https://astro.build/config
export default defineConfig({
  integrations: [hbsSpec(), tailwind(), mdx(), solidJs()],
  vite: {
    resolve: {
      alias: {
        "@": path.resolve("src")
      }
    },
    build: {
      rollupOptions: {
        output: {
          entryFileNames: 'entry.[hash].js',
          chunkFileNames: 'chunks/chunk.[hash].js',
          assetFileNames: 'assets/asset.[hash][extname]',
        },
      },
    },  },
  srcDir: "./src",
  markdown: {
    remarkPlugins: [injectTestcases],
    extendDefaultPlugins: true,
    syntaxHighlight: 'shiki',
  },
  outDir: "dist",
  site: "https://handlebars-ng.knappi.org/",
  base: "/"
});
