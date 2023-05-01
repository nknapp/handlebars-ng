import { HandlebarsParserPlugin, Parser } from "../../core/types";
import { BooleanLiteral } from "@handlebars-ng/abstract-syntax-tree";
import { tok } from "../../core/utils/tok";

const TOK_BOOLEAN = tok("BOOLEAN");

export const BooleanLiteralPlugin: HandlebarsParserPlugin = {
  expression({ lexerRules, addParser }) {
    lexerRules.add({ type: "BOOLEAN", match: /true|false/ });
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
