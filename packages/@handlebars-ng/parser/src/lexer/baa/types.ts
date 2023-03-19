import { Location } from "../model";

export interface LexerTypings {
  state: string;
  tokenType: string;
}

export type Rule<States extends string> =
  | MatchRule<States>
  | FallbackRule
  | ErrorRule;

export interface MatchRule<States extends string> {
  match: RegExp;
  push?: States;
  pop?: 1;
}

export interface FallbackRule {
  fallback: true;
}

export interface ErrorRule {
  error: true;
}

export interface Token<T extends string> {
  type: T;
  original: string;
  value: string;
  start: Location;
  end: Location;
}

export interface InternalToken<T extends LexerTypings>
  extends Token<TokenTypes<T>> {
  offset: number;
  rule: MatchRule<States<T>>;
}

export type States<T extends LexerTypings> = T["state"] | "main";
export type TokenTypes<T extends LexerTypings> = T["tokenType"];

export type StateSpec<T extends LexerTypings> = Partial<
  Record<TokenTypes<T>, Rule<States<T>>>
>;

export type LexerSpec<T extends LexerTypings> = Record<States<T>, StateSpec<T>>;

export type StateEnd<T extends LexerTypings> =
  | {
      type: "push";
      state: States<T>;
      endOffset: number;
    }
  | { type: "pop"; endOffset: number }
  | { type: "finished" };
