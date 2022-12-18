import { specDir, specFilesRelativeToSpecDir } from "@/utils/parseSpec";
import Handlebars from "handlebars";
import type { Program } from "../types/ast";
import fs from 'node:fs'
import path from 'node:path'
import {promisify, isDeepStrictEqual} from 'node:util'
import type { HandlebarsTest } from "../types/tests";
import prettier from 'prettier'

const writeFile = promisify(fs.writeFile)
const readFile = promisify(fs.readFile)

for (const file of await specFilesRelativeToSpecDir()) {
    const absoluteFile = path.resolve(specDir, file);

    const testcase = JSON.parse(await readFile(absoluteFile,"utf-8"))
    const newTestcase = {...testcase}

    addOutput(newTestcase)
    addAst(newTestcase)

    if (!isDeepStrictEqual(testcase, newTestcase)) {
        console.log("Updating "+file)
        const formatted = prettier.format(JSON.stringify(newTestcase),{parser: "json"})
        await writeFile(absoluteFile, formatted)
    }    
}


function addOutput(testcase: HandlebarsTest): void {
    if (testcase.output == null) {
        testcase.output = Handlebars.compile(testcase.template)(testcase.input)
    }
}

function addAst(testcase: HandlebarsTest): void {
    if (testcase.ast == null) {
        testcase.ast = Handlebars.parse(testcase.template) as Program
    }    
}
