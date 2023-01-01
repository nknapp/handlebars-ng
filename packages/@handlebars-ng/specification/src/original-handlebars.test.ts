import { describe, expect, it } from "vitest";
import * as Handlebars from "handlebars";
import { loadTestcases } from "./utils/testcases";
import { Normalizer } from "./utils/AstNormalizer";

const testCases = await loadTestcases();

describe("The spec", () => {
  for (const testCase of testCases) {
    describe(testCase.filename, () => {
      if (testCase.originalAst != null) {
        it.todo(testCase.description);
      } else {
        it(testCase.description, () => {
          const instance = Handlebars.create();
          const ast = instance.parse(testCase.template);
          new Normalizer().accept(ast);
          expect(ast).toEqual(testCase.ast);
          const template = instance.compile(ast);
          expect(template(testCase.input)).toEqual(testCase.output);
        });
      }
    });
  }
});
