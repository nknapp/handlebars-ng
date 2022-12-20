import { defineConfig } from "astro/config";
import { injectTestcases } from "./astro-plugins/inject-testcase.mjs";
import shikiTheme from 'shiki/themes/github-light.json'

// https://astro.build/config
import tailwind from "@astrojs/tailwind";

// https://astro.build/config
import mdx from "@astrojs/mdx";
import path from "path";

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), mdx()],
  vite: {
    resolve: {
      alias: { "@": path.resolve("src") },
    },
  },
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
});
