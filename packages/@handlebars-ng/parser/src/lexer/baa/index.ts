import { AlternativeMooWrappingLexer } from "./AlternativeMooWrappingLexer";
import { ConcurrentLexer } from "./ConcurrentLexer";
import { NonConcurrentLexer } from "./NonConcurrentLexer";
import { LexerSpec, LexerTypings } from "./types";

/**
 * "baa" is a replacement for https://github.com/no-context/moo, containing only the features that are required for Handlebars.
 */
export { ConcurrentLexer } from "./ConcurrentLexer";
export { NonConcurrentLexer } from "./NonConcurrentLexer";
export { AlternativeMooWrappingLexer } from "./AlternativeMooWrappingLexer";

export type { Token, LexerSpec, LexerTypings, StateSpec } from "./types";

export interface CreateLexerOptions {
  LexerImpl: typeof AlternativeMooWrappingLexer | typeof NonConcurrentLexer;
}

export function createLexer<T extends LexerTypings>(
  states: LexerSpec<T>,
  options: CreateLexerOptions
) {
  return new ConcurrentLexer(() => new options.LexerImpl(states));
}
