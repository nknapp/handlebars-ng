import { TestBench, tests } from "./index";
import { ObjectUnderTest } from "./types/types";
import { busyWaitMs } from "./utils/tests/busyWait";

const someTests = tests.filter((test) =>
  ["mustaches.perf.ts", "unescaped-mustaches.perf.ts"].includes(test.name),
);

describe("benchmarks", () => {
  it("asTable returns a table", async () => {
    const bench = new TestBench({
      roundsPerExecution: 2,
    })
      .addTests(someTests)
      .addTestee(randomBusy("twenty", 20, 5))
      .addTestee(randomBusy("ten", 10, 5));
    await bench.run({ iterations: 20, warmupIterations: 10 });

    expect(bench.asTable()).toEqual([
      ["ms / 2 runs", "twenty", "ten"],
      [
        "mustaches.perf.ts",
        expect.stringMatching(/[\d.]+ \(± [\d.]+\)/),
        expect.stringMatching(/[\d.]+ \(± [\d.]+\)/),
      ],
      [
        "unescaped-mustaches.perf.ts",
        expect.stringMatching(/[\d.]+ \(± [\d.]+\)/),
        expect.stringMatching(/[\d.]+ \(± [\d.]+\)/),
      ],
    ]);
  });

  it("asGraphData", async () => {
    const testBench = new TestBench({ roundsPerExecution: 2 })
      .addTests(someTests)
      .addTestee(randomBusy("twenty", 20, 5))
      .addTestee(randomBusy("ten", 10, 5));

    await testBench.run({ iterations: 20, warmupIterations: 10 });

    expect(testBench.asGraphData()).toEqual({
      unit: "ms / 2 runs",
      datasets: [
        {
          label: "twenty",
          data: [
            [roughly(35), roughly(45)],
            [roughly(35), roughly(45)],
          ],
        },
        {
          label: "ten",
          data: [
            [roughly(15), roughly(25)],
            [roughly(15), roughly(25)],
          ],
        },
      ],
      tests: ["mustaches.perf.ts", "unescaped-mustaches.perf.ts"],
    });
  });
});

function randomBusy(name: string, mean: number, sd: number): ObjectUnderTest {
  return {
    name,
    testFn() {
      let r = 0;
      return () => {
        r = (r + 1) % 3;
        switch (r) {
          case 0:
            busyWaitMs(mean - sd)();
            return;
          case 1:
            busyWaitMs(mean)();
            return;
          case 2:
            busyWaitMs(mean + sd)();
            return;
          default:
            throw new Error("Unexpected result: " + r);
        }
      };
    },
  };
}

export interface AsymmetricMatcherInterface<T> {
  $$typeof: symbol;
  asymmetricMatch(other: T): boolean;
  toString(): string;
  getExpectedType?(): string;
  toAsymmetricMatcher?(): string;
}

function roughly(expected: number, threshold: number = expected / 2): number {
  const matcher: AsymmetricMatcherInterface<number> = {
    $$typeof: Symbol.for("jest.asymmetricMatcher"),
    asymmetricMatch(other: number) {
      return Math.abs(other - expected) <= threshold;
    },
    toString() {
      return "Expected";
    },
    getExpectedType() {
      return "number";
    },
    toAsymmetricMatcher() {
      return "roughly " + expected + " \u00B1" + threshold;
    },
  };
  return matcher as unknown as number;
}
