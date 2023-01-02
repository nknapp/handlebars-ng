import { Program } from "./model/ast";
import { HandlebarsLexer } from "./lexer";
import { HandlebarsParser } from "./parser/HandlebarsParser";

const parser = new HandlebarsParser();

export function parse(template: string): Program {
  const lexer = new HandlebarsLexer(template);
  return parser.parse(lexer);
}
