import moo, { Token } from "moo";

describe("moo", () => {
  it("state pop without consume", () => {
    const lexer = moo.states({
      root: {
        A: {
          match: /a/,
        },
        OPEN: {
          match: /</,
          push: "tag",
        },
        CLOSE: {
          match: />/,
        },
      },
      tag: {
        B: /b/,
        CLOSE_TAG: {
          match: />/,
          pop: 1,
        },
      },
    });

    const tokens = [...lexer.reset("a<b>a")].map((token) => token.type);

    expect(tokens).toEqual(["A", "OPEN", "B", "CLOSE_TAG", "A"]);
  });

  it("identifies line-breaks in the fallback rule", () => {
    const lexer = moo.states({
      main: {
        A: {
          match: /aa/,
        },
        DEFAULT: {
          fallback: true,
        },
      },
    });
    lexer.reset("aa\naa");
    expect([...lexer].map(typeAndPosition)).toEqual([
      "A -> 1:1 linebreaks: 0",
      "DEFAULT -> 1:3 linebreaks: 1",
      "A -> 2:1 linebreaks: 0",
    ]);
  });
});

function typeAndPosition(token: Token): string {
  return `${token.type} -> ${token.line}:${token.col} linebreaks: ${token.lineBreaks}`;
}
