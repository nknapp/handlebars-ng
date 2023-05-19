import { ExpressionParser } from "../core/ExpressionParser";
import { tok } from "../../lexer";
import { ParserContext } from "../ParserContext";
import { StringLiteral } from "@handlebars-ng/abstract-syntax-tree";

const TOK_STRING_LITERAL = tok(
  "STRING_LITERAL_DOUBLE_QUOTE",
  "STRING_LITERAL_SINGLE_QUOTE"
);

export const StringLiteralParser: ExpressionParser<StringLiteral> = {
  rules: [
    {
      type: "STRING_LITERAL_DOUBLE_QUOTE",
      match: /"[^"]+?"/,
      value: (text) => text.slice(1, -1),
    },
    {
      type: "STRING_LITERAL_SINGLE_QUOTE",
      match: /'[^']+?'/,
      value: (text) => text.slice(1, -1),
    },
  ],
  startTokens: TOK_STRING_LITERAL,
  parse(context: ParserContext): StringLiteral {
    const token = context.tokens.eat(TOK_STRING_LITERAL);
    return {
      type: "StringLiteral",
      original: token.original,
      value: token.value,
      loc: context.tokens.location(token, token),
    };
  },
};
