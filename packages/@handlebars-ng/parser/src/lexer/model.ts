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
  | MustacheOpenType
  | MustacheCloseType;

export type TokenTypes = Set<TokenType>;

export function tok(...types: TokenType[]): TokenTypes {
  return new Set<TokenType>(types);
}

export type Location = {
  column: number;
  line: number;
};

export interface Token {
  type: TokenType;
  start: Location;
  end: Location;
  value: string;
  original: string;
}
