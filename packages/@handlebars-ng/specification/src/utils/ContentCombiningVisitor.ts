import Handlebars from "handlebars";

export class ContentCombiningVisitor extends Handlebars.Visitor {
  override acceptArray(arr: hbs.AST.Node[]): void {
    combineContentStatements(arr);
  }
}

type Content = hbs.AST.ContentStatement;

function combineContentStatements(nodes: hbs.AST.Node[]): void {
  while (combineTwoContentStatements(nodes).repeat);
}

function combineTwoContentStatements(nodes: hbs.AST.Node[]): {
  repeat: boolean;
} {
  for (let i = 0; i < nodes.length; i++) {
    const current = nodes[i] as Content;
    const next = nodes[i + 1] as Content;
    if (
      current?.type === "ContentStatement" &&
      next?.type === "ContentStatement"
    ) {
      const newLocal = combine(current, next);
      nodes.splice(i, 2, newLocal);
      return { repeat: true };
    }
  }
  return { repeat: false };
}

function combine(c1: Content, c2: Content): Content {
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
