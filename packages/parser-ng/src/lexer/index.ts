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

export interface TokenStream extends Iterable<Token> {
    readonly currentToken: Token
}

export class HandlebarsLexer implements TokenStream {

    private lexer: Lexer;

    private current: Token | null = null

    constructor(template: string) {
        this.lexer = moo.compile({
            OPEN: /{{/,
            CLOSE: /}}/,
            CONTENT: {fallback: true}
        })
        this.lexer.reset(template)
    }

    get currentToken() {
        if (this.current == null) throw new Error("Lexing has not started yet")
        return this.current
    }

    [Symbol.iterator](): Iterator<Token> {
        return {
            next: (): IteratorResult<Token, undefined> => {
                const next = this.lexer.next()
                if (next != null) {
                    this.current = {
                        type: next.type as TokenType,
                        location: {
                            col: next.col,
                            row: next.line,
                        },
                        value: next.value,
                    };
                    return {
                        done: false,
                        value: this.current
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

