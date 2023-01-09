export type MustacheOpenType = "OPEN_UNESCAPED" | "OPEN";
export type MustacheCloseType = "CLOSE_UNESCAPED" | "CLOSE";
export type TokenType =
  | "CONTENT"
  | "NEWLLINE"
  | "SPACE"
  | "ID"
  | "ESCAPED_MUSTACHE"
  | "STRIP"
  | "DOT"
  | MustacheOpenType
  | MustacheCloseType;

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
