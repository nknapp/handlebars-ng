import { AnyNode, Program } from "./model/ast";
import { HandlebarsLexer } from "./lexer";
import { HandlebarsParser } from "./parser/HandlebarsParser";
import { Traverser } from "./traverser/Traverser";

const parser = new HandlebarsParser();

export function parseWithoutProcessing(template: string): Program {
  const lexer = new HandlebarsLexer(template);
  return parser.parse(lexer);
}

export function parse(template: string): Program {
  const ast = parseWithoutProcessing(template);
  for (const context of new Traverser().traverse(ast)) {
    if (context.type === "array") {
      applyWhitespaceControl(context.array);
    }
  }
  return ast;
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
