import Handlebars from "handlebars";
import { ContentStatement } from "types/ast";

export class ContentCombiningVisitor extends Handlebars.Visitor {
  override acceptArray(arr: hbs.AST.Node[]): void {
    combineContentStatements(arr);
  }
}

function combineContentStatements(nodes: hbs.AST.Node[]): void {
  while (combineTwoContentStatements(nodes).repeat);
}

function combineTwoContentStatements(nodes: hbs.AST.Node[]): {
  repeat: boolean;
} {
  for (let i = 0; i < nodes.length; i++) {
    const current = nodes[i] as ContentStatement;
    const next = nodes[i + 1] as ContentStatement;
    if (
      current?.type === "ContentStatement" &&
      next?.type === "ContentStatement"
    ) {
      const newLocal = merge(current, next);
      nodes.splice(i, 2, newLocal);
      return { repeat: true };
    }
  }
  return { repeat: false };
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
