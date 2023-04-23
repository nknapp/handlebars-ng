import { BaaRule, Match, Matcher } from "baa-lexer";
import { HbsLexerTypes } from "./rules";

const RULE_OPEN: BaaRule<HbsLexerTypes> = {
  type: "OPEN",
  next: "mustache",
} as const;

const RULE_OPEN_UNESCAPED: BaaRule<HbsLexerTypes> = {
  type: "OPEN_UNESCAPED",
  next: "unescapedMustache",
} as const;

const RULE_ESCAPED_MUSTACHE: BaaRule<HbsLexerTypes> = {
  type: "ESCAPED_MUSTACHE",
  value: () => "{{",
} as const;

const CURLY = "{".charCodeAt(0);

export class ExperimentalMainMatcher implements Matcher<HbsLexerTypes> {
  match(string: string, offset: number): Match<HbsLexerTypes> | null {
    const index = string.indexOf("{{", offset);
    if (index === -1) return null;
    if (string.charAt(index - 1) === "\\") {
      return {
        rule: RULE_ESCAPED_MUSTACHE,
        text: "\\{{",
        offset: index - 1,
      };
    }
    switch (string.charCodeAt(index + 2)) {
      case CURLY:
        return {
          rule: RULE_OPEN_UNESCAPED,
          text: "{{{",
          offset: index,
        };
      default: {
        return {
          rule: RULE_OPEN,
          offset: index,
          text: "{{",
        };
      }
    }
  }
}
