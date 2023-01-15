import { handlebarsSpec } from "@handlebars-ng/specification/tests";
import { HandlebarsNgRunner } from ".";
import { helpers } from "./test-utils/helpers-from-spec";

describe("the runner runs templates from the spec", () => {
  for (const [filename, testCase] of Object.entries(handlebarsSpec)) {
    if (testCase.type === "success") {
      describe(filename, () => {
        it(testCase.description, () => {
          const runner = new HandlebarsNgRunner();
          if (testCase.helpers != null) {
            for (const [name, helper] of Object.entries(testCase.helpers)) {
              runner.registerHelper(name, helpers[helper].fn);
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
