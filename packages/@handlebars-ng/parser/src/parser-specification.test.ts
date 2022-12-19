import { handlebarsSpec } from "@handlebars-ng/specification/tests";
import { parse } from "./index";

describe("test against Handlebars spec", () => {
  for (const testCase of handlebarsSpec) {
    describe(testCase.filename, () => {
      it(testCase.description, () => {
        const ast = parse(testCase.template);
        expect(ast).toEqual(testCase.ast);
      });
    });
  }
});
