import { HbsMatchRule, TokenTypes } from "../model/lexer";
import { ParseContext } from "../core/types";
import {
  Expression,
  PathExpression,
} from "@handlebars-ng/abstract-syntax-tree";
import { RULE_SPACE, TOK_SPACE } from "./lexer";

interface PathAndParametersReturn {
  rules: HbsMatchRule[];
  parse(context: ParseContext): {
    path: PathExpression;
    params: Expression[];
  };
}

export function pathAndParameters(
  endType: TokenTypes
): PathAndParametersReturn {
  const rules = [RULE_SPACE];

  const parse = (context: ParseContext) => {
    context.tokens.ignore(TOK_SPACE);
    const path = context.parse("PathExpression");
    const params = [];
    while (context.tokens.lookAhead?.type === "SPACE") {
      context.tokens.ignore(TOK_SPACE);
      if (!endType.has(context.tokens.lookAhead.type)) {
        params.push(context.parseExpression());
      }
    }
    context.tokens.ignore(TOK_SPACE);
    return {
      path,
      params,
    };
  };

  return {
    parse,
    rules,
  };
}
