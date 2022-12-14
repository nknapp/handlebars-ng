import { testCases } from "@handlebars-ng/specification";
import { compile } from ".";
import { Program } from "./model/ast";

describe("the runner runs templates from the spec", () => {
  for (const testCase of testCases) {
    describe(testCase.filename, () => {
      it(testCase.description, () => {
        const result = compile(testCase.ast as Program)(testCase.input);
        expect(result).toEqual(testCase.output);
      });
    });
  }
});
