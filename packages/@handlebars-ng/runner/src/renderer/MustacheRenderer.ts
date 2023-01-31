import { MustacheStatement, Node, PathExpression } from "../types/ast";
import { renderEscapedHtml } from "../utils/htmlEscape";
import { AbstractNodeRenderer } from "./AbstractNodeRenderer";
import { RenderContext } from "./RenderContext";

export class MustacheRenderer extends AbstractNodeRenderer<MustacheStatement> {
  constructor(node: Node) {
    super(node as MustacheStatement);
  }

  render(context: RenderContext): void {
    const value = this.evaluateExpression(context);
    if (this.node.escaped) {
      renderEscapedHtml(value, context);
    } else {
      context.output += value;
    }
  }

  // TODO: Extract to an ExpressionRenderer or something like that
  evaluateExpression(context: RenderContext): string {
    // TODO: Make this distinction during compile-time
    if (this.node.path.parts.length === 1) {
      return this.evaluateHelperOrExpression(context, this.node.path.parts[0]);
    }
    return this.evaluatePathExpression(context, this.node.path);
  }

  evaluateHelperOrExpression(
    context: RenderContext,
    propertyName: string
  ): string {
    const helper = context.helpers.get(propertyName);
    if (helper != null) {
      const args = this.node.params.map((param) => {
        return this.evaluatePathExpression(context, param);
      });
      return helper(...args);
    }
    return String(context.input[propertyName]);
  }

  evaluatePathExpression(
    context: RenderContext,
    expression: PathExpression
  ): string {
    let currentObject: Record<string, unknown> = context.input;
    for (const id of expression.parts) {
      if (typeof currentObject === "object" && currentObject != null) {
        currentObject = currentObject[id] as Record<string, unknown>;
      } else {
        return "";
      }
    }
    return String(currentObject);
  }
}
