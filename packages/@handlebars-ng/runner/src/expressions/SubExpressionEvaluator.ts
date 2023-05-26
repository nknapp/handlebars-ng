import { AbstractEvaluator } from "./AbstractEvaluator";
import {
  EvaluationContext,
  Evaluator,
  NodeMapping,
} from "../types/nodeMapping";
import { createEvaluator } from "../renderer/MustacheRenderer";
import { Node, SubExpression } from "@handlebars-ng/abstract-syntax-tree";

export class SubExpressionEvaluator extends AbstractEvaluator<SubExpression> {
  private subEvaluator: Evaluator;
  constructor(node: Node, nodeMapping: NodeMapping) {
    super(node as SubExpression);
    this.subEvaluator = createEvaluator(this.node, nodeMapping);
  }
  evaluate(context: EvaluationContext): unknown {
    return this.subEvaluator.evaluate(context);
  }
}
