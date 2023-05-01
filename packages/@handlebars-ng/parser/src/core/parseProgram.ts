import { ParseContext } from "./types";
import { Program, Statement } from "@handlebars-ng/abstract-syntax-tree";

export function parseProgram(context: ParseContext): Program {
  const statements: Statement[] = [];
  const firstToken = context.tokens.lookAhead;
  while (context.tokens.lookAhead != null) {
    statements.push(context.parseStatement());
  }

  return {
    type: "Program",
    strip: {},
    body: statements,
    loc: context.tokens.location(firstToken, context.tokens.currentToken),
  };
}
