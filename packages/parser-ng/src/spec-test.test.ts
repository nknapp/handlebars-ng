
import {testCases} from "specification";
import {HandlebarsParser} from "./parser/parser";
import {HandlebarsLexer} from "./lexer";
import {describe, expect, it} from "vitest";

describe("specification tests", () => {
    for (const testCase of testCases) {
        describe(testCase.filename, () => {
            it(testCase.description, () => {
                const parser = new HandlebarsParser(new HandlebarsLexer(testCase.template))
                expect(parser.parse()).toEqual(testCase.ast)
            })
        })
    }
})