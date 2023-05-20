import { createLexer } from "./createLexer";

describe("createLexer", () => {
  it("creates a lexer with a fallback rule", () => {
    const lexer = createLexer({
      statements: { fallbackRule: { type: "CONTENT" }, matchRules: [] },
    });
    const tokens = lexer.lex("a");
    expect([...tokens]).toEqual([
      {
        type: "CONTENT",
        value: "a",
        original: "a",
        start: { line: 1, column: 0 },
        end: { line: 1, column: 1 },
      },
    ]);
  });

  it("creates a lexer with a match rule", () => {
    const lexer = createLexer({
      statements: {
        fallbackRule: null,
        matchRules: [
          { type: "OPEN", match: "{{" },
          { type: "CLOSE", match: "}}" },
        ],
      },
    });
    const tokens = lexer.lex("{{}}");
    expect([...tokens]).toEqual([
      {
        type: "OPEN",
        value: "{{",
        original: "{{",
        start: { line: 1, column: 0 },
        end: { line: 1, column: 2 },
      },
      {
        type: "CLOSE",
        value: "}}",
        original: "}}",
        start: { line: 1, column: 2 },
        end: { line: 1, column: 4 },
      },
    ]);
  });

  it("lexer without fallback rule and unmatched content", () => {
    const lexer = createLexer({
      statements: {
        fallbackRule: null,
        matchRules: [
          { type: "OPEN", match: "{{" },
          { type: "CLOSE", match: "}}" },
        ],
      },
    });
    const tokens = lexer.lex("{{abc}}");
    expect(() => {
      for (const ignoredToken of tokens) {
        /* noop */
      }
    }).toThrow("Syntax error at 1:2, expected one of  but got 'a'");
  });

  it("creates a lexer with fallback and match rule", () => {
    const lexer = createLexer({
      statements: {
        fallbackRule: { type: "CONTENT" },
        matchRules: [{ type: "COMMENT", match: /\{\{!.*?}}/ }],
      },
    });
    const tokens = lexer.lex("a{{!b}}c");
    expect([...tokens]).toEqual([
      {
        type: "CONTENT",
        value: "a",
        original: "a",
        start: { line: 1, column: 0 },
        end: { line: 1, column: 1 },
      },
      {
        type: "COMMENT",
        value: "{{!b}}",
        original: "{{!b}}",
        start: { line: 1, column: 1 },
        end: { line: 1, column: 7 },
      },
      {
        type: "CONTENT",
        value: "c",
        original: "c",
        start: { line: 1, column: 7 },
        end: { line: 1, column: 8 },
      },
    ]);
  });
});
