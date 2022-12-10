import {describe, it} from "vitest";
import moo from 'moo'

describe("moo", () => {

    it("test", () => {
        const lexer = moo.compile({
            WS:      /[ \t]+/,
            comment: /\/\/.*?$/,
            number:  /0|[1-9][0-9]*/,
            string:  /"(?:\\["\\]|[^\n"\\])*"/,
            lparen:  '(',
            rparen:  ')',
            keyword: ['while', 'if', 'else', 'moo', 'cows'],
            NL:      { match: /\n/, lineBreaks: true },
        })

        lexer.reset('while test (')
        console.log(lexer.next()) // -> { type: 'keyword', value: 'while' }
        console.log(lexer.next()) // -> { type: 'WS', value: ' ' }
        console.log(lexer.next()) // -> { type: 'lparen', value: '(' }
        console.log(lexer.next()) // -> { type: 'number', value: '10' }
        console.log(lexer.next()) // -> { type: 'number', value: '10' }
        console.log(lexer.next()) // -> { type: 'number', value: '10' }
    })
})

