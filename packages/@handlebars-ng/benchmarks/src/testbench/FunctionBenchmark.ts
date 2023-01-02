import { performance } from "isomorphic-performance";
import { Measurement } from "../types/types";
import { statistics } from "./statistics";

export type FunctionUnderTest = () => Promise<unknown> | unknown;

export class FunctionBenchmark {
  readonly durations: number[] = [];
  total = 0;
  sum = 0;
  readonly fn: FunctionUnderTest;

  constructor(fn: () => Promise<unknown> | unknown) {
    this.fn = fn;
  }

  async run(times: number, warmup: number): Promise<void> {
    for (let i = 0; i < warmup; i++) {
      const result = this.fn() as Partial<Promise<unknown>>;
      if (result != null && result.then != null)
        await (result as Promise<void>);
    }

    const start = performance.now();
    for (let i = 0; i < times; i++) {
      const start = performance.now();
      const result = this.fn() as Partial<Promise<unknown>>;
      if (result != null && result.then != null)
        await (result as Promise<void>);
      const duration = performance.now() - start;
      this.durations.push(duration);
      this.sum += duration;
    }
    this.total = performance.now() - start;
  }

  getStats(): Measurement {
    return {
      statistics: statistics(this.durations),
      diagnosis: {
        overheadPercent: (this.total - this.sum) / this.sum,
        sum: this.sum,
        total: this.total,
      },
    };
  }
}
