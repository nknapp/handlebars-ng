import { Program } from "@handlebars-ng/abstract-syntax-tree";
import { HandlebarsParserPlugin, ParseContext } from "./types";
import { StatementRegistryImpl } from "./StatementRegistry";
import { createLexer } from "./createLexer";
import { TokenStream } from "./TokenStream";
import { createCombinedStatementParser } from "./createCombinedStatementParser";
import { parseProgram } from "./parseProgram";

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
  const lexer = createLexer({ statements: registry, states: registry.states });
  const statementParser = createCombinedStatementParser(registry.parsers);

  return {
    parse(template) {
      const context: ParseContext = {
        tokens: new TokenStream(template, lexer),
        parseStatement() {
          return statementParser(context);
        },
      };
      return parseProgram(context);
    },
  };
}
