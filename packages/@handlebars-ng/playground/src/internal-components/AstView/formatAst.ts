import { Program } from "@handlebars-ng/abstract-syntax-tree";
import JSON5 from "json5";
import prettier from "prettier/standalone";
import * as parserBabel from "prettier/plugins/babel.js";
import * as prettierPluginEstree from "prettier/plugins/estree";

export async function formatAst(ast: Program): Promise<string> {
  return prettier.format(JSON5.stringify(ast), {
    parser: "json5",
    plugins: [parserBabel, prettierPluginEstree],
  });
}
