import { MooState, TokenType } from "baa-lexer";
import { HbsLexerTypes } from "../../lexer/rules";
import { ParserContext } from "../ParserContext";
import { Expression } from "@handlebars-ng/abstract-syntax-tree";

export interface ExpressionParser {
  readonly startTokens: ReadonlyArray<TokenType<HbsLexerTypes>>;
  readonly rules: MooState<HbsLexerTypes>;
  parse(context: ParserContext): Expression;
}
