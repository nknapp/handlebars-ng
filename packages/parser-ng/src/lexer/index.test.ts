import {HandlebarsLexer, Token} from "./index";

describe("Lexer", () => {
    describe("works for different templates", () => {
        function testTemplate(template: string, expectedValue: Token[]) {
            const lexer = new HandlebarsLexer(template)
            const tokens = [...lexer]
            expect(tokens).toEqual(expectedValue)
        }

        it("a single character is a content token", () => {
            testTemplate("a", [{
                type: "CONTENT",
                start: {column: 0, line: 1},
                end: {column: 1, line: 1},
                original: "a",
                value: "a"
            }]);
        })
        it("a multiple characters are one content token", () => {
            testTemplate("hello", [{
                type: "CONTENT",
                start: {column: 0, line: 1},
                end: {column: 5, line: 1},
                original: "hello",
                value: "hello"
            }]);
        })
        it("detect OPEN", () => {
            testTemplate("hello {{", [
                {
                    type: "CONTENT", start: {column: 0, line: 1}, end: {column: 6, line: 1},
                    original: "hello ",
                    value: "hello "
                },
                {
                    type: "OPEN", start: {column: 6, line: 1}, end: {column: 8, line: 1},
                    original: "{{",
                    value: "{{"
                }
            ]);
        })
        it("detect CLOSE", () => {
            testTemplate("hello {{ }}", [
                {
                    type: "CONTENT", start: {column: 0, line: 1}, end: {column: 6, line: 1},
                    original: "hello ",
                    value: "hello "
                },
                {
                    type: "OPEN", start: {column: 6, line: 1}, end: {column: 8, line: 1},
                    original: "{{",
                    value: "{{"
                },
                {
                    type: "SPACE", start: {column: 8, line: 1}, end: {column: 9, line: 1},
                    original: " ",
                    value: " "
                },
                {
                    type: "CLOSE", start: {column: 9, line: 1}, end: {column: 11, line: 1},
                    original: "}}",
                    value: "}}"
                }
            ])
        })
    })
})

