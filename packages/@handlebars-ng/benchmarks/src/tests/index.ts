/// <reference types="vite/client" />

import { NamedPerformanceTest, PerformanceTest } from "../types/types";

const testModules = import.meta.glob<PerformanceTest>("./**/*.perf.ts", {
  eager: true,
  import: "default",
});

function getAllTests(): NamedPerformanceTest[] {
  const tests = Object.entries(testModules).map(([name, test]) => {
    return {
      name: name.replace(/^\.\//, ""),
      ...test,
    };
  });
  if (tests.length === 0) {
    throw new Error("No tests found");
  }
  return tests;
}

export const tests = getAllTests();
