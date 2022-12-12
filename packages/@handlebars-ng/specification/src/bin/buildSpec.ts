import { parseSpec } from "../utils/parseSpec";
import fs from "fs";
import path from "path";
import { HandlebarsTest } from "../utils/HandlebarsTestType";

const generatedDir = path.resolve(__dirname, "..", "__generated__");
const specJsonFile = path.join(generatedDir, "spec.json");
const specTsFile = path.join(generatedDir, "spec.ts");

const testCases = await parseSpec();

ensureDistDir();
createJsonSpec(specJsonFile, testCases);
createTypeScriptSpec(specTsFile, testCases);

function ensureDistDir() {
  if (!fs.existsSync(generatedDir)) {
    fs.mkdirSync(generatedDir);
  }
}

function createJsonSpec(file: string, testCases: HandlebarsTest[]) {
  fs.writeFileSync(file, JSON.stringify(testCases, null, 2));
}

function createTypeScriptSpec(file: string, testCases: HandlebarsTest[]) {
  const testCaseType = fs.readFileSync(
    require.resolve("../utils/HandlebarsTestType.ts"),
    "utf-8"
  );
  fs.writeFileSync(
    file,
    `${testCaseType}

export const testCases: HandlebarsTest[] = ${JSON.stringify(testCases)}
`
  );
}
