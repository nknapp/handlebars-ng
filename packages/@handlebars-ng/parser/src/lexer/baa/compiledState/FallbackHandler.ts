import {
  FallbackRule,
  LexerTypings,
  TokenTypes,
  TokenWithoutLocation,
} from "../types";

export class Fallback<T extends LexerTypings> {
  #rule: FallbackRule;
  #type: TokenTypes<T>;

  constructor(type: TokenTypes<T>, rule: FallbackRule) {
    this.#type = type;
    this.#rule = rule;
  }

  createToken(
    string: string,
    from: number,
    to: number
  ): TokenWithoutLocation<T> {
    const original = string.substring(from, to);
    return {
      type: this.#type,
      value: original,
      original,
    };
  }
}
