import { ParseError } from "../parser/ParseError";
import { Lexer, Token as BaaToken } from "./baa";
import { StateSpec } from "./baa/types";
import { TokenType } from "./model";

export * from "./model";

export interface HbsLexerTypes {
  state: "main" | "mustache" | "unescapedMustache";
  tokenType: TokenType | "error";
}

export type Token = BaaToken<HbsLexerTypes>;

const LOOK_AHEAD = /[=~}\s/.)|]/;
const LITERAL_LOOKAHEAD = /[~}\s)]/;

const mustacheRules: StateSpec<HbsLexerTypes> = {
  SPACE: { match: /[ \t\n]/, lineBreaks: true },
  NUMBER: {
    match: /-?\d+(?:\.\d+)?/,
    lookaheadMatch: LITERAL_LOOKAHEAD,
  },
  ID: {
    match: /[^\n \t!"#%&'()*+,./;<=>@[\\\]^`{|}~]+/,
    lookaheadMatch: LOOK_AHEAD,
  },
  SQUARE_WRAPPED_ID: {
    match: /\[[^[]*?\]/,
    value: (text) => text.slice(1, -1),
  },
  STRIP: { match: /~/ },
  DOT: { match: /\./ },
  SLASH: { match: /\// },
  STRING_LITERAL_DOUBLE_QUOTE: {
    match: /"[^"]+"/,
    value: (text) => text.slice(1, -1),
  },
  STRING_LITERAL_SINGLE_QUOTE: {
    match: /'[^']+'/,
    value: (text) => text.slice(1, -1),
  },
  error: { error: true },
};

const lexer = new Lexer<HbsLexerTypes>({
  main: {
    OPEN_UNESCAPED: { match: /{{{/, push: "unescapedMustache" },
    OPEN: { match: /{{/, push: "mustache" },
    ESCAPED_MUSTACHE: { match: /\\\{\{/, value: (text) => text.slice(1) },
    CONTENT: { fallback: true, lineBreaks: true },
  },
  mustache: {
    CLOSE: {
      match: /}}/,
      pop: 1,
    },
    ...mustacheRules,
  },
  unescapedMustache: {
    CLOSE_UNESCAPED: {
      match: /}}}/,
      pop: 1,
    },
    ...mustacheRules,
  },
});

export function* createLexer(string: string): Generator<Token> {
  for (const token of lexer.lex(string)) {
    if (token.type === "error") {
      throw new ParseError("Parse error", token.start, string);
    }
    yield token;
  }
}
