import { LocalExecutor } from "../common/LocalExecutor";
import { Program } from "@handlebars-ng/abstract-syntax-tree";
import Handlebars from "handlebars";

export function createLocalHbs4Executor() {
  return new LocalExecutor({
    async parse(template: string): Promise<Program> {
      return Handlebars.parse(template) as Program;
    },
  });
}
