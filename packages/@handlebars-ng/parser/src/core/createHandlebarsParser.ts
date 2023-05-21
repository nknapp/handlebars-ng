import { NodeByType, Program } from "@handlebars-ng/abstract-syntax-tree";
import {
  ExpressionParser,
  ExpressionPluginArgs,
  HandlebarsParserPlugin,
  LexerRules,
  ParseContext,
  StatementParser,
  StatementPluginArgs,
} from "./types";
import { Parsers } from "./registry/Parsers";
import { createLexer } from "./createLexer";
import { TokenStream } from "./TokenStream";
import { createCombinedStatementParser } from "./createCombinedStatementParser";
import { parseProgram } from "./parseProgram";
import { RuleCollectionImpl } from "./registry/RuleCollectionImpl";
import { DefaultParsers } from "./registry/DefaultParsers";
import { HbsLexerState } from "../model/lexer";

export interface HandlebarsParser {
  parse(template: string): Program;
}

interface HandlebarsParserOptions {
  plugins: HandlebarsParserPlugin[];
}

export function createHandlebarsParser(
  options: HandlebarsParserOptions
): HandlebarsParser {
  const expressionRules = new RuleCollectionImpl();
  const statementRules = new RuleCollectionImpl();
  const defaultParsers: DefaultParsers = new DefaultParsers();
  const states: Map<HbsLexerState, LexerRules> = new Map();

  const expressions = new Parsers<ExpressionParser>();
  const statements = new Parsers<StatementParser>();
  const expressionApi: ExpressionPluginArgs = {
    setDefaultParser: defaultParsers.setDefaultParser.bind(defaultParsers),
    lexerRules: expressionRules,
    addParser(tokenTypes, parse) {
      expressions.addParser(tokenTypes, parse);
    },
  };

  const statementApi: StatementPluginArgs = {
    lexerRules: statementRules,
    addParser(tokenTypes, parse) {
      statements.addParser(tokenTypes, parse);
    },
    addState: states.set.bind(states),
    setDefaultParser: defaultParsers.setDefaultParser.bind(defaultParsers),
    expressionRules: expressionRules,
  };

  for (const plugin of options.plugins) {
    plugin.expression?.(expressionApi);
  }
  for (const plugin of options.plugins) {
    plugin.statement?.(statementApi);
  }

  const lexer = createLexer({
    statements: statementRules,
    states,
  });

  const statementParser = createCombinedStatementParser(statements.parsers);
  const expressionParser = createCombinedStatementParser(expressions.parsers);

  return {
    parse(template) {
      const context: ParseContext = {
        tokens: new TokenStream(template, lexer),
        parseStatement() {
          return statementParser(context);
        },
        parseExpression() {
          return expressionParser(context);
        },
        parse<T extends keyof NodeByType>(nodeType: T): NodeByType[T] {
          return defaultParsers.getDefaultParser(nodeType)(
            context
          ) as NodeByType[T];
        },
      };
      return parseProgram(context);
    },
  };
}
