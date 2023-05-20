import { createHandlebarsParser } from "../../core/createHandlebarsParser";
import { ContentPlugin } from "./ContentPlugin";
import { loc } from "../../test-utils/loc";
import { HandlebarsParserPlugin } from "../../core/types";

describe("ContentPlugin", () => {
  it("parses content", () => {
    const parser = createHandlebarsParser({ plugins: [ContentPlugin] });
    const ast = parser.parse("abc");
    expect(ast.body).toEqual([
      {
        type: "ContentStatement",
        loc: loc("1:0-1:3"),
        original: "abc",
        value: "abc",
      },
    ]);
  });

  it("parses escaped mustaches", () => {
    const parser = createHandlebarsParser({
      plugins: [ContentPlugin, TestMustache],
    });
    const ast = parser.parse("a\\{{c");
    expect(ast.body).toEqual([
      {
        type: "ContentStatement",
        loc: loc("1:0-1:5"),
        original: "a\\{{c",
        value: "a{{c",
      },
    ]);
  });
});

const TestMustache: HandlebarsParserPlugin = {
  statement(statementRegistry) {
    statementRegistry.addMatchRule({ type: "OPEN", match: "{{" });
  },
};
