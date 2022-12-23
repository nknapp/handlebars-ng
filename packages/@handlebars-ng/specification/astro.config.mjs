import { defineConfig } from "astro/config";
import { injectTestcases } from "./astro-plugins/inject-testcase.mjs";
import shikiTheme from 'shiki/themes/github-light.json';

// https://astro.build/config
import tailwind from "@astrojs/tailwind";

// https://astro.build/config
import mdx from "@astrojs/mdx";
import path from "path";

// https://astro.build/config
import solidJs from "@astrojs/solid-js";

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), mdx(), solidJs()],
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
    shikiConfig: {
      theme: shikiTheme
    }
  },
  outDir: "dist",
  site: "https://handlebars-ng.knappi.org/",
  base: "/"
});