import type { Node } from "../types/ast";
import { RenderContext } from "../types/nodeMapping";

export abstract class AbstractNodeRenderer<T extends Node> {
  node: T;

  constructor(node: T) {
    this.node = node;
  }

  abstract render(context: RenderContext): void;
}
