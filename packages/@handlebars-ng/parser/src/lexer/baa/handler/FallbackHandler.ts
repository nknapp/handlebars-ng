import { FallbackRule, LexerTypings, Token, TokenTypes } from "../types";

export class Fallback<T extends LexerTypings> {
  #rule: FallbackRule;
  #type: TokenTypes<T>;

  constructor(type: TokenTypes<T>, rule: FallbackRule) {
    this.#type = type;
    this.#rule = rule;
  }

  createToken(string: string, from: number, to: number): Token<TokenTypes<T>> {
    const original = string.substring(from, to);
    return {
      type: this.#type,
      value: original,
      original,
      start: { line: 1, column: from },
      end: { line: 1, column: to },
    };
  }
}
