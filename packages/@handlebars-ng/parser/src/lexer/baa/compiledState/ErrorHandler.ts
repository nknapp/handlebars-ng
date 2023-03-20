import {
  ErrorRule,
  LexerTypings,
  TokenTypes,
  TokenWithoutLocation,
} from "../types";

export interface ErrorHandler<T extends LexerTypings> {
  createErrorToken(string: string, offset: number): TokenWithoutLocation<T>;
}

export class TokenErrorHandler<T extends LexerTypings>
  implements ErrorHandler<T>
{
  #rule: ErrorRule;
  #type: TokenTypes<T>;

  constructor(type: TokenTypes<T>, rule: ErrorRule) {
    this.#type = type;
    this.#rule = rule;
  }

  createErrorToken(string: string, offset: number): TokenWithoutLocation<T> {
    const original = string.substring(offset);
    return {
      type: this.#type,
      value: original,
      original,
    };
  }
}

export class ThrowingErrorHandler<T extends LexerTypings>
  implements ErrorHandler<T>
{
  #expectedTypes: TokenTypes<T>[];

  constructor(expectedTypes: TokenTypes<T>[]) {
    this.#expectedTypes = expectedTypes;
  }

  createErrorToken(string: string, offset: number): TokenWithoutLocation<T> {
    const expectedTypes = this.#expectedTypes.map((t) => `\`${t}\``).join(", ");
    throw new Error(
      `Syntax error at 1:${offset}, expected one of ${expectedTypes} but got '${string[offset]}'`
    );
  }
}
