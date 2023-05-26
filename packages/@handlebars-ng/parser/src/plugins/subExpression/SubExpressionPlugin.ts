import { HandlebarsParserPlugin } from "../../core/types";
import { tok } from "../../core/utils/tok";
import { pathAndParameters } from "../../common/pathAndParameters";
import { SubExpression } from "@handlebars-ng/abstract-syntax-tree";

const TOK_OPEN_SUB = tok("OPEN_SUB_EXPRESSION");
const TOK_CLOSE_SUB = tok("CLOSE_SUB_EXPRESSION");

export const SubExpressionPlugin: HandlebarsParserPlugin = {
  expression(api) {
    api.lexerRules.add({ type: "OPEN_SUB_EXPRESSION", match: "(" });
    api.lexerRules.add({ type: "CLOSE_SUB_EXPRESSION", match: ")" });
    const { rules, parse } = pathAndParameters(TOK_CLOSE_SUB);
    for (const rule of rules) {
      api.lexerRules.add(rule);
    }
    api.addParser(TOK_OPEN_SUB, (context): SubExpression => {
      const firstToken = context.tokens.eat(TOK_OPEN_SUB);
      const { path, params } = parse(context);
      const lastToken = context.tokens.eat(TOK_CLOSE_SUB);
      return {
        type: "SubExpression",
        loc: { start: firstToken.start, end: lastToken.end },
        path,
        params,
      };
    });
  },
};
