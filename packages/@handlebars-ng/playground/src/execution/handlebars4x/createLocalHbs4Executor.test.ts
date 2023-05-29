import { createLocalHbs4Executor } from "./createLocalHbs4Executor";

describe("Handlebars4xExecutor", () => {
  it("parses templates", async () => {
    const executor = createLocalHbs4Executor();
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
