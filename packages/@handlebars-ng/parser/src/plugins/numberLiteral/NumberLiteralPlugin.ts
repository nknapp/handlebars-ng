import { HandlebarsParserPlugin, Parser } from "../../core/types";
import { withLookAhead } from "baa-lexer";
import { LITERAL_LOOKAHEAD } from "../../common/lexer";
import { NumberLiteral } from "@handlebars-ng/abstract-syntax-tree";
import { tok } from "../../core/utils/tok";

const TOK_NUMBER = tok("NUMBER");

export const NumberLiteralPlugin: HandlebarsParserPlugin = {
  expression({ lexerRules, addParser }) {
    lexerRules.add({
      type: "NUMBER",
      match: withLookAhead(/-?\d+(?:\.\d+)?/, LITERAL_LOOKAHEAD),
    });
    addParser(TOK_NUMBER, parseNumberLiteral);
  },
};

const parseNumberLiteral: Parser<NumberLiteral> = (context) => {
  const token = context.tokens.eat(TOK_NUMBER);
  return {
    type: "NumberLiteral",
    original: token.original,
    value: parseFloat(token.value),
    loc: context.tokens.location(token, token),
  };
};
