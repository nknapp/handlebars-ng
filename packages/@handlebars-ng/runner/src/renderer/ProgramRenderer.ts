import { Node, Program } from "@handlebars-ng/specification/ast";
import { getRendererForNode } from "../renderMapping";
import { AbstractNodeRenderer } from "./AbstractNodeRenderer";
import { RenderContext } from "./RenderContext";

export class ProgramRenderer extends AbstractNodeRenderer<Program> {
  body: AbstractNodeRenderer<Node>[];

  constructor(node: Node) {
    super(node as Program);
    this.body = this.node.body.map(getRendererForNode);
  }

  render(context: RenderContext): void {
    for (const statement of this.body) {
      statement.render(context);
    }
  }
}
