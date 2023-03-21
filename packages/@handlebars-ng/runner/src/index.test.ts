import { handlebarsSpec, helpers } from "@handlebars-ng/specification";
import type { HandlebarsTest } from "@handlebars-ng/specification";
import { HandlebarsNgRunner } from ".";

describe("the runner runs templates from the spec", () => {
  for (const [filename, testCase] of Object.entries<HandlebarsTest>(
    handlebarsSpec
  )) {
    if (testCase.type === "success") {
      describe(filename, () => {
        it(testCase.description, () => {
          const runner = new HandlebarsNgRunner();
          if (testCase.helpers != null) {
            for (const [name, helper] of Object.entries(testCase.helpers)) {
              if (helper in helpers) {
                runner.registerHelper(name, helpers[helper].fn);
              }
            }
          }
          const compiledTemplate = runner.compile(testCase.ast);
          const result = compiledTemplate(testCase.input);
          expect(result).toEqual(testCase.output);
        });
      });
    }
  }
});
