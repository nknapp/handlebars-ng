import { Program } from "@handlebars-ng/abstract-syntax-tree";
import JSON5 from "json5";
import prettier from "prettier/standalone";
import parserBabel from "prettier/parser-babel";

export function formatAst(ast: Program): string {
  return prettier.format(JSON5.stringify(ast), {
    parser: "json5",
    pluginSearchDirs: false,
    plugins: [parserBabel],
  });
}
