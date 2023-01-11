import { MustacheCloseType, MustacheOpenType } from "../../lexer";
import { ParserContext } from "../ParserContext";

export function mustacheStatement(
  openToken: Set<MustacheOpenType>,
  closeToken: Set<MustacheCloseType>,
  escaped: boolean
): ParserContext["mustache"] {
  return (context) => {
    const open = context.tokens.eat(openToken);
    const stripLeft = context.tokens.eatOptional("STRIP");
    context.tokens.ignore("SPACE");
    const path = context.pathExpression(context);
    context.tokens.ignore("SPACE");
    const stripRight = context.tokens.eatOptional("STRIP");
    const close = context.tokens.eat(closeToken);

    return {
      type: "MustacheStatement",
      path,
      escaped,
      params: [],
      strip: { close: stripRight != null, open: stripLeft != null },
      loc: context.tokens.loc(open, close),
    };
  };
}
