import { ParseContext } from "./types";
import { Node } from "@handlebars-ng/abstract-syntax-tree";
import { TokenType } from "../model/lexer";

export function createCombinedStatementParser<T extends Node>(
  parsers: Map<TokenType, (context: ParseContext) => T>,
): (context: ParseContext) => T {
  return (context) => {
    const lookahead = context.tokens.lookAhead;
    if (lookahead != null) {
      const parser = parsers.get(lookahead.type);
      if (parser == null) {
        throw new Error("No parser found");
      }
      return parser(context);
    }
    throw new Error("End of file");
  };
}
