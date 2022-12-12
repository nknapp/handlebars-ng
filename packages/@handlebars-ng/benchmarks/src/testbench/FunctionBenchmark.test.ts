import { describe, expect, it, vi } from "vitest";
import { FunctionBenchmark } from "./FunctionBenchmark";
import { performance } from "node:perf_hooks";

describe("suite", () => {
  it("runs a function multiple times", () => {
    const fn = vi.fn();
    new FunctionBenchmark(fn).run(1000);
    expect(fn).toHaveBeenCalledTimes(1000);
  });

  it("returns statistics", async () => {
    const fn = vi.fn();
    const suite = new FunctionBenchmark(fn);
    await suite.run(1000);
    expect(suite.getStats()).toEqual({
      count: 1000,
      average: expect.any(Number),
    });
  });

  it("returns plausible values for average", async () => {
    function busyWait10ms() {
      const start = performance.now();
      while (performance.now() - start < 10) {
        /* busy wait */
      }
    }

    const suite = new FunctionBenchmark(busyWait10ms);
    await suite.run(10);
    expectValueWithThreshold(suite.getStats().average, 10, 2);
  });

  it("waits for promises", async () => {
    function promiseWait100ms(): Promise<void> {
      return new Promise((resolve) => setTimeout(resolve, 100));
    }

    const suite = new FunctionBenchmark(promiseWait100ms);
    await suite.run(2);
    expectValueWithThreshold(suite.getStats().average, 100, 20);
  });
});

function expectValueWithThreshold(
  actual: number,
  expected: number,
  threshold: number
) {
  expect(actual).toBeLessThan(expected + threshold);
  expect(actual).toBeGreaterThan(expected - threshold);
}
