import {
  HandlebarsParserPlugin,
  ParseContext,
  StatementRegistry,
} from "../../core/types";
import {
  MustacheStatement,
  PathExpression,
} from "@handlebars-ng/abstract-syntax-tree";
import { tok } from "../../core/utils/tok";

const TOK_OPEN = tok("OPEN");
const TOK_CLOSE = tok("CLOSE");
const TOK_ID = tok("ID");
const TOK_SPACE = tok("SPACE");
const TOK_STRIP = tok("STRIP");
const TOK_PARAM_END = tok("STRIP", ...TOK_CLOSE);

export const MustachePlugin: HandlebarsParserPlugin = {
  statement(registry: StatementRegistry) {
    registry.addMatchRule({ type: "OPEN", match: "{{", next: "mustache" });
    registry.addState("mustache", {
      fallbackRule: { type: "ID" },
      matchRules: [
        { type: "CLOSE", match: "}}", next: "main" },
        { type: "STRIP", match: "~" },
        { type: "SPACE", match: /[ \t\n]/, lineBreaks: true },
      ],
    });
    registry.addParser<MustacheStatement>(TOK_OPEN, parseMustacheStatement);
  },
};

function parseMustacheStatement(context: ParseContext): MustacheStatement {
  const open = context.tokens.eat(TOK_OPEN);
  const stripLeft = context.tokens.eatOptional(TOK_STRIP);
  context.tokens.ignore(TOK_SPACE);
  const path = parsePathExpression(context);
  const params = [];
  while (context.tokens.lookAhead?.type === "SPACE") {
    context.tokens.ignore(TOK_SPACE);
    if (!TOK_PARAM_END.has(context.tokens.lookAhead.type)) {
      params.push(parsePathExpression(context));
    }
  }
  context.tokens.ignore(TOK_SPACE);
  const stripRight = context.tokens.eatOptional(TOK_STRIP);
  const close = context.tokens.eat(TOK_CLOSE);

  return {
    type: "MustacheStatement",
    path,
    escaped: true,
    params,
    strip: { close: stripRight != null, open: stripLeft != null },
    loc: context.tokens.location(open, close),
  };
}

function parsePathExpression(context: ParseContext): PathExpression {
  const id = context.tokens.eat(TOK_ID);
  return {
    type: "PathExpression",
    loc: context.tokens.location(id, id),
    original: id.original,
    depth: 0,
    data: false,
    parts: [id.value],
  };
}
