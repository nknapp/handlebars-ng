import {Program} from "./model/program";
import {HandlebarsLexer} from "./lexer";
import {HandlebarsParser} from "./parser/parser";

export function parse(template: string): Program {
    const lexer = new HandlebarsLexer(template)
    return new HandlebarsParser(lexer).parse()
}