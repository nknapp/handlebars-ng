import { AnyNode, Program } from "../model/ast";
import { pathExpression } from "./nodes/pathExpression";
import { contentStatement } from "./nodes/contentStatement";
import { statement } from "./nodes/statement";
import { mustacheStatement } from "./nodes/mustacheStatement";
import { program } from "./nodes/program";
import { TokenStream } from "./TokenStream";
import { ParserContext } from "./ParserContext";
import { expression } from "./nodes/expression";
import { stringLiteral } from "./nodes/stringLiteral";
import { numberLiteral } from "./nodes/numberLiteral";
import { createHbsLexer, HbsLexer } from "../lexer";
import { Traverser } from "../traverser/Traverser";

export class HandlebarsParser {
  #lexer: HbsLexer;

  constructor({ lexer = createHbsLexer() } = {}) {
    this.#lexer = lexer;
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
      pathExpression: pathExpression,
      expression: expression,
      stringLiteral: stringLiteral,
      numberLiteral: numberLiteral,
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
