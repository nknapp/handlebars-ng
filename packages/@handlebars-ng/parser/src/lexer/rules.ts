import { LexerSpec, Token as BaaToken, StateSpec } from "./baa";

export type MustacheOpenType = "OPEN_UNESCAPED" | "OPEN";
export type MustacheCloseType = "CLOSE_UNESCAPED" | "CLOSE";
export type TokenType =
  | "CONTENT"
  | "NEWLLINE"
  | "SPACE"
  | "ID"
  | "SQUARE_WRAPPED_ID"
  | "ESCAPED_MUSTACHE"
  | "STRIP"
  | "DOT"
  | "SLASH"
  | "STRING_LITERAL_DOUBLE_QUOTE"
  | "STRING_LITERAL_SINGLE_QUOTE"
  | "NUMBER"
  | MustacheOpenType
  | MustacheCloseType
  | "error";

export interface HbsLexerTypes {
  state: "main" | "mustache" | "unescapedMustache";
  tokenType: TokenType | "error";
}

export type Token = BaaToken<HbsLexerTypes>;

export function createHbsLexerSpec(): LexerSpec<HbsLexerTypes> {
  const LOOK_AHEAD = /[=~}\s/.)|]/;
  const LITERAL_LOOKAHEAD = /[~}\s)]/;

  const mustacheRules: StateSpec<HbsLexerTypes> = {
    SPACE: { match: /[ \t\n]/, lineBreaks: true },
    NUMBER: {
      match: /-?\d+(?:\.\d+)?/,
      lookaheadMatch: LITERAL_LOOKAHEAD,
    },
    ID: {
      match: /[^\n \t!"#%&'()*+,./;<=>@[\\\]^`{|}~]+?/,
      lookaheadMatch: LOOK_AHEAD,
    },
    SQUARE_WRAPPED_ID: {
      match: /\[[^[]*?]/,
      value: (text) => text.slice(1, -1),
    },
    STRIP: { match: /~/ },
    DOT: { match: /\./ },
    SLASH: { match: /\// },
    STRING_LITERAL_DOUBLE_QUOTE: {
      match: /"[^"]+?"/,
      value: (text) => text.slice(1, -1),
    },
    STRING_LITERAL_SINGLE_QUOTE: {
      match: /'[^']+?'/,
      value: (text) => text.slice(1, -1),
    },
    error: { error: true },
  } as const;

  return {
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
  };
}
