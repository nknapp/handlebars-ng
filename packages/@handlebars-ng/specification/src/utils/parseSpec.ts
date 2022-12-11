import YAML from "yaml";
import fs from "fs";
import path from "path";
import {globby} from "globby";
import {promisify} from 'node:util'
import {HandlebarsTest} from "./HandlebarsTestType";

const specDir = path.resolve(__dirname, '..', 'spec')
const readFile = promisify(fs.readFile)



export async function* iterateSpec(): AsyncGenerator<HandlebarsTest> {
    const testCaseFiles = await globby("**/*.hb-spec.yaml", {cwd: specDir})
    for (const testCaseFile of testCaseFiles) {
        const contents = await readFile(path.join(specDir, testCaseFile), "utf-8");
        yield {...YAML.parse(contents), filename: testCaseFile}
    }
}

export async function parseSpec(): Promise<HandlebarsTest[]> {
    const result = []
    for await (const testCase of iterateSpec()) {
        result.push(testCase)
    }
    return result
}