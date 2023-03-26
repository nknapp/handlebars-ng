import { FallbackRule, LexerTypings, Token, TokenTypes } from "../types";
import { TokenFactory } from "./TokenFactory";

export class Fallback<T extends LexerTypings> {
  rule: FallbackRule;
  type: TokenTypes<T>;
  tokenFactory: TokenFactory<T>;

  constructor(
    type: TokenTypes<T>,
    rule: FallbackRule,
    tokenFactory: TokenFactory<T>
  ) {
    this.type = type;
    this.rule = rule;
    this.tokenFactory = tokenFactory;
  }

  createToken(string: string, from: number, to: number): Token<T> {
    const original = string.substring(from, to);
    return this.tokenFactory.createToken(this.type, original, original);
  }
}
