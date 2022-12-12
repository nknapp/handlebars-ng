import { ParserContext } from "../ParserContext";

export const contentStatement: ParserContext["content"] = (context) => {
  const token = context.tokens.eat("CONTENT");
  return {
    type: "ContentStatement",
    original: token.value,
    loc: context.tokens.loc(token, token),
    value: token.value,
  };
};
