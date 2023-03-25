import { Location } from "../../model";
import { LexerTypings, Token, TokenTypes } from "../types";
import { endLocationMultiline } from "../utils/endLocationMultiline";

export class TokenFactory<T extends LexerTypings> {
  currentLocation: Location = { line: 1, column: 0 };

  reset() {
    this.currentLocation = { line: 1, column: 0 };
  }

  createToken(type: TokenTypes<T>, original: string, value: string): Token<T> {
    const start = this.currentLocation;
    const end = endLocationMultiline(start, original);
    this.currentLocation = end;
    return {
      type,
      original,
      value,
      start,
      end,
    };
  }
}
