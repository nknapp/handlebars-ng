import { ExpressionParser } from "../core/ExpressionParser";
import { tok } from "../../lexer";
import { BooleanLiteral } from "@handlebars-ng/abstract-syntax-tree";
import { ParserContext } from "../ParserContext";
import { withLookAhead } from "baa-lexer";
import { LITERAL_LOOKAHEAD } from "../../lexer/rules";

const TOK_BOOLEAN = tok("BOOLEAN");

export const BooleanLiteralParser: ExpressionParser<BooleanLiteral> = {
  startTokens: TOK_BOOLEAN,
  rules: [
    { type: "BOOLEAN", match: withLookAhead(/true|false/, LITERAL_LOOKAHEAD) },
  ],
  parse(context: ParserContext): BooleanLiteral {
    const token = context.tokens.eat(TOK_BOOLEAN);
    return {
      type: "BooleanLiteral",
      original: token.original,
      value: token.value === "true",
      loc: context.tokens.location(token, token),
    };
  },
};
