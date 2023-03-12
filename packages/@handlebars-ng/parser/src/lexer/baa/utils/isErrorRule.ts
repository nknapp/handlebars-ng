import { ErrorRule, Rule } from "../types";

export function isErrorRule<Types extends string>(
  rule: Rule<Types>
): rule is ErrorRule {
  return (rule as ErrorRule).error === true;
}
