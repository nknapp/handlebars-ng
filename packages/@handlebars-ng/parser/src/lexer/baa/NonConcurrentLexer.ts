import { CompiledState } from "./CompiledState";
import { LexerSpec, LexerTypings, States, Token } from "./types";
import { mapValues } from "./utils/mapValues";

const EMPTY_ITERATOR: Iterator<Token<never>> = {
  next: () => ({ done: true, value: null }),
};

export class NonConcurrentLexer<T extends LexerTypings> {
  states: Record<States<T>, CompiledState<T>>;
  stateStack: CompiledState<T>[] = [];
  offset = 0;
  stateIterator: Iterator<Token<T>> = EMPTY_ITERATOR;
  string = "";

  constructor(states: LexerSpec<T>) {
    this.states = mapValues(
      states,
      (spec, name) => new CompiledState(name, spec)
    );
  }

  init(string: string) {
    this.string = string;
    this.offset = 0;
    this.stateStack.unshift(this.states.main);
  }

  *lex(): Generator<Token<T>> {
    while (this.offset < this.string.length) {
      yield* this.#iterateState();
    }
  }

  *#iterateState(): Generator<Token<T>> {
    const { matchHandler, fallback, errorHandler } = this.#currentState;
    matchHandler.reset(this.offset);
    for (const { offset, rule, ...token } of matchHandler.matchAll(
      this.string
    )) {
      if (offset > this.offset && fallback != null) {
        yield fallback.createToken(this.string, this.offset, offset);
      }
      yield token;
      this.offset = offset + token.original.length;
      if (rule.push != null) {
        this.stateStack.unshift(this.states[rule.push]);
        return;
      }
      if (rule.pop != null) {
        this.stateStack.shift();
        return;
      }
    }
    if (this.offset < this.string.length) {
      yield errorHandler.createErrorToken(this.string, this.offset);
      this.offset = this.string.length;
    }
  }

  get #currentState() {
    return this.stateStack[0];
  }
}
