import { TokenType, TokenTypes } from "../../model/lexer";

export class Parsers<Parser> {
  parsers: Map<TokenType, Parser> = new Map();

  addParser(startToken: TokenTypes, parser: Parser): void {
    for (const token of startToken) {
      this.parsers.set(token, parser);
    }
  }
}
