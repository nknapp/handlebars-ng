import { MatchHandler } from "./MatchHandler";
import { LexerTypings, Token } from "../types";
import { CompiledRule } from "./CompiledRule";
import { TokenFactory } from "./TokenFactory";

export class CompiledState<T extends LexerTypings> {
  name: string;
  fallbackRule: CompiledRule<T> | null;
  errorRule: CompiledRule<T> | null;
  matchHandler: MatchHandler<T>;
  tokenFactory: TokenFactory<T>;

  constructor(
    name: string,
    fallbackRule: CompiledRule<T> | null,
    errorRule: CompiledRule<T> | null,
    matchHandler: MatchHandler<T>
  ) {
    this.name = name;
    this.fallbackRule = fallbackRule;
    this.errorRule = errorRule;
    this.matchHandler = matchHandler;
    this.tokenFactory = new TokenFactory<T>();
  }

  init(tokenFactory: TokenFactory<T>): this {
    this.tokenFactory = tokenFactory;
    return this;
  }

  reset(offset: number) {
    this.matchHandler.reset(offset);
  }

  nextToken(): Token<T> {
    const match = this.matchHandler.exec(this.tokenFactory.string);
    if (match == null) {
      const nextRule =
        this.fallbackRule ?? this.errorRule ?? this.throwSyntaxError();
      return this.tokenFactory.createTokenUpTo(
        nextRule,
        this.tokenFactory.string.length
      );
    }

    if (
      this.matchHandler.offset > this.tokenFactory.offset &&
      this.fallbackRule != null
    ) {
      this.tokenFactory.pendingMatch = match;
      return this.tokenFactory.createTokenUpTo(
        this.fallbackRule,
        this.matchHandler.offset
      );
    }
    return this.tokenFactory.createTokenFromMatch(match);
  }

  throwSyntaxError(): never {
    const offset = this.tokenFactory.offset;
    const found = this.tokenFactory.string[offset];
    const expectedTypes = this.matchHandler.expectedTypesString();
    throw new Error(
      `Syntax error at 1:${offset}, expected one of ${expectedTypes} but got '${found}'`
    );
  }
}
