import { TestBench, tests } from "./index";
import { ObjectUnderTest } from "./types/types";
import { busyWaitMs } from "./utils/tests/busyWait";

describe("benchmarks", () => {
  it("asTable returns a table", async () => {
    const bench = new TestBench({ time: 500, warmupTime: 20 })
      .addTests(tests)
      .addTestee(randomBusy("twenty", 20, 5))
      .addTestee(randomBusy("ten", 10, 5));
    await bench.run();

    expect(bench.asTable()).toEqual([
      ["ms", "twenty", "ten"],
      ["mustaches.perf.ts", roughMeanStd("20 (± 5)"), roughMeanStd("10 (± 5)")],
      [
        "unescaped-mustaches.perf.ts",
        roughMeanStd("20 (± 5)"),
        roughMeanStd("10 (± 5)"),
      ],
    ]);
  });

  it("asGraphData", async () => {
    const testBench = new TestBench({ time: 500 })
      .addTests(tests)
      .addTestee(randomBusy("twenty", 20, 5))
      .addTestee(randomBusy("ten", 10, 5));

    await testBench.run();

    expect(testBench.asGraphData()).toEqual({
      datasets: [
        {
          label: "twenty",
          data: [
            [roughly(15), roughly(25)],
            [roughly(15), roughly(25)],
          ],
        },
        {
          label: "ten",
          data: [
            [roughly(5), roughly(15)],
            [roughly(5), roughly(15)],
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

function roughMeanStd(expectedMeanStdDev: string, threshold?: string): number {
  const [expectedMean, expectedStdDev] = parseMeanStdDev(expectedMeanStdDev);
  const [thresholdMean, thresholdStdDev] = threshold
    ? parseMeanStdDev(threshold)
    : [expectedMean / 2, expectedStdDev / 2];

  const matcher: AsymmetricMatcherInterface<string> = {
    $$typeof: Symbol.for("jest.asymmetricMatcher"),
    asymmetricMatch(received: string) {
      const [receivedMean, receivedStdDev] = parseMeanStdDev(received);
      return (
        Math.abs(receivedMean - expectedMean) <= thresholdMean &&
        Math.abs(receivedStdDev - expectedStdDev) <= thresholdStdDev
      );
    },
    toString() {
      return "Expected";
    },
    getExpectedType() {
      return "number";
    },
    toAsymmetricMatcher() {
      return "roughly " + expectedMeanStdDev;
    },
  };
  return matcher as unknown as number;
}

function parseMeanStdDev(meanStdDev: string): [mean: number, stdDev: number] {
  const match = meanStdDev.match(/[-\d.]+/g)?.map(Number);
  if (match == null || match.length < 2)
    throw new Error("Could not find two numbers in string");
  return [match[0], match[1]];
}
