import { Lexer, Token } from "./lexer";

describe("lexer", () => {
  it("parses simple tokens", () => {
    const lexer = new Lexer({
      main: {
        A: {
          match: /a/,
        },
        B: {
          match: /b/,
        },
      },
    });
    expect([...lexer.lex("abab")]).toEqual([
      {
        type: "A",
        original: "a",
        value: "a",
        start: { line: 1, column: 0 },
        end: { line: 1, column: 1 },
      },
      {
        type: "B",
        original: "b",
        value: "b",
        start: { line: 1, column: 1 },
        end: { line: 1, column: 2 },
      },
      {
        type: "A",
        original: "a",
        value: "a",
        start: { line: 1, column: 2 },
        end: { line: 1, column: 3 },
      },
      {
        type: "B",
        original: "b",
        value: "b",
        start: { line: 1, column: 3 },
        end: { line: 1, column: 4 },
      },
    ] satisfies Token<string>);
  });
});
