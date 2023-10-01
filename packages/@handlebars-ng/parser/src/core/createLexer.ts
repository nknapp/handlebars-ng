import {
  Lexer,
  createLexer as createBaaLexer,
  createTokenFactory,
  createStateProcessor,
  createMatcher,
  StateProcessorDict,
} from "baa-lexer";
import { LexerRules } from "./types";
import { HbsLexerState, HbsLexerTypes, TokenType } from "../model/lexer";

interface CreateLexerOptions {
  statements: LexerRules;
  states: Map<HbsLexerState, LexerRules>;
}

export function createLexer({
  statements,
  states,
}: CreateLexerOptions): Lexer<HbsLexerTypes> {
  const stateProcessors: StateProcessorDict<HbsLexerTypes> = {
    main: hbsState(statements),
  } as StateProcessorDict<HbsLexerTypes>;

  for (const [name, rules] of states) {
    stateProcessors[name] = hbsState(rules);
  }
  return createBaaLexer<HbsLexerTypes>(stateProcessors, createTokenFactory);
}

function hbsState(statements: LexerRules) {
  const statementTypes: TokenType[] = [];
  return createStateProcessor(
    statementTypes,
    createMatcher<HbsLexerTypes>(
      statements.matchRules,
      statements.fallbackRule == null,
    ),
    statements.fallbackRule,
    { type: "error" },
  );
}
