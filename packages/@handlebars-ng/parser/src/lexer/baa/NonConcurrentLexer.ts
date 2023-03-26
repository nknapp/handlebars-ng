import { CompiledRule } from "./compiledState/CompiledRule";
import { CompiledState } from "./compiledState/CompiledState";
import { Fallback } from "./compiledState/FallbackHandler";
import { TokenFactory } from "./compiledState/TokenFactory";
import { ILexer, LexerSpec, LexerTypings, States, Token } from "./types";
import { mapValues } from "./utils/mapValues";

const done = { done: true, value: undefined } as const;

export class NonConcurrentLexer<T extends LexerTypings> implements ILexer<T> {
  stateStack: StateStack<T>;
  offset = 0;
  string = "";
  tokenFactory: TokenFactory<T> = new TokenFactory();
  matchPending = false;
  pendingStateUpdate: CompiledRule<T> | null = null;

  constructor(states: LexerSpec<T>) {
    const compiledStates = mapValues(
      states,
      (spec, name) => new CompiledState(name, spec, this.tokenFactory)
    );
    this.stateStack = new StateStack<T>(compiledStates);
  }

  reset(string: string): void {
    this.string = string;
    this.offset = 0;
    this.stateStack.reset();
    this.tokenFactory.reset();
    this.#currentState.matchHandler.reset(this.offset, this.string);
    this.matchPending = false;
  }

  lex(string: string): IterableIterator<Token<T>> {
    this.reset(string);
    return this;
  }

  [Symbol.iterator]() {
    return this;
  }

  next(): IteratorResult<Token<T>> {
    const token = this.nextToken();
    if (token == null) return done;
    this.offset += token.original.length;
    return { done: false, value: token };
  }

  nextToken(): Token<T> | null {
    if (this.matchPending) {
      this.matchPending = false;
      return this.continueWithCurrentMatch();
    }

    if (this.offset >= this.string.length) return null;

    if (this.pendingStateUpdate) {
      this.stateStack.update(this.pendingStateUpdate);
      this.#currentState.matchHandler.reset(this.offset, this.string);
      this.pendingStateUpdate = null;
    }

    const matchHandler = this.#currentState.matchHandler;
    const fallback = this.#currentState.fallback;

    if (!matchHandler.next()) {
      if (fallback) {
        return this.fallbackToken(fallback, this.string.length);
      } else {
        return this.#currentState.errorHandler.createErrorToken(
          this.string,
          this.offset
        );
      }
    }

    if (matchHandler.offset > this.offset && fallback != null) {
      this.matchPending = true;
      return this.fallbackToken(fallback, matchHandler.offset);
    }
    return this.continueWithCurrentMatch();
  }

  fallbackToken(fallback: Fallback<T>, endOffset: number): Token<T> {
    const original = this.string.substring(this.offset, endOffset);
    return this.tokenFactory.createToken(fallback.type, original, original);
  }

  continueWithCurrentMatch(): Token<T> {
    const matchHandler = this.#currentState.matchHandler;
    this.pendingStateUpdate = matchHandler.rule;
    return this.tokenFactory.createToken(
      matchHandler.rule.type,
      matchHandler.original,
      matchHandler.rule.value
        ? matchHandler.rule.value(matchHandler.original)
        : matchHandler.original
    );
  }

  get #currentState() {
    return this.stateStack.current;
  }
}

class StateStack<T extends LexerTypings> {
  stack: CompiledState<T>[];
  states: Record<States<T>, CompiledState<T>>;

  constructor(states: Record<States<T>, CompiledState<T>>) {
    this.states = states;
    this.stack = [this.states.main];
  }

  reset() {
    this.stack = [this.states.main];
  }

  update(rule: CompiledRule<T>): boolean {
    if (!rule) return false;
    if (rule.push) {
      this.stack.unshift(this.states[rule.push]);
    }
    if (rule.pop) {
      this.stack.shift();
    }
    return true;
  }

  get current() {
    return this.stack[0];
  }
}
