import { CompiledRule } from "./compiledState/CompiledRule";
import { CompiledState } from "./compiledState/CompiledState";
import { TokenFactory } from "./compiledState/TokenFactory";
import { ILexer, LexerSpec, LexerTypings, States, Token } from "./types";
import { mapValues } from "./utils/mapValues";
import { mooState } from "./builder/mooState";

const done = { done: true, value: undefined } as const;
export class NonConcurrentLexer<T extends LexerTypings> implements ILexer<T> {
  stateStack: StateStack<T>;
  tokenFactory: TokenFactory<T> = new TokenFactory();

  constructor(states: LexerSpec<T>) {
    const compiledStates = mapValues(states, (spec, name) =>
      mooState(name, spec).init(this.tokenFactory)
    );
    this.stateStack = new StateStack<T>(compiledStates);
  }

  reset(string: string): void {
    this.stateStack.reset();
    this.tokenFactory.reset(string);
    this.#currentState.reset(0);
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
    return { done: false, value: token };
  }

  nextToken(): Token<T> | null {
    if (this.tokenFactory.pendingMatch != null) {
      return this.tokenFactory.resolvePendingMatch();
    }
    if (this.tokenFactory.isFinished()) return null;

    const stateUpdate = this.tokenFactory.takePendingStateUpdate();
    if (stateUpdate != null) {
      this.stateStack.update(stateUpdate);
      this.#currentState.reset(this.tokenFactory.offset);
    }

    return this.#currentState.nextToken();
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
