import { ParserContext } from "../ParserContext";

export const expression: ParserContext["expression"] = (context) => {
  const lookAhead = context.tokens.lookAhead;
  if (lookAhead == null) {
    throw new Error("Unexpected end of file. Expected expression.");
  }
  switch (lookAhead?.type) {
    case "ID":
    case "SQUARE_WRAPPED_ID":
      return context.pathExpression(context);
    case "STRING_LITERAL_DOUBLE_QUOTE":
      return context.stringLiteral(context);
    case "STRING_LITERAL_SINGLE_QUOTE":
      return context.stringLiteral(context);
  }

  throw new Error(`Unexpected token: '${lookAhead.type}'`);
};
