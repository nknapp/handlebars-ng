import { describe, expect, it } from "vitest";
import * as Handlebars from "handlebars";
import { loadTestcases } from "./utils/testcases";
import { Program } from "types/ast";
import { normalizeAst } from "./utils/normalizeAst";
import fs from "node:fs";
import path from "node:path";
import prettier from "prettier";

const specDir = path.join(__dirname, "spec");

const testCases = await loadTestcases();

describe("The spec", () => {
  for (const testCase of testCases) {
    describe(testCase.filename, () => {
      describe(testCase.description, () => {
        if (testCase.originalAst != null || testCase.originalParseError) {
          it.todo(testCase.description);
        } else {
          describe(testCase.description, () => {
            it("output", () => {
              const instance = Handlebars.create();
              const template = instance.compile(testCase.template);
              expect(template(testCase.input)).toEqual(testCase.output);
            });

            it("ast", () => {
              const instance = Handlebars.create();
              const ast = instance.parse(testCase.template) as Program;
              const actual = { ...testCase, ast: normalizeAst(ast) };
              try {
                expect(actual.ast).toEqual(testCase.ast);
              } catch (error) {
                const actualFile = path.join(
                  specDir,
                  testCase.filename + ".actual.json"
                );
                const actualContents = JSON.stringify(actual);
                fs.writeFileSync(
                  actualFile,
                  prettier.format(actualContents, { parser: "json" })
                );
                throw new Error(
                  "Difference in " +
                    testCase.filename +
                    ": Adding " +
                    actualFile
                );
              }
            });
          });
        }
      });
    });
  }
});
