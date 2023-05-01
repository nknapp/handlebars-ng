import { MooState, MooStates, withLookAhead } from "baa-lexer";

export type MustacheOpenType = "OPEN_UNESCAPED" | "OPEN";
export type MustacheCloseType = "CLOSE_UNESCAPED" | "CLOSE";
export type TokenType =
  | "CONTENT"
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
  | "BOOLEAN"
  | MustacheOpenType
  | MustacheCloseType
  | "error";

export interface HbsLexerTypes {
  tokenType: TokenType | "error";
  stateName: "main" | "mustache" | "unescapedMustache";
}

export const LOOK_AHEAD = /[=~}\s/.)|]/;
export const LITERAL_LOOKAHEAD = /[~}\s)]/;

/* @deprecated To be replaced by dynamic rules from register expression parsers */
export const mustacheRules: MooState<HbsLexerTypes> = {
  SPACE: { match: /[ \t\n]/, lineBreaks: true },
  NUMBER: {
    match: withLookAhead(/-?\d+(?:\.\d+)?/, LITERAL_LOOKAHEAD),
  },
  BOOLEAN: {
    match: withLookAhead(/true|false/, LITERAL_LOOKAHEAD),
  },
  ID: {
    match: withLookAhead(/[^\n \t!"#%&'()*+,./;<=>@[\\\]^`{|}~]+?/, LOOK_AHEAD),
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

export function createHbsLexerSpec(
  expressionRules: MooState<HbsLexerTypes>
): MooStates<HbsLexerTypes> {
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
      SPACE: { match: /[ \t\n]/, lineBreaks: true },
      STRIP: { match: /~/ },
      error: { error: true },
      ...expressionRules,
    },
    unescapedMustache: {
      CLOSE_UNESCAPED: {
        match: "}}}",
        next: "main",
      },
      SPACE: { match: /[ \t\n]/, lineBreaks: true },
      STRIP: { match: /~/ },
      error: { error: true },
      ...expressionRules,
    },
  };
}
