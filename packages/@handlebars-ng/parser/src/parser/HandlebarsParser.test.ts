import { HandlebarsParser } from "./HandlebarsParser";
import { Program, SourceLocation } from "../model/ast";

describe("parser", () => {
  it("parses a simple content template", () => {
    expectAst("abc", {
      type: "Program",
      loc: loc(1, 0, 1, 3),
      body: [
        {
          type: "ContentStatement",
          loc: loc(1, 0, 1, 3),
          original: "abc",
          value: "abc",
        },
      ],
      strip: {},
    });
  });

  it("parses a simple content template (different length)", () => {
    expectAst("abcde", {
      type: "Program",
      loc: loc(1, 0, 1, 5),
      body: [
        {
          type: "ContentStatement",
          loc: loc(1, 0, 1, 5),
          original: "abcde",
          value: "abcde",
        },
      ],
      strip: {},
    });
  });

  it("lexer applies lookahead on ID token and does not match 'a' in '{{a{b}}", () => {
    const tokens = new HandlebarsParser().lexer.lex("{{a{b}}");
    expect([...tokens]).toEqual([
      {
        type: "OPEN",
        value: "{{",
        original: "{{",
        ...loc(1, 0, 1, 2),
      },
      {
        type: "error",
        value: "a{b}}",
        original: "a{b}}",
        ...loc(1, 2, 1, 7),
      },
    ]);
  });
});

function expectAst(template: string, expectedAst: Program) {
  const ast = new HandlebarsParser().parse(template);
  expect(ast).toEqual(expectedAst);
}

function loc(
  startLine: number,
  startCol: number,
  endLine: number,
  endCol: number
): SourceLocation {
  return {
    start: { line: startLine, column: startCol },
    end: { line: endLine, column: endCol },
  };
}
