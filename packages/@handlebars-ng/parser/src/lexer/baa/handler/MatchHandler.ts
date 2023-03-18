import {
  InternalToken,
  LexerTypings,
  MatchRule,
  States,
  TokenTypes,
} from "../types";

export class MatchHandler<T extends LexerTypings> {
  readonly #matchRegex: RegExp;
  readonly #matchRules: MatchRule<States<T>>[];
  readonly #matchTypes: TokenTypes<T>[];

  constructor(
    types: TokenTypes<T>[],
    rules: MatchRule<States<T>>[],
    fallbackExists: boolean
  ) {
    this.#matchRules = rules;
    this.#matchTypes = types;
    const regexes = this.#matchRules.map((rule) => rule.match);
    const sources = regexes.map((regex) => `(${regex.source})`);
    // If there is no fallback rules, we assume that every token must directly follow the previous token
    // thus, the regex must be sticky
    this.#matchRegex = new RegExp(
      sources.join("|"),
      fallbackExists ? "g" : "yg"
    );
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
        return {
          type: this.#matchTypes[i - 1],
          offset: match.index,
          original: matchingGroup,
          value: matchingGroup,
          start: { line: 1, column: match.index },
          end: { line: 1, column: match.index + matchingGroup.length },
          rule: this.#matchRules[i - 1],
        };
      }
    }
    throw new Error("Unexpected: Did not find token in matcher array");
  }

  expectedTypesString(): string {
    return this.#matchTypes.map((t) => `\`${t}\``).join(", ");
  }
}
