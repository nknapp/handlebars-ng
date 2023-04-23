import {
  createLexer,
  createStateProcessor,
  createTokenFactory,
  Lexer,
  mooState,
} from "baa-lexer";
import { createHbsLexerSpec, HbsLexerTypes } from "./rules";
import { ExperimentalMainMatcher } from "./ExperimentalMainMatcher";

export function createExperimentalLexer(): Lexer<HbsLexerTypes> {
  const rules = createHbsLexerSpec();
  return createLexer<HbsLexerTypes>(
    {
      main: createStateProcessor(
        ["OPEN", "OPEN_UNESCAPED", "CONTENT", "ESCAPED_MUSTACHE"],
        new ExperimentalMainMatcher(),
        { type: "CONTENT", lineBreaks: true },
        null
      ),
      mustache: mooState(rules.mustache),
      unescapedMustache: mooState(rules.unescapedMustache),
    },
    createTokenFactory
  );
}
