import { HandlebarsParserPlugin, Parser } from "../../core/types";
import { PathExpression } from "@handlebars-ng/abstract-syntax-tree";
import { tok } from "../../core/utils/tok";
import { withLookAhead } from "baa-lexer";

const LOOK_AHEAD = /[=~}\s/.)|]/;

export const PathExpressionPlugin: HandlebarsParserPlugin = {
  expression(api) {
    api.lexerRules.add({
      type: "SQUARE_WRAPPED_ID",
      match: /\[[^[]*?]/,
      value: (text) => text.slice(1, -1),
    });
    api.lexerRules.add({
      type: "ID",
      match: withLookAhead(
        /[^\n \t!"#%&'()*+,./;<=>@[\\\]^`{|}~]+?/,
        LOOK_AHEAD
      ),
    });
    api.lexerRules.add({ type: "DOT", match: "." });
    api.lexerRules.add({ type: "SLASH", match: "/" });
    api.addParser(TOK_ID, parsePathExpression);
    api.setDefaultParser("PathExpression", parsePathExpression);
  },
};

const TOK_ID = tok("ID", "SQUARE_WRAPPED_ID");
const TOK_SEPARATOR = tok("DOT", "SLASH");

const parsePathExpression: Parser<PathExpression> = (context) => {
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
