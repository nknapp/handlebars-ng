import { render, screen } from "@solidjs/testing-library";
import { AstView } from "./AstView";
import { Program } from "@handlebars-ng/abstract-syntax-tree";

const testAst: Program = {
  type: "Program",
  body: [],
  loc: { start: { line: 1, column: 0 }, end: { line: 1, column: 0 } },
  strip: {},
};

const expectedPrettyAst = `{
  type: "Program",
  body: [],
  loc: { start: { line: 1, column: 0 }, end: { line: 1, column: 0 } },
  strip: {},
}
`;

describe("AstView", () => {
  it("renders a label", async () => {
    render(() => <AstView label="label" ast={testAst} />);
    expect(await screen.findByLabelText("label")).toBeInTheDocument();
  });

  it("renders a Program node with prettier", () => {
    render(() => <AstView label="label" ast={testAst} />);
    expect(screen.getByLabelText("label")).toHaveValue(expectedPrettyAst);
  });
});
