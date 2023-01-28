import { hbsViteConfig } from "./src/hbs-vite-config";
import path from "node:path";
import { UserConfigExport } from "vite";

const config: UserConfigExport = hbsViteConfig({
  name: "common-dev",
  srcDir: path.resolve("src"),
  rollupExternal: ["vite", "vite-plugin-dts", "node:path"],
});

export default config;
