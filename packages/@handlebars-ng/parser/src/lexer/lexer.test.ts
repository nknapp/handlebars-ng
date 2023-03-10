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
      token("A", "a", "a", "1:0", "1:1"),
      token("B", "b", "b", "1:1", "1:2"),
      token("A", "a", "a", "1:2", "1:3"),
      token("B", "b", "b", "1:3", "1:4"),
    ]);
  });

  it("allows fallback tokens", () => {
    const lexer = new Lexer({
      main: {
        A: {
          match: /a/,
        },
        DEFAULT: {
          fallback: true,
        },
      },
    });
    expect([...lexer.lex("a---a")]).toEqual([
      token("A", "a", "a", "1:0", "1:1"),
      token("DEFAULT", "---", "---", "1:1", "1:4"),
      token("A", "a", "a", "1:4", "1:5"),
    ]);
  });

  it("identifies boundary of fallback token surrounded by multi-char tokens", () => {
    const lexer = new Lexer({
      main: {
        A: {
          match: /aa/,
        },
        DEFAULT: {
          fallback: true,
        },
      },
    });
    expect([...lexer.lex("aa---aa")]).toEqual([
      token("A", "aa", "aa", "1:0", "1:2"),
      token("DEFAULT", "---", "---", "1:2", "1:5"),
      token("A", "aa", "aa", "1:5", "1:7"),
    ]);
  });
});

type LocationSpec = `${number}:${number}`;

function token(
  type: string,
  original: string,
  value: string,
  start: LocationSpec,
  end: LocationSpec
): Token<string> {
  // e.g. 1:0 - 1:5 (columns 0-5 on first line)
  return {
    type,
    original,
    value,
    start: parseLocation(start),
    end: parseLocation(end),
  };
}

function parseLocation(location: string): { line: number; column: number } {
  const [line, column] = location.split(":").map(Number);
  return { line, column };
}
