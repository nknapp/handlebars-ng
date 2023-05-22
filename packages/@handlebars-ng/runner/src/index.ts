import { Node, Program } from "./types/ast";
import { ContentRenderer } from "./renderer/ContentRenderer";
import { MustacheRenderer } from "./renderer/MustacheRenderer";
import { ProgramRenderer } from "./renderer/ProgramRenderer";
import { HelperFn } from "./types/helper";
import { NodeMapping, RenderContext } from "./types/nodeMapping";
import { PathEvaluator } from "./expressions/PathEvaluator";
import { LiteralEvaluator } from "./expressions/LiteralEvaluator";

type Runnable = (input: Record<string, unknown>) => string;

export class HandlebarsNgRunner {
  helpers: Map<string, HelperFn> = new Map();

  compile(ast: Program): Runnable {
    const renderer = nodeMapping.createRenderer(ast);
    return (input) => {
      const context: RenderContext = {
        input,
        output: "",
        helpers: this.helpers,
      };
      renderer.render(context);
      return context.output;
    };
  }

  registerHelper(name: string, fn: HelperFn) {
    this.helpers.set(name, fn);
  }
}

const nodeMapping: NodeMapping = {
  createEvaluator(node) {
    switch (node.type) {
      case "PathExpression":
        return new PathEvaluator(node);
      case "StringLiteral":
      case "NumberLiteral":
      case "BooleanLiteral":
        return new LiteralEvaluator(node);
      default:
        unexpectedNodeType(node);
    }
  },

  createRenderer(node) {
    switch (node.type) {
      case "ContentStatement":
        return new ContentRenderer(node);
      case "MustacheStatement":
        return new MustacheRenderer(node, this);
      case "Program":
        return new ProgramRenderer(node, this);
      case "CommentStatement":
        throw new Error("Not yet implemented");
      default:
        unexpectedNodeType(node);
    }
  },
};

function unexpectedNodeType(node: never): never {
  throw new Error("Unexpected node type" + (node as Node).type);
}
