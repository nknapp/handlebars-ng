import {
  NodeMapping,
  RenderContext,
  Evaluator,
  EvaluationContext,
} from "../types/nodeMapping";
import {
  Expression,
  MustacheStatement,
  Node,
  PathExpression,
} from "../types/ast";
import { renderEscapedHtml } from "../utils/htmlEscape";
import { AbstractNodeRenderer } from "./AbstractNodeRenderer";
import { getOwnProperty } from "../utils/getOwnProperty";

export class MustacheRenderer extends AbstractNodeRenderer<MustacheStatement> {
  private evaluator: Evaluator;

  constructor(node: Node, nodeMapping: NodeMapping) {
    super(node as MustacheStatement);
    this.evaluator = createEvaluator(this.node, nodeMapping);
  }

  render(context: RenderContext): void {
    const value = this.evaluator.evaluate(context);
    const stringValue = String(value ?? "");
    if (this.node.escaped) {
      renderEscapedHtml(stringValue, context);
    } else {
      context.output += stringValue;
    }
  }
}

export function createEvaluator(
  node: {
    params: Expression[];
    path: PathExpression;
  },
  nodeMapping: NodeMapping
): Evaluator {
  const pathParts = node.path.parts;
  const params = node.params.map((node) => nodeMapping.createEvaluator(node));

  if (pathParts.length === 1 && params.length === 0) {
    return new HelperOrPathEvaluator(pathParts[0]);
  } else if (pathParts.length > 1 && params.length === 0) {
    return nodeMapping.createEvaluator(node.path);
  } else if (pathParts.length === 1 && params.length > 0) {
    return new HelperEvaluator(pathParts[0], params);
  } else {
    throw new Error(`Missing helper: "${node.path.original}"`);
  }
}

class HelperOrPathEvaluator implements Evaluator {
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  evaluate(context: EvaluationContext): unknown {
    const helper = context.helpers.get(this.name);
    if (helper) {
      return helper();
    } else {
      return getOwnProperty(context.input, this.name);
    }
  }
}

class HelperEvaluator implements Evaluator {
  helperName: string;
  paramEvaluator: Evaluator[];

  constructor(helperName: string, paramEvaluator: Evaluator[]) {
    this.helperName = helperName;
    this.paramEvaluator = paramEvaluator;
  }
  evaluate(context: EvaluationContext): unknown {
    const params = this.paramEvaluator.map((e) => e.evaluate(context));
    const helper = context.helpers.get(this.helperName);
    if (helper == null) throw new Error("Helper not found");
    return helper(...params);
  }
}
