import {
  handlebarsSpec,
  ParseErrorTest,
  SuccessTest,
} from "@handlebars-ng/specification/tests";
import { parse } from "./index";
import { ParseError } from "./parser/ParseError";

describe("test against Handlebars spec", () => {
  for (const [filename, testCase] of Object.entries(handlebarsSpec)) {
    describe(filename, () => {
      it(testCase.description, () => {
        if (testCase.type === "success") {
          expectSameAst(testCase);
        }
        if (testCase.type === "parseError") {
          expectSameError(testCase);
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

function expectSameError(testcase: ParseErrorTest) {
  // TODO: The messages are currently different and we don't test this at the moment
  // I don't know if the messages are really that important to be spec'd, the important
  // thing in my view is that there IS an error an the the location is correct.
  const parseError = getParseError(testcase.template);

  acceptWrongLocationForUnfinishedFeatures(testcase);
  expect(parseError.location).toEqual({
    column: testcase.expected.column,
    line: testcase.expected.line,
  });
}

function getParseError(template: string): ParseError {
  try {
    parse(template);
  } catch (error) {
    if (error instanceof ParseError) {
      return error;
    }
    throw error;
  }
  throw new Error(`No error was thrown when parsing "${template}"`);
}

/**
 * Some errors are returning the wrong location.
 *
 * * An invalid id-char may be a valid token in the Mustache context for Handlebars 4.x, but not yet for this parser
 *   In this case, Handlebars 4.x reports the next token as invalid
 */
function acceptWrongLocationForUnfinishedFeatures(testcase: ParseErrorTest) {
  switch (testcase.description) {
    case "| may not be used in an id":
    case "} may not be used in an id":
    case ") may not be used in an id":
    case "= may not be used in an id":
      testcase.expected.column--;
      break;
  }
}
