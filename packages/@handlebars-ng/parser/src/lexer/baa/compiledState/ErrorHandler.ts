import { ErrorRule, LexerTypings, Token, TokenTypes } from "../types";
import { TokenFactory } from "./TokenFactory";

export interface ErrorHandler<T extends LexerTypings> {
  createErrorToken(string: string, offset: number): Token<T>;
}

export class TokenErrorHandler<T extends LexerTypings>
  implements ErrorHandler<T>
{
  #rule: ErrorRule;
  #type: TokenTypes<T>;
  #tokenFactory: TokenFactory<T>;

  constructor(
    type: TokenTypes<T>,
    rule: ErrorRule,
    tokenFactory: TokenFactory<T>
  ) {
    this.#type = type;
    this.#rule = rule;
    this.#tokenFactory = tokenFactory;
  }

  createErrorToken(string: string, offset: number): Token<T> {
    const original = string.substring(offset);
    return this.#tokenFactory.createToken(this.#type, original, original);
  }
}

export class ThrowingErrorHandler<T extends LexerTypings>
  implements ErrorHandler<T>
{
  #expectedTypes: TokenTypes<T>[];

  constructor(expectedTypes: TokenTypes<T>[]) {
    this.#expectedTypes = expectedTypes;
  }

  createErrorToken(string: string, offset: number): Token<T> {
    const expectedTypes = this.#expectedTypes.map((t) => `\`${t}\``).join(", ");
    throw new Error(
      `Syntax error at 1:${offset}, expected one of ${expectedTypes} but got '${string[offset]}'`
    );
  }
}
