import { CompiledRule } from "./compiledState/CompiledRule";
import { CompiledState } from "./compiledState/CompiledState";
import { Match } from "./compiledState/MatchHandler";
import { TokenFactory } from "./compiledState/TokenFactory";
import { ILexer, LexerSpec, LexerTypings, States, Token } from "./types";
import { mapValues } from "./utils/mapValues";

const done = { done: true, value: undefined } as const;
export class NonConcurrentLexer<T extends LexerTypings> implements ILexer<T> {
  stateStack: StateStack<T>;
  offset = 0;
  string = "";
  tokenFactory: TokenFactory<T> = new TokenFactory();
  pendingMatch: Match<T> | null = null;
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
    this.pendingStateUpdate = null;
    this.stateStack.reset();
    this.tokenFactory.reset();
    this.#currentState.matchHandler.reset(this.offset);
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
    if (this.pendingMatch != null) {
      const match = this.pendingMatch;
      this.pendingMatch = null;
      return this.#createMatchToken(match);
    }

    if (this.offset >= this.string.length) return null;

    if (this.pendingStateUpdate) {
      this.stateStack.update(this.pendingStateUpdate);
      this.#currentState.matchHandler.reset(this.offset);
      this.pendingStateUpdate = null;
    }

    const matchHandler = this.#currentState.matchHandler;
    const fallback = this.#currentState.fallback;

    const match = matchHandler.exec(this.string);
    if (match == null) {
      if (fallback) {
        return this.#createFallbackToken(fallback, this.string.length);
      } else {
        return this.#currentState.errorHandler.createErrorToken(
          this.string,
          this.offset
        );
      }
    }

    if (matchHandler.offset > this.offset && fallback != null) {
      this.pendingMatch = match;
      return this.#createFallbackToken(fallback, matchHandler.offset);
    }
    return this.#createMatchToken(match);
  }

  #createFallbackToken(fallback: CompiledRule<T>, endOffset: number): Token<T> {
    const original = this.string.substring(this.offset, endOffset);
    return this.tokenFactory.createToken(fallback.type, original, original);
  }

  #createMatchToken(match: Match<T>): Token<T> {
    this.pendingStateUpdate = match.rule;
    return this.tokenFactory.createToken(
      match.rule.type,
      match.text,
      match.rule.value ? match.rule.value(match.text) : match.text
    );
  }

  get #currentState() {
    return this.stateStack.current;
  }
}

class StateStack<T extends LexerTypings> {
  stack: CompiledState<T>[];
  states: Record<States<T>, CompiledState<T>>;
  current: CompiledState<T>;

  constructor(states: Record<States<T>, CompiledState<T>>) {
    this.states = states;
    this.stack = [this.states.main];
    this.current = this.states.main;
  }

  reset() {
    this.stack = [this.states.main];
    this.current = this.states.main;
  }

  update(rule: CompiledRule<T>): boolean {
    if (!rule) return false;
    if (rule.push) {
      this.stack.unshift(this.states[rule.push]);
    }
    if (rule.pop) {
      this.stack.shift();
    }
    this.current = this.stack[0];
    return true;
  }
}
