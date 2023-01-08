import moo, { Lexer } from "moo";
import { TokenType, Token } from "./model";
import { createHandlebarsMooLexer } from "./moo-lexer";

export * from "./model";

const availableMooLexers: Lexer[] = [];

export class HandlebarsLexer {
  lexer: Lexer;
  template: string;

  constructor(template: string) {
    this.template = template;
    this.lexer = availableMooLexers.shift() ?? createHandlebarsMooLexer();
    this.lexer.reset(template);
  }

  *[Symbol.iterator](): Iterator<Token> {
    for (const token of this.lexer) {
      yield this.convertToken(token);
    }
    availableMooLexers.push(this.lexer);
  }

  private convertToken(token: moo.Token): Token {
    const startColumn = token.col - 1;

    const endColumn =
      token.lineBreaks === 0
        ? startColumn + token.text.length
        : token.text.length - token.text.lastIndexOf("\n") - 1;

    return {
      type: token.type as TokenType,
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
