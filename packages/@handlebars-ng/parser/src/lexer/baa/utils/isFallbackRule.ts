import { FallbackRule, LexerTypings, Rule } from "../types";

export function isFallbackRule<T extends LexerTypings>(
  rule: Rule<T>
): rule is FallbackRule {
  return (rule as FallbackRule).fallback === true;
}
