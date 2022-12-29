import { ParserContext } from "../ParserContext";

export const contentStatement: ParserContext["content"] = (context) => {
  const tokens = [...context.tokens.keepEating("CONTENT", "ESCAPED_MUSTACHE")];

  const firstToken = tokens[0];
  const lastToken = tokens[tokens.length - 1];
  const combinedValues = tokens.map((token) => token.value).join("");

  return {
    type: "ContentStatement",
    original: combinedValues,
    loc: context.tokens.loc(firstToken, lastToken),
    value: combinedValues,
  };
};
