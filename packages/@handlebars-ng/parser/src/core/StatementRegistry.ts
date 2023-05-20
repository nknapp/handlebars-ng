import {
  HbsLexerState,
  HbsLexerTypes,
  HbsMatchRule,
  HbsRule,
  TokenTypes,
} from "../model/lexer";
import { StatementParser, StatementRegistry, LexerRules } from "./types";
import { StateName, TokenType } from "baa-lexer";
import { Statement } from "@handlebars-ng/abstract-syntax-tree";

export class StatementRegistryImpl implements StatementRegistry, LexerRules {
  fallbackRule: HbsRule | null = null;
  matchRules: HbsMatchRule[] = [];
  parsers: Map<TokenType<HbsLexerTypes>, StatementParser> = new Map();
  states: Map<HbsLexerState, LexerRules> = new Map();

  setFallbackRule(rule: HbsRule) {
    if (this.fallbackRule != null)
      throw new Error(
        "Only one fallback rule is allowed, and this one already exists: " +
          this.fallbackRule.type
      );
    this.fallbackRule = rule;
  }

  addMatchRule(rule: HbsMatchRule) {
    this.matchRules.push(rule);
  }

  addState(name: StateName<HbsLexerTypes>, rules: LexerRules) {
    this.states.set(name, rules);
  }

  addParser<T extends Statement>(
    startToken: TokenTypes,
    parser: StatementParser<T>
  ): void {
    for (const token of startToken) {
      this.parsers.set(token, parser);
    }
  }
}
