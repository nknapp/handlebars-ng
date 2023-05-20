import {
  HbsLexerTypes,
  HbsMatchRule,
  HbsRule,
  TokenTypes,
} from "../model/lexer";
import { Statement } from "@handlebars-ng/abstract-syntax-tree";
import { TokenStream } from "./TokenStream";
import { StateName, TokenType } from "baa-lexer";

export interface HandlebarsParserPlugin {
  statement(statementRegistry: StatementRegistry): void;
}
export interface StatementRegistry {
  setFallbackRule(rule: HbsRule): void;
  addMatchRule(rule: HbsMatchRule): void;
  addState(name: StateName<HbsLexerTypes>, rules: LexerRules): void;
  addParser<T extends Statement>(
    startToken: TokenTypes,
    parse: StatementParser<T>
  ): void;
  parsers: Map<TokenType<HbsLexerTypes>, StatementParser>;
}

export interface LexerRules {
  fallbackRule: HbsRule | null;
  matchRules: HbsMatchRule[];
}

export type StatementParser<T extends Statement = Statement> = (
  context: ParseContext
) => T;
export interface ParseContext {
  tokens: TokenStream;
  parseStatement: () => Statement;
}
