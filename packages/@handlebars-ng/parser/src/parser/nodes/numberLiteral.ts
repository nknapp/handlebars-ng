import { tok } from "../../lexer/rules";
import { ParserContext } from "../ParserContext";

const numberLiteralToken = tok("NUMBER");

export const numberLiteral: ParserContext["numberLiteral"] = (context) => {
  const token = context.tokens.eat(numberLiteralToken);
  return {
    type: "NumberLiteral",
    original: token.original,
    value: parseFloat(token.value),
    loc: context.tokens.loc(token, token),
  };
};
