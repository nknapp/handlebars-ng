import { NonConcurrentLexer } from "./NonConcurrentLexer";
import { LexerSpec, LexerTypings, Token } from "./types";

export class Lexer<T extends LexerTypings> {
  #states: LexerSpec<T>;
  #unusedIterators: NonConcurrentLexer<T>[];

  constructor(states: LexerSpec<T>) {
    this.#states = states;
    this.#unusedIterators = [];
  }

  *lex(string: string): Generator<Token<T>> {
    const tokens = this.#getTokenIterator();
    tokens.init(string);
    yield* tokens.lex();
    this.#storeForReuse(tokens);
  }

  #getTokenIterator(): NonConcurrentLexer<T> {
    return (
      this.#unusedIterators.shift() ?? new NonConcurrentLexer(this.#states)
    );
  }

  #storeForReuse(iterator: NonConcurrentLexer<T>) {
    return this.#unusedIterators.push(iterator);
  }
}
