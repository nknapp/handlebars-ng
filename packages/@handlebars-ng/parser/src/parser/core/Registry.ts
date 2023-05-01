import { MooState } from "baa-lexer";
import { HbsLexerTypes } from "../../lexer/rules";
import { ExpressionParser } from "./ExpressionParser";
import { ParserContext } from "../ParserContext";

export type RuleGroup = "statement" | "expression";

export class Registry {
  expressionRules: MooState<HbsLexerTypes> = {};
  expressionParsers: ExpressionParser[] = [];

  registerExpression(expression: ExpressionParser) {
    Object.assign(this.expressionRules, expression.rules);
    this.expressionParsers.push(expression);
  }

  createExpressionParser(): ParserContext["expression"] {
    const expressions = new Map(
      this.expressionParsers.flatMap((parser) => {
        return parser.startTokens.map((tokenType) => {
          return [tokenType, parser];
        });
      })
    );
    return (context) => {
      const lookAhead = context.tokens.lookAhead;
      if (lookAhead == null) {
        throw new Error("Unexpected end of file. Expected expression.");
      }
      const parser = expressions.get(lookAhead.type);
      if (parser == null) {
        throw new Error(
          "Cannot find parser for token " +
            lookAhead.type +
            " registered: " +
            [...expressions.keys()]
        );
      }
      return parser.parse(context);
    };
  }
}
