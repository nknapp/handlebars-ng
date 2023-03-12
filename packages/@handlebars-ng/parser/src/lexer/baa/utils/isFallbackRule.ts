import { FallbackRule, Rule } from "../types";

export function isFallbackRule<Types extends string>(
  rule: Rule<Types>
): rule is FallbackRule {
  return (rule as FallbackRule).fallback === true;
}
