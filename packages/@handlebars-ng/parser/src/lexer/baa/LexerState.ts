import {
  ErrorHandler,
  ThrowingErrorHandler,
  TokenErrorHandler,
} from "./handler/ErrorHandler";
import { Fallback as FallbackHandler } from "./handler/FallbackHandler";
import { MatchHandler } from "./handler/MatchHandler";
import {
  ErrorRule,
  FallbackRule,
  LexerTypings,
  MatchRule,
  Rule,
  States,
  StateSpec,
  Token,
  TokenTypes,
} from "./types";
import { isErrorRule } from "./utils/isErrorRule";
import { isFallbackRule } from "./utils/isFallbackRule";

export class LexerState<T extends LexerTypings> {
  #fallback?: FallbackHandler<TokenTypes<T>>;
  #errorHandler: ErrorHandler<TokenTypes<T>>;
  #matchHandler: MatchHandler<T>;

  constructor(rules: StateSpec<T>) {
    const { matchRules, errorRule, fallbackRule } = splitByRuleType(rules);
    this.#matchHandler = new MatchHandler(
      matchRules.map(({ type }) => type),
      matchRules.map(({ rule }) => rule),
      fallbackRule != null
    );
    if (errorRule != null) {
      this.#errorHandler = new TokenErrorHandler<TokenTypes<T>>(
        errorRule.type,
        errorRule.rule
      );
    } else {
      this.#errorHandler = new ThrowingErrorHandler(
        matchRules.map(({ type }) => type)
      );
    }
    if (fallbackRule != null) {
      this.#fallback = new FallbackHandler(
        fallbackRule.type,
        fallbackRule.rule
      );
    }
  }

  *lex(string: string): IterableIterator<Token<TokenTypes<T>>> {
    let lastOffset = 0;
    for (const { offset, ...token } of this.#matchHandler.matchAll(string)) {
      if (offset > lastOffset && this.#fallback) {
        yield this.#fallback.createToken(string, lastOffset, offset);
      }
      yield token;
      lastOffset = offset + token.original.length;
    }
    if (lastOffset < string.length) {
      yield this.#errorHandler.createErrorToken(string, lastOffset);
    }
  }
}

interface RuleWithType<T extends LexerTypings, R extends Rule<States<T>>> {
  type: TokenTypes<T>;
  rule: R;
}

interface SplitRulesReturn<T extends LexerTypings> {
  fallbackRule?: RuleWithType<T, FallbackRule>;
  errorRule?: RuleWithType<T, ErrorRule>;
  matchRules: RuleWithType<T, MatchRule<States<T>>>[];
}

function splitByRuleType<T extends LexerTypings>(
  rules: StateSpec<T>
): SplitRulesReturn<T> {
  const result: SplitRulesReturn<T> = {
    matchRules: [],
  };
  for (const [type, rule] of entries(rules)) {
    if (isFallbackRule(rule)) {
      result.fallbackRule = { type, rule };
    } else if (isErrorRule(rule)) {
      result.errorRule = { type, rule };
    } else {
      result.matchRules.push({ type, rule });
    }
  }
  return result;
}

function entries<K extends string, V>(object: Partial<Record<K, V>>): [K, V][] {
  return Object.entries(object) as [K, V][];
}
