import moo from "moo";

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
});
