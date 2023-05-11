import { ExpressionParser } from "./ExpressionParser";
import { MooState, TokenType } from "baa-lexer";
import { HbsLexerTypes } from "../../lexer/rules";
import { Expression } from "@handlebars-ng/abstract-syntax-tree";
import { ParserContext } from "../ParserContext";

export class UnionExpressionParser implements ExpressionParser {
  readonly rules: MooState<HbsLexerTypes>;
  readonly startTokens: ReadonlyArray<TokenType<HbsLexerTypes>>;
  readonly delegatesByTokenType: Map<
    TokenType<HbsLexerTypes>,
    ExpressionParser
  >;

  constructor(delegates: ExpressionParser[]) {
    this.rules = Object.assign(
      {},
      ...delegates.map((delegate) => delegate.rules)
    );
    this.startTokens = delegates.flatMap((delegate) => delegate.startTokens);
    this.delegatesByTokenType = new Map(
      delegates.flatMap((parser) => {
        return parser.startTokens.map((tokenType) => {
          return [tokenType, parser];
        });
      })
    );
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
