import { TestBench } from "./index";
import { originalHandlebars } from "./index";
import { tests } from "./index";
import { statistics } from "./testbench/statistics";
import { Measurement } from "./types/types";

describe("benchmarks", () => {
  describe("asTable returns a table", () => {
    let result: string[][] = [];

    beforeAll(() => {
      result = new TestBench({ cycles: 10, warmupCycles: 5 })
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
      expect(firstCol).toContain("mustaches.perf.ts");
      expect(firstCol).toContain("unescaped-mustaches.perf.ts");
    });

    it("returns average and stdDev in the cells", () => {
      for (const row of result.slice(1)) {
        for (const col of row.slice(1)) {
          expect(col).toMatch(/^[\d.]+ \(\u00B1 [\d.]+\)$/);
        }
      }
    });
  });

  it("asGraphData", () => {
    const testBench = new TestBench()
      .addTests(tests)
      .addTestee(originalHandlebars.parser)
      .addTestee(originalHandlebars.runner)
      .run();

    let counter = 0;
    for (const key of Object.keys(testBench.results)) {
      testBench.results[key] = createResult(counter++);
    }
    const result = testBench.asGraphData();

    expect(result).toEqual({
      datasets: [
        {
          label: "original parser",
          data: [
            [-2, 2],
            [0, 4],
          ],
        },
        {
          label: "original runner",
          data: [
            [-1, 3],
            [1, 5],
          ],
        },
      ],
      tests: ["mustaches.perf.ts", "unescaped-mustaches.perf.ts"],
    });
  });
});

function createResult(counter: number): Measurement {
  return {
    diagnosis: {
      sum: 0,
      overheadPercent: 0,
      total: 0,
    },
    statistics: statistics([counter - 2, counter, counter + 2]),
  };
  throw new Error("Function not implemented.");
}
