import { TestBench } from "./index";
import { originalHandlebars } from "./index";
import { tests } from "./index";

describe("benchmarks", () => {
  describe("asTable returns a table", () => {
    let result: string[][] = [];

    beforeAll(() => {
      result = new TestBench()
        .addTests(tests)
        .addTestee(originalHandlebars.parser)
        .addTestee(originalHandlebars.runner)
        .run()
        .asTable();
    });

    it("with the testees in the first header-row", () => {
      expect(result[0]).toEqual(["ms", "original parser", "original runner"]);
    });

    it("with the result rows", () => {
      expect(result.length).toBeGreaterThan(0);
    });

    it("with the tests in the first column", () => {
      const firstCol = result.map((cols) => cols[0]);
      expect(firstCol).toContain("./mustaches.perf.ts");
      expect(firstCol).toContain("./unescaped-mustaches.perf.ts");
    });

    it("returns average and stdDev in the cells", () => {
      for (const row of result.slice(1)) {
        for (const col of row.slice(1)) {
          expect(col).toMatch(/^[\d.]+ \(\u00B1 [\d.]+\)$/);
        }
      }
    });
  });
});
