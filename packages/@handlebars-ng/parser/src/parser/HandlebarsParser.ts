import { AnyNode, Program } from "../model/ast";
import { contentStatement } from "./nodes/contentStatement";
import { statement } from "./nodes/statement";
import { mustacheStatement } from "./nodes/mustacheStatement";
import { program } from "./nodes/program";
import { TokenStream } from "./TokenStream";
import { ParserContext } from "./ParserContext";
import { HbsLexer } from "../lexer";
import { Traverser } from "../traverser/Traverser";
import { BooleanLiteralParser } from "./expressions/BooleanLiteralParser";
import { PathExpressionParser } from "./expressions/PathExpressionParser";
import { StringLiteralParser } from "./expressions/StringLiteralParser";
import { NumberLiteralParser } from "./expressions/NumberLiteralParser";
import { ParameterExpressionParser } from "./core/ParameterExpressionParser";
import { Expressions } from "./core/Expressions";
import { createLexer, createTokenFactory, mooState } from "baa-lexer";
import { HbsLexerTypes, mainRules } from "../lexer/rules";

export class HandlebarsParser {
  readonly lexer: HbsLexer;
  readonly #expressions: Expressions;

  constructor() {
    this.#expressions = new Expressions(
      PathExpressionParser,
      new ParameterExpressionParser([
        BooleanLiteralParser,
        NumberLiteralParser,
        StringLiteralParser,
        PathExpressionParser,
      ])
    );

    this.lexer = createLexer<HbsLexerTypes>(
      {
        main: mooState(mainRules),
        mustache: this.#expressions.createLexerState({
          type: "CLOSE",
          match: "}}",
          next: "main",
        }),
        unescapedMustache: this.#expressions.createLexerState({
          type: "CLOSE_UNESCAPED",
          match: "}}}",
          next: "main",
        }),
      },
      createTokenFactory
    );
  }

  parseWithoutProcessing(template: string): Program {
    const context: ParserContext = {
      tokens: new TokenStream(template, this.lexer),
      program: program,
      statement: statement,
      mustache: mustacheStatement(new Set(["OPEN"]), new Set(["CLOSE"]), true),
      tripleMustache: mustacheStatement(
        new Set(["OPEN_UNESCAPED"]),
        new Set(["CLOSE_UNESCAPED"]),
        false
      ),
      content: contentStatement,
      pathExpression: this.#expressions.pathExpressionParser.parse.bind(
        this.#expressions.pathExpressionParser
      ),
      expression: this.#expressions.parameterExpressionParser.parse.bind(
        this.#expressions.parameterExpressionParser
      ),
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
