import { ErrorRule, Token } from "../types";

export interface ErrorHandler<Types extends string> {
  createErrorToken(string: string, offset: number): Token<Types>;
}

export class TokenErrorHandler<Types extends string>
  implements ErrorHandler<Types>
{
  #rule: ErrorRule;
  #type: Types;

  constructor(type: Types, rule: ErrorRule) {
    this.#type = type;
    this.#rule = rule;
  }

  createErrorToken(string: string, offset: number): Token<Types> {
    const original = string.substring(offset);
    return {
      type: this.#type,
      value: original,
      original,
      start: { line: 1, column: offset },
      end: { line: 1, column: string.length },
    };
  }
}

export class ThrowingErrorHandler<Types extends string>
  implements ErrorHandler<Types>
{
  #expectedTypes: Types[];

  constructor(expectedTypes: Types[]) {
    this.#expectedTypes = expectedTypes;
  }

  createErrorToken(string: string, offset: number): Token<Types> {
    const expectedTypes = this.#expectedTypes.map((t) => `\`${t}\``).join(", ");
    throw new Error(
      `Syntax error at 1:${offset}, expected one of ${expectedTypes} but got '${string[offset]}'`
    );
  }
}
