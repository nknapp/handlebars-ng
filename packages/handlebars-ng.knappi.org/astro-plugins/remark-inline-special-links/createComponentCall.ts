import { JsxComponentCall, PropValue } from "./LinkCollector";

export function createComponentCall(call: JsxComponentCall) {
  return {
    type: "mdxJsxFlowElement",
    name: call.jsxElementName,
    children: [],
    data: {
      _mdxExplicitJsx: true,
    },
    attributes: Object.entries(call.props).map(([name, propValue]) => ({
      type: "mdxJsxAttribute",
      name,
      value: createPropValueNode(propValue),
    })),
  };
}

function createPropValueNode(propValue: PropValue) {
  switch (propValue.type) {
    case "string":
      return propValue.value;
    case "identifier":
      return {
        type: "mdxJsxAttributeValueExpression",
        value: propValue.value,
        data: {
          estree: {
            type: "Program",
            body: [
              {
                type: "ExpressionStatement",
                expression: {
                  type: "Identifier",
                  name: propValue.value,
                },
              },
            ],
            sourceType: "module",
          },
        },
      };
  }
}
