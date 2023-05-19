import { BaaMatchRule } from "baa-lexer";
import { HbsLexerTypes } from "../../lexer/rules";
import { ParserContext } from "../ParserContext";
import { Expression } from "@handlebars-ng/abstract-syntax-tree";
import { TokenTypes } from "../../lexer";

export interface ExpressionParser<T extends Expression = Expression> {
  readonly startTokens: TokenTypes;
  readonly rules: BaaMatchRule<HbsLexerTypes>[];
  parse(context: ParserContext): T;
}
