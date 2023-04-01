export interface LexerTypings {
  state: string;
  tokenType: string;
}

export type Rule<T extends LexerTypings> =
  | MatchRule<T>
  | FallbackRule
  | ErrorRule;

export interface MatchRule<T extends LexerTypings> {
  match: RegExp | string;
  lineBreaks?: boolean;
  lookaheadMatch?: RegExp;
  push?: States<T>;
  pop?: 1;
  next?: States<T>;
  value?: (original: string) => string;
}

export interface FallbackRule {
  fallback: true;
  lineBreaks?: boolean;
}

export interface ErrorRule {
  error: true;
}

export interface Token<T extends LexerTypings> {
  type: TokenTypes<T>;
  original: string;
  value: string;
  start: Location;
  end: Location;
}

export type States<T extends LexerTypings> = T["state"] | "main";
export type TokenTypes<T extends LexerTypings> = T["tokenType"];

export type StateSpec<T extends LexerTypings> = Partial<
  Record<TokenTypes<T>, Rule<T>>
>;

export type LexerSpec<T extends LexerTypings> = Record<States<T>, StateSpec<T>>;

export interface ILexer<T extends LexerTypings> {
  lex(string: string): IterableIterator<Token<T>>;
}

export type LexerFactory<T extends LexerTypings> = (
  states: LexerSpec<T>
) => ILexer<T>;

export interface Location {
  column: number;
  line: number;
}
