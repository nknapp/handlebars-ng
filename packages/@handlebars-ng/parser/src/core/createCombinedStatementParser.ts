import { ParseContext, StatementParser } from "./types";
import { Statement } from "@handlebars-ng/abstract-syntax-tree";
import { TokenType } from "baa-lexer";
import { HbsLexerTypes } from "../model/lexer";

export function createCombinedStatementParser(
  parsers: Map<TokenType<HbsLexerTypes>, StatementParser>
): StatementParser {
  return (context: ParseContext): Statement => {
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
