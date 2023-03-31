import { LexerTypings, Rule, TokenTypes } from "../types";
import { CompiledRule } from "./CompiledRule";

export interface Match<T extends LexerTypings> {
  text: string;
  rule: CompiledRule<T>;
}

export interface RuleWithType<T extends LexerTypings, R extends Rule<T>> {
  type: TokenTypes<T>;
  rule: R;
}

export interface MatchHandler<T extends LexerTypings> {
  reset(offset: number): void;
  exec(string: string): Match<T> | null;
  expectedTypesString(): string;
  offset: number;
}
