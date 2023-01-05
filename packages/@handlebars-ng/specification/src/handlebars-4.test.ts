import { describe, expect, it } from "vitest";
import * as Handlebars from "handlebars";
import { loadTestcases } from "./utils/testcases";
import { ContentCombiningVisitor } from "./utils/ContentCombiningVisitor";

const testCases = await loadTestcases();

describe("The spec", () => {
  for (const testCase of testCases) {
    describe(testCase.filename, () => {
      if (testCase.originalAst != null || testCase.originalParseError) {
        it.todo(testCase.description);
      } else {
        it(testCase.description, () => {
          const instance = Handlebars.create();
          const ast = instance.parseWithoutProcessing(testCase.template);
          new ContentCombiningVisitor().accept(ast);
          expect(plainAst(ast)).toEqual(testCase.ast);
          const template = instance.compile(testCase.template);
          expect(template(testCase.input)).toEqual(testCase.output);
        });
      }
    });
  }
});

function plainAst(ast: unknown): Record<string, unknown> {
  return JSON.parse(JSON.stringify(ast));
}
