import { LexerTypings, MatchRule, Rule } from "../types";

export function isMatchRule<T extends LexerTypings>(
  rule: Rule<T>
): rule is MatchRule<T> {
  return (rule as MatchRule<T>).match != null;
}
