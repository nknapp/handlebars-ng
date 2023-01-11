import { Program } from "../model/ast";
import { Token } from "../lexer";
import { pathExpression } from "./nodes/pathExpression";
import { contentStatement } from "./nodes/contentStatement";
import { statement } from "./nodes/statement";
import { mustacheStatement } from "./nodes/mustacheStatement";
import { program } from "./nodes/program";
import { TokenStream } from "./TokenStream";

export class HandlebarsParser {
  parse(tokens: Iterable<Token>): Program {
    const context = {
      tokens: new TokenStream(tokens[Symbol.iterator]()),
      program: program,
      statement: statement,
      mustache: mustacheStatement(new Set(["OPEN"]), new Set(["CLOSE"]), true),
      tripleMustache: mustacheStatement(
        new Set(["OPEN_UNESCAPED"]),
        new Set(["CLOSE_UNESCAPED"]),
        false
      ),
      content: contentStatement,
      pathExpression: pathExpression,
    };
    return context.program(context);
  }
}
