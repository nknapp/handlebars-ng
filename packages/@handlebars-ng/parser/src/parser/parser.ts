import {ContentStatement, MustacheStatement, PathExpression, Program, SourceLocation, Statement} from "../model/ast";
import {MustacheCloseType, MustacheOpenType, Token, TokenType} from "../lexer";


export class HandlebarsParser {

    private tokens: Iterator<Token>;
    private lookAhead: IteratorResult<Token>
    private currentToken: Token | null = null

    constructor(tokens: Iterable<Token>) {
        this.tokens = tokens[Symbol.iterator]()
        this.lookAhead = this.tokens.next()
    }

    parse(): Program {
        const body: Statement[] = [];
        const firstToken = this.lookAhead.value
        while (!this.lookAhead.done) {
            let statement = this.parseStatement();
            body.push(statement)
        }

        return {
            type: "Program",
            strip: {},
            body,
            loc: this.loc(firstToken, this.currentToken)
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
            loc: this.loc(token, token),
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
            strip: {close: false, open: false},
            loc: this.loc(open, close)
        }

    }

    private pathExpression(): PathExpression {
        const token = this.eat("ID")
        return {
            type: "PathExpression",
            original: token.value,
            loc: {start: token.start, end: token.end},
            depth: 0,
            data: false,
            parts: [token.value]
        }
    }

    eat(type: TokenType): Token {
        if (this.lookAhead.done == null) throw new Error(`Expected '${type}', but received end of file.`)
        const currentToken = this.lookAhead.value;
        if (currentToken.type !== type) throw new Error(`Expected '${type}', but received '${currentToken}'`)
        this.lookAhead = this.tokens.next()
        this.currentToken = currentToken
        return currentToken
    }

    ignore(type: TokenType): void {
        while (!this.lookAhead.done && this.lookAhead.value.type === type) {
            this.lookAhead = this.tokens.next()
        }
    }

    loc(firstToken?: Token |null , lastToken?: Token | null): SourceLocation {
        let start = firstToken?.start ?? {column: 0, line: 1};
        let end = lastToken?.end ?? {column: 1, line: 1};
        return {start, end,}
    }
}

