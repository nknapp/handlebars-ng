import { HandlebarsLexer, Token } from "./index";

describe("Lexer", () => {
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
      const lexer = new HandlebarsLexer(text);
      const token: Token = lexer[Symbol.iterator]().next().value;
      expect(token.original).toEqual(text);
      expect(token.end).toEqual({ line, column });
    }
  );

  it("multiple instances can work in parallel", () => {
    const lexer1 = new HandlebarsLexer("a {{b")[Symbol.iterator]();
    const lexer2 = new HandlebarsLexer("c")[Symbol.iterator]();

    expect(lexer1.next()).toEqual({
      done: false,
      value: expect.objectContaining({ value: "a " }),
    });

    expect(lexer2.next()).toEqual({
      done: false,
      value: expect.objectContaining({ value: "c" }),
    });

    expect(lexer1.next()).toEqual({
      done: false,
      value: expect.objectContaining({ value: "{{" }),
    });

    expect(lexer2.next()).toEqual({
      done: true,
    });

    expect(lexer1.next()).toEqual({
      done: false,
      value: expect.objectContaining({ value: "b" }),
    });

    expect(lexer1.next()).toEqual({
      done: true,
    });
  });
});

function testTemplate(template: string, expectedValue: Token[]) {
  const lexer = new HandlebarsLexer(template);
  const tokens = [...lexer];
  expect(JSON.parse(JSON.stringify(tokens))).toEqual(expectedValue);
}
