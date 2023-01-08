import { MustacheStatement, Node } from "@handlebars-ng/specification/ast";
import { renderHtmlEscaped } from "../utils/htmlEscape";
import { AbstractNodeRenderer } from "./AbstractNodeRenderer";
import { RenderContext } from "./RenderContext";

export class MustacheRenderer extends AbstractNodeRenderer<MustacheStatement> {
  constructor(node: Node) {
    super(node as MustacheStatement);
  }

  render(context: RenderContext): void {
    const key = this.node.path.parts[0];
    const value = String(context.input[key]);
    if (this.node.escaped) {
      renderHtmlEscaped(value, context);
    } else {
      context.output += value;
    }
  }
}
