import {describe} from "vitest";
import {HandlebarsLexer} from "../lexer";
import {HandlebarsParser} from "./parser";
import {Program} from "../model/program";
import {SourceLocation} from "../model/node";


describe("parser", () => {
    it("parses a simple content template", () => {
        expectAst("abc", {
            type: "Program",
            loc: loc(1, 0, 1, 3),
            body: [
                {
                    type: "ContentStatement",
                    loc: loc(1, 0, 1, 3),
                    original: "abc",
                    value: "abc",
                }
            ],
            strip: {},
        });
    })

    it("parses a simple content template (different length)", () => {
        expectAst("abcde", {
            type: "Program",
            loc: loc(1, 0, 1, 5),
            body: [
                {
                    type: "ContentStatement",
                    loc: loc(1, 0, 1, 5),
                    original: "abcde",
                    value: "abcde",
                }
            ],
            strip: {},
        });
    })
})

function expectAst(template: string, expectedAst: Program) {
    const tokens = new HandlebarsLexer(template)
    const ast = new HandlebarsParser(tokens).parse()
    expect(ast).toEqual(expectedAst)
}


function loc(startLine: number, startCol: number, endLine: number, endCol: number): SourceLocation {
    return {
        start: {line: startLine, column: startCol},
        end: {line: endLine, column: endCol}
    }
}
