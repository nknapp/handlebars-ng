import { Location } from "../types";
import { LexerTypings, Token } from "../types";
import { endLocationMultiline } from "../utils/endLocationMultiline";
import { CompiledRule } from "./CompiledRule";
import { Match } from "./MatchHandler";

export class TokenFactory<T extends LexerTypings> {
  currentLocation: Location = { line: 1, column: 0 };
  offset = 0;
  string = "";
  pendingStateUpdate: CompiledRule<T> | null = null;
  pendingMatch: Match<T> | null = null;

  reset(string: string) {
    this.currentLocation = { line: 1, column: 0 };
    this.offset = 0;
    this.string = string;
    this.pendingStateUpdate = null;
  }

  isFinished(): boolean {
    return this.offset >= this.string.length;
  }

  resolvePendingMatch(): Token<T> | null {
    if (this.pendingMatch == null) return null;
    try {
      return this.createTokenFromMatch(this.pendingMatch);
    } finally {
      this.pendingMatch = null;
    }
  }

  createToken(rule: CompiledRule<T>, original: string): Token<T> {
    const start = this.currentLocation;
    const end: Location = rule.lineBreaks
      ? endLocationMultiline(start, original)
      : { column: start.column + original.length, line: start.line };

    this.currentLocation = end;
    this.offset += original.length;
    return {
      type: rule.type,
      original,
      value: rule.value ? rule.value(original) : original,
      start,
      end,
    };
  }

  createTokenUpTo(fallback: CompiledRule<T>, endOffset: number): Token<T> {
    const original = this.string.substring(this.offset, endOffset);
    return this.createToken(fallback, original);
  }

  createTokenFromMatch(match: Match<T>): Token<T> {
    this.pendingStateUpdate = match.rule;
    return this.createToken(match.rule, match.text);
  }

  takePendingStateUpdate() {
    try {
      return this.pendingStateUpdate;
    } finally {
      this.pendingStateUpdate = null;
    }
  }
}
