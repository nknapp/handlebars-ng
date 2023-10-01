import {
  Expression,
  PathExpression,
} from "@handlebars-ng/abstract-syntax-tree";
import {
  EvaluationContext,
  Evaluator,
  NodeMapping,
} from "../types/nodeMapping";
import { getOwnProperty } from "../utils/getOwnProperty";

export function createEvaluatorForHelperOrPath(
  path: PathExpression,
  parameters: Expression[],
  nodeMapping: NodeMapping,
): Evaluator {
  const pathParts = path.parts;
  const paramEvaluators = parameters.map((node) =>
    nodeMapping.createEvaluator(node),
  );

  if (pathParts.length === 1 && paramEvaluators.length === 0) {
    return new HelperOrPathEvaluator(pathParts[0]);
  } else if (pathParts.length > 1 && paramEvaluators.length === 0) {
    return nodeMapping.createEvaluator(path);
  } else if (pathParts.length === 1 && paramEvaluators.length > 0) {
    return new HelperEvaluator(pathParts[0], paramEvaluators);
  } else {
    throw new Error(`Missing helper: "${path.original}"`);
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
