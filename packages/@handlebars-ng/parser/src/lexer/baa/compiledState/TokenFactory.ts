import { Location } from "../types";
import { LexerTypings, Token } from "../types";
import { endLocationMultiline } from "../utils/endLocationMultiline";
import { CompiledRule } from "./CompiledRule";

export class TokenFactory<T extends LexerTypings> {
  currentLocation: Location = { line: 1, column: 0 };

  reset() {
    this.currentLocation = { line: 1, column: 0 };
  }

  createToken(rule: CompiledRule<T>, original: string): Token<T> {
    const start = this.currentLocation;
    const end: Location = rule.lineBreaks
      ? endLocationMultiline(start, original)
      : { column: start.column + original.length, line: start.line };

    this.currentLocation = end;
    return {
      type: rule.type,
      original,
      value: rule.value ? rule.value(original) : original,
      start,
      end,
    };
  }
}
