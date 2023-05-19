import { ExpressionParser } from "./ExpressionParser";
import { PathExpression } from "@handlebars-ng/abstract-syntax-tree";
import { ParameterExpressionParser } from "./ParameterExpressionParser";
import { BaaMatchRule, createMatcher, createStateProcessor } from "baa-lexer";
import { HbsLexerTypes } from "../../lexer/rules";

export class Expressions {
  readonly pathExpressionParser: ExpressionParser<PathExpression>;
  readonly parameterExpressionParser: ParameterExpressionParser;
  constructor(
    pathExpressionParser: ExpressionParser<PathExpression>,
    parameterExpressionParser: ParameterExpressionParser
  ) {
    this.pathExpressionParser = pathExpressionParser;
    this.parameterExpressionParser = parameterExpressionParser;
  }

  createLexerState(endRule: BaaMatchRule<HbsLexerTypes>) {
    const expressionRules: BaaMatchRule<HbsLexerTypes>[] = [
      { type: "STRIP", match: "~" },
      { type: "SPACE", match: /[ \t\n]/, lineBreaks: true },
      ...this.parameterExpressionParser.rules,
      ...this.pathExpressionParser.rules,
      endRule,
    ];
    return createStateProcessor(
      expressionRules.map((rule) => rule.type),
      createMatcher(expressionRules, true),
      null,
      { type: "error" }
    );
  }
}
