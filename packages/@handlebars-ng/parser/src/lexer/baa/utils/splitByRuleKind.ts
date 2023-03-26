import {
  ErrorRule,
  FallbackRule,
  LexerTypings,
  MatchRule,
  Rule,
  StateSpec,
  TokenTypes,
} from "../types";
import { isErrorRule } from "./isErrorRule";
import { isFallbackRule } from "./isFallbackRule";

interface RuleWithType<T extends LexerTypings, R extends Rule<T>> {
  type: TokenTypes<T>;
  rule: R;
}

interface SplitRulesReturn<T extends LexerTypings> {
  fallback?: RuleWithType<T, FallbackRule>;
  error?: RuleWithType<T, ErrorRule>;
  match: RuleWithType<T, MatchRule<T>>[];
}

export function splitByRuleKind<T extends LexerTypings>(
  rules: StateSpec<T>
): SplitRulesReturn<T> {
  const result: SplitRulesReturn<T> = {
    match: [],
  };
  for (const [type, rule] of entries(rules)) {
    if (isFallbackRule(rule)) {
      result.fallback = { type, rule };
    } else if (isErrorRule(rule)) {
      result.error = { type, rule };
    } else {
      result.match.push({ type, rule });
    }
  }
  return result;
}

function entries<K extends string, V>(object: Partial<Record<K, V>>): [K, V][] {
  return Object.entries(object) as [K, V][];
}
