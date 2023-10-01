import {
  GraphData,
  NamedPerformanceTest,
  ObjectUnderTest,
} from "../types/types";

import { Bench, TaskResult } from "tinybench";

type ResultToSpan = (result: TaskResult) => [number, number];
const meanPlusMinusStdDev: ResultToSpan = (result) => [
  result.mean - result.sd,
  result.mean + result.sd,
];

type ResultFormatter = (result: TaskResult) => string;

const format = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 3,
  minimumFractionDigits: 3,
});

const formatMeanStdDev: ResultFormatter = (result) => {
  const average = format.format(result.mean);
  const stdDev = format.format(result.sd);
  return average + " (\u00B1 " + stdDev + ")";
};

export class TestBench {
  testees: ObjectUnderTest[] = [];
  tests: NamedPerformanceTest[] = [];
  results: Record<string, TaskResult> = {};
  done = false;
  roundsPerExecution: number;

  constructor({ roundsPerExecution = 1 } = {}) {
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

  async run({ iterations = 2000, warmupIterations = 100 }): Promise<void> {
    if (this.done) throw new Error("Testbench can only be used once");
    const bench = new Bench({
      iterations,
      warmupIterations,
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

  asTable(format: ResultFormatter = formatMeanStdDev): string[][] {
    if (!this.done) throw new Error("Call 'run' before retrieving the result");
    const rows: string[][] = [];
    const headers = [
      `ms / ${this.roundsPerExecution} runs`,
      ...this.testees.map((t) => t.name),
    ];
    for (const test of this.tests) {
      const cols: string[] = [];
      cols.push(test.name);
      for (const testee of this.testees) {
        const result = this.getResult(testee, test);
        cols.push(format(result));
      }
      rows.push(cols);
    }
    return [headers, ...rows];
  }

  asGraphData(toSpan: ResultToSpan = meanPlusMinusStdDev): GraphData {
    return {
      unit: `ms / ${this.roundsPerExecution} runs`,
      datasets: this.testees.map((testee) => {
        return {
          label: testee.name,
          data: this.tests.map((test) => {
            const result = this.getResult(testee, test);
            return toSpan(result);
          }),
        };
      }),
      tests: this.tests.map((test) => test.name),
    };
  }

  private getResult(
    testee: ObjectUnderTest,
    test: NamedPerformanceTest,
  ): TaskResult {
    return this.results[this.taskName(testee, test)];
  }

  private taskName(testee: ObjectUnderTest, test: NamedPerformanceTest) {
    return `${testee.name}-${test.name}`;
  }
}
