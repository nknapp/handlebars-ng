/// <reference types="vite/client" />

import path from "path";
import type { HandlebarsTest } from "types/tests";

const specs = await import.meta.glob<{ default: HandlebarsTest }>(
  "../spec/**/*.hb-spec.json",
  { eager: true }
);

export const specDir = path.resolve(__dirname, "..", "spec");

export function loadTestcases(): Record<string, HandlebarsTest> {
  const entries = Object.entries(specs).map(([filename, testcase]) => {
    return [toRelativePath(filename), testcase.default];
  });
  entries.sort(compareBy(0));
  return Object.fromEntries(entries);
}

export function specFilesRelativeToSpecDir(): string[] {
  return Object.keys(specs).map(toRelativePath);
}

function toRelativePath(specPath: string) {
  return path.relative(specDir, path.resolve(__dirname, specPath));
}

function compareBy<T>(prop: keyof T): (a: T, b: T) => number {
  return (a: T, b: T) => {
    if (a[prop] === b[prop]) return 0;
    if (a[prop] < b[prop]) return -1;
    return 1;
  };
}
