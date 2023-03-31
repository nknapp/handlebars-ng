import {
  AlternativeMooWrappingLexer,
  ConcurrentLexer,
  NonConcurrentLexer,
  Token as BaaToken,
} from "./baa";

import { createHbsLexerSpec, HbsLexerTypes, TokenType } from "./rules";

export type { Location } from "./baa";
export type { TokenType, MustacheOpenType, MustacheCloseType } from "./rules";
export type Token = BaaToken<HbsLexerTypes>;

export function createHbsLexer(impl: "moo" | "baa" = "baa") {
  return new ConcurrentLexer(
    impl === "moo"
      ? () => new AlternativeMooWrappingLexer(createHbsLexerSpec())
      : () => new NonConcurrentLexer(createHbsLexerSpec())
  );
}

export interface TokenTypes extends Iterable<TokenType> {
  has(token: TokenType): boolean;
}

export function tok(...types: TokenType[]): TokenTypes {
  return {
    has: (typeToCheck) => types.includes(typeToCheck),
    [Symbol.iterator]: types[Symbol.iterator],
  };
}
