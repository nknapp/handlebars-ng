import { ILexer, LexerTypings, Token } from "./types";

export class ConcurrentLexer<T extends LexerTypings> implements ILexer<T> {
  #unusedLexers: Pool<ILexer<T>>;

  constructor(factory: () => ILexer<T>) {
    this.#unusedLexers = new Pool(() => factory());
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
