import {
  ErrorHandler,
  ThrowingErrorHandler,
  TokenErrorHandler,
} from "./ErrorHandler";
import { MatchHandler } from "./MatchHandler";
import { LexerTypings, StateSpec } from "../types";
import { TokenFactory } from "./TokenFactory";
import { splitByRuleKind } from "../utils/splitByRuleKind";
import { CompiledRule } from "./CompiledRule";

export class CompiledState<T extends LexerTypings> {
  name: string;
  fallback?: CompiledRule<T>;
  errorHandler: ErrorHandler<T>;
  matchHandler: MatchHandler<T>;

  constructor(
    name: string,
    rules: StateSpec<T>,
    tokenFactory: TokenFactory<T>
  ) {
    this.name = name;
    const { match, error, fallback } = splitByRuleKind(rules);
    const hasFallback = fallback != null;
    this.matchHandler = new MatchHandler(match, hasFallback);
    if (error != null) {
      this.errorHandler = new TokenErrorHandler<T>(
        error.type,
        error.rule,
        tokenFactory
      );
    } else {
      this.errorHandler = new ThrowingErrorHandler(
        match.map(({ type }) => type)
      );
    }
    if (fallback != null) {
      this.fallback = {
        type: fallback.type,
      };
    }
  }
}
