import { Literal } from "@handlebars-ng/abstract-syntax-tree";
import { AbstractEvaluator } from "./AbstractEvaluator";

export class LiteralEvaluator extends AbstractEvaluator<Literal> {
  evaluate(): unknown {
    return this.node.value;
  }
}
