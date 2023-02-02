import { Node, PathExpression } from "@handlebars-ng/abstract-syntax-tree";
import { getOwnProperty } from "src/utils/getOwnProperty";
import { EvaluationContext } from "../types/nodeMapping";
import { AbstractEvaluator } from "./AbstractEvaluator";

export class PathEvaluator extends AbstractEvaluator<PathExpression> {
  constructor(node: Node) {
    super(node as PathExpression);
  }

  evaluate(context: EvaluationContext): unknown {
    let currentObject = context.input;
    for (const id of this.node.parts) {
      currentObject = getOwnProperty(currentObject, id);
      if (currentObject == null) return null;
    }
    return currentObject;
  }
}
