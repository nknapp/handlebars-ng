import { testCases } from "@handlebars-ng/specification";
import { parse } from "./index";

describe("test against Handlebars spec", () => {
  for (const testCase of testCases) {
    describe(testCase.filename, () => {
      it(testCase.description, () => {
        const ast = parse(testCase.template);
        expect(ast).toEqual(testCase.ast);
      });
    });
  }
});
