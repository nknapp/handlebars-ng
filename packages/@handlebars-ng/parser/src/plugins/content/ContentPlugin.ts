import { HandlebarsParserPlugin, ParseContext } from "../../core/types";
import { ContentStatement } from "@handlebars-ng/abstract-syntax-tree";
import { tok } from "../../core/utils/tok";

export const TOK_CONTENT = tok("CONTENT");

export const ContentPlugin: HandlebarsParserPlugin = {
  statement(registry) {
    registry.setFallbackRule({ type: "CONTENT", lineBreaks: true });
    registry.addParser<ContentStatement>(TOK_CONTENT, parseContentStatement);
  },
};

export function parseContentStatement(context: ParseContext): ContentStatement {
  const token = context.tokens.eat(TOK_CONTENT);
  return {
    type: "ContentStatement",
    loc: context.tokens.location(token, token),
    value: token.value,
    original: token.original,
  };
}
