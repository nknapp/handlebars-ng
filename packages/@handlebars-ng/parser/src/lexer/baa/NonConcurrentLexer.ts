import { CompiledState } from "./compiledState/CompiledState";
import { TokenFactory } from "./compiledState/TokenFactory";
import { ILexer, LexerSpec, LexerTypings, States, Token } from "./types";
import { mapValues } from "./utils/mapValues";

const EMPTY_ITERATOR: Iterator<Token<never>> = {
  next: () => ({ done: true, value: null }),
};

export class NonConcurrentLexer<T extends LexerTypings> implements ILexer<T> {
  states: Record<States<T>, CompiledState<T>>;
  stateStack: CompiledState<T>[] = [];
  offset = 0;
  stateIterator: Iterator<Token<T>> = EMPTY_ITERATOR;
  string = "";
  tokenFactory: TokenFactory<T> = new TokenFactory();

  constructor(states: LexerSpec<T>) {
    this.states = mapValues(
      states,
      (spec, name) => new CompiledState(name, spec, this.tokenFactory)
    );
  }

  *lex(string: string): Generator<Token<T>> {
    this.string = string;
    this.offset = 0;
    this.stateStack.unshift(this.states.main);
    this.tokenFactory.reset();
    while (this.offset < this.string.length) {
      yield* this.#iterateState();
    }
  }

  *#iterateState(): Generator<Token<T>> {
    const { matchHandler, fallback, errorHandler } = this.#currentState;
    matchHandler.reset(this.offset);
    for (const { offset, rule, type, original } of matchHandler.matchAll(
      this.string
    )) {
      if (offset > this.offset && fallback != null) {
        yield fallback.createToken(this.string, this.offset, offset);
      }

      yield this.tokenFactory.createToken(
        type,
        original,
        rule.value ? rule.value(original) : original
      ),
        (this.offset = offset + original.length);
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
      const token =
        fallback != null
          ? fallback.createToken(this.string, this.offset, this.string.length)
          : errorHandler.createErrorToken(this.string, this.offset);
      yield token;
      this.offset = this.string.length;
    }
  }

  get #currentState() {
    return this.stateStack[0];
  }
}
