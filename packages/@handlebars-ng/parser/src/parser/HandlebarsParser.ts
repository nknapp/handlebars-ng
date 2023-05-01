import { AnyNode, Program } from "../model/ast";
import { contentStatement } from "./nodes/contentStatement";
import { statement } from "./nodes/statement";
import { mustacheStatement } from "./nodes/mustacheStatement";
import { program } from "./nodes/program";
import { TokenStream } from "./TokenStream";
import { ParserContext } from "./ParserContext";
import { stringLiteral } from "./nodes/stringLiteral";
import { numberLiteral } from "./nodes/numberLiteral";
import { createHbsLexer, HbsLexer } from "../lexer";
import { Traverser } from "../traverser/Traverser";
import { booleanLiteral } from "./nodes/booleanLiteral";
import { Registry } from "./core/Registry";
import { BooleanLiteralParser } from "./expressions/BooleanLiteralParser";
import { PathExpressionParser } from "./expressions/PathExpression";
import { StringLiteralParser } from "./expressions/StringLiteral";
import { NumberLiteralParser } from "./expressions/NumberLiteralParser";

export class HandlebarsParser {
  #lexer: HbsLexer;
  #registry: Registry;
  #pathExpressionParser: PathExpressionParser;
  #expressionParser: ParserContext["expression"];

  constructor({ lexer: createLexer = createHbsLexer } = {}) {
    this.#registry = new Registry();
    this.#registry.registerExpression(new BooleanLiteralParser());
    this.#registry.registerExpression(new NumberLiteralParser());
    this.#pathExpressionParser = new PathExpressionParser();
    this.#registry.registerExpression(this.#pathExpressionParser);
    this.#registry.registerExpression(new StringLiteralParser());
    this.#expressionParser = this.#registry.createExpressionParser();
    this.#lexer = createLexer(this.#registry.expressionRules);
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
      pathExpression: (context) => this.#pathExpressionParser.parse(context),
      expression: this.#expressionParser,
      stringLiteral: stringLiteral,
      numberLiteral: numberLiteral,
      booleanLiteral: booleanLiteral,
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
