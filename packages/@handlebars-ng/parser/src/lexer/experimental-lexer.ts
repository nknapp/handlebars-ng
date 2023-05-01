import {
  createLexer,
  createStateProcessor,
  createTokenFactory,
  Lexer,
  MooState,
  mooState,
} from "baa-lexer";
import { createHbsLexerSpec, HbsLexerTypes } from "./rules";
import { ExperimentalMainMatcher } from "./ExperimentalMainMatcher";

export function createExperimentalLexer(
  expressionRules: MooState<HbsLexerTypes>
): Lexer<HbsLexerTypes> {
  const rules = createHbsLexerSpec(expressionRules);
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
