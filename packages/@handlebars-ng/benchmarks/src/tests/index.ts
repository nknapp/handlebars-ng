/// <reference types="vite/client" />

import { NamedPerformanceTest, PerformanceTest } from "../types/types";

const testModules = import.meta.glob("./**/*.perf.ts");

async function getAllTests(): Promise<NamedPerformanceTest[]> {
  const promises = Object.entries(testModules).map(async ([name, moduleFn]) => {
    const module = (await moduleFn()) as { default: PerformanceTest };
    const test = module.default;
    return {
      name: name.replace(/^\.\//, ""),
      ...test,
    };
  });
  if (promises.length === 0) {
    throw new Error("No tests found");
  }
  return Promise.all(promises);
}

export const tests = await getAllTests();
