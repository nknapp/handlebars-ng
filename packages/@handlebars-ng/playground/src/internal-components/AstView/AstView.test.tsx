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
    render(() => <AstView label="label" ast={testAst} loading={false} />);
    expect(await screen.findByLabelText("label")).toBeInTheDocument();
  });

  it("renders a Program node with prettier", () => {
    render(() => <AstView label="label" ast={testAst} loading={false} />);
    expect(screen.getByLabelText("label")).toHaveValue(expectedPrettyAst);
  });

  it("renders a readonly editor", () => {
    render(() => <AstView label="label" ast={testAst} loading={false} />);
    expect(screen.getByLabelText("label")).toHaveAttribute("readonly");
  });

  it("renders loading indicator while loading", () => {
    render(() => <AstView label="label" ast={testAst} loading={true} />);
    expect(screen.queryByText("Loading...")).not.toBeNull();
  });

  it("renders empty editor when ASt is undefined", () => {
    render(() => <AstView label="label" ast={undefined} loading={true} />);
    expect(screen.getByLabelText("label")).toHaveValue("");
  });
});
