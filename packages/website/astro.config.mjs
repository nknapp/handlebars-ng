import { defineConfig } from "astro/config";
import {injectTestcases} from './astro-plugins/inject-testcase.mjs';

// https://astro.build/config
import tailwind from "@astrojs/tailwind";

// https://astro.build/config
import mdx from "@astrojs/mdx";
import path from 'path'


// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), mdx()],
  vite: {
    resolve: {
      alias: {"src": path.resolve("src") }
    },
  },
  markdown: {  
    remarkPlugins: [injectTestcases],
    extendDefaultPlugins: true
  }
});
