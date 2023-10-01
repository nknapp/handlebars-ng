import { LexerRules, RuleCollector } from "../types";
import { HbsMatchRule, HbsRule } from "../../model/lexer";

export class RuleCollectionImpl implements RuleCollector, LexerRules {
  fallbackRule: HbsRule | null = null;
  matchRules: HbsMatchRule[] = [];
  add(rule: HbsMatchRule): void {
    this.matchRules.push(rule);
  }

  setFallback(rule: HbsRule): void {
    if (this.fallbackRule != null)
      throw new Error(
        "Only one fallback rule is allowed, and this one already exists: " +
          this.fallbackRule.type,
      );
    this.fallbackRule = rule;
  }
}
