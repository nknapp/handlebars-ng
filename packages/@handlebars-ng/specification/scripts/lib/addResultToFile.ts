import Handlebars from "handlebars";
import type { Program } from "../../types/ast";
import fs from "node:fs/promises";

import type { HandlebarsTest } from "../../types/tests";
import prettier from "prettier";
import { jsonEquals } from "@/utils/jsonEquals";
import { normalizeAst } from "@/utils/normalizeAst";

export async function addResultToFile(file: string) {
  const testcase = JSON.parse(await fs.readFile(file, "utf-8"));

  adjustTestcase(testcase);

  const json = JSON.stringify(testcase);
  const formatted = prettier.format(json, { parser: "json" });

  if ((await fs.readFile(file, "utf-8")) !== formatted) {
    console.log("Updating " + file);
    await fs.writeFile(file, formatted);
  }
}

function adjustTestcase(testcase: HandlebarsTest): void {
  testcase.ast = normalizeAst(testcase.ast);
  if (testcase.originalAst != null) {
    testcase.originalAst = normalizeAst(testcase.originalAst as Program);
  }

  if (!testcase.originalParseError) {
    addOutput(testcase);
    addAstOrOriginalAst(testcase);
  }
}

function addOutput(testcase: HandlebarsTest): void {
  if (testcase.output == null) {
    testcase.output = Handlebars.compile(testcase.template)(testcase.input);
  }
}

function addAstOrOriginalAst(testcase: HandlebarsTest): void {
  const ast = normalizeAst(Handlebars.parse(testcase.template) as Program);
  if (testcase.ast == null) {
    testcase.ast = ast;
  } else if (jsonEquals(ast, testcase.ast)) {
    delete testcase.originalAst;
  } else {
    testcase.originalAst = ast;
  }
}
