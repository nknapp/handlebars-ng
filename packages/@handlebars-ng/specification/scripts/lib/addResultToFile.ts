import { specDir } from "@/utils/testcases";
import Handlebars from "handlebars";
import type { Program } from "../../types/ast";
import fs from "node:fs/promises";
import path from "node:path";
import type { HandlebarsTest } from "../../types/tests";
import prettier from "prettier";
import { jsonEquals } from "@/utils/jsonEquals";
import { normalizeAst } from "@/utils/normalizeAst";

export async function addResultToFile(file: string) {
  const absoluteFile = path.resolve(specDir, file);
  const testcase = JSON.parse(await fs.readFile(absoluteFile, "utf-8"));
  const newTestcase = { ...testcase };
  newTestcase.ast = normalizeAst(testcase.ast);
  if (newTestcase.originalAst != null) {
    newTestcase.originalAst = normalizeAst(newTestcase.originalAst);
  }

  addOutput(newTestcase);
  addAstOrOriginalAst(newTestcase);

  if (!jsonEquals(testcase, newTestcase)) {
    console.log("Updating " + file);
    const formatted = prettier.format(JSON.stringify(newTestcase), {
      parser: "json",
    });
    await fs.writeFile(absoluteFile, formatted);
  }
}

function addOutput(testcase: HandlebarsTest): void {
  if (testcase.output == null) {
    testcase.output = Handlebars.compile(testcase.template)(testcase.input);
  }
}

function addAstOrOriginalAst(testcase: HandlebarsTest): void {
  const ast = normalizeAst(Handlebars.parse(testcase.template));
  if (testcase.ast == null) {
    testcase.ast = ast as Program;
  } else if (jsonEquals(ast, testcase.ast)) {
    delete testcase.originalAst;
  } else {
    testcase.originalAst = ast;
  }
}
