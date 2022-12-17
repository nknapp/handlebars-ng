import { parseSpec } from "./parseSpec";
import fs from "fs";
import path from "path";
import { HandlebarsTest } from "../exported/HandlebarsTest";

const targetDir = path.resolve(__dirname, "..");
const specJsonFile = path.join(targetDir, "exported", "all-tests.json");
const specTsFile = path.join(targetDir, "exported", "all-tests.ts");

const testCases = await parseSpec();

createJsonSpec(specJsonFile, testCases);
createTypeScriptSpec(specTsFile, testCases);

function createJsonSpec(file: string, testCases: HandlebarsTest[]) {
  fs.writeFileSync(file, JSON.stringify(testCases, null, 2));
}

function createTypeScriptSpec(file: string, testCases: HandlebarsTest[]) {
  fs.writeFileSync(
    file,
    `import {ExportedHandlebarsTest} from './HandlebarsTest'

export const testCases: ExportedHandlebarsTest[] = ${JSON.stringify(testCases)}
`
  );
}
