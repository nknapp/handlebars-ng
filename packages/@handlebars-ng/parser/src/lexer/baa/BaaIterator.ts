import { LexerState } from "./LexerState";
import {
  LexerSpec,
  LexerTypings,
  StateEnd,
  States,
  Token,
  TokenTypes,
} from "./types";
import { mapValues } from "./utils/mapValues";

const EMPTY_ITERATOR: Iterator<Token<never>> = {
  next: () => ({ done: true, value: null }),
};

export class BaaIterator<T extends LexerTypings>
  implements IterableIterator<Token<TokenTypes<T>>>
{
  states: Record<States<T>, LexerState<T>>;
  stateStack: LexerState<T>[] = [];
  offset = 0;
  stateIterator: Iterator<Token<TokenTypes<T>>, StateEnd<T>> = EMPTY_ITERATOR;
  string = "";

  constructor(states: LexerSpec<T>) {
    this.states = mapValues(states, (spec, name) => new LexerState(name, spec));
  }

  init(string: string) {
    this.string = string;
    this.#handleStateChange({ endOffset: 0, state: "main", type: "push" });
  }

  next(): IteratorResult<Token<TokenTypes<T>>> {
    const next = this.stateIterator.next();
    if (next.done) {
      if (next.value.type === "finished") return { done: true, value: null };
      this.#handleStateChange(next.value);
      return this.next();
    }
    return {
      value: next.value,
      done: false,
    };
  }

  [Symbol.iterator]() {
    return this;
  }

  #handleStateChange(stateEnd: StateEnd<T>): void {
    switch (stateEnd.type) {
      case "push":
        this.stateStack.unshift(this.states[stateEnd.state]);
        this.offset = stateEnd.endOffset;
        break;
      case "pop":
        this.stateStack.shift();
        this.offset = stateEnd.endOffset;
        break;
    }
    const nextState = this.stateStack[0];
    this.stateIterator = nextState.lex(this.string, this.offset);
  }
}
