import { handlebarsSpec } from "@handlebars-ng/specification/tests";
import { compile } from ".";
import { Program } from "@handlebars-ng/specification/ast";

describe("the runner runs templates from the spec", () => {
  for (const testCase of handlebarsSpec) {
    describe(testCase.filename, () => {
      it(testCase.description, () => {
        const result = compile(testCase.ast as Program)(testCase.input);
        expect(result).toEqual(testCase.output);
      });
    });
  }
});
