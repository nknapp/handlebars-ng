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
    const iterator =
      this.#unusedIterators.shift() ?? new BaaIterator(this.#states);
    iterator.init(string);
    let next = null;
    while (!(next = iterator.next()).done) {
      yield next.value;
    }
    this.#unusedIterators.push(iterator);
  }
}
