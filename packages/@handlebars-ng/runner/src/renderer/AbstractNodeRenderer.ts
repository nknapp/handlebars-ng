import { Node } from "@handlebars-ng/specification/ast";
import { RenderContext } from "./RenderContext";

export abstract class AbstractNodeRenderer<T extends Node> {
  node: T;

  constructor(node: T) {
    this.node = node;
  }

  abstract render(context: RenderContext): void;
}
