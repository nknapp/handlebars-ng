import { describe, expect, it } from "vitest";
import * as Handlebars from "handlebars";
import { loadTestcases } from "./utils/testcases";
import { Program } from "types/ast";
import { normalizeAst } from "./utils/normalizeAst";
import fs from "node:fs";
import path from "node:path";
import prettier from "prettier";
import { ParseErrorTest, SuccessTest } from "types/tests";

const specDir = path.join(__dirname, "spec");

const testCases = await loadTestcases();

describe("The spec", () => {
  for (const [filename, testcase] of Object.entries(testCases)) {
    describe(filename, () => {
      describe(testcase.description, () => {
        switch (testcase.type) {
          case "success":
            return new ExpectedSuccess(testcase, filename).testSuccess();
          case "parseError":
            return new ExpectedParseError(testcase, filename).testError();
          default:
            it("error", () => {
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              throw new Error("Unexpected test type " + testcase.type);
            });
        }
      });
    });
  }
});

class ExpectedSuccess {
  testcase: SuccessTest;
  filename: string;
  constructor(testcase: SuccessTest, filename: string) {
    this.testcase = testcase;
    this.filename = filename;
  }

  testSuccess() {
    if (this.shouldWorkWithOriginalHandlebars()) {
      it.todo(this.testcase.description);
    } else {
      describe(this.testcase.description, () => {
        it("output", () => {
          this.expectCorrectOutput();
        });

        it("ast", () => {
          this.expectCorrectAst();
        });
      });
    }
  }

  shouldWorkWithOriginalHandlebars() {
    return (
      this.testcase.originalAst != null || this.testcase.originalParseError
    );
  }

  expectCorrectAst() {
    const instance = Handlebars.create();
    const ast = instance.parse(this.testcase.template) as Program;
    const actual = { ...this.testcase, ast: normalizeAst(ast) };
    try {
      expect(actual.ast).toEqual(this.testcase.ast);
    } catch (error) {
      writeActualSpecForComparison(this.filename, actual);
    }
  }

  expectCorrectOutput() {
    const instance = Handlebars.create();
    const template = instance.compile(this.testcase.template);
    expect(template(this.testcase.input)).toEqual(this.testcase.output);
  }
}

class ExpectedParseError {
  testcase: ParseErrorTest;
  filename: string;
  constructor(testcase: ParseErrorTest, filename: string) {
    this.testcase = testcase;
    this.filename = filename;
  }

  testError() {
    if (this.testcase.originalMessage != null) {
      it.todo("should yield a parse error");
    } else {
      it("should yield a parse error", () => {
        const instance = Handlebars.create();
        try {
          instance.parse(this.testcase.template);
          expect.fail("Expected template to fail");
        } catch (error) {
          this.verifyError(error as Error);
          return;
        }
      });
    }
  }

  verifyError(error: Error) {
    const { line, column } = this.posFromMessage(error.message);
    try {
      expect(error.message).toEqual(this.testcase.expected.message);
    } catch (failedExpectation) {
      const actual: ParseErrorTest = {
        ...this.testcase,
        expected: { message: error.message, line, column },
      };
      writeActualSpecForComparison(this.filename, actual);
      throw failedExpectation;
    }
  }

  posFromMessage(message: string): { line: number; column: number } {
    const [parseErrorMsg, ignoredCodeLine, marker, ignoredExpectations] =
      message.split("\n");
    const [lineAsString] = getMatchingGroups(parseErrorMsg, /on line (\d+)/);
    expect(marker).toMatch(/-*\^$/); // e.g. ---^
    const column = marker.length;
    return { line: parseInt(lineAsString), column };
  }
}

function getMatchingGroups(string: string, regex: RegExp) {
  const match = string.match(regex);
  if (match == null) throw new Error(`"${string}" does not match ${regex}`);
  return match.slice(1);
}

function writeActualSpecForComparison(filename: string, actualSpec: unknown) {
  const actualFile = path.join(specDir, filename + ".actual.json");
  const actualContents = JSON.stringify(actualSpec);
  fs.writeFileSync(
    actualFile,
    prettier.format(actualContents, { parser: "json" })
  );
  throw new Error(
    `Difference in "${filename}": Adding "${actualFile}" as reference`
  );
}
