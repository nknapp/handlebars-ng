import { Token } from "../lexer";
import { HandlebarsParser } from "./HandlebarsParser";
import { Program, SourceLocation } from "../model/ast";

describe("parser", () => {
  it("parses a simple content template", () => {
    expectAst(
      [
        {
          type: "CONTENT",
          start: { column: 0, line: 1 },
          end: { column: 3, line: 1 },
          value: "abc",
          original: "abc",
        },
      ],
      {
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
      }
    );
  });

  it("parses a simple content template (different length)", () => {
    expectAst(
      [
        {
          type: "CONTENT",
          start: { column: 0, line: 1 },
          end: { column: 5, line: 1 },
          value: "abcde",
          original: "abcde",
        },
      ],
      {
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
      }
    );
  });
});

function expectAst(tokens: Token[], expectedAst: Program) {
  const ast = new HandlebarsParser().parse(tokens);
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
