import { LexerTypings, TokenTypes } from "../types";
import { CompiledState } from "../compiledState/CompiledState";
import { CompiledRule } from "../compiledState/CompiledRule";
import { MatchHandler } from "../compiledState/MatchHandler";

export interface BuilderFallbackRule<T extends LexerTypings> {
  type: TokenTypes<T>;
  lineBreaks?: boolean;
}

export interface RegexStateInit<T extends LexerTypings> {
  fallback: BuilderFallbackRule<T>;
}

export function regexState<T extends LexerTypings>(
  name: string,
  { fallback }: RegexStateInit<T>
): CompiledState<T> {
  const fallbackRule: CompiledRule<T> = {
    type: fallback.type,
    lineBreaks: fallback.lineBreaks ?? false,
  };
  // TODO: build this, with tests
  return new CompiledState<T>(
    name,
    fallbackRule,
    null,
    new MatchHandler([], false)
  );
}
