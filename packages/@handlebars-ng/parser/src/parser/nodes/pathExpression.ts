import { ParserContext } from "../ParserContext";

export const pathExpression: ParserContext["pathExpression"] = (context) => {
  const firstToken = context.tokens.eat("ID");
  let original = firstToken.original;

  const restValues: string[] = [];
  let lastToken = firstToken;
  let dotToken = null;
  while ((dotToken = context.tokens.eatOptional("DOT")) != null) {
    original += dotToken.original;
    const idToken = context.tokens.eat("ID");
    restValues.push(idToken.value);
    original += idToken.original;
    lastToken = idToken;
  }
  return {
    type: "PathExpression",
    original,
    loc: { start: firstToken.start, end: lastToken.end },
    depth: 0,
    data: false,
    parts: [firstToken.value, ...restValues],
  };
};
