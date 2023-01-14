import {
  handlebarsSpec,
  SuccessTest,
} from "@handlebars-ng/specification/tests";
import { parse } from "./index";

describe("test against Handlebars spec", () => {
  for (const [filename, testCase] of Object.entries(handlebarsSpec)) {
    describe(filename, () => {
      it(testCase.description, () => {
        if (testCase.type === "success") {
          expectSameAst(testCase);
        }
      });
    });
  }
});

function expectSameAst(testCase: SuccessTest) {
  const ast = parse(testCase.template);
  try {
    expect(ast).toEqual(testCase.ast);
  } catch (error) {
    // Allow console in this case since it helps adjusting test-cases in case they are wrong
    // eslint-disable-next-line no-console
    console.log(JSON.stringify(ast));
    throw error;
  }
}
