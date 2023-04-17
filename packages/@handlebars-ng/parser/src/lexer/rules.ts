import { BaaToken, MooState, MooStates, withLookAhead } from "baa-lexer";

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
  tokenType: TokenType | "error";
  stateName: "main" | "mustache" | "unescapedMustache";
}

export type Token = BaaToken<HbsLexerTypes>;

export function createHbsLexerSpec(): MooStates<HbsLexerTypes> {
  const LOOK_AHEAD = /[=~}\s/.)|]/;
  const LITERAL_LOOKAHEAD = /[~}\s)]/;

  const mustacheRules: MooState<HbsLexerTypes> = {
    SPACE: { match: /[ \t\n]/, lineBreaks: true },
    NUMBER: {
      match: withLookAhead(/-?\d+(?:\.\d+)?/, LITERAL_LOOKAHEAD),
    },
    ID: {
      match: withLookAhead(
        /[^\n \t!"#%&'()*+,./;<=>@[\\\]^`{|}~]+?/,
        LOOK_AHEAD
      ),
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
      OPEN_UNESCAPED: { match: "{{{", next: "unescapedMustache" },
      OPEN: { match: "{{", next: "mustache" },
      ESCAPED_MUSTACHE: { match: "\\{{", value: (text) => text.slice(1) },
      CONTENT: { fallback: true, lineBreaks: true },
    },
    mustache: {
      CLOSE: {
        match: "}}",
        next: "main",
      },
      ...mustacheRules,
    },
    unescapedMustache: {
      CLOSE_UNESCAPED: {
        match: "}}}",
        next: "main",
      },
      ...mustacheRules,
    },
  };
}
