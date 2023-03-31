import { createHbsLexer } from "../lexer";
import { Token, TokenTypes } from "../lexer";
import { SourceLocation } from "../model/ast";
import { ParseError } from "./ParseError";

export class TokenStream {
  #tokens: Iterator<Token>;
  #template: string;

  lookAhead: Token | null;
  currentToken: Token | null = null;

  constructor(template: string) {
    this.#template = template;
    const lexer = createHbsLexer().lex(template);
    this.#tokens = lexer[Symbol.iterator]();
    this.lookAhead = this.#tokens.next().value ?? null;
  }

  eat(types: TokenTypes): Token {
    if (this.lookAhead == null)
      throw new Error(`Expected '${[...types]}', but received end of file.`);
    this.currentToken = this.lookAhead;
    if (!types.has(this.currentToken.type))
      throw new ParseError(
        `Expected '${[...types]}', but received '${this.currentToken.type}'`,
        this.currentToken.start,
        this.#template
      );
    this.lookAhead = this.#tokens.next().value;
    return this.currentToken;
  }

  eatOptional(types: TokenTypes): Token | null {
    if (this.lookAhead == null) return null;
    if (!types.has(this.lookAhead.type)) return null;
    this.currentToken = this.lookAhead;
    this.lookAhead = this.#tokens.next().value;
    return this.currentToken;
  }

  *keepEating(types: TokenTypes): Generator<Token> {
    while (this.lookAhead?.type != null && types.has(this.lookAhead.type)) {
      this.currentToken = this.lookAhead;
      this.lookAhead = this.#tokens.next().value;
      yield this.currentToken;
    }
  }

  ignore(types: TokenTypes): void {
    for (const ignoredToken of this.keepEating(types)) {
      // ignore token
    }
  }

  location(
    firstToken?: Token | null,
    lastToken?: Token | null
  ): SourceLocation {
    const start = firstToken?.start ?? { column: 0, line: 1 };
    const end = lastToken?.end ?? { column: 1, line: 1 };
    return { start, end };
  }
}
