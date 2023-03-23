import { Location } from "../model";
import { CompiledState } from "./compiledState/CompiledState";
import {
  ILexer,
  LexerSpec,
  LexerTypings,
  States,
  Token,
  TokenWithoutLocation,
} from "./types";
import { endLocationMultiline } from "./utils/endLocationMultiline";
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
  currentLocation: Location = { line: 1, column: 0 };

  constructor(states: LexerSpec<T>) {
    this.states = mapValues(
      states,
      (spec, name) => new CompiledState(name, spec)
    );
  }

  *lex(string: string): Generator<Token<T>> {
    this.string = string;
    this.offset = 0;
    this.stateStack.unshift(this.states.main);
    this.currentLocation = { line: 1, column: 0 };
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
        const fallbackToken = fallback.createToken(
          this.string,
          this.offset,
          offset
        );
        yield this.addLocation(fallbackToken);
      }
      yield this.addLocation(token);
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
      const token =
        fallback != null
          ? fallback.createToken(this.string, this.offset, this.string.length)
          : errorHandler.createErrorToken(this.string, this.offset);
      yield this.addLocation(token);
      this.offset = this.string.length;
    }
  }

  addLocation(token: TokenWithoutLocation<T>): Token<T> {
    const start = this.currentLocation;
    const end = endLocationMultiline(start, token.original);
    this.currentLocation = end;
    return { ...token, start, end };
  }

  get #currentState() {
    return this.stateStack[0];
  }
}
