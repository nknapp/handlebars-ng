import { LexerTypings, States, TokenTypes } from "../types";

export interface CompiledRule<T extends LexerTypings> {
  type: TokenTypes<T>;
  value?: (original: string) => string;
  push?: States<T>;
  pop?: 1;
  next?: States<T>;
  lineBreaks: boolean;
}
