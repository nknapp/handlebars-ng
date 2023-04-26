import { tok } from "../../lexer";
import { ParserContext } from "../ParserContext";

const booleanLiteralToken = tok("BOOLEAN");

export const booleanLiteral: ParserContext["booleanLiteral"] = (context) => {
  const token = context.tokens.eat(booleanLiteralToken);
  return {
    type: "BooleanLiteral",
    original: token.original,
    value: token.value === "true",
    loc: context.tokens.location(token, token),
  };
};
