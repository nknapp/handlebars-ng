import { defineConfig } from "astro/config";
import {
  DATA,
  FILENAME,
  HASH,
  inlineSpecialLinks,
} from "./astro-plugins/remark-inline-special-links";

// https://astro.build/config
import tailwind from "@astrojs/tailwind";

// https://astro.build/config
import mdx from "@astrojs/mdx";

// https://astro.build/config
import solidJs from "@astrojs/solid-js";
import { syncHandlebarsSpec } from "./astro-plugins/sync-handlebars-spec";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";

// https://astro.build/config
export default defineConfig({
  integrations: [syncHandlebarsSpec(), tailwind(), mdx(), solidJs()],
  srcDir: "./src",
  markdown: {
    remarkPlugins: [
      [
        inlineSpecialLinks,
        {
          baseDir: "./src/pages/spec",
          links: [
            {
              match: /hb-spec\.json$/,
              component: "@/components/Testcase/index.astro",
              propMapping: {
                filename: FILENAME,
                spec: DATA,
              },
            },
            {
              match: /\.grammar(#.*?)?$/,
              component: "@/components/Grammar/index.astro",
              dataImportQuery: "?raw",
              propMapping: {
                filename: FILENAME,
                contents: DATA,
                hash: HASH,
              },
            },
          ],
        },
      ],
    ],
    rehypePlugins: [rehypeSlug, [rehypeAutolinkHeadings, { behavior: "wrap" }]],
    syntaxHighlight: "shiki",
  },
  outDir: "dist",
  site: "https://handlebars-ng.knappi.org",
  trailingSlash: "always",
  base: "/",
});
