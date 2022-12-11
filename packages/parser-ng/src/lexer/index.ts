import moo, {Lexer} from "moo";

export type TokenType = "CONTENT" | "OPEN" | "CLOSE"

export type Location = {
    column: number;
    line: number;
}

export interface Token {
    type: TokenType;
    start: Location;
    end: Location;
    value: string
    original: string
}


export class HandlebarsLexer {

    private readonly lexer: Lexer;

    constructor(template: string) {
        this.lexer = moo.compile({
            OPEN: /{{/,
            CLOSE: /}}/,
            CONTENT: {fallback: true}
        })
        this.lexer.reset(template)
    }

    *[Symbol.iterator](): Iterator<Token> {
        for (const token of this.lexer) {
            let startColumn = token.col - 1;
            yield {
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
}

