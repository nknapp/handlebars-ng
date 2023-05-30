import { LocalExecutor } from "../common/LocalExecutor";
import { Program } from "@handlebars-ng/abstract-syntax-tree";
import { createDefaultParser } from "@handlebars-ng/parser";

export function createLocalHbsNgExecutor() {
  const parser = createDefaultParser();
  return new LocalExecutor({
    async parse(template: string): Promise<Program> {
      return parser.parse(template) as Program;
    },
  });
}
