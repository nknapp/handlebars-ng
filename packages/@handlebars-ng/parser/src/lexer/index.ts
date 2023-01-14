import moo, { Lexer } from "moo";
import { TokenType, Token } from "./model";
import { createHandlebarsMooLexer } from "./moo-lexer";

export * from "./model";

const availableMooLexers: Lexer[] = [];

export function* createLexer(template: string): Generator<Token> {
  const mooLexer = availableMooLexers.shift() ?? createHandlebarsMooLexer();
  mooLexer.reset(template);
  for (const mooToken of mooLexer) {
    yield convertToken(mooToken);
  }
  availableMooLexers.push(mooLexer);
}

function convertToken(token: moo.Token): Token {
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
