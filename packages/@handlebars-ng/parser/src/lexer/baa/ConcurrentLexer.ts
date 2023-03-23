/// <reference types="vite/client" />

import { NonConcurrentLexer } from "./NonConcurrentLexer";
import { ILexer, LexerSpec, LexerTypings, Token } from "./types";
import { AlternativeMooWrappingLexer } from "./AlternativeMooWrappingLexer";

export class ConcurrentLexer<T extends LexerTypings> {
  #unusedLexers: Pool<ILexer<T>>;

  constructor(states: LexerSpec<T>) {
    const LexerClass = import.meta.env.VITE_USE_MOO
      ? AlternativeMooWrappingLexer
      : NonConcurrentLexer;
    this.#unusedLexers = new Pool(() => new LexerClass(states));
  }

  *lex(string: string): Generator<Token<T>> {
    const lexer = this.#unusedLexers.popOrCreate();
    try {
      yield* lexer.lex(string);
    } finally {
      this.#unusedLexers.push(lexer);
    }
  }

  poolSize() {
    return this.#unusedLexers.size();
  }
}

class Pool<T> {
  #objects: T[];
  #create: () => T;

  constructor(create: () => T) {
    this.#create = create;
    this.#objects = [];
  }

  popOrCreate(): T {
    return this.#objects.pop() ?? this.#create();
  }

  push(lexer: T): void {
    this.#objects.push(lexer);
  }

  size() {
    return this.#objects.length;
  }
}
