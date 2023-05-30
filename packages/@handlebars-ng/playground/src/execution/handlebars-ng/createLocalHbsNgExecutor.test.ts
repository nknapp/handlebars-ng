import { createLocalHbsNgExecutor } from "./createLocalHbsNgExecutor";

describe("handlebars-ng executor", () => {
  it("parses templates", async () => {
    const executor = createLocalHbsNgExecutor();
    const ast = await executor.parse("abc");

    expect(ast).toEqual({
      type: "Program",
      loc: { start: { line: 1, column: 0 }, end: { line: 1, column: 3 } },
      body: [
        {
          type: "ContentStatement",
          original: "abc",
          loc: { start: { line: 1, column: 0 }, end: { line: 1, column: 3 } },
          value: "abc",
        },
      ],
      strip: {},
    });
  });
});
