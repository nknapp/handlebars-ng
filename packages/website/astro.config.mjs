import { defineConfig } from "astro/config";

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
});
