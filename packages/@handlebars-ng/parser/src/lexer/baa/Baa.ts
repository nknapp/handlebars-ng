import { LexerState } from "./LexerState";
import { LexerSpec, LexerTypings, States, Token } from "./types";
import { mapValues } from "./utils/mapValues";

export class Lexer<T extends LexerTypings> {
  states: Record<States<T>, LexerState<T>>;
  stateStack: LexerState<T>[] = [];
  offset = 0;

  constructor(states: LexerSpec<T>) {
    this.states = mapValues(states, (spec, name) => new LexerState(name, spec));
    this.stateStack.unshift(this.states.main);
  }

  *lex(string: string): Generator<Token<T["tokenType"]>> {
    let next = null;
    const nextState = this.stateStack[0];
    const iterator = nextState.lex(string, this.offset);
    while (!(next = iterator.next()).done) {
      yield next.value;
    }
    if (next.value.type === "push") {
      this.stateStack.unshift(this.states[next.value.state]);
      this.offset = next.value.endOffset;
      yield* this.lex(string);
    } else if (next.value.type === "pop") {
      this.stateStack.shift();
      this.offset = next.value.endOffset;
      yield* this.lex(string);
    }
  }
}
