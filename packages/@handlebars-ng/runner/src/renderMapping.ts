import { AnyNode, Node } from "@handlebars-ng/specification/ast";
import { AbstractNodeRenderer as NodeRenderer } from "./renderer/AbstractNodeRenderer";

const mapping = new Map<Node["type"], new (node: Node) => NodeRenderer<Node>>();

export function getRendererForNode(node: AnyNode): NodeRenderer<Node> {
  const RendererClass = mapping.get(node.type);
  if (RendererClass == null) {
    throw new Error("No renderer registered for node-type " + node);
  }
  return new RendererClass(node);
}

export function registerNodeRenderer(
  type: AnyNode["type"],
  factory: new (node: Node) => NodeRenderer<Node>
) {
  mapping.set(type, factory);
}
