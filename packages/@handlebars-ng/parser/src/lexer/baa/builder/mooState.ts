import { LexerTypings, MatchRule, StateSpec } from "../types";
import { splitByRuleKind } from "../utils/splitByRuleKind";
import { CompiledState } from "../compiledState/CompiledState";
import { RegexMatchHandler } from "../compiledState/RegexMatchHandler";
import { StringMatchHandler } from "../compiledState/StringMatchHandler";
import { RuleWithType } from "../compiledState/MatchHandler";

export function mooState<T extends LexerTypings>(
  name: string,
  rules: StateSpec<T>
) {
  const { match, error, fallback } = splitByRuleKind(rules);
  const hasFallback = fallback != null;
  const matchHandler = everyRuleIsRegexp(match)
    ? new RegexMatchHandler(match, hasFallback)
    : new StringMatchHandler(match);

  const errorRule =
    error != null ? { type: error.type, lineBreaks: false } : null;
  const fallbackRule =
    fallback == null
      ? null
      : {
          type: fallback.type,
          lineBreaks: fallback.rule.lineBreaks ?? false,
        };

  return new CompiledState(name, fallbackRule, errorRule, matchHandler);
}

function everyRuleIsRegexp(
  match: RuleWithType<LexerTypings, MatchRule<LexerTypings>>[]
) {
  return match.every((rule) => rule.rule.match instanceof RegExp);
}
