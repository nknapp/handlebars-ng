import { StringLiteral } from "@handlebars-ng/abstract-syntax-tree";
import { HandlebarsParserPlugin, Parser } from "../../core/types";
import { tok } from "../../core/utils/tok";

const TOK_STRING_LITERAL = tok(
  "STRING_LITERAL_DOUBLE_QUOTE",
  "STRING_LITERAL_SINGLE_QUOTE",
);

export const StringLiteralPlugin: HandlebarsParserPlugin = {
  expression(api) {
    api.lexerRules.add({
      type: "STRING_LITERAL_DOUBLE_QUOTE",
      match: /"[^"]+?"/,
      value: (text) => text.slice(1, -1),
    });
    api.lexerRules.add({
      type: "STRING_LITERAL_SINGLE_QUOTE",
      match: /'[^']+?'/,
      value: (text) => text.slice(1, -1),
    });
    api.addParser(TOK_STRING_LITERAL, parseStringLiteral);
  },
};

export const parseStringLiteral: Parser<StringLiteral> = (context) => {
  const token = context.tokens.eat(TOK_STRING_LITERAL);
  return {
    type: "StringLiteral",
    original: token.original,
    value: token.value,
    loc: context.tokens.location(token, token),
  };
};
