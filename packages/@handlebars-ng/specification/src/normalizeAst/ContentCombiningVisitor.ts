import Handlebars from "handlebars";
import { ContentStatement, Node } from "@handlebars-ng/abstract-syntax-tree";

export class ContentCombiningVisitor extends Handlebars.Visitor {
  override acceptArray(arr: hbs.AST.Node[]): void {
    combineContentStatements(arr as Node[]);
  }
}

function combineContentStatements(nodes: Node[]): void {
  while (combineTwoContentStatements(nodes).shouldRepeat);
}

function combineTwoContentStatements(nodes: Node[]) {
  for (let i = 0; i < nodes.length; i++) {
    const current = nodes[i];
    const next = nodes[i + 1];
    if (
      current?.type === "ContentStatement" &&
      next?.type === "ContentStatement"
    ) {
      const mergedNode = merge(
        current as ContentStatement,
        next as ContentStatement
      );
      nodes.splice(i, 2, mergedNode);
      return { shouldRepeat: true };
    }
  }
  return { shouldRepeat: false };
}

function merge(c1: ContentStatement, c2: ContentStatement): ContentStatement {
  // When changing this code, don't forget to change it in the spec (01-introduction)
  return {
    type: "ContentStatement",
    original: c1.original + c2.original,
    value: c1.value + c2.value,
    loc: {
      start: c1.loc.start,
      end: c2.loc.end,
      source: c1.loc.source,
    },
  };
}
