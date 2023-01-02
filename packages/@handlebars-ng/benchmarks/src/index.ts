/// <reference types="vite/client" />

import { FunctionBenchmark } from "./testbench/FunctionBenchmark";
import {
  Measurement,
  NamedPerformanceTest,
  ObjectUnderTest,
  PerformanceTest,
  TestResult,
} from "./types/types";
import {
  originalParser,
  originalRunner,
} from "./environments/originalHandlebars";
import { ngParser, ngRunner } from "./environments/handlebarsNg";

const tests = import.meta.glob("./tests/**/*.perf.ts");

export async function runAllTests(): Promise<TestResult[]> {
  const tests = await getAllTests();
  const results = [];
  for (const test of tests) {
    const result: TestResult = {
      name: test.name,
      originalParser: await measure(originalParser, test),
      nextGeneParser: await measure(ngParser, test),
      originalRunner: await measure(originalRunner, test),
      nextGeneRunner: await measure(ngRunner, test),
    };
    results.push(result);
  }
  return results;
}

async function getAllTests(): Promise<NamedPerformanceTest[]> {
  const promises = Object.entries(tests).map(async ([name, moduleFn]) => {
    const module = (await moduleFn()) as { default: PerformanceTest };
    const test = module.default;
    return {
      name,
      ...test,
    };
  });
  return Promise.all(promises);
}

function measure(
  objectUnderTest: ObjectUnderTest,
  test: PerformanceTest
): Measurement {
  const benchmark = new FunctionBenchmark(
    objectUnderTest.createRunner(test).run
  );
  benchmark.run(2000);
  return benchmark.getStats();
}
