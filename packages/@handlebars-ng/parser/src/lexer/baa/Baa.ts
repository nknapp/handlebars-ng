import { BaaIterator } from "./BaaIterator";
import { LexerSpec, LexerTypings, Token } from "./types";

export class Lexer<T extends LexerTypings> {
  #states: LexerSpec<T>;
  #unusedIterators: BaaIterator<T>[];

  constructor(states: LexerSpec<T>) {
    this.#states = states;
    this.#unusedIterators = [];
  }

  *lex(string: string): Generator<Token<T["tokenType"]>> {
    const tokens = this.#getTokenIterator();
    tokens.init(string);
    yield* tokens;
    this.#storeForReuse(tokens);
  }

  #getTokenIterator(): BaaIterator<T> {
    return this.#unusedIterators.shift() ?? new BaaIterator(this.#states);
  }

  #storeForReuse(iterator: BaaIterator<T>) {
    return this.#unusedIterators.push(iterator);
  }
}
