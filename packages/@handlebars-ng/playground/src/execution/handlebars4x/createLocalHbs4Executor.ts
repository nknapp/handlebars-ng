import { LocalExecutor } from "../common/LocalExecutor";
import { Program } from "@handlebars-ng/abstract-syntax-tree";

declare global {
  interface Window {
    global: typeof globalThis;
  }
}

if (typeof self === "object") {
  // ts-ignore
  self.global = self;
}
const Handlebars = import("handlebars");
export function createLocalHbs4Executor() {
  return new LocalExecutor({
    async parse(template: string): Promise<Program> {
      return (await Handlebars).parse(template) as Program;
    },
  });
}
