import {ContentStatement, Program, Statement} from "../model/program";
import {Token, TokenType} from "../lexer";
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
        }
        throw new Error("Unexpected token" + this.lookAhead.value.type)
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

    private eat(type: TokenType): Token {
        if (this.lookAhead.done == null) throw new Error(`Expected '${type}', but received end of file.`)
        const nextToken = this.lookAhead.value;
        if (nextToken.type !== type) throw new Error(`Expected '${type}', but received '${nextToken}'`)
        this.lookAhead = this.tokens.next()
        return nextToken
    }
}

