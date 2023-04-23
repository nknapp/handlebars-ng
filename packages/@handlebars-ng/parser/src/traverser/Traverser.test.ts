import { AnyNode } from "../model/ast";
import { Traverser } from "./Traverser";
import { NodeType } from "./types";
import { HandlebarsParser } from "../parser/HandlebarsParser";

const parser = new HandlebarsParser();
describe("Traverser", () => {
  it("yields statements of a program", () => {
    const nodes = [
      ...new Traverser().traverse(parser.parseWithoutProcessing("a{{b}}c")),
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
