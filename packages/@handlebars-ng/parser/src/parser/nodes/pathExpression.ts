import { ParserContext } from "../ParserContext";

export const pathExpression: ParserContext["pathExpression"] = (context) => {
  const token = context.tokens.eat("ID");
  return {
    type: "PathExpression",
    original: token.value,
    loc: { start: token.start, end: token.end },
    depth: 0,
    data: false,
    parts: [token.value],
  };
};
