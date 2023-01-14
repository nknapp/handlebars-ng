import { handlebarsSpec } from "@handlebars-ng/specification/tests";
import { parse } from "./index";

describe("test against Handlebars spec", () => {
  for (const testCase of handlebarsSpec) {
    describe(testCase.filename, () => {
      it(testCase.description, () => {
        const ast = parse(testCase.template);
        try {
          expect(ast).toEqual(testCase.ast);
        } catch (error) {
          // Allow console in this case since it helps adjusting test-cases in case they are wrong
          // eslint-disable-next-line no-console
          console.log(JSON.stringify(ast));
          throw error;
        }
      });
    });
  }
});
