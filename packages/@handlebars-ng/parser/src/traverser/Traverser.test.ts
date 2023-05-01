import { AnyNode } from "../model/ast";
import { Traverser } from "./Traverser";
import { NodeType } from "./types";
import { loc } from "../test-utils/loc";

describe("Traverser", () => {
  it("yields statements of a program", () => {
    const nodes = [
      ...new Traverser().traverse({
        type: "Program",
        loc: loc("1:0-1:7"),
        strip: {},
        body: [
          {
            type: "ContentStatement",
            loc: loc("1:0-1:1"),
            value: "a",
            original: "a",
          },
          {
            type: "MustacheStatement",
            loc: loc("1:1-1:6"),
            escaped: true,
            strip: { open: false, close: false },
            path: {
              type: "PathExpression",
              loc: loc("1:3-1:4"),
              depth: 1,
              original: "a",
              parts: ["a"],
              data: false,
            },
            params: [],
          },
          {
            type: "ContentStatement",
            loc: loc("1:6-1:7"),
            value: "b",
            original: "b",
          },
        ],
      }),
    ];
    expect(nodes).toContainEqual({
      type: "array",
      array: [
        anyNode("ContentStatement"),
        anyNode("MustacheStatement"),
        anyNode("ContentStatement"),
      ],
    });
  });
});

function anyNode(type: NodeType): AnyNode {
  return expect.objectContaining({ type });
}
