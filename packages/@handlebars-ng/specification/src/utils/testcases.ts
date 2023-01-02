import path from "path";
import { globby } from "globby";
import type { ExportedHandlebarsTest } from "@handlebars-ng/specification/tests";

export const specDir = path.resolve(__dirname, "..", "spec");

export async function loadTestcases(): Promise<ExportedHandlebarsTest[]> {
  const result = [];
  for await (const testCase of iterateTestcases()) {
    result.push(testCase);
  }
  return result.sort(compareBy("filename"));
}

async function* iterateTestcases(): AsyncGenerator<ExportedHandlebarsTest> {
  for (const testCaseFile of await specFilesRelativeToSpecDir()) {
    const testModule = await import(path.join(specDir, testCaseFile));
    const contents = testModule.default;
    yield { filename: testCaseFile, ...contents };
  }
}

function compareBy<T>(prop: keyof T): (a: T, b: T) => number {
  return (a: T, b: T) => {
    if (a[prop] === b[prop]) return 0;
    if (a[prop] < b[prop]) return -1;
    return 1;
  };
}

export function specFilesRelativeToSpecDir(): Promise<string[]> {
  return globby("**/*.hb-spec.json", { cwd: specDir });
}
