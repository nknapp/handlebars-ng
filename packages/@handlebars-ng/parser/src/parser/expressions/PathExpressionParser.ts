import { ExpressionParser } from "../core/ExpressionParser";
import { withLookAhead } from "baa-lexer";
import { LOOK_AHEAD } from "../../lexer/rules";
import { tok } from "../../lexer";
import { ParserContext } from "../ParserContext";
import { PathExpression } from "@handlebars-ng/abstract-syntax-tree";

const TOK_ID = tok("ID", "SQUARE_WRAPPED_ID");
const TOK_SEPARATOR = tok("DOT", "SLASH");

export const PathExpressionParser: ExpressionParser<PathExpression> = {
  startTokens: TOK_ID,
  rules: [
    {
      type: "ID",
      match: withLookAhead(
        /[^\n \t!"#%&'()*+,./;<=>@[\\\]^`{|}~]+?/,
        LOOK_AHEAD
      ),
    },
    {
      type: "SQUARE_WRAPPED_ID",
      match: /\[[^[]*?]/,
      value: (text) => text.slice(1, -1),
    },
    { type: "DOT", match: "." },
    { type: "SLASH", match: "/" },
  ],
  parse(context: ParserContext): PathExpression {
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
  },
};
