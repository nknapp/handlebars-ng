import {
  HandlebarsParserPlugin,
  ParseContext,
  StatementRegistry,
} from "../../core/types";
import { MustacheStatement } from "@handlebars-ng/abstract-syntax-tree";
import { tok } from "../../core/utils/tok";

const TOK_OPEN = tok("OPEN");
const TOK_CLOSE = tok("CLOSE");
const TOK_ID = tok("ID");

export const MustachePlugin: HandlebarsParserPlugin = {
  statement(registry: StatementRegistry) {
    registry.addMatchRule({ type: "OPEN", match: "{{", next: "mustache" });
    registry.addState("mustache", {
      fallbackRule: { type: "ID" },
      matchRules: [{ type: "CLOSE", match: "}}", next: "main" }],
    });
    registry.addParser<MustacheStatement>(TOK_OPEN, parseMustacheStatement);
  },
};

function parseMustacheStatement(context: ParseContext): MustacheStatement {
  const open = context.tokens.eat(TOK_OPEN);
  const id = context.tokens.eat(TOK_ID);
  const close = context.tokens.eat(TOK_CLOSE);
  return {
    type: "MustacheStatement",
    loc: context.tokens.location(open, close),
    params: [],
    strip: { open: false, close: false },
    escaped: true,
    path: {
      type: "PathExpression",
      loc: context.tokens.location(id, id),
      parts: [id.value],
      data: false,
      depth: 0,
      original: id.original,
    },
  };
}
