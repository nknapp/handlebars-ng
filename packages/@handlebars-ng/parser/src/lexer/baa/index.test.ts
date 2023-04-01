import {
  AlternativeMooWrappingLexer,
  ConcurrentLexer,
  NonConcurrentLexer,
} from "./index";
import { Token } from "./index";
import { parseLocation } from "./test-utils/parseLocation";
import { ILexer, LexerSpec, LexerTypings } from "./types";

const lexerImpl = [NonConcurrentLexer, AlternativeMooWrappingLexer];
describe.each(lexerImpl)("lexer (%s)", (LexerImpl) => {
  function createLexer<T extends LexerTypings>(
    states: LexerSpec<T>
  ): ConcurrentLexer<T> {
    return new ConcurrentLexer(() => new LexerImpl(states));
  }

  it("parses an empty string", () => {
    const lexer = createLexer({
      main: {
        A: {
          match: /a/,
        },
        B: {
          match: /b/,
        },
      },
    });
    expectTokens(lexer, "", []);
  });

  it("parses simple tokens", () => {
    const lexer = createLexer({
      main: {
        A: {
          match: /a/,
        },
        B: {
          match: /b/,
        },
      },
    });
    expectTokens(lexer, "abab", [
      token("A", "a", "a", "1:0", "1:1"),
      token("B", "b", "b", "1:1", "1:2"),
      token("A", "a", "a", "1:2", "1:3"),
      token("B", "b", "b", "1:3", "1:4"),
    ]);
  });

  it("allows string-tokens", () => {
    const lexer = createLexer({
      main: {
        A: {
          match: "a",
        },
        B: {
          match: "b",
        },
      },
    });
    expectTokens(lexer, "abab", [
      token("A", "a", "a", "1:0", "1:1"),
      token("B", "b", "b", "1:1", "1:2"),
      token("A", "a", "a", "1:2", "1:3"),
      token("B", "b", "b", "1:3", "1:4"),
    ]);
  });

  it("allows string-tokens with common chars and fallback", () => {
    const lexer = createLexer({
      main: {
        AB: {
          match: "ab",
        },
        CA: {
          match: "ca",
        },
        FALLBACK: {
          fallback: true,
        },
      },
    });
    expectTokens(lexer, "abfffca", [
      token("AB", "ab", "ab", "1:0", "1:2"),
      token("FALLBACK", "fff", "fff", "1:2", "1:5"),
      token("CA", "ca", "ca", "1:5", "1:7"),
    ]);
  });

  it("allows fallback tokens", () => {
    const lexer = createLexer({
      main: {
        A: {
          match: /a/,
        },
        DEFAULT: {
          fallback: true,
        },
      },
    });
    expectTokens(lexer, "a---a", [
      token("A", "a", "a", "1:0", "1:1"),
      token("DEFAULT", "---", "---", "1:1", "1:4"),
      token("A", "a", "a", "1:4", "1:5"),
    ]);
  });

  it("allows a string, that only consists of fallback", () => {
    const lexer = createLexer({
      main: {
        A: {
          match: /a/,
        },
        DEFAULT: {
          fallback: true,
        },
      },
    });
    expectTokens(lexer, "---", [token("DEFAULT", "---", "---", "1:0", "1:3")]);
  });

  it("identifies boundary of fallback token surrounded by multi-char tokens", () => {
    const lexer = createLexer({
      main: {
        A: {
          match: /aa/,
        },
        DEFAULT: {
          fallback: true,
        },
      },
    });
    expectTokens(lexer, "aa---aa", [
      token("A", "aa", "aa", "1:0", "1:2"),
      token("DEFAULT", "---", "---", "1:2", "1:5"),
      token("A", "aa", "aa", "1:5", "1:7"),
    ]);
  });

  it.skipIf(LexerImpl === AlternativeMooWrappingLexer)(
    "throws an error if no token matches",
    () => {
      const lexer = createLexer({
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
    }
  );

  it("returns an error token containing the rest of the string, if one is configured and nothing matches", () => {
    const lexer = createLexer({
      main: {
        A: {
          match: /aa/,
        },
        ERROR: {
          error: true,
        },
      },
    });
    expectTokens(lexer, "aa---aa", [
      token("A", "aa", "aa", "1:0", "1:2"),
      token("ERROR", "---aa", "---aa", "1:2", "1:7"),
    ]);
  });

  it("allows concurrent parsing", () => {
    const lexer = createLexer({
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
    const lexer = createLexer({
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
    const lexer = createLexer({
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
    const lexer = createLexer({
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

    expectTokens(lexer, "a(b)a", [
      token("A", "a", "a", "1:0", "1:1"),
      token("OPEN", "(", "(", "1:1", "1:2"),
      token("B", "b", "b", "1:2", "1:3"),
      token("CLOSE", ")", ")", "1:3", "1:4"),
      token("A", "a", "a", "1:4", "1:5"),
    ]);
  });

  it("changes state if a 'next' property is set.", () => {
    const lexer = createLexer({
      main: {
        A: { match: /a/ },
        OPEN: {
          match: /\(/,
          next: "brackets",
        },
      },
      brackets: {
        B: { match: /b/ },
        CLOSE: {
          match: /\)/,
          next: "main",
        },
      },
    });

    expectTokens(lexer, "a(b)a", [
      token("A", "a", "a", "1:0", "1:1"),
      token("OPEN", "(", "(", "1:1", "1:2"),
      token("B", "b", "b", "1:2", "1:3"),
      token("CLOSE", ")", ")", "1:3", "1:4"),
      token("A", "a", "a", "1:4", "1:5"),
    ]);
  });

  it("'pop' at the end of the string", () => {
    const lexer = createLexer({
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

    expectTokens(lexer, "a(b)", [
      token("A", "a", "a", "1:0", "1:1"),
      token("OPEN", "(", "(", "1:1", "1:2"),
      token("B", "b", "b", "1:2", "1:3"),
      token("CLOSE", ")", ")", "1:3", "1:4"),
    ]);
  });

  it("pops state correcty when a fallback rule after state-change", () => {
    const lexer = createLexer({
      main: {
        A: { fallback: true },
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

    expectTokens(lexer, "a(b)a", [
      token("A", "a", "a", "1:0", "1:1"),
      token("OPEN", "(", "(", "1:1", "1:2"),
      token("B", "b", "b", "1:2", "1:3"),
      token("CLOSE", ")", ")", "1:3", "1:4"),
      token("A", "a", "a", "1:4", "1:5"),
    ]);
  });

  it("identifies line-breaks in the fallback rule", () => {
    const lexer = createLexer({
      main: {
        A: {
          match: /aa/,
        },
        DEFAULT: {
          fallback: true,
          lineBreaks: true,
        },
      },
    });
    expectTokens(lexer, "aa\naa", [
      token("A", "aa", "aa", "1:0", "1:2"),
      token("DEFAULT", "\n", "\n", "1:2", "2:0"),
      token("A", "aa", "aa", "2:0", "2:2"),
    ]);
  });

  it("identifies line-breaks in the match rule", () => {
    const lexer = createLexer({
      main: {
        A: {
          match: /a/,
        },
        NEWLINE: {
          match: /\n/,
          lineBreaks: true,
        },
      },
    });
    expectTokens(lexer, "a\na", [
      token("A", "a", "a", "1:0", "1:1"),
      token("NEWLINE", "\n", "\n", "1:1", "2:0"),
      token("A", "a", "a", "2:0", "2:1"),
    ]);
  });

  it("transforms values", () => {
    const lexer = createLexer({
      main: {
        A: {
          match: /a/,
          value: (original) => `(${original})`,
        },
        DEFAULT: {
          fallback: true,
        },
      },
    });
    expectTokens(lexer, "a", [token("A", "a", "(a)", "1:0", "1:1")]);
  });

  it("uses lookahead to determine token type", () => {
    const lexer = createLexer({
      main: {
        A1: {
          match: /a/,
          lookaheadMatch: /1/,
        },
        A2: {
          match: /a/,
          lookaheadMatch: /2/,
        },
        NUMBER: {
          match: /\d/,
        },
      },
    });

    expectTokens(lexer, "a1a2", [
      token("A1", "a", "a", "1:0", "1:1"),
      token("NUMBER", "1", "1", "1:1", "1:2"),
      token("A2", "a", "a", "1:2", "1:3"),
      token("NUMBER", "2", "2", "1:3", "1:4"),
    ]);
  });

  it("fallback as last token", () => {
    const lexer = createLexer({
      main: {
        A: { match: /a/ },
        B: { fallback: true },
      },
    });
    expectTokens(lexer, "ab", [
      token("A", "a", "a", "1:0", "1:1"),
      token("B", "b", "b", "1:1", "1:2"),
    ]);
  });

  function expectTokens<T extends LexerTypings>(
    lexer: ILexer<T>,
    template: string,
    expectedTokens: TestToken[]
  ) {
    for (let i = 0; i < 2; i++) {
      const actualTokens = [...lexer.lex(template)];
      try {
        expect(actualTokens).toEqual(expectedTokens);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log("Unexpected tokens for template", template, actualTokens);
        throw error;
      }
    }
  }
});

type LocationSpec = `${number}:${number}`;
type TestToken = Token<{ tokenType: string; state: string }>;

function token(
  type: string,
  original: string,
  value: string,
  start: LocationSpec,
  end: LocationSpec
): TestToken {
  // e.g. 1:0 - 1:5 (columns 0-5 on first line)
  return {
    type,
    original,
    value,
    start: parseLocation(start),
    end: parseLocation(end),
  };
}
