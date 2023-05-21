import { HandlebarsParserPlugin, ParseContext } from "../../core/types";
import { MustacheStatement } from "@handlebars-ng/abstract-syntax-tree";
import { tok } from "../../core/utils/tok";
import { HbsLexerState, HbsMatchRule } from "../../model/lexer";

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
    const path = context.parse("PathExpression");
    const params = [];
    while (context.tokens.lookAhead?.type === "SPACE") {
      context.tokens.ignore(TOK_SPACE);
      if (!TOK_PARAM_END.has(context.tokens.lookAhead.type)) {
        params.push(context.parseExpression());
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
        fallbackRule: api.expressionRules.fallbackRule,
        matchRules: [
          ...api.expressionRules.matchRules,
          closeRule,
          { type: "STRIP", match: "~" },
          { type: "SPACE", match: /[ \t\n]/, lineBreaks: true },
        ],
      });
      api.addParser(TOK_OPEN, parseMustacheStatement);
    },
  };
}
