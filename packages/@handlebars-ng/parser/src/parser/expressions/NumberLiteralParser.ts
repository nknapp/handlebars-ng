import { ExpressionParser } from "../core/ExpressionParser";
import { tok } from "../../lexer";
import { NumberLiteral } from "@handlebars-ng/abstract-syntax-tree";
import { ParserContext } from "../ParserContext";
import { withLookAhead } from "baa-lexer";
import { LITERAL_LOOKAHEAD } from "../../lexer/rules";

const TOK_NUMBER = tok("NUMBER");

export const NumberLiteralParser: ExpressionParser<NumberLiteral> = {
  rules: [
    {
      type: "NUMBER",
      match: withLookAhead(/-?\d+(?:\.\d+)?/, LITERAL_LOOKAHEAD),
    },
  ],
  startTokens: TOK_NUMBER,
  parse(context: ParserContext): NumberLiteral {
    const token = context.tokens.eat(TOK_NUMBER);
    return {
      type: "NumberLiteral",
      original: token.original,
      value: parseFloat(token.value),
      loc: context.tokens.location(token, token),
    };
  },
};
