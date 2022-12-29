/* eslint-disable @typescript-eslint/no-explicit-any */

export function combineContentStatements(nodes: hbs.AST.Node[]): void {
  while (tryCombineContentStatements(nodes));
}

function tryCombineContentStatements(nodes: hbs.AST.Node[]): boolean {
  for (let i = 0; i < nodes.length; i++) {
    if (
      nodes[i]?.type === "ContentStatement" &&
      nodes[i + 1]?.type === "ContentStatement"
    ) {
      nodes.splice(
        i,
        2,
        combine(
          nodes[i] as hbs.AST.ContentStatement,
          nodes[i + 1] as hbs.AST.ContentStatement
        )
      );
    }
  }
  return false;
}

function combine(
  c1: hbs.AST.ContentStatement,
  c2: hbs.AST.ContentStatement
): hbs.AST.ContentStatement {
  return {
    type: "ContentStatement",
    original: ((c1.original as any) + c2.original) as any,
    value: c1.value + c2.value,
    loc: {
      start: c1.loc.start,
      end: c2.loc.end,
      source: c1.loc.source,
    },
  };
}
