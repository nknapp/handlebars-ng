import { MustacheCloseType, MustacheOpenType } from "../../lexer";
import { ParserContext } from "../ParserContext";

export function mustacheStatement(
  openToken: MustacheOpenType,
  closeToken: MustacheCloseType,
  escaped: boolean
): ParserContext["mustache"] {
  return (context) => {
    const open = context.tokens.eat(openToken);
    context.tokens.ignore("SPACE");
    const path = context.pathExpression(context);
    context.tokens.ignore("SPACE");
    const close = context.tokens.eat(closeToken);

    return {
      type: "MustacheStatement",
      path,
      escaped,
      params: [],
      strip: { close: false, open: false },
      loc: context.tokens.loc(open, close),
    };
  };
}
