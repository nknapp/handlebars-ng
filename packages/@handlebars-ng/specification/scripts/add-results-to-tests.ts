import { specDir, specFilesRelativeToSpecDir } from "@/utils/parseSpec";
import Handlebars from "handlebars";
import type { Program } from "../types/ast";
import fs from "node:fs";
import path from "node:path";
import { promisify, isDeepStrictEqual } from "node:util";
import type { HandlebarsTest } from "../types/tests";
import prettier from "prettier";

const writeFile = promisify(fs.writeFile);
const readFile = promisify(fs.readFile);

for (const file of await specFilesRelativeToSpecDir()) {
  const absoluteFile = path.resolve(specDir, file);

  const testcase = JSON.parse(await readFile(absoluteFile, "utf-8"));
  const newTestcase = { ...testcase };

  addOutput(newTestcase);
  addAst(newTestcase);

  if (!deepEqual(testcase, newTestcase)) {
    console.log("Updating " + file);
    const formatted = prettier.format(JSON.stringify(newTestcase), {
      parser: "json",
    });
    await writeFile(absoluteFile, formatted);
  }
}

function addOutput(testcase: HandlebarsTest): void {
  if (testcase.output == null) {
    testcase.output = Handlebars.compile(testcase.template)(testcase.input);
  }
}

function addAst(testcase: HandlebarsTest): void {
  const ast = Handlebars.parse(testcase.template);
  if (testcase.ast == null) {
    testcase.ast = ast as Program;
  } else if (!deepEqual(ast, testcase.ast)) {
    testcase.originalAst = ast;
  } else {
    delete testcase.originalAst;
  }
}

// isDeepStrictEqual does not work properly for ASTs because the prototypes are different.
// we convert to a plain object but parsing the stringified version.
function deepEqual(obj1: unknown, obj2: unknown): boolean {
  const plainObj1 = JSON.parse(JSON.stringify(obj1));
  const plainObj2 = JSON.parse(JSON.stringify(obj2));

  return isDeepStrictEqual(plainObj1, plainObj2);
}
