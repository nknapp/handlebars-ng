import { ExpressionParser } from "../core/ExpressionParser";
import { MooState, withLookAhead } from "baa-lexer";
import { HbsLexerTypes, LOOK_AHEAD } from "../../lexer/rules";
import { tok } from "../../lexer";
import { ParserContext } from "../ParserContext";
import { PathExpression } from "@handlebars-ng/abstract-syntax-tree";

export class PathExpressionParser implements ExpressionParser {
  readonly TOK_ID = tok("ID", "SQUARE_WRAPPED_ID");
  readonly TOK_SEPARATOR = tok("DOT", "SLASH");
  readonly startTokens = ["ID", "SQUARE_WRAPPED_ID"] as const;
  readonly rules = {
    ID: {
      match: withLookAhead(
        /[^\n \t!"#%&'()*+,./;<=>@[\\\]^`{|}~]+?/,
        LOOK_AHEAD
      ),
    },
    SQUARE_WRAPPED_ID: {
      match: /\[[^[]*?]/,
      value: (text) => text.slice(1, -1),
    },
    DOT: { match: /\./ },
    SLASH: { match: /\// },
  } satisfies MooState<HbsLexerTypes>;

  parse(context: ParserContext): PathExpression {
    const firstToken = context.tokens.eat(this.TOK_ID);
    let original = firstToken.original;

    const restValues: string[] = [];
    let lastToken = firstToken;
    let dotToken = null;
    while (
      (dotToken = context.tokens.eatOptional(this.TOK_SEPARATOR)) != null
    ) {
      original += dotToken.original;
      const idToken = context.tokens.eat(this.TOK_ID);
      restValues.push(idToken.value);
      original += idToken.original;
      lastToken = idToken;
    }
    return {
      type: "PathExpression",
      original,
      loc: { start: firstToken.start, end: lastToken.end },
      depth: 0,
      data: false,
      parts: [firstToken.value, ...restValues],
    };
  }
}
