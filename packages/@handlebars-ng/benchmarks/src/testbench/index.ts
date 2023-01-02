import {
  Measurement,
  NamedPerformanceTest,
  ObjectUnderTest,
  PerformanceTest,
} from "../types/types";
import { FunctionBenchmark } from "./FunctionBenchmark";

export class TestBench {
  testees: ObjectUnderTest[] = [];
  results: Record<`${string}-${string}`, Measurement> = {};
  tests: NamedPerformanceTest[] = [];
  cycles = 2000;
  warmupCycles = 1000;
  done = false;

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
    const format = new Intl.NumberFormat("en-US", { maximumFractionDigits: 4 });
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
