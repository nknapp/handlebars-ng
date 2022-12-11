import {describe} from "vitest";
import {HandlebarsLexer} from "../lexer";
import {HandlebarsParser} from "./parser";
import {Program} from "../model/program";


describe("parser", () => {
    it("parses a simple content template", () => {
        const tokens = new HandlebarsLexer("abc")
        const ast = new HandlebarsParser(tokens).parse()
        expect<Program>(ast).toEqual({})
    })

})
