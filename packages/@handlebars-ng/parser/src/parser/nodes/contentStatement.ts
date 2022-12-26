import { ParserContext } from "../ParserContext";

export const contentStatement: ParserContext["content"] = (context) => {
  const values: string[] = [];
  const firstToken = context.tokens.lookAhead;
  let lastToken = firstToken;
  for (const token of context.tokens.keepEating(
    "CONTENT",
    "ESCAPED_MUSTACHE"
  )) {
    if (token.type === "ESCAPED_MUSTACHE") {
      values.push(token.value.slice(1));
    } else {
      values.push(token.value);
    }
    lastToken = token;
  }
  const combinedValues = values.join("");
  return {
    type: "ContentStatement",
    original: combinedValues,
    loc: context.tokens.loc(firstToken, lastToken),
    value: combinedValues,
  };
};
