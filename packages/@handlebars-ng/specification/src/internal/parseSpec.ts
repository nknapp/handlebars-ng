import path from "path";
import { globby } from "globby";
import { ExportedHandlebarsTest } from "../exported/HandlebarsTest";

const specDir = path.resolve(__dirname, "..", "spec");

export async function parseSpec(): Promise<ExportedHandlebarsTest[]> {
  const result = [];
  for await (const testCase of iterateSpec()) {
    result.push(testCase);
  }
  return result;
}

export async function* iterateSpec(): AsyncGenerator<ExportedHandlebarsTest> {
  const testCaseFiles = await globby("**/*.hb-spec.ts", { cwd: specDir });
  for (const testCaseFile of testCaseFiles) {
    const testModule = await import(path.join(specDir, testCaseFile));
    const contents = testModule.default;
    yield { ...contents, filename: testCaseFile };
  }
}
