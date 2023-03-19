import { ErrorRule, LexerTypings, Rule } from "../types";

export function isErrorRule<T extends LexerTypings>(
  rule: Rule<T>
): rule is ErrorRule {
  return (rule as ErrorRule).error === true;
}
