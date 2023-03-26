import { LexerTypings, MatchRule, Rule, TokenTypes } from "../types";
import { CompiledRule } from "./CompiledRule";

interface RuleWithType<T extends LexerTypings, R extends Rule<T>> {
  type: TokenTypes<T>;
  rule: R;
}

export class MatchHandler<T extends LexerTypings> {
  readonly #matchRegex: RegExp;
  readonly #matchRules: CompiledRule<T>[];
  string = "";
  offset = 0;
  rule: CompiledRule<T>;
  original: string;

  constructor(rules: RuleWithType<T, MatchRule<T>>[], hasFallback: boolean) {
    this.#matchRules = rules.map(({ rule, type }) => {
      return {
        type,
        value: rule.value,
        pop: rule.pop,
        push: rule.push,
      };
    });
    const regexes = rules.map(({ rule }) => {
      return (
        "(" +
        rule.match.source +
        ")" +
        (rule.lookaheadMatch ? `(?=${rule.lookaheadMatch.source})` : "")
      );
    });
    const sources = regexes.map((regex) => `${regex}`);
    // If there is no fallback rule, we assume that every token must directly follow the previous token
    // thus, the regex must be sticky
    this.#matchRegex = new RegExp(sources.join("|"), hasFallback ? "g" : "y");
    this.rule = this.#matchRules[0];
    this.original = "";
  }

  reset(offset: number, string: string) {
    this.#matchRegex.lastIndex = offset;
    this.string = string;
  }

  next(): boolean {
    const match = this.#matchRegex.exec(this.string);
    if (match == null) return false;
    let matchingGroup = 1;
    while (match[matchingGroup] == null && matchingGroup <= match.length) {
      matchingGroup++;
    }
    this.offset = match.index ?? 0;
    this.original = match[matchingGroup];
    this.rule = this.#matchRules[matchingGroup - 1];
    return true;
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
