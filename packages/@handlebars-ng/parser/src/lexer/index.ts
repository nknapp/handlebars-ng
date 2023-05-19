import { HbsLexerTypes, TokenType } from "./rules";
import { BaaToken, Lexer } from "baa-lexer";

export type { Location } from "baa-lexer";
export type { TokenType, MustacheOpenType, MustacheCloseType } from "./rules";
export type Token = BaaToken<HbsLexerTypes>;
export type HbsLexer = Lexer<HbsLexerTypes>;

export interface TokenTypes extends Iterable<TokenType> {
  has(token: TokenType): boolean;
}

export function tok(...types: TokenType[]): TokenTypes {
  return {
    has: (typeToCheck) => types.includes(typeToCheck),
    [Symbol.iterator]: types[Symbol.iterator].bind(types),
  };
}
