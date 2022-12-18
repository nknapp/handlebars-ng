import path, { relative } from "path";
import fs from "fs";
import { promisify } from "util";
import { url } from "inspector";

const readFile = promisify(fs.readFile);

const specDir = path.resolve("src/pages/spec");

export function injectTestcases(options = {}) {
  return (tree, file) => {
    const testcases = new TestcaseImports()
    for (const { node, replaceWith } of visit(tree)) {
      if (node.type === "link" && node.url.match(/hb-spec.json$/)) {
        replaceWith(testcases.createTestcaseNode(node, file))
      }
    }
    if (testcases.importsRequired) {
      tree.children.unshift(createImports(testcases.identifierToUrl));
      file.extname = ".mdx";
    }
  };
}

function* visit(node, parent, childIndex) {
  yield {
    node,
    replaceWith(replacementNode) {
      parent.children.splice(childIndex, 1, replacementNode);
    },
  };
  if (node.children == null) return;
  for (let i = 0; i < node.children.length; i++) {
    yield* visit(node.children[i], node, i);
  }
}

class TestcaseImports {
  identifierToUrl = {}
  counter = 0;
  get importsRequired() {
    return this.counter > 0
  }

  createTestcaseNode(node, file) {
    this.counter++;
    const identifier = "testcase" + this.counter;
    this.identifierToUrl[identifier] = node.url

    return createTestcaseNode(node, identifier, file)
  }
}


function createTestcaseNode(linkNode, identifier, file) {
  const testcasePath = path.resolve(file.dirname, linkNode.url)
  const testcaseRelativeToSpec = path.relative(specDir, testcasePath)
  return {
    "type": "mdxJsxFlowElement",
    "name": "InjectedTestcase",
    "attributes": [
        {
            "type": "mdxJsxAttribute",
            "name": "spec",
            "value": {
                "type": "mdxJsxAttributeValueExpression",
                "value": identifier,
                "data": {
                    "estree": {
                        "type": "Program",
                        "body": [
                            {
                                "type": "ExpressionStatement",
                                "expression": {
                                    "type": "Identifier",
                                    "name": identifier,
                                }
                            }
                        ],
                        "sourceType": "module",
                        "comments": [],
                    }
                }
            }
        },
        {
            "type": "mdxJsxAttribute",
            "name": "filename",
            "value": testcaseRelativeToSpec
        }
    ],
    "children": [],
    "data": {
        "_mdxExplicitJsx": true
    }
};
}

// TODO: see if this can be done better with less code
// This is just a node that I copied from an actual AST
function createImports(identigierToTestcaseUrl) {
  return {
    type: "mdxjsEsm",
    position: {
      start: {
        line: 2,
        column: 1,
        offset: 1,
      },
      end: {
        line: 3,
        column: 45,
        offset: 98,
      },
    },
    data: {
      estree: {
        type: "Program",
        start: 1,
        end: 98,
        body: [
          createComponentImport(),
          ...Object.entries(identigierToTestcaseUrl).map(([variable, url]) => {
            return createTestcaseImport(variable, url)
          })
        ],
        sourceType: "module",
        comments: [],
        loc: {
          start: {
            line: 2,
            column: 0,
            offset: 1,
          },
          end: {
            line: 3,
            column: 44,
            offset: 98,
          },
        },
        range: [1, 98],
      },
    },
  };
}


function createComponentImport() {
  return {
    type: "ImportDeclaration",
    start: 1,
    end: 53,
    specifiers: [
      {
        type: "ImportDefaultSpecifier",
        start: 8,
        end: 16,
        local: {
          type: "Identifier",
          start: 8,
          end: 16,
          name: "InjectedTestcase",
          loc: {
            start: {
              line: 2,
              column: 7,
              offset: 8,
            },
            end: {
              line: 2,
              column: 15,
              offset: 16,
            },
          },
          range: [8, 16],
        },
        loc: {
          start: {
            line: 2,
            column: 7,
            offset: 8,
          },
          end: {
            line: 2,
            column: 15,
            offset: 16,
          },
        },
        range: [8, 16],
      },
    ],
    source: {
      type: "Literal",
      start: 22,
      end: 53,
      value: "src/components/Testcase.astro",
      raw: "'src/components/Testcase.astro'",
      loc: {
        start: {
          line: 2,
          column: 21,
          offset: 22,
        },
        end: {
          line: 2,
          column: 52,
          offset: 53,
        },
      },
      range: [22, 53],
    },
    loc: {
      start: {
        line: 2,
        column: 0,
        offset: 1,
      },
      end: {
        line: 2,
        column: 52,
        offset: 53,
      },
    },
    range: [1, 53],
  }
}


function createTestcaseImport(variable, url) {
  return {
    type: "ImportDeclaration",
    start: 54,
    end: 98,
    specifiers: [
      {
        type: "ImportDefaultSpecifier",
        start: 61,
        end: 68,
        local: {
          type: "Identifier",
          start: 61,
          end: 68,
          name: variable,
          loc: {
            start: {
              line: 3,
              column: 7,
              offset: 61,
            },
            end: {
              line: 3,
              column: 14,
              offset: 68,
            },
          },
          range: [61, 68],
        },
        loc: {
          start: {
            line: 3,
            column: 7,
            offset: 61,
          },
          end: {
            line: 3,
            column: 14,
            offset: 68,
          },
        },
        range: [61, 68],
      },
    ],
    source: {
      type: "Literal",
      start: 74,
      end: 98,
      value: url,
      loc: {
        start: {
          line: 3,
          column: 20,
          offset: 74,
        },
        end: {
          line: 3,
          column: 44,
          offset: 98,
        },
      },
      range: [74, 98],
    },
    loc: {
      start: {
        line: 3,
        column: 0,
        offset: 54,
      },
      end: {
        line: 3,
        column: 44,
        offset: 98,
      },
    },
    range: [54, 98],
  }
}