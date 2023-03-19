import { Location } from "../model";

export interface LexerTypings {
  state: string;
  tokenType: string;
}

export type Rule<T extends LexerTypings> =
  | MatchRule<T>
  | FallbackRule
  | ErrorRule;

export interface MatchRule<T extends LexerTypings> {
  match: RegExp;
  push?: States<T>;
  pop?: 1;
}

export interface FallbackRule {
  fallback: true;
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

export interface InternalToken<T extends LexerTypings> extends Token<T> {
  offset: number;
  rule: MatchRule<T>;
}

export type States<T extends LexerTypings> = T["state"] | "main";
export type TokenTypes<T extends LexerTypings> = T["tokenType"];

export type StateSpec<T extends LexerTypings> = Partial<
  Record<TokenTypes<T>, Rule<T>>
>;

export type LexerSpec<T extends LexerTypings> = Record<States<T>, StateSpec<T>>;
