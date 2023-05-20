import { HandlebarsParserPlugin } from "../core/types";
import { tok } from "../core/utils/tok";
import { ContentStatement } from "@handlebars-ng/abstract-syntax-tree";

const TOK_CONTENT = tok("CONTENT");

export const ContentPlugin: HandlebarsParserPlugin = {
  statement(registry) {
    registry.setFallbackRule({ type: "CONTENT", lineBreaks: true });
    registry.addParser<ContentStatement>(
      TOK_CONTENT,
      (context): ContentStatement => {
        const token = context.tokens.eat(TOK_CONTENT);
        return {
          type: "ContentStatement",
          loc: context.tokens.location(token, token),
          value: token.value,
          original: token.original,
        };
      }
    );
  },
};
