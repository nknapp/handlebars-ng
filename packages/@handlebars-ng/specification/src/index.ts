/// <reference types="vite/client" />

import type { HandlebarsTest } from "./types/tests";
export type {
  HandlebarsTest,
  ParseErrorTest,
  SuccessTest,
} from "./types/tests";

export { helpers } from "./helpers";
export type { Helper } from "./types/helpers";

export { normalizeAst } from "./normalizeAst";

const testModules = import.meta.glob<HandlebarsTest>(
  "./spec/**/*.hb-spec.json",
  {
    eager: true,
    import: "default",
  }
);

export const handlebarsSpec: Record<string, HandlebarsTest> =
  Object.fromEntries(
    Object.entries(testModules)
      .map(([path, spec]) => [removePrefix(path), spec])
      .sort(compareBy(0))
  );

function removePrefix(path: string): string {
  return path.replace(/^\.\/spec\//, "");
}

function compareBy<T>(prop: keyof T): (a: T, b: T) => number {
  return (a: T, b: T) => {
    if (a[prop] === b[prop]) return 0;
    if (a[prop] < b[prop]) return -1;
    return 1;
  };
}
