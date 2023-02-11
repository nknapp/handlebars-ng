import type { Parent } from "unist";
import type { MyNode } from "./types";

interface Visited<Node extends MyNode> {
  node: Node;
  replaceWith(replacementNode: MyNode): void;
}

export function* visit<NodeType extends MyNode>(
  node: MyNode,
  type: string
): Generator<Visited<NodeType>> {
  for (const visited of visitAll(node)) {
    if (visited.node.type === type) {
      yield visited as Visited<NodeType>;
    }
  }
}

function* visitAll(
  node: MyNode,
  parent?: Parent<MyNode>,
  childIndex?: number
): Generator<Visited<MyNode>> {
  yield {
    node,
    replaceWith(replacementNode) {
      if (parent == null || childIndex == null) {
        throw new Error("Cannot replace root element");
      }
      parent.children.splice(childIndex, 1, replacementNode);
    },
  };
  if (node.children != null) {
    for (let i = 0; i < node.children.length; i++) {
      yield* visitAll(node.children[i], node as Parent<MyNode>, i);
    }
  }
}
