import { tok } from "../../lexer";
import { ParserContext } from "../ParserContext";

const stringLiteralToken = tok(
  "STRING_LITERAL_DOUBLE_QUOTE",
  "STRING_LITERAL_SINGLE_QUOTE"
);

export const stringLiteral: ParserContext["stringLiteral"] = (context) => {
  const token = context.tokens.eat(stringLiteralToken);
  return {
    type: "StringLiteral",
    original: token.original,
    value: token.value,
    loc: context.tokens.loc(token, token),
  };
};
