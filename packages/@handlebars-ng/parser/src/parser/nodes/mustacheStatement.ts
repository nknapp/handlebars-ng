import {
  MustacheCloseType,
  MustacheOpenType,
  tok,
  TokenType,
} from "../../lexer";
import { ParserContext } from "../ParserContext";

const TOK_STRIP = tok("STRIP");
const TOK_SPACE = tok("SPACE");

export function mustacheStatement(
  openToken: Set<MustacheOpenType>,
  closeToken: Set<MustacheCloseType>,
  escaped: boolean
): ParserContext["mustache"] {
  return (context) => {
    const open = context.tokens.eat(openToken);
    const stripLeft = context.tokens.eatOptional(TOK_STRIP);
    context.tokens.ignore(TOK_SPACE);
    const path = context.pathExpression(context);
    const params = [];
    while (context.tokens.lookAhead?.type === "SPACE") {
      context.tokens.ignore(TOK_SPACE);
      if ((context.tokens.lookAhead.type as TokenType) === "ID") {
        params.push(context.pathExpression(context));
      }
    }
    context.tokens.ignore(TOK_SPACE);
    const stripRight = context.tokens.eatOptional(TOK_STRIP);
    const close = context.tokens.eat(closeToken);

    return {
      type: "MustacheStatement",
      path,
      escaped,
      params,
      strip: { close: stripRight != null, open: stripLeft != null },
      loc: context.tokens.loc(open, close),
    };
  };
}
