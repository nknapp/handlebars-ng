import { LexerTypings, StateSpec } from "../types";
import { splitByRuleKind } from "../utils/splitByRuleKind";
import { MatchHandler } from "../compiledState/MatchHandler";
import { CompiledState } from "../compiledState/CompiledState";

export function mooState<T extends LexerTypings>(
  name: string,
  rules: StateSpec<T>
) {
  const { match, error, fallback } = splitByRuleKind(rules);
  const hasFallback = fallback != null;
  const matchHandler = new MatchHandler(match, hasFallback);
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
