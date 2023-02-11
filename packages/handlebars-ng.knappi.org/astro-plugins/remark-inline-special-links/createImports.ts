import { ImportSpec } from "./LinkCollector";
import { MyNode } from "./types";

export function createImports(imports: ImportSpec[]): MyNode {
  return {
    type: "mdxjsEsm",
    data: {
      estree: {
        type: "Program",
        body: imports.map(createTestcaseImport),
        sourceType: "module",
      },
    },
  };
}

function createTestcaseImport(importSpec: ImportSpec) {
  return {
    type: "ImportDeclaration",
    specifiers: [
      {
        type: "ImportDefaultSpecifier",
        local: {
          type: "Identifier",
          name: importSpec.name,
        },
      },
    ],
    source: {
      type: "Literal",
      value: importSpec.source,
    },
  };
}
