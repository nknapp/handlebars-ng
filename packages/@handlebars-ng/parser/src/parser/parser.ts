import {ContentStatement, MustacheStatement, PathExpression, Program, Statement} from "../model/program";
import {MustacheCloseType, MustacheOpenType, Token, TokenType} from "../lexer";
import {Position} from "../model/node";


export class HandlebarsParser {

    private tokens: Iterator<Token>;
    private lookAhead: IteratorResult<Token>

    constructor(tokens: Iterable<Token>) {
        this.tokens = tokens[Symbol.iterator]()
        this.lookAhead = this.tokens.next()
    }

    parse(): Program {
        const body: Statement[] = [];
        let lastStatement: Statement | null = null
        while (!this.lookAhead.done) {
            let statement = this.parseStatement();
            body.push(statement)
            lastStatement = statement
        }
        const end: Position = lastStatement == null ? {column: 1, line: 1} : lastStatement.loc.end

        return {
            type: "Program",
            loc: {
                start: {line: 1, column: 0},
                end,
            },
            strip: {},
            body,
        }
    }


    parseStatement(): Statement {
        switch (this.lookAhead.value.type) {
            case "CONTENT":
                return this.contentStatement()
            case "OPEN":
                return this.mustacheStatement("OPEN", "CLOSE", true)
            case "OPEN_UNESCAPED":
                return this.mustacheStatement("OPEN_UNESCAPED", "CLOSE_UNESCAPED", false)
        }
        throw new Error(`Unknown token: '${this.lookAhead.value.type}'`)
    }

    contentStatement(): ContentStatement {
        const token = this.eat("CONTENT")
        return {
            type: "ContentStatement",
            original: token.value,
            loc: {
                start: {
                    line: token.start.line,
                    column: token.start.column
                },
                end: {
                    line: token.end.line,
                    column: token.end.column
                },
            },
            value: token.value,
        }
    }

    private mustacheStatement(openToken: MustacheOpenType, closeToken: MustacheCloseType, escaped: boolean): MustacheStatement {
        const open = this.eat(openToken)
        this.ignore("SPACE")
        const path = this.pathExpression()
        this.ignore("SPACE")
        const close = this.eat(closeToken)

        return {
            type: "MustacheStatement",
            path,
            escaped,
            params: [],
            strip: { close: false, open: false},
            loc: {
                start: {
                    line: open.start.line,
                    column: open.start.column
                },
                end: {
                    line: close.end.line,
                    column: close.end.column
                },
            }
        }

    }

    private pathExpression(): PathExpression {
        const token = this.eat("ID")
        return {
            type: "PathExpression",
            original: token.value,
            loc: { start: token.start, end: token.end},
            depth: 0,
            data: false,
            parts: [ token.value ]
        }
    }

    private eat(type: TokenType): Token {
        if (this.lookAhead.done == null) throw new Error(`Expected '${type}', but received end of file.`)
        const nextToken = this.lookAhead.value;
        if (nextToken.type !== type) throw new Error(`Expected '${type}', but received '${nextToken}'`)
        this.lookAhead = this.tokens.next()
        return nextToken
    }

    private ignore(type: TokenType): void {
        while (!this.lookAhead.done && this.lookAhead.value.type === type) {
            this.lookAhead = this.tokens.next()
        }
    }
}

