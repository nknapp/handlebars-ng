import { HandlebarsParserPlugin, Parser } from "../../core/types";
import { BooleanLiteral } from "@handlebars-ng/abstract-syntax-tree";
import { tok } from "../../core/utils/tok";
import { withLookAhead } from "baa-lexer";
import { LITERAL_LOOKAHEAD } from "../../common/lexer";

const TOK_BOOLEAN = tok("BOOLEAN");

export const BooleanLiteralPlugin: HandlebarsParserPlugin = {
  expression({ lexerRules, addParser }) {
    lexerRules.add({
      type: "BOOLEAN",
      match: withLookAhead(/true|false/, LITERAL_LOOKAHEAD),
    });
    addParser(TOK_BOOLEAN, booleanLiteralParser);
  },
};

const booleanLiteralParser: Parser<BooleanLiteral> = (context) => {
  const token = context.tokens.eat(TOK_BOOLEAN);
  return {
    type: "BooleanLiteral",
    original: token.original,
    value: token.value === "true",
    loc: context.tokens.location(token, token),
  };
};
