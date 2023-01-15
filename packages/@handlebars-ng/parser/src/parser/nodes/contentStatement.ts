import { tok } from "../../lexer";
import { ParserContext } from "../ParserContext";

const TOK_CONTENT_ESCAPED_MUSTACHE = tok("CONTENT", "ESCAPED_MUSTACHE");

export const contentStatement: ParserContext["content"] = (context) => {
  const tokens = [...context.tokens.keepEating(TOK_CONTENT_ESCAPED_MUSTACHE)];

  const firstToken = tokens[0];
  const lastToken = tokens[tokens.length - 1];
  const combinedValues = tokens.map((token) => token.value).join("");
  const combinedOriginals = tokens.map((token) => token.original).join("");

  return {
    type: "ContentStatement",
    original: combinedOriginals,
    loc: context.tokens.loc(firstToken, lastToken),
    value: combinedValues,
  };
};
