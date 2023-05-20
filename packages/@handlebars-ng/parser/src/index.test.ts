import { createDefaultParser } from "./index";

describe("index", () => {
  it("parses content", () => {
    const parser = createDefaultParser();
    const ast = parser.parse("");
    expect(ast).toEqual({
      type: "Program",
      strip: {},
      body: [],
      loc: { start: { line: 1, column: 0 }, end: { line: 1, column: 1 } },
    });
  });
});
