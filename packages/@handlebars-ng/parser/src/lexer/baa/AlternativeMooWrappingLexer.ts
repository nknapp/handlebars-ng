import {
  ILexer,
  LexerSpec,
  LexerTypings,
  Rule,
  Token,
  TokenTypes,
} from "./types";
import moo, { Rules } from "moo";
import { ParseError } from "../../parser/ParseError";
import { isMatchRule } from "./utils/isMatchRule";

/**
 * Alternative lexer implementation: Wrapper around "moo"
 */
export class AlternativeMooWrappingLexer<T extends LexerTypings>
  implements ILexer<T>
{
  moo: moo.Lexer;
  constructor(states: LexerSpec<T>) {
    for (const stateSpec of Object.values(states)) {
      for (const rule of Object.values<Rule<T>>(
        stateSpec as Record<string, Rule<T>>
      )) {
        if (isMatchRule(rule) && rule.lookaheadMatch) {
          rule.match = new RegExp(
            rule.match.source + `(?=${rule.lookaheadMatch.source})`
          );
        }
      }
    }
    this.moo = moo.states(states as Record<string, Rules>);
  }

  *lex(string: string): Generator<Token<T>> {
    this.moo.reset(string);
    for (const mooToken of this.moo) {
      if (mooToken.type === "error") {
        throw new ParseError(
          "Parse error",
          {
            line: mooToken.line,
            column: mooToken.col - 1,
          },
          string
        );
      }
      yield this.convertToken(mooToken);
    }
  }

  convertToken(token: moo.Token): Token<T> {
    const startColumn = token.col - 1;

    const endColumn =
      token.lineBreaks === 0
        ? startColumn + token.text.length
        : token.text.length - token.text.lastIndexOf("\n") - 1;

    return {
      type: token.type as TokenTypes<T>,
      start: {
        column: startColumn,
        line: token.line,
      },
      end: {
        column: endColumn,
        line: token.line + token.lineBreaks,
      },
      value: token.value,
      original: token.text,
    };
  }
}
