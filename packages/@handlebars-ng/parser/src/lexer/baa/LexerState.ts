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

type StateEnd<T extends LexerTypings> =
  | {
      type: "push";
      state: States<T>;
      endOffset: number;
    }
  | { type: "pop"; endOffset: number }
  | { type: "finished" };

export class LexerState<T extends LexerTypings> {
  name: string;
  #fallback?: FallbackHandler<TokenTypes<T>>;
  #errorHandler: ErrorHandler<TokenTypes<T>>;
  #matchHandler: MatchHandler<T>;

  constructor(name: string, rules: StateSpec<T>) {
    this.name = name;
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

  *lex(
    string: string,
    startOffset: number
  ): Iterator<Token<TokenTypes<T>>, StateEnd<T>> {
    this.#matchHandler.reset(startOffset);
    let lastOffset = startOffset;
    for (const { offset, rule, ...token } of this.#matchHandler.matchAll(
      string
    )) {
      if (offset > lastOffset && this.#fallback) {
        yield this.#fallback.createToken(string, lastOffset, offset);
      }
      yield token;
      lastOffset = offset + token.original.length;
      if (rule.push) {
        return {
          type: "push",
          state: rule.push,
          endOffset: lastOffset,
        };
      }
      if (rule.pop) {
        return {
          type: "pop",
          endOffset: lastOffset,
        };
      }
    }
    if (lastOffset < string.length) {
      yield this.#errorHandler.createErrorToken(string, lastOffset);
    }
    return { type: "finished" };
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
