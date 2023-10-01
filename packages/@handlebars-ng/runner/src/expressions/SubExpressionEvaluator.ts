import { AbstractEvaluator } from "./AbstractEvaluator";
import {
  EvaluationContext,
  Evaluator,
  NodeMapping,
} from "../types/nodeMapping";
import { Node, SubExpression } from "@handlebars-ng/abstract-syntax-tree";
import { createEvaluatorForHelperOrPath } from "../common/createEvaluatorForHelperOrPath";

export class SubExpressionEvaluator extends AbstractEvaluator<SubExpression> {
  private subEvaluator: Evaluator;
  constructor(node: Node, nodeMapping: NodeMapping) {
    super(node as SubExpression);
    this.subEvaluator = createEvaluatorForHelperOrPath(
      this.node.path,
      this.node.params,
      nodeMapping,
    );
  }
  evaluate(context: EvaluationContext): unknown {
    return this.subEvaluator.evaluate(context);
  }
}
