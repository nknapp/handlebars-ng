import { FallbackRule, Token } from "../types";

export class Fallback<Types extends string> {
  #rule: FallbackRule;
  #type: Types;

  constructor(type: Types, rule: FallbackRule) {
    this.#type = type;
    this.#rule = rule;
  }

  createToken(string: string, from: number, to: number): Token<Types> {
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
