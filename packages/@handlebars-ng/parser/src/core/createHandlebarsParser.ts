import { Program, Statement } from "@handlebars-ng/abstract-syntax-tree";
import { HandlebarsParserPlugin, ParseContext } from "./types";
import { StatementRegistryImpl } from "./StatementRegistry";
import { createLexer } from "./createLexer";
import { TokenStream } from "./TokenStream";
import { createCombinedStatementParser } from "./createCombinedStatementParser";

export interface HandlebarsParser {
  parse(template: string): Program;
}

interface HandlebarsParserOptions {
  plugins: HandlebarsParserPlugin[];
}

export function createHandlebarsParser(
  options: HandlebarsParserOptions
): HandlebarsParser {
  const registry = new StatementRegistryImpl();
  for (const plugin of options.plugins) {
    plugin.statement(registry);
  }
  const lexer = createLexer({ statements: registry });
  const statementParser = createCombinedStatementParser(registry.parsers);

  return {
    parse(template) {
      const context: ParseContext = {
        tokens: new TokenStream(template, lexer),
        parseStatement() {
          return statementParser(context);
        },
      };

      const statements: Statement[] = [];
      const firstToken = context.tokens.lookAhead;
      let lastToken = null;
      while (context.tokens.lookAhead != null) {
        lastToken = context.tokens.lookAhead;
        statements.push(context.parseStatement());
      }

      return {
        type: "Program",
        strip: {},
        body: statements,
        loc: context.tokens.location(firstToken, lastToken),
      };
    },
  };
}
