import moo, {Lexer} from "moo";

export type TokenType = "CONTENT" | "OPEN" | "CLOSE"

export type Location = {
    col: number;
    row: number;
}

export interface Token {
    type: TokenType;
    location: Location;
    value: string
}


export class HandlebarsLexer {

    private lexer: Lexer;


    constructor(template: string) {
        this.lexer = moo.compile({
            OPEN: /{{/,
            CLOSE: /}}/,
            CONTENT: {fallback: true}
        })
        this.lexer.reset(template)
    }

    [Symbol.iterator](): Iterator<Token> {
        return {
            next: (): IteratorResult<Token, undefined> => {
                const next = this.lexer.next()
                if (next != null) {
                    return {
                        done: false,
                        value: {
                            type: next.type as TokenType,
                            location: {
                                col: next.col,
                                row: next.line,
                            },
                            value: next.value,
                        }
                    }
                }
                return {
                    value: undefined,
                    done: true
                }
            }
        }
    }
}

