import { Program } from "../model/ast";
import { Token } from "../lexer";
import { ParserContext } from "./ParserContext";
import { pathExpression } from "./nodes/pathExpression";
import { contentStatement } from "./nodes/contentStatement";
import { statement } from "./nodes/statement";
import { mustacheStatement } from "./nodes/mustacheStatement";
import { program } from "./nodes/program";
import { TokenStream } from "./TokenStream";

export class HandlebarsParser {
  private readonly tokens: TokenStream;
  private readonly context: ParserContext;

  constructor(tokens: Iterable<Token>) {
    this.tokens = new TokenStream(tokens[Symbol.iterator]());
    this.context = {
      tokens: this.tokens,
      program: program,
      statement: statement,
      mustache: mustacheStatement("OPEN", "CLOSE", true),
      tripleMustache: mustacheStatement(
        "OPEN_UNESCAPED",
        "CLOSE_UNESCAPED",
        false
      ),
      content: contentStatement,
      pathExpression: pathExpression,
    };
  }

  parse(): Program {
    return this.context.program(this.context);
  }
}
