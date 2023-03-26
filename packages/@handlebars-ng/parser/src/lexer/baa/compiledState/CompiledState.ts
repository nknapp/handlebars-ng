import {
  ErrorHandler,
  ThrowingErrorHandler,
  TokenErrorHandler,
} from "./ErrorHandler";
import { Fallback as FallbackHandler } from "./FallbackHandler";
import { MatchHandler } from "./MatchHandler";
import { LexerTypings, StateSpec } from "../types";
import { TokenFactory } from "./TokenFactory";
import { splitByRuleKind } from "../utils/splitByRuleKind";

export class CompiledState<T extends LexerTypings> {
  name: string;
  fallback?: FallbackHandler<T>;
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
      this.fallback = new FallbackHandler(
        fallback.type,
        fallback.rule,
        tokenFactory
      );
    }
  }
}
