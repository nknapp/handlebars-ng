import {
  ContentStatement,
  MustacheStatement,
  Node,
  Program,
  Statement,
} from "@handlebars-ng/specification/ast";
import { htmlEscape } from "./utils/htmlEscape";

type Runnable = (input: Record<string, unknown>) => string;

export function compile(ast: Program): Runnable {
  return (input) => {
    const output: string[] = [];
    handleProgram(input, ast, output);
    return output.join("");
  };
}

type Handler<T extends Node> = (
  input: Record<string, unknown>,
  node: T,
  output: string[]
) => void;

const handleProgram: Handler<Program> = (input, node, output) => {
  for (const statement of node.body) {
    handleStatement(input, statement, output);
  }
};

const handleStatement: Handler<Statement> = (input, node, output) => {
  switch (node.type) {
    case "ContentStatement":
      return handleContentStatement(input, node, output);
    case "MustacheStatement":
      return handleMustache(input, node, output);
  }
};

const handleContentStatement: Handler<ContentStatement> = (
  input,
  node,
  output
) => {
  output.push(node.value);
};

const handleMustache: Handler<MustacheStatement> = (input, node, output) => {
  const key = node.path.parts[0];
  const value = String(input[key]);
  if (node.escaped) {
    output.push(htmlEscape(value));
  } else {
    output.push(value);
  }
};
