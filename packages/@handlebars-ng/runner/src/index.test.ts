import { handlebarsSpec } from "@handlebars-ng/specification/tests";
import { compile } from "./index";

describe("the runner runs templates from the spec", () => {
  for (const [filename, testCase] of Object.entries(handlebarsSpec)) {
    if (testCase.type === "success") {
      describe(filename, () => {
        it(testCase.description, () => {
          const compiledTemplate = compile(testCase.ast);
          const result = compiledTemplate(testCase.input);
          expect(result).toEqual(testCase.output);
        });
      });
    }
  }
});
