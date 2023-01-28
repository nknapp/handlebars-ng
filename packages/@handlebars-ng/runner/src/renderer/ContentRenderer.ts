import { ContentStatement, Node } from "../types/ast";
import { AbstractNodeRenderer } from "./AbstractNodeRenderer";
import { RenderContext } from "./RenderContext";

export class ContentRenderer extends AbstractNodeRenderer<ContentStatement> {
  constructor(node: Node) {
    super(node as ContentStatement);
  }

  render(context: RenderContext): void {
    context.output += this.node.value;
  }
}
