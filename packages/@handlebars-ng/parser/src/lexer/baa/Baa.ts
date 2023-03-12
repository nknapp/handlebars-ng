import { LexerState } from "./LexerState";
import { LexerSpec, LexerTypings, States, Token } from "./types";
import { mapValues } from "./utils/mapValues";

export class Lexer<T extends LexerTypings> {
  states: Record<States<T>, LexerState<T>>;
  stateStack: LexerState<T>[] = [];

  constructor(states: LexerSpec<T>) {
    this.states = mapValues(states, (spec) => new LexerState(spec));
    this.stateStack.unshift(this.states.main);
  }

  *lex(string: string): Generator<Token<T["tokenType"]>> {
    for (const token of this.stateStack[0].lex(string)) {
      yield token;
    }
  }
}
