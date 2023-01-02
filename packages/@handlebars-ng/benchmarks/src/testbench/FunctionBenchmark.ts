import { performance } from "isomorphic-performance";
import { Measurement } from "../types/types";

export type FunctionUnderTest = () => Promise<unknown> | unknown;

export class FunctionBenchmark {
  private durations: number[] = [];
  private readonly fn: FunctionUnderTest;

  constructor(fn: () => Promise<unknown> | unknown) {
    this.fn = fn;
  }

  async run(times: number): Promise<void> {
    for (let i = 0; i < times; i++) {
      const start = performance.now();
      const result = this.fn() as Partial<Promise<unknown>>;
      if (result != null && result.then != null)
        await (result as Promise<void>);
      const duration = performance.now() - start;
      this.durations.push(duration);
    }
  }

  getStats(): Measurement {
    const count = this.durations.length;
    return {
      count,
      average: sum(this.durations) / count,
    };
  }
}

function sum(values: number[]): number {
  let result = 0;
  for (const value of values) result += value;
  return result;
}
