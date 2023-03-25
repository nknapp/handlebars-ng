import {
  AlternativeMooWrappingLexer,
  ConcurrentLexer,
  NonConcurrentLexer,
} from "./baa";
import { createHbsLexerSpec } from "./rules";

export function createHbsLexer(impl: "moo" | "hbs" = "moo") {
  return new ConcurrentLexer(
    impl === "moo"
      ? () => new AlternativeMooWrappingLexer(createHbsLexerSpec())
      : () => new NonConcurrentLexer(createHbsLexerSpec())
  );
}
