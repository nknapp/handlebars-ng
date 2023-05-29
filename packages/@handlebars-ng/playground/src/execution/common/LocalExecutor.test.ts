import { vi } from "vitest";
import { HandlebarsAdapter } from "./Executor.types";
import { LocalExecutor } from "./LocalExecutor";

const testAst = {
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
};

describe("Executor", () => {
  const parse = vi.fn();
  const impl = {
    parse,
  } satisfies HandlebarsAdapter;

  beforeEach(() => {
    parse.mockClear();
  });

  it("parses the template", async () => {
    impl.parse.mockReturnValue(testAst);

    const executor = new LocalExecutor(impl);
    const ast = await executor.parse("abc");
    expect(ast).toEqual(testAst);
  });

  it("rejects on parse errors", async () => {
    impl.parse.mockImplementation(() => {
      throw new Error("Test-Error");
    });

    const executor = new LocalExecutor(impl);
    await expect(executor.parse("abc")).rejects.toThrow("Test-Error");
  });
});
