import { LexerTypings, MatchRule } from "../types";
import { CompiledRule } from "./CompiledRule";
import { Match, MatchHandler, RuleWithType } from "./MatchHandler";

export class RegexMatchHandler<T extends LexerTypings>
  implements MatchHandler<T>
{
  readonly #matchRegex: RegExp;
  readonly #matchRules: CompiledRule<T>[];
  offset = 0;
  constructor(rules: RuleWithType<T, MatchRule<T>>[], hasFallback: boolean) {
    this.#matchRules = rules.map(({ rule, type }) => {
      return {
        type,
        value: rule.value,
        pop: rule.pop,
        push: rule.push,
        next: rule.next,
        lineBreaks: rule.lineBreaks ?? false,
      };
    });
    const regexes = rules.map(({ rule }) => {
      if (!(rule.match instanceof RegExp))
        throw new Error(`Expecting "${rule.match}" to be a regular expression`);
      return (
        `(${rule.match.source})` +
        (rule.lookaheadMatch ? `(?=${rule.lookaheadMatch.source})` : "")
      );
    });
    const sources = regexes.map((regex) => `${regex}`);
    // If there is no fallback rule, we assume that every token must directly follow the previous token
    // thus, the regex must be sticky
    this.#matchRegex = new RegExp(sources.join("|"), hasFallback ? "g" : "y");
  }

  reset(offset: number) {
    this.#matchRegex.lastIndex = offset;
  }

  exec(string: string): Match<T> | null {
    const match = this.#matchRegex.exec(string);
    if (match == null) return null;
    let matchingGroup = 1;
    while (match[matchingGroup] == null && matchingGroup <= match.length) {
      matchingGroup++;
    }
    this.offset = match.index ?? 0;

    return {
      text: match[matchingGroup],
      rule: this.#matchRules[matchingGroup - 1],
    };
  }

  expectedTypesString(): string {
    return this.#matchRules.map((rule) => `\`${rule.type}\``).join(", ");
  }

  toJson() {
    return {
      regex: this.#matchRegex.source,
    };
  }
}
