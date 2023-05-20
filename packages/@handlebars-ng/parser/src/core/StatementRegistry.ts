import {
  HbsLexerTypes,
  HbsMatchRule,
  HbsRule,
  TokenTypes,
} from "../model/lexer";
import { StatementParser, StatementRegistry, StatementRules } from "./types";
import { TokenType } from "baa-lexer";
import { Statement } from "@handlebars-ng/abstract-syntax-tree";

export class StatementRegistryImpl
  implements StatementRegistry, StatementRules
{
  fallbackRule: HbsRule | null = null;
  matchRules: HbsMatchRule[] = [];
  parsers: Map<TokenType<HbsLexerTypes>, StatementParser> = new Map();

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

  addParser<T extends Statement>(
    startToken: TokenTypes,
    parser: StatementParser<T>
  ): void {
    for (const token of startToken) {
      this.parsers.set(token, parser);
    }
  }
}
