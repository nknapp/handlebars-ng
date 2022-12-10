import {HandlebarsLexer} from "./index";
import {describe, expect, it} from "vitest";

describe("Lexer", () => {
    it("test", () => {
        const lexer = new HandlebarsLexer("a")
        const tokens = [...lexer]
        expect(tokens).toEqual([{type: "CONTENT", start: 0, end: 1}])
    })
})