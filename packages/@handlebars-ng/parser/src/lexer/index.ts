import moo, { Lexer } from "moo";
import { TokenType, Token } from "./model";
import { createHandlebarsMooLexer } from "./moo-lexer";

export * from "./model";

export class HandlebarsLexer {
  private readonly lexer: Lexer;

  constructor(template: string) {
    this.lexer = createHandlebarsMooLexer();
    this.lexer.reset(template);
  }

  *[Symbol.iterator](): Iterator<Token> {
    for (const token of this.lexer) {
      yield this.convertToken(token);
    }
  }

  private convertToken(token: moo.Token): Token {
    const startColumn = token.col - 1;
    return {
      type: token.type as TokenType,
      start: {
        column: startColumn,
        line: token.line,
      },
      get end() {
        if (token.lineBreaks === 0) {
          return {
            column: startColumn + token.text.length,
            line: token.line,
          };
        } else {
          return {
            column: token.text.length - token.text.lastIndexOf("\n") - 1,
            line: token.line + token.lineBreaks,
          };
        }
      },
      value: token.value,
      original: token.text,
    };
  }
}
