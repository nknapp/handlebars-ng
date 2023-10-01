import { formatAst } from "./formatAst";
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

describe("formatAst", () => {
  it("formats the ast", async () => {
    expect(await formatAst(testAst)).toEqual(expectedPrettyAst);
  });
});
