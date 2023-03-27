import { MatchHandler } from "./MatchHandler";
import { LexerTypings, StateSpec } from "../types";
import { splitByRuleKind } from "../utils/splitByRuleKind";
import { CompiledRule } from "./CompiledRule";

export class CompiledState<T extends LexerTypings> {
  name: string;
  fallbackRule?: CompiledRule<T>;
  errorRule?: CompiledRule<T>;
  matchHandler: MatchHandler<T>;

  constructor(name: string, rules: StateSpec<T>) {
    this.name = name;
    const { match, error, fallback } = splitByRuleKind(rules);
    const hasFallback = fallback != null;
    this.matchHandler = new MatchHandler(match, hasFallback);
    if (error != null) {
      this.errorRule = { type: error.type, lineBreaks: false };
    }
    if (fallback != null) {
      this.fallbackRule = {
        type: fallback.type,
        lineBreaks: fallback.rule.lineBreaks ?? false,
      };
    }
  }
}
