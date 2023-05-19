import { MooState } from "baa-lexer";

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

export const mainRules: MooState<HbsLexerTypes> = {
  OPEN_UNESCAPED: { match: "{{{", next: "unescapedMustache" },
  OPEN: { match: "{{", next: "mustache" },
  ESCAPED_MUSTACHE: { match: "\\{{", value: (text) => text.slice(1) },
  CONTENT: { fallback: true, lineBreaks: true },
};
