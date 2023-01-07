import {
  GraphData,
  Measurement,
  NamedPerformanceTest,
  ObjectUnderTest,
  PerformanceTest,
} from "../types/types";
import { FunctionBenchmark } from "./FunctionBenchmark";

export class TestBench {
  testees: ObjectUnderTest[] = [];
  results: Record<string, Measurement> = {};
  tests: NamedPerformanceTest[] = [];
  cycles;
  warmupCycles;
  done = false;

  constructor({ cycles = 2000, warmupCycles = 1000 } = {}) {
    (this.cycles = cycles), (this.warmupCycles = warmupCycles);
  }

  addTests(newTests: NamedPerformanceTest[]): this {
    this.tests.push(...newTests);
    return this;
  }

  addTestee(testee: ObjectUnderTest): this {
    this.testees.push(testee);
    return this;
  }

  run(): this {
    if (this.done) throw new Error("Testbench can only be used once");
    for (const test of this.tests) {
      for (const testee of this.testees) {
        this.putResult(testee, test, this.measure(testee, test));
      }
    }
    this.done = true;
    return this;
  }

  private measure(
    objectUnderTest: ObjectUnderTest,
    test: PerformanceTest
  ): Measurement {
    const testFn = objectUnderTest.createRunner(test).run;
    const benchmark = new FunctionBenchmark(testFn);
    benchmark.run(this.cycles, this.warmupCycles);
    return benchmark.getStats();
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
        const average = format.format(result.statistics.average);
        const stdDev = format.format(result.statistics.stdDev);
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
            return [
              result.statistics.average - result.statistics.stdDev,
              result.statistics.average + result.statistics.stdDev,
            ];
          }),
        };
      }),
      tests: this.tests.map((test) => test.name),
    };
  }

  private putResult(
    testee: ObjectUnderTest,
    test: NamedPerformanceTest,
    measurement: Measurement
  ): void {
    this.results[`${testee.name}-${test.name}`] = measurement;
  }

  private getResult(
    testee: ObjectUnderTest,
    test: NamedPerformanceTest
  ): Measurement {
    return this.results[`${testee.name}-${test.name}`];
  }
}
