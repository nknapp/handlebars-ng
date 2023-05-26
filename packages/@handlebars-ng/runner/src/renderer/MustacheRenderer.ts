import { NodeMapping, RenderContext, Evaluator } from "../types/nodeMapping";
import { MustacheStatement, Node } from "../types/ast";
import { renderEscapedHtml } from "../utils/htmlEscape";
import { AbstractNodeRenderer } from "./AbstractNodeRenderer";
import { createEvaluatorForHelperOrPath } from "../common/createEvaluatorForHelperOrPath";

export class MustacheRenderer extends AbstractNodeRenderer<MustacheStatement> {
  private evaluator: Evaluator;

  constructor(node: Node, nodeMapping: NodeMapping) {
    super(node as MustacheStatement);
    this.evaluator = createEvaluatorForHelperOrPath(
      this.node.path,
      this.node.params,
      nodeMapping
    );
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
