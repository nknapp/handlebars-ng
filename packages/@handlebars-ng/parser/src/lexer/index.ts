import { createHbsLexerSpec, HbsLexerTypes, TokenType } from "./rules";
import {
  BaaToken,
  createLexer,
  createTokenFactory,
  Lexer,
  mooState,
} from "baa-lexer";

export type { Location } from "baa-lexer";
export type { TokenType, MustacheOpenType, MustacheCloseType } from "./rules";
export type Token = BaaToken<HbsLexerTypes>;
export type HbsLexer = Lexer<HbsLexerTypes>;

export function createHbsLexer(): HbsLexer {
  const rules = createHbsLexerSpec();
  return createLexer<HbsLexerTypes>(
    {
      main: mooState(rules.main),
      mustache: mooState(rules.mustache),
      unescapedMustache: mooState(rules.unescapedMustache),
    },
    createTokenFactory
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
