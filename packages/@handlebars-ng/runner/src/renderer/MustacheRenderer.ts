import { MustacheStatement, Node } from "@handlebars-ng/specification/ast";
import { renderHtmlEscaped } from "../utils/htmlEscape";
import { AbstractNodeRenderer } from "./AbstractNodeRenderer";
import { RenderContext } from "./RenderContext";

export class MustacheRenderer extends AbstractNodeRenderer<MustacheStatement> {
  constructor(node: Node) {
    super(node as MustacheStatement);
  }

  render(context: RenderContext): void {
    const value = this.evaluateExpression(context);
    if (this.node.escaped) {
      renderHtmlEscaped(value, context);
    } else {
      context.output += value;
    }
  }

  // TODO: Extract to an ExpressionRenderer or something like that
  evaluateExpression(context: RenderContext): string {
    let currentObject: Record<string, unknown> = context.input;
    for (const id of this.node.path.parts) {
      if (typeof currentObject === "object" && currentObject != null) {
        currentObject = currentObject[id] as Record<string, unknown>;
      } else {
        return "";
      }
    }
    return String(currentObject);
  }
}
