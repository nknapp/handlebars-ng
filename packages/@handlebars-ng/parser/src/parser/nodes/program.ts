import { Statement } from "../../model/ast";
import { ParserContext } from "../ParserContext";

export const program: ParserContext["program"] = (context) => {
  const body: Statement[] = [];
  const firstToken = context.tokens.lookAhead;
  while (context.tokens.lookAhead != null) {
    const statement = context.statement(context);
    body.push(statement);
  }

  return {
    type: "Program",
    strip: {},
    body,
    loc: context.tokens.location(firstToken, context.tokens.currentToken),
  };
};
