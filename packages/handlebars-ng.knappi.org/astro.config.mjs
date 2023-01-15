import { defineConfig } from "astro/config";
import { injectTestcases } from "./astro-plugins/remark-inject-testcase.mjs";

// https://astro.build/config
import tailwind from "@astrojs/tailwind";

// https://astro.build/config
import mdx from "@astrojs/mdx";

// https://astro.build/config
import solidJs from "@astrojs/solid-js";
import { hbsSpec } from "./astro-plugins/sync-handlebars-spec";
import rehypeAutolinkHeadings from "rehype-autolink-headings";

// https://astro.build/config
export default defineConfig({
  integrations: [hbsSpec(), tailwind(), mdx(), solidJs()],
  srcDir: "./src",
  markdown: {
    remarkPlugins: [injectTestcases],
    rehypePlugins: [[rehypeAutolinkHeadings, { behavior: "wrap" }]],
    extendDefaultPlugins: true,
    syntaxHighlight: "shiki",
  },
  outDir: "dist",
  site: "https://handlebars-ng.knappi.org/",
  base: "/",
});
