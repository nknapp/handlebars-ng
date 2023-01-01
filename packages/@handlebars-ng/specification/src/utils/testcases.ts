import path from "path";
import { globby } from "globby";
import type { ExportedHandlebarsTest } from "@handlebars-ng/specification/tests";

export const specDir = path.resolve(__dirname, "..", "spec");

export async function loadTestcases(): Promise<ExportedHandlebarsTest[]> {
  const result = [];
  for await (const testCase of iterateTestcases()) {
    result.push(testCase);
  }
  return result;
}

async function* iterateTestcases(): AsyncGenerator<ExportedHandlebarsTest> {
  for (const testCaseFile of await specFilesRelativeToSpecDir()) {
    const testModule = await import(path.join(specDir, testCaseFile));
    const contents = testModule.default;
    yield { ...contents, filename: testCaseFile };
  }
}

export function specFilesRelativeToSpecDir(): Promise<string[]> {
  return globby("**/*.hb-spec.json", { cwd: specDir });
}
