import { describe, expect, it } from "vitest";
import * as Handlebars from "handlebars";
import { loadTestcases } from "./utils/testcases";
import { Program } from "types/ast";
import { normalizeAst } from "./utils/normalizeAst";

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
              expect(normalizeAst(ast)).toEqual(testCase.ast);
            });
          });
        }
      });
    });
  }
});
