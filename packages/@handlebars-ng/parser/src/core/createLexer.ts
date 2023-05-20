import {
  Lexer,
  createLexer as createBaaLexer,
  createTokenFactory,
  createStateProcessor,
  createMatcher,
  StateProcessorDict,
  TokenType,
} from "baa-lexer";
import { StatementRules } from "./types";
import { HbsLexerTypes } from "../model/lexer";

interface CreateLexerOptions {
  statements: StatementRules;
}

export function createLexer({
  statements,
}: CreateLexerOptions): Lexer<HbsLexerTypes> {
  const statementTypes: TokenType<HbsLexerTypes>[] = [];
  return createBaaLexer<HbsLexerTypes>(
    {
      main: createStateProcessor(
        statementTypes,
        createMatcher<HbsLexerTypes>(
          statements.matchRules,
          statements.fallbackRule == null
        ),
        statements.fallbackRule,
        null
      ),
    } as StateProcessorDict<HbsLexerTypes>,
    createTokenFactory
  );
}
