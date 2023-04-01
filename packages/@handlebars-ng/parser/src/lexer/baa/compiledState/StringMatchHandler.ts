import { LexerTypings, MatchRule } from "../types";
import { Match, MatchHandler, RuleWithType } from "./MatchHandler";
import { CompiledRule } from "./CompiledRule";
import { findCommonChar } from "../utils/findCommonChars";

export class StringMatchHandler<T extends LexerTypings>
  implements MatchHandler<T>
{
  offset = 0;
  compiledRules: CompiledRule<T>[] = [];
  matchedStrings: string[] = [];
  prefixes: number[] = [];
  commonChar: {
    char: string;
    maxIndex: number;
  } | null;

  constructor(rules: RuleWithType<T, MatchRule<T>>[]) {
    for (const { rule, type } of rules) {
      this.compiledRules.push({
        type,
        value: rule.value,
        pop: rule.pop,
        push: rule.push,
        lineBreaks: rule.lineBreaks ?? false,
      });
      if (typeof rule.match !== "string")
        throw new Error(`Expected '${rule.match}' to be a string`);
      this.matchedStrings.push(rule.match);
    }
    this.prefixes = [
      ...new Set(this.matchedStrings.map((string) => string.charCodeAt(0))),
    ];
    this.commonChar = findCommonChar(this.matchedStrings);
  }

  reset(offset: number): void {
    this.offset = offset;
  }

  exec(string: string): Match<T> | null {
    for (let i = this.offset; i < string.length; i++) {
      if (this.commonChar != null) {
        const commonChar =
          string.indexOf(this.commonChar.char, i) - this.commonChar.maxIndex;
        if (commonChar > i) {
          i = commonChar;
        }
      }
      if (!this.prefixes.includes(string.charCodeAt(i))) {
        continue;
      }
      for (let j = 0; j < this.compiledRules.length; j++) {
        if (this.#stringMatches(string, this.matchedStrings[j], i)) {
          this.offset = i;
          return {
            text: this.matchedStrings[j],
            rule: this.compiledRules[j],
          };
        }
      }
    }
    return null;
  }

  #stringMatches(haystack: string, needle: string, offset: number) {
    for (let i = 0; i < needle.length; i++) {
      if (haystack.charCodeAt(offset + i) !== needle.charCodeAt(i))
        return false;
    }
    return true;
  }

  expectedTypesString(): string {
    return this.matchedStrings.map((s) => `"${s}"`).join(", ");
  }
}
