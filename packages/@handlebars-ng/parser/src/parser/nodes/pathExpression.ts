import { tok } from "../../lexer";
import { ParserContext } from "../ParserContext";

const TOK_ID = tok("ID", "SQUARE_WRAPPED_ID");
const TOK_SEPARATOR = tok("DOT", "SLASH");

export const pathExpression: ParserContext["pathExpression"] = (context) => {
  const firstToken = context.tokens.eat(TOK_ID);
  let original = firstToken.original;

  const restValues: string[] = [];
  let lastToken = firstToken;
  let dotToken = null;
  while ((dotToken = context.tokens.eatOptional(TOK_SEPARATOR)) != null) {
    original += dotToken.original;
    const idToken = context.tokens.eat(TOK_ID);
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
