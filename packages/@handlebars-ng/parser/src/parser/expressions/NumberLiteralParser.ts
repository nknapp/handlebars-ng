import { ExpressionParser } from "../core/ExpressionParser";
import { tok } from "../../lexer";
import { Expression } from "@handlebars-ng/abstract-syntax-tree";
import { ParserContext } from "../ParserContext";
import { withLookAhead } from "baa-lexer";
import { LITERAL_LOOKAHEAD } from "../../lexer/rules";

const numberLiteralToken = tok("NUMBER");

export class NumberLiteralParser implements ExpressionParser {
  readonly startTokens = ["NUMBER"] as const;
  readonly tokens = ["NUMBER"] as const;
  readonly rules = {
    NUMBER: {
      match: withLookAhead(/-?\d+(?:\.\d+)?/, LITERAL_LOOKAHEAD),
    },
  };

  parse(context: ParserContext): Expression {
    const token = context.tokens.eat(numberLiteralToken);
    return {
      type: "NumberLiteral",
      original: token.original,
      value: parseFloat(token.value),
      loc: context.tokens.location(token, token),
    };
  }
}
