import { EvaluationContext } from "src/types/nodeMapping";
import type { Node } from "../types/ast";

export abstract class AbstractEvaluator<T extends Node> {
  node: T;

  constructor(node: T) {
    this.node = node;
  }

  abstract evaluate(context: EvaluationContext): unknown;
}
