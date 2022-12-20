import path, { relative } from "path";

const specDir = path.resolve("src/pages/spec");
const TestCaseComponentName = "InjectedTestCase";

/**
 * Replace markdown links to hb-spec.json files with "Testcase" components.
 *
 * There should be a much easier way to achieve this, but I haven't looked a lot.
 * Seems to work for now, but I would be cautious to copy the concept into other
 * projects.
 *
 */
export function injectTestcases(options = {}) {
  return (tree, file) => {
    const testcases = new TestcaseImports();
    for (const { node, replaceWith } of visit(tree)) {
      if (node.type === "link" && node.url.match(/hb-spec.json$/)) {
        replaceWith(testcases.createTestcaseNode(node, file));
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
  identifierToUrl = {};
  counter = 0;
  get importsRequired() {
    return this.counter > 0;
  }

  createTestcaseNode(node, file) {
    this.counter++;
    const identifier = "testcase" + this.counter;
    this.identifierToUrl[identifier] = node.url;

    return createTestcaseNode(node, identifier, file);
  }
}

function createTestcaseNode(linkNode, identifier, file) {
  const testcasePath = path.resolve(file.dirname, linkNode.url);
  const testcaseRelativeToSpec = path.relative(specDir, testcasePath);
  return {
    type: "mdxJsxFlowElement",
    name: TestCaseComponentName,
    attributes: [
      {
        type: "mdxJsxAttribute",
        name: "spec",
        value: {
          type: "mdxJsxAttributeValueExpression",
          value: identifier,
          data: {
            estree: {
              type: "Program",
              body: [
                {
                  type: "ExpressionStatement",
                  expression: {
                    type: "Identifier",
                    name: identifier,
                  },
                },
              ],
              sourceType: "module",
            },
          },
        },
      },
      {
        type: "mdxJsxAttribute",
        name: "filename",
        value: testcaseRelativeToSpec,
      },
    ],
    children: [],
    data: {
      _mdxExplicitJsx: true,
    },
  };
}

function createImports(identigierToTestcaseUrl) {
  return {
    type: "mdxjsEsm",
    data: {
      estree: {
        type: "Program",
        body: [
          createComponentImport(),
          ...Object.entries(identigierToTestcaseUrl).map(([variable, url]) => {
            return createTestcaseImport(variable, url);
          }),
        ],
        sourceType: "module",
      },
    },
  };
}

function createComponentImport() {
  return {
    type: "ImportDeclaration",
    specifiers: [
      {
        type: "ImportDefaultSpecifier",
        local: {
          type: "Identifier",
          name: TestCaseComponentName,
        },
      },
    ],
    source: {
      type: "Literal",
      value: "@/components/Testcase.astro",
    },
  };
}

function createTestcaseImport(variable, url) {
  return {
    type: "ImportDeclaration",
    specifiers: [
      {
        type: "ImportDefaultSpecifier",
        local: {
          type: "Identifier",
          name: variable,
        },
      },
    ],
    source: {
      type: "Literal",
      value: url,
    },
  };
}
