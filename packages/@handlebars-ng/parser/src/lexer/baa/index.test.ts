import { Lexer } from "./index";
import { Token } from "./index";

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

  it("throws an error if no token matches", () => {
    const lexer = new Lexer({
      main: {
        A: {
          match: /aa/,
        },
        B: {
          match: /bb/,
        },
      },
    });
    const tokens = lexer.lex("aa---aa");
    expect(tokens.next().value).toEqual(token("A", "aa", "aa", "1:0", "1:2"));
    expect(() => tokens.next()).toThrow(
      "Syntax error at 1:2, expected one of `A`, `B` but got '-'"
    );
  });

  it("returns an error token containing the rest of the string, if one is configured and nothing matches", () => {
    const lexer = new Lexer({
      main: {
        A: {
          match: /aa/,
        },
        ERROR: {
          error: true,
        },
      },
    });
    const tokens = lexer.lex("aa---aa");
    expect(tokens.next().value).toEqual(token("A", "aa", "aa", "1:0", "1:2"));
    expect(tokens.next().value).toEqual(
      token("ERROR", "---aa", "---aa", "1:2", "1:7")
    );
    expect(tokens.next().done).toBe(true);
  });

  it("allows concurrent parsing", () => {
    const lexer = new Lexer({
      main: {
        A: { match: /a/ },
        B: { match: /b/ },
      },
    });

    const tokens1 = lexer.lex("ab");
    const tokens2 = lexer.lex("ba");

    expect(tokens1.next().value).toEqual(token("A", "a", "a", "1:0", "1:1"));
    expect(tokens2.next().value).toEqual(token("B", "b", "b", "1:0", "1:1"));

    expect(tokens1.next().value).toEqual(token("B", "b", "b", "1:1", "1:2"));
    expect(tokens2.next().value).toEqual(token("A", "a", "a", "1:1", "1:2"));
  });

  it("reuses lexer after completion", () => {
    const lexer = new Lexer({
      main: {
        A: { match: /a/ },
        B: { match: /b/ },
      },
    });
    const tokens1 = lexer.lex("ab");
    expect(lexer.poolSize()).toEqual(0);
    expect([...tokens1]).toEqual([
      token("A", "a", "a", "1:0", "1:1"),
      token("B", "b", "b", "1:1", "1:2"),
    ]);
    expect(lexer.poolSize()).toEqual(1);
    lexer.lex("a").next();
    expect(lexer.poolSize()).toEqual(0);
  });

  it("reuses lexer after throwing error", () => {
    const lexer = new Lexer({
      main: {
        A: { match: /a/ },
        B: { match: /b/ },
      },
    });

    const tokens1 = lexer.lex("c");
    expect(() => tokens1.next()).toThrowError();
    expect(lexer.poolSize()).toEqual(1);
  });

  it("changes state if a 'push' or 'pop' property is set.", () => {
    const lexer = new Lexer({
      main: {
        A: { match: /a/ },
        OPEN: {
          match: /\(/,
          push: "brackets",
        },
      },
      brackets: {
        B: { match: /b/ },
        CLOSE: {
          match: /\)/,
          pop: 1,
        },
      },
    });

    const tokens = lexer.lex("a(b)a");
    expect([...tokens]).toEqual([
      token("A", "a", "a", "1:0", "1:1"),
      token("OPEN", "(", "(", "1:1", "1:2"),
      token("B", "b", "b", "1:2", "1:3"),
      token("CLOSE", ")", ")", "1:3", "1:4"),
      token("A", "a", "a", "1:4", "1:5"),
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
): Token<{ tokenType: string; state: string }> {
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
