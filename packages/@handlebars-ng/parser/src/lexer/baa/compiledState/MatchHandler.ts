import { InternalToken, LexerTypings, MatchRule, TokenTypes } from "../types";
import { TokenFactory } from "./TokenFactory";

export class MatchHandler<T extends LexerTypings> {
  readonly #matchRegex: RegExp;
  readonly #matchRules: MatchRule<T>[];
  readonly #matchTypes: TokenTypes<T>[];
  #tokenFactory: TokenFactory<T>;

  constructor(
    types: TokenTypes<T>[],
    rules: MatchRule<T>[],
    hasFallback: boolean,
    tokenFactory: TokenFactory<T>
  ) {
    this.#matchRules = rules;
    this.#matchTypes = types;
    this.#tokenFactory = tokenFactory;
    const regexes = this.#matchRules.map((rule) => {
      return (
        rule.match.source +
        (rule.lookaheadMatch ? `(?=${rule.lookaheadMatch.source})` : "")
      );
    });
    const sources = regexes.map((regex) => `(${regex})`);
    // If there is no fallback rule, we assume that every token must directly follow the previous token
    // thus, the regex must be sticky
    this.#matchRegex = new RegExp(sources.join("|"), hasFallback ? "g" : "yg");
  }

  reset(offset: number) {
    this.#matchRegex.lastIndex = offset;
  }

  *matchAll(string: string): Generator<InternalToken<T>> {
    for (const match of string.matchAll(this.#matchRegex)) {
      yield this.#createTokenFromMatch(match);
    }
  }

  #createTokenFromMatch(match: RegExpMatchArray): InternalToken<T> {
    for (let i = 1; i < match.length; i++) {
      const matchingGroup = match[i];
      if (matchingGroup != null && match.index != null) {
        const rule = this.#matchRules[i - 1];
        return {
          original: matchingGroup,
          type: this.#matchTypes[i - 1],
          offset: match.index,
          rule,
        };
      }
    }
    throw new Error("Unexpected: Did not find token in matcher array");
  }

  expectedTypesString(): string {
    return this.#matchTypes.map((t) => `\`${t}\``).join(", ");
  }

  toJson() {
    return {
      regex: this.#matchRegex.source,
    };
  }
}
