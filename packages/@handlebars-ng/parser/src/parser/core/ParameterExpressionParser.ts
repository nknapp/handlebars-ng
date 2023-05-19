import { ExpressionParser } from "./ExpressionParser";
import { BaaMatchRule, TokenType } from "baa-lexer";
import { HbsLexerTypes } from "../../lexer/rules";
import { Expression } from "@handlebars-ng/abstract-syntax-tree";
import { ParserContext } from "../ParserContext";

export class ParameterExpressionParser {
  readonly rules: BaaMatchRule<HbsLexerTypes>[];
  readonly delegatesByTokenType: Map<
    TokenType<HbsLexerTypes>,
    ExpressionParser
  >;

  constructor(parsers: ExpressionParser[]) {
    this.rules = [...new Set(parsers.flatMap((parser) => parser.rules))];
    this.delegatesByTokenType = new Map();
    for (const delegate of parsers) {
      for (const tokenType of delegate.startTokens) {
        this.delegatesByTokenType.set(tokenType, delegate);
      }
    }
  }

  parse(context: ParserContext): Expression {
    const lookAhead = context.tokens.lookAhead;
    if (lookAhead == null) {
      throw new Error("Unexpected end of file. Expected expression.");
    }
    const parser = this.delegatesByTokenType.get(lookAhead.type);
    if (parser == null) {
      throw new Error(
        "Cannot find parser for token " +
          lookAhead.type +
          " registered: " +
          [...this.delegatesByTokenType.keys()]
      );
    }
    return parser.parse(context);
  }
}
