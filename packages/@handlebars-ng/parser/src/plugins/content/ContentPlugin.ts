import { HandlebarsParserPlugin, ParseContext } from "../../core/types";
import { ContentStatement } from "@handlebars-ng/abstract-syntax-tree";
import { tok } from "../../core/utils/tok";

export const TOK_CONTENT = tok("CONTENT", "ESCAPED_MUSTACHE");

export const ContentPlugin: HandlebarsParserPlugin = {
  statement(api) {
    api.lexerRules.setFallback({ type: "CONTENT", lineBreaks: true });
    api.lexerRules.add({
      type: "ESCAPED_MUSTACHE",
      match: "\\{{",
      value: () => "{{",
    });
    api.addParser(TOK_CONTENT, parseContentStatement);
  },
};

export function parseContentStatement(context: ParseContext): ContentStatement {
  const tokens = [...context.tokens.keepEating(TOK_CONTENT)];

  const firstToken = tokens[0];
  const lastToken = tokens[tokens.length - 1];
  const combinedValues = tokens.map((token) => token.value).join("");
  const combinedOriginals = tokens.map((token) => token.original).join("");

  return {
    type: "ContentStatement",
    original: combinedOriginals,
    loc: context.tokens.location(firstToken, lastToken),
    value: combinedValues,
  };
}
