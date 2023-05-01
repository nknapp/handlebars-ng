import { ExpressionParser } from "../core/ExpressionParser";
import { tok } from "../../lexer";
import { Expression } from "@handlebars-ng/abstract-syntax-tree";
import { ParserContext } from "../ParserContext";
import { withLookAhead } from "baa-lexer";
import { LITERAL_LOOKAHEAD } from "../../lexer/rules";

const booleanLiteralToken = tok("BOOLEAN");

export class BooleanLiteralParser implements ExpressionParser {
  readonly startTokens = ["BOOLEAN"] as const;
  readonly tokens = ["BOOLEAN"] as const;
  readonly rules = {
    BOOLEAN: {
      match: withLookAhead(/true|false/, LITERAL_LOOKAHEAD),
    },
  };

  parse(context: ParserContext): Expression {
    const token = context.tokens.eat(booleanLiteralToken);
    return {
      type: "BooleanLiteral",
      original: token.original,
      value: token.value === "true",
      loc: context.tokens.location(token, token),
    };
  }
}
