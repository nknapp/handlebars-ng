import { Node, Program } from "../types/ast";
import { AbstractNodeRenderer } from "./AbstractNodeRenderer";
import { NodeMapping, Renderer, RenderContext } from "../types/nodeMapping";

export class ProgramRenderer extends AbstractNodeRenderer<Program> {
  body: Renderer[];

  constructor(node: Node, mapping: NodeMapping) {
    super(node as Program);
    this.body = this.node.body.map((node) => mapping.createRenderer(node));
  }

  render(context: RenderContext): void {
    for (const statement of this.body) {
      statement.render(context);
    }
  }
}
