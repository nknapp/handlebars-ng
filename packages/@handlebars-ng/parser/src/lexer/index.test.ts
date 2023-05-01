import { createHbsLexer, Token } from ".";
import { mustacheRules } from "./rules";

describe("Lexer", () => {
  const hbsLexer = createHbsLexer(mustacheRules);
  function createLexer(template: string): IterableIterator<Token> {
    return hbsLexer.lex(template);
  }

  describe("works for different templates", () => {
    it("a single character is a content token", () => {
      testTemplate("a", [
        {
          type: "CONTENT",
          start: { column: 0, line: 1 },
          end: { column: 1, line: 1 },
          original: "a",
          value: "a",
        },
      ]);
    });

    it("a multiple characters are one content token", () => {
      testTemplate("hello", [
        {
          type: "CONTENT",
          start: { column: 0, line: 1 },
          end: { column: 5, line: 1 },
          original: "hello",
          value: "hello",
        },
      ]);
    });

    it("detects OPEN", () => {
      testTemplate("hello {{", [
        {
          type: "CONTENT",
          start: { column: 0, line: 1 },
          end: { column: 6, line: 1 },
          original: "hello ",
          value: "hello ",
        },
        {
          type: "OPEN",
          start: { column: 6, line: 1 },
          end: { column: 8, line: 1 },
          original: "{{",
          value: "{{",
        },
      ]);
    });

    it("detects CLOSE", () => {
      testTemplate("hello {{ }}", [
        {
          type: "CONTENT",
          start: { column: 0, line: 1 },
          end: { column: 6, line: 1 },
          original: "hello ",
          value: "hello ",
        },
        {
          type: "OPEN",
          start: { column: 6, line: 1 },
          end: { column: 8, line: 1 },
          original: "{{",
          value: "{{",
        },
        {
          type: "SPACE",
          start: { column: 8, line: 1 },
          end: { column: 9, line: 1 },
          original: " ",
          value: " ",
        },
        {
          type: "CLOSE",
          start: { column: 9, line: 1 },
          end: { column: 11, line: 1 },
          original: "}}",
          value: "}}",
        },
      ]);
    });
  });

  it.each([
    { text: "lorem ipsum dolor sit", line: 1, column: 21 },
    { text: "lorem ipsum dolor\nsit", line: 2, column: 3 },
    { text: "lorem ipsum\ndolor\n", line: 3, column: 0 },
    { text: "lorem ipsum\ndolor\nsit ", line: 3, column: 4 },
  ])(
    "'$text' ends in line $line and column $column",
    ({ text, line, column }) => {
      const lexer = createLexer(text);
      const token: Token = lexer.next().value;
      expect(token.original).toEqual(text);
      expect(token.end).toEqual({ line, column });
    }
  );

  it("multiple instances can work in parallel", () => {
    const lexer1 = createLexer("a {{b}}")[Symbol.iterator]();
    const lexer2 = createLexer("c")[Symbol.iterator]();

    expect(lexer1.next().value.value).toBe("a ");
    expect(lexer2.next().value.value).toBe("c");

    expect(lexer1.next().value.value).toBe("{{");
    expect(lexer2.next().done).toBe(true);

    expect(lexer1.next().value.value).toBe("b");
    expect(lexer1.next().value.value).toBe("}}");
    expect(lexer1.next().done).toBe(true);
  });

  it("keeps square-brackets in the 'original' property of wrapped id tokens", () => {
    const lexer = createLexer("{{ [ ]");
    expect([...lexer].map((token) => token.original)).toEqual([
      "{{",
      " ",
      "[ ]",
    ]);
  });

  function testTemplate(template: string, expectedValue: Token[]) {
    const lexer = createLexer(template);
    const tokens = [...lexer];
    expect(JSON.parse(JSON.stringify(tokens))).toEqual(expectedValue);
  }
});
