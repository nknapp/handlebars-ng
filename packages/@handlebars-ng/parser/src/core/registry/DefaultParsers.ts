import { Parser, ParserCollector } from "../types";
import { Node, NodeByType } from "@handlebars-ng/abstract-syntax-tree";

export class DefaultParsers implements ParserCollector {
  parsers = new Map<keyof NodeByType, Parser<Node>>();

  setDefaultParser<T extends keyof NodeByType>(
    nodeType: T,
    parse: Parser<NodeByType[T]>
  ): void {
    if (this.parsers.has(nodeType)) {
      throw new Error(
        "A default parser for this node-type was already registered: " +
          nodeType
      );
    }
    this.parsers.set(nodeType, parse);
  }

  getDefaultParser<T extends keyof NodeByType>(
    nodeType: T
  ): Parser<NodeByType[T]> {
    const result = this.parsers.get(nodeType) as Parser<NodeByType[T]>;
    if (result == null)
      throw new Error("No default parser found for node type: " + nodeType);
    return result;
  }
}
