import { BaaMatchRule, BaaRule, BaaToken, Lexer, StateName } from "baa-lexer";

export type MustacheOpenType = "OPEN_UNESCAPED" | "OPEN";
export type MustacheCloseType = "CLOSE_UNESCAPED" | "CLOSE";
export type TokenType =
  | "CONTENT"
  | "COMMENT"
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

export type HbsRule = BaaRule<HbsLexerTypes>;
export type HbsMatchRule = BaaMatchRule<HbsLexerTypes>;
export type Token = BaaToken<HbsLexerTypes>;
export type HbsLexer = Lexer<HbsLexerTypes>;
export type HbsLexerState = StateName<HbsLexerTypes>;

export interface TokenTypes extends Iterable<TokenType> {
  has(token: TokenType): boolean;
}
