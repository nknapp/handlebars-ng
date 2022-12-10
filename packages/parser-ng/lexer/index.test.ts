import {HandlebarsLexer, Token} from "./index";
import {describe, expect, it} from "vitest";

describe("Lexer", () => {
    it("a single character is a content token", () => {
        testTemplate("a", [{type: "CONTENT", location: {col: 1, row: 1}, value: "a"}]);
    })
    it("a multiple characters are one content token", () => {
        testTemplate("hello", [{type: "CONTENT", location: {col: 1, row: 1}, value: "hello"}]);
    })
    it("detect OPEN", () => {
        testTemplate("hello {{", [
            {type: "CONTENT", location: {col: 1, row: 1}, value: "hello "},
            {type: "OPEN", location: {col: 7, row: 1}, value: "{{"}
        ]);
    })
    it("detect CLOSE", () => {
        testTemplate("hello }}", [
            {type: "CONTENT", location: {col: 1, row: 1}, value: "hello "},
            {type: "CLOSE", location: {col: 7, row: 1}, value: "}}"}
        ]);
    })
})

function testTemplate(template: string, expectedValue: Token[]) {
    const lexer = new HandlebarsLexer(template)
    const tokens = [...lexer]
    expect(tokens).toEqual(expectedValue)
}
