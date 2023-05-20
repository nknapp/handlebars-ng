import { TokenType, TokenTypes } from "../../model/lexer";

export function tok(...types: TokenType[]): TokenTypes {
  return {
    has: (typeToCheck) => types.includes(typeToCheck),
    [Symbol.iterator]: types[Symbol.iterator].bind(types),
  };
}
