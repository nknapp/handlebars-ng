import Handlebars from "handlebars";
import type { Program } from "../../types/ast";
import fs from "node:fs/promises";

import type {
  HandlebarsTest,
  ParseErrorTest,
  SuccessTest,
} from "../../types/tests";
import { jsonEquals } from "@/utils/jsonEquals";
import { normalizeAst } from "@/utils/normalizeAst";
import { writeTestcase } from "./writeTestcase";

export async function addResultToFile(file: string) {
  const testcase = JSON.parse(
    await fs.readFile(file, "utf-8")
  ) as HandlebarsTest;
  switch (testcase.type) {
    case "success":
      adjustSuccessTestcase(testcase);
      break;
    case "parseError":
      adjustParseErrorTestcase(testcase);
      break;
  }

  writeTestcase(file, testcase);
}

function adjustSuccessTestcase(testcase: SuccessTest): void {
  if (!testcase.originalParseError) {
    addOutput(testcase);
    addAstOrOriginalAst(testcase);
  }

  testcase.ast = normalizeAst(testcase.ast);
  if (testcase.originalAst != null) {
    testcase.originalAst = normalizeAst(testcase.originalAst as Program);
  }
}

function addOutput(testcase: SuccessTest): void {
  if (testcase.output == null) {
    testcase.output = Handlebars.compile(testcase.template)(testcase.input);
  }
}

function addAstOrOriginalAst(testcase: SuccessTest): void {
  const ast = normalizeAst(Handlebars.parse(testcase.template) as Program);
  if (testcase.ast == null) {
    testcase.ast = ast;
  } else if (jsonEquals(ast, testcase.ast)) {
    delete testcase.originalAst;
  } else {
    testcase.originalAst = ast;
  }
}

function adjustParseErrorTestcase(testcase: ParseErrorTest): void {
  try {
    Handlebars.parse(testcase.template);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message !== testcase.expected.message) {
        testcase.originalMessage = error.message;
      }
      return;
    }
  }
  throw new Error(
    `Expected Handlebars 4.x to fail parsing "${testcase.template}"`
  );
}
