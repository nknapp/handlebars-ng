import { AnyNode, Program } from "../model/ast";
import { contentStatement } from "./nodes/contentStatement";
import { statement } from "./nodes/statement";
import { mustacheStatement } from "./nodes/mustacheStatement";
import { program } from "./nodes/program";
import { TokenStream } from "./TokenStream";
import { ParserContext } from "./ParserContext";
import { createHbsLexer, HbsLexer } from "../lexer";
import { Traverser } from "../traverser/Traverser";
import { BooleanLiteralParser } from "./expressions/BooleanLiteralParser";
import { PathExpressionParser } from "./expressions/PathExpressionParser";
import { StringLiteralParser } from "./expressions/StringLiteralParser";
import { NumberLiteralParser } from "./expressions/NumberLiteralParser";
import { ExpressionParser } from "./core/ExpressionParser";
import { UnionExpressionParser } from "./core/UnionExpressionParser";

export class HandlebarsParser {
  #lexer: HbsLexer;
  #expressionParser: ExpressionParser;
  #pathExpressionParser: PathExpressionParser;

  constructor({ lexer: createLexer = createHbsLexer } = {}) {
    this.#expressionParser = new UnionExpressionParser([
      new BooleanLiteralParser(),
      new NumberLiteralParser(),
      new StringLiteralParser(),
      new PathExpressionParser(),
    ]);
    this.#pathExpressionParser = new PathExpressionParser();

    // TODO: This union is not optimal since pathexpression is also part of
    // the expression rules.
    this.#lexer = createLexer({
      ...this.#expressionParser.rules,
      ...this.#pathExpressionParser.rules,
    });
  }

  parseWithoutProcessing(template: string): Program {
    const context: ParserContext = {
      tokens: new TokenStream(template, this.#lexer),
      program: program,
      statement: statement,
      mustache: mustacheStatement(new Set(["OPEN"]), new Set(["CLOSE"]), true),
      tripleMustache: mustacheStatement(
        new Set(["OPEN_UNESCAPED"]),
        new Set(["CLOSE_UNESCAPED"]),
        false
      ),
      content: contentStatement,
      pathExpression: this.#pathExpressionParser.parse.bind(
        this.#pathExpressionParser
      ),
      expression: this.#expressionParser.parse.bind(this.#expressionParser),
    };
    return context.program(context);
  }

  parse(template: string): Program {
    const ast = this.parseWithoutProcessing(template);
    for (const context of new Traverser().traverse(ast)) {
      if (context.type === "array") {
        applyWhitespaceControl(context.array);
      }
    }
    return ast;
  }
}

function applyWhitespaceControl(array: AnyNode[]) {
  for (let i = 0; i < array.length; i++) {
    const current = array[i];
    const next = array[i + 1];
    const previous = array[i - 1];

    if (
      current?.type === "ContentStatement" &&
      next?.type === "MustacheStatement" &&
      next.strip.open
    ) {
      current.value = current.value.trimEnd();
    }
    if (
      current?.type === "ContentStatement" &&
      previous?.type === "MustacheStatement" &&
      previous.strip.close
    ) {
      current.value = current.value.trimStart();
    }
  }
}
