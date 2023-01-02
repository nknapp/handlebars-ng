import { describe, expect, it, vi } from "vitest";
import { FunctionBenchmark } from "./FunctionBenchmark";
import { performance } from "node:perf_hooks";
import { expectValueWithThreshold } from "./statistics.test-helper";

describe("suite", () => {
  it("runs a function multiple times", () => {
    const fn = vi.fn();
    new FunctionBenchmark(fn).run(1000, 500);
    expect(fn).toHaveBeenCalledTimes(1500);
  });

  it("returns statistics", async () => {
    const fn = vi.fn();
    const suite = new FunctionBenchmark(fn);
    await suite.run(1000, 500);
    expect(suite.getStats().statistics).toEqual({
      count: 1000,
      average: expect.any(Number),
      stdDev: expect.any(Number),
      max: expect.any(Number),
      min: expect.any(Number),
      per25: expect.any(Number),
      per50: expect.any(Number),
      per75: expect.any(Number),
    });
  });

  it("returns plausible values for average", async () => {
    const suite = new FunctionBenchmark(busyWait10ms);
    await suite.run(20, 20);
    expectValueWithThreshold(suite.getStats().statistics.average, 10, 2);
  });

  it("returns plausible values for stdDev", async () => {
    const suite = new FunctionBenchmark(busyWait10ms);
    await suite.run(20, 20);
    expectValueWithThreshold(suite.getStats().statistics.stdDev, 0.5, 0.5);
  });

  it("waits for promises", async () => {
    function promiseWait100ms(): Promise<void> {
      return new Promise((resolve) => setTimeout(resolve, 100));
    }

    const suite = new FunctionBenchmark(promiseWait100ms);
    await suite.run(2, 2);
    expectValueWithThreshold(suite.getStats().statistics.average, 100, 20);
  });
});

function busyWait10ms() {
  const start = performance.now();
  while (performance.now() - start < 10) {
    /* busy wait */
  }
}
