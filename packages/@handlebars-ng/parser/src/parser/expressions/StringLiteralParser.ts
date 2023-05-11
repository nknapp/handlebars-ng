import { ExpressionParser } from "../core/ExpressionParser";
import { tok } from "../../lexer";
import { ParserContext } from "../ParserContext";
import { MooState, TokenType } from "baa-lexer";
import { HbsLexerTypes } from "../../lexer/rules";
import { Expression } from "@handlebars-ng/abstract-syntax-tree";

export class StringLiteralParser implements ExpressionParser {
  readonly TOK_STRING_LITERAL = tok(
    "STRING_LITERAL_DOUBLE_QUOTE",
    "STRING_LITERAL_SINGLE_QUOTE"
  );
  readonly rules: MooState<HbsLexerTypes> = {
    STRING_LITERAL_DOUBLE_QUOTE: {
      match: /"[^"]+?"/,
      value: (text) => text.slice(1, -1),
    },
    STRING_LITERAL_SINGLE_QUOTE: {
      match: /'[^']+?'/,
      value: (text) => text.slice(1, -1),
    },
  };
  readonly startTokens: ReadonlyArray<TokenType<HbsLexerTypes>> = [
    "STRING_LITERAL_SINGLE_QUOTE",
    "STRING_LITERAL_DOUBLE_QUOTE",
  ] as const;
  parse(context: ParserContext): Expression {
    const token = context.tokens.eat(this.TOK_STRING_LITERAL);
    return {
      type: "StringLiteral",
      original: token.original,
      value: token.value,
      loc: context.tokens.location(token, token),
    };
  }
}
