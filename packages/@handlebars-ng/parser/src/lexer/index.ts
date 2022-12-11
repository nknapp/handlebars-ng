import moo, {Lexer} from "moo";
import {TokenType, Token} from "./model";
import {createHandlebarsMooLexer} from "./moo-lexer";

export * from './model'


export class HandlebarsLexer {

    private readonly lexer: Lexer;

    constructor(template: string) {
        this.lexer = createHandlebarsMooLexer()
        this.lexer.reset(template)
    }

    * [Symbol.iterator](): Iterator<Token> {
        for (const token of this.lexer) {
            yield this.convertToken(token);
        }
    }

    private convertToken(token: moo.Token): Token {
        let startColumn = token.col - 1;
        return {
            type: token.type as TokenType,
            start: {
                column: startColumn,
                line: token.line,
            },
            end: {
                column: startColumn + token.text.length,
                line: token.line,
            },
            value: token.value,
            original: token.text,
        }
    }
}

