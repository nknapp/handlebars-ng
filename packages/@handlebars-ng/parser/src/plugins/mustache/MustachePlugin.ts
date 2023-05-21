import { HandlebarsParserPlugin, ParseContext } from "../../core/types";
import {
  MustacheStatement,
  PathExpression,
} from "@handlebars-ng/abstract-syntax-tree";
import { tok } from "../../core/utils/tok";
import { HbsLexerState, HbsMatchRule } from "../../model/lexer";

const TOK_ID = tok("ID");

export const MustachePluginEscaped = createMustachePlugin(
  { type: "OPEN", match: "{{", next: "mustache" },
  { type: "CLOSE", match: "}}", next: "main" },
  "mustache",
  true
);

export const MustachePluginUnescaped = createMustachePlugin(
  { type: "OPEN_UNESCAPED", match: "{{{", next: "unescapedMustache" },
  { type: "CLOSE_UNESCAPED", match: "}}}", next: "main" },
  "unescapedMustache",
  false
);

export function createMustachePlugin(
  openRule: HbsMatchRule,
  closeRule: HbsMatchRule,
  lexerState: HbsLexerState,
  escaped: boolean
): HandlebarsParserPlugin {
  const TOK_OPEN = tok(openRule.type);
  const TOK_CLOSE = tok(closeRule.type);

  const TOK_SPACE = tok("SPACE");
  const TOK_STRIP = tok("STRIP");
  const TOK_PARAM_END = tok("STRIP", ...TOK_CLOSE);

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
      escaped,
      params,
      strip: { close: stripRight != null, open: stripLeft != null },
      loc: context.tokens.location(open, close),
    };
  }

  return {
    statement(api) {
      api.lexerRules.add(openRule);
      api.addState(lexerState, {
        fallbackRule: { type: "ID" },
        matchRules: [
          closeRule,
          { type: "STRIP", match: "~" },
          { type: "SPACE", match: /[ \t\n]/, lineBreaks: true },
        ],
      });
      api.addParser(TOK_OPEN, parseMustacheStatement);
    },
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
