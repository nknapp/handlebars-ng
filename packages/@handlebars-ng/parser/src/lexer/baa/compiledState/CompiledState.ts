import {
  ErrorHandler,
  ThrowingErrorHandler,
  TokenErrorHandler,
} from "./ErrorHandler";
import { Fallback as FallbackHandler } from "./FallbackHandler";
import { MatchHandler } from "./MatchHandler";
import {
  ErrorRule,
  FallbackRule,
  LexerTypings,
  MatchRule,
  Rule,
  StateSpec,
  TokenTypes,
} from "../types";
import { isErrorRule } from "../utils/isErrorRule";
import { isFallbackRule } from "../utils/isFallbackRule";
import { TokenFactory } from "./TokenFactory";

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
    const { match, error, fallback } = splitByRuleType(rules);
    const hasFallback = fallback != null;
    this.matchHandler = new MatchHandler(
      match.types,
      match.rules,
      hasFallback,
      tokenFactory
    );
    if (error != null) {
      this.errorHandler = new TokenErrorHandler<T>(
        error.type,
        error.rule,
        tokenFactory
      );
    } else {
      this.errorHandler = new ThrowingErrorHandler(match.types);
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

interface RuleWithType<T extends LexerTypings, R extends Rule<T>> {
  type: TokenTypes<T>;
  rule: R;
}

interface SplitRulesReturn<T extends LexerTypings> {
  fallback?: RuleWithType<T, FallbackRule>;
  error?: RuleWithType<T, ErrorRule>;
  match: { types: TokenTypes<T>[]; rules: MatchRule<T>[] };
}

function splitByRuleType<T extends LexerTypings>(
  rules: StateSpec<T>
): SplitRulesReturn<T> {
  const result: SplitRulesReturn<T> = {
    match: {
      types: [],
      rules: [],
    },
  };
  for (const [type, rule] of entries(rules)) {
    if (isFallbackRule(rule)) {
      result.fallback = { type, rule };
    } else if (isErrorRule(rule)) {
      result.error = { type, rule };
    } else {
      result.match.rules.push(rule);
      result.match.types.push(type);
    }
  }
  return result;
}

function entries<K extends string, V>(object: Partial<Record<K, V>>): [K, V][] {
  return Object.entries(object) as [K, V][];
}
