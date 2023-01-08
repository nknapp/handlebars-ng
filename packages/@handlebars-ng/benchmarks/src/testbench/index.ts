import {
  GraphData,
  NamedPerformanceTest,
  ObjectUnderTest,
} from "../types/types";

import { Bench, TaskResult } from "tinybench";

export class TestBench {
  testees: ObjectUnderTest[] = [];
  tests: NamedPerformanceTest[] = [];
  results: Record<string, TaskResult> = {};
  done = false;
  time: number;
  warmupTime: number;
  roundsPerExecution: number;

  constructor({ time = 2000, warmupTime = 1000, roundsPerExecution = 1 } = {}) {
    this.time = time;
    this.warmupTime = warmupTime;
    this.roundsPerExecution = roundsPerExecution;
  }

  addTests(newTests: NamedPerformanceTest[]): this {
    this.tests.push(...newTests);
    return this;
  }

  addTestee(testee: ObjectUnderTest): this {
    this.testees.push(testee);
    return this;
  }

  async run(): Promise<void> {
    if (this.done) throw new Error("Testbench can only be used once");
    const bench = new Bench({
      warmupTime: this.warmupTime,
      time: this.time,
    });
    for (const test of this.tests) {
      for (const testee of this.testees) {
        const testFn = testee.testFn(test);
        bench.add(this.taskName(testee, test), () => {
          for (let i = 0; i < this.roundsPerExecution; i++) {
            testFn();
          }
        });
      }
    }
    await bench.run();
    for (const task of bench.tasks) {
      if (task.result != null) {
        this.results[task.name] = task.result;
      }
    }
    this.done = true;
  }

  asTable(): string[][] {
    if (!this.done) throw new Error("Call 'run' before retrieving the result");
    const format = new Intl.NumberFormat("en-US", {
      maximumFractionDigits: 3,
      minimumFractionDigits: 3,
    });
    const rows: string[][] = [];
    const headers = ["ms", ...this.testees.map((t) => t.name)];
    for (const test of this.tests) {
      const cols: string[] = [];
      cols.push(test.name);
      for (const testee of this.testees) {
        const result = this.getResult(testee, test);
        const average = format.format(result.mean);
        const stdDev = format.format(result.sd);
        cols.push(average + " (\u00B1 " + stdDev + ")");
      }
      rows.push(cols);
    }
    return [headers, ...rows];
  }

  asGraphData(): GraphData {
    return {
      datasets: this.testees.map((testee) => {
        return {
          label: testee.name,
          data: this.tests.map((test) => {
            const result = this.getResult(testee, test);
            return [result.mean - result.sd, result.mean + result.sd];
          }),
        };
      }),
      tests: this.tests.map((test) => test.name),
    };
  }

  private getResult(
    testee: ObjectUnderTest,
    test: NamedPerformanceTest
  ): TaskResult {
    return this.results[this.taskName(testee, test)];
  }

  private taskName(testee: ObjectUnderTest, test: NamedPerformanceTest) {
    return `${testee.name}-${test.name}`;
  }
}
