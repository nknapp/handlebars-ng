export type TokenType = "CONTENT" | "OPEN" | "CLOSE"

export interface Token {
    type: TokenType;
    start: number;
    end: number;
}

export class HandlebarsLexer {

    private position = 0;
    private template: string;


    constructor(template: string) {
        this.template = template;
    }

    [Symbol.iterator](): Iterator<Token> {
        return {
            next: (): IteratorResult<Token, undefined> => {
                if (this.position < this.template.length) {
                    try {
                        return {
                            value: {
                                type: "CONTENT",
                                start: this.position,
                                end: this.position+1
                            }
                        }
                    } finally {
                        this.position++
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
