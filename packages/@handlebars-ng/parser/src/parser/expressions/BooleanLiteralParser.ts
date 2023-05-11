import { ExpressionParser } from "../core/ExpressionParser";
import { tok } from "../../lexer";
import { Expression } from "@handlebars-ng/abstract-syntax-tree";
import { ParserContext } from "../ParserContext";
import { withLookAhead } from "baa-lexer";
import { LITERAL_LOOKAHEAD } from "../../lexer/rules";

export class BooleanLiteralParser implements ExpressionParser {
  readonly TOK_BOOLEAN = tok("BOOLEAN");
  readonly startTokens = ["BOOLEAN"] as const;
  readonly tokens = ["BOOLEAN"] as const;
  readonly rules = {
    BOOLEAN: {
      match: withLookAhead(/true|false/, LITERAL_LOOKAHEAD),
    },
  };

  parse(context: ParserContext): Expression {
    const token = context.tokens.eat(this.TOK_BOOLEAN);
    return {
      type: "BooleanLiteral",
      original: token.original,
      value: token.value === "true",
      loc: context.tokens.location(token, token),
    };
  }
}
