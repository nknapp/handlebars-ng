import { describe, expect, it } from "vitest";
import Handlebars from "handlebars";
import { Program } from "@handlebars-ng/abstract-syntax-tree";
import { normalizeAst } from "./normalizeAst";
import fs from "node:fs";
import path from "node:path";
import prettier from "prettier";
import { ParseErrorTest, SuccessTest } from "./types/tests";
import { posFromParseError } from "./utils/posFromParseError";
import { compileAndRun } from "./utils/hbs4-compileAndRun";
import { handlebarsSpec } from "./";

const specDir = path.join(__dirname, "spec");

describe("The spec", () => {
  for (const [filename, testcase] of Object.entries(handlebarsSpec)) {
    describe(filename, () => {
      describe(testcase.description, () => {
        switch (testcase.type) {
          case "success":
            return new ExpectedSuccess(testcase, filename).testSuccess();
          case "runtimeError":
            it.todo("verify runtime error: " + filename);
            return;
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
    const output = compileAndRun(this.testcase);
    expect(output).toEqual(this.testcase.output);
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
    const { line, column } = posFromParseError(error);
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
