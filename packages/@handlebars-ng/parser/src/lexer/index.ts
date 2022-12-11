import moo, {Lexer} from "moo";

export type MustacheOpenType = "OPEN_UNESCAPED" | "OPEN"
export type MustacheCloseType = "CLOSE_UNESCAPED" | "CLOSE"
export type TokenType = "CONTENT" | "SPACE" | "ID" | MustacheOpenType | MustacheCloseType

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
        this.lexer = moo.states({
            main: {
                OPEN_UNESCAPED: {match: /{{{/, push: 'unescapedMustache'},
                OPEN: {match: /{{/, push: 'mustache'},
                CONTENT: {fallback: true}
            },
            mustache: {
                CLOSE: {
                    match: /}}/, pop: 1,
                },
                SPACE: / +/,
                ID: /\w+/
            },
            unescapedMustache: {
                CLOSE_UNESCAPED: {
                    match: /}}}/, pop: 1,
                },
                SPACE: / +/,
                ID: /\w+/
            }
        })
        this.lexer.reset(template)
    }

    * [Symbol.iterator]()
        :
        Iterator<Token> {
        for (const token of this.lexer
            ) {
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

