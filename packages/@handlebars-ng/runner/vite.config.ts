import { hbsViteConfig } from "@handlebars-ng/common-dev";
import { UserConfigExport } from "vite";

export default hbsViteConfig({
  srcDir: "src",
  name: "handlebars-ng-runner",
}) as UserConfigExport;
