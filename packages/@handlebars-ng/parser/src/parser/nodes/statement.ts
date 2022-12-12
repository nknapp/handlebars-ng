import { ParserContext } from "../ParserContext";

export const statement: ParserContext["statement"] = (context) => {
  const lookAhead = context.tokens.lookAhead;
  if (lookAhead == null) {
    throw new Error("Unexpected end of file. Expected statement.");
  }
  switch (lookAhead?.type) {
    case "CONTENT":
      return context.content(context);
    case "OPEN":
      return context.mustache(context);
    case "OPEN_UNESCAPED":
      return context.tripleMustache(context);
  }
  throw new Error(`Unknown token: '${lookAhead.type}'`);
};
