import {
  HbsLexerState,
  HbsMatchRule,
  HbsRule,
  TokenTypes,
} from "../model/lexer";
import {
  Expression,
  Node,
  NodeByType,
  Statement,
} from "@handlebars-ng/abstract-syntax-tree";

import { TokenStream } from "./TokenStream";

export interface RuleCollector {
  setFallback(rule: HbsRule): void;
  add(rule: HbsMatchRule): void;
}

export type SetDefaultParser = <T extends keyof NodeByType>(
  nodeType: T,
  parse: Parser<NodeByType[T]>
) => void;

export interface ParserCollector {
  setDefaultParser: SetDefaultParser;
  getDefaultParser<T extends keyof NodeByType>(
    nodeType: T
  ): Parser<NodeByType[T]>;
}

export interface StatementPluginArgs {
  lexerRules: RuleCollector;
  setDefaultParser: SetDefaultParser;
  addParser(tokenTypes: TokenTypes, parse: Parser<Statement>): void;
  addState(name: HbsLexerState, rules: LexerRules): void;
  expressionRules: LexerRules;
}

export interface ExpressionPluginArgs {
  lexerRules: RuleCollector;
  setDefaultParser: SetDefaultParser;
  addParser(tokenTypes: TokenTypes, parse: Parser<Expression>): void;
}

export interface HandlebarsParserPlugin {
  statement?: (args: StatementPluginArgs) => void;
  expression?: (args: ExpressionPluginArgs) => void;
}

export type ExpressionParser<T extends Expression = Expression> = (
  context: ParseContext
) => T;

export interface LexerRules {
  fallbackRule: HbsRule | null;
  matchRules: HbsMatchRule[];
}

export type StatementParser<T extends Statement = Statement> = (
  context: ParseContext
) => T;

export type Parser<T extends Node> = (context: ParseContext) => T;

export interface ParseContext {
  tokens: TokenStream;
  parseStatement(): Statement;
  parseExpression(): Expression;
  parse<T extends keyof NodeByType>(nodeType: T): NodeByType[T];
}
