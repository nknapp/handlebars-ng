import {describe} from "vitest";
import {globbySync} from "globby";
import YAML from 'yaml'
import * as fs from "fs";
import * as Handlebars from "handlebars";
import * as path from "path";

const specFiles =  globbySync("**/*.hb-spec.yaml",{cwd: __dirname})

describe("The spec", () => {
    for (const specFile of specFiles) {
        describe(specFile, () => {
            const spec = YAML.parse(fs.readFileSync(path.join(__dirname, specFile),"utf-8"))
            it(spec.description, () => {
                const instance = Handlebars.create()
                const ast = instance.parse(spec.template)
                console.log(YAML.stringify(ast))
                expect(ast).toEqual(spec.ast)
                const template = instance.compile(ast)
                expect(template(spec.input)).toEqual(spec.output)
            })
        })
    }
})