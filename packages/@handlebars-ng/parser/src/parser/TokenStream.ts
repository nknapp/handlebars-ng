import { Token, TokenType } from "../lexer";
import { SourceLocation } from "../model/ast";

export class TokenStream {
  private tokens: Iterator<Token>;

  lookAhead: Token | null;
  currentToken: Token | null = null;

  constructor(tokens: Iterator<Token>) {
    this.tokens = tokens;
    this.lookAhead = this.tokens.next().value ?? null;
  }

  eat(type: TokenType): Token {
    if (this.lookAhead == null)
      throw new Error(`Expected '${type}', but received end of file.`);
    this.currentToken = this.lookAhead;
    if (this.currentToken.type !== type)
      throw new Error(
        `Expected '${type}', but received '${this.currentToken}'`
      );
    this.lookAhead = this.tokens.next().value;
    return this.currentToken;
  }

  eatOptional(type: TokenType): Token | null {
    if (this.lookAhead == null) return null;
    if (this.lookAhead.type !== type) return null;
    this.currentToken = this.lookAhead;
    this.lookAhead = this.tokens.next().value;
    return this.currentToken;
  }

  *keepEating(...types: TokenType[]): Generator<Token> {
    while (
      this.lookAhead?.type != null &&
      types.includes(this.lookAhead.type)
    ) {
      this.currentToken = this.lookAhead;
      this.lookAhead = this.tokens.next().value;
      yield this.currentToken;
    }
  }

  ignore(...types: TokenType[]): void {
    for (const ignoredToken of this.keepEating(...types)) {
      // ignore token
    }
  }

  loc(firstToken?: Token | null, lastToken?: Token | null): SourceLocation {
    const start = firstToken?.start ?? { column: 0, line: 1 };
    const end = lastToken?.end ?? { column: 1, line: 1 };
    return { start, end };
  }
}
