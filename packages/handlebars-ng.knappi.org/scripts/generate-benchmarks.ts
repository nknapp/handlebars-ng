/// <reference types="vite/client" />

import fs from "node:fs/promises";
import { existsSync } from "node:fs";

import {
  ObjectUnderTest,
  originalHandlebars,
  TestBench,
  tests,
} from "@handlebars-ng/benchmarks";
import { parse } from "@handlebars-ng/parser";
import { compile } from "@handlebars-ng/runner";
import mkdirp from "make-dir";
import path from "path";

const force = import.meta.env.VITE_FORCE === "true";

const ngParser: ObjectUnderTest = {
  name: "ng-parser",
  createRunner(test) {
    return {
      run: () => {
        parse(test.template);
      },
    };
  },
};

const ngRunner: ObjectUnderTest = {
  name: "ngrunner",
  createRunner(test) {
    const ast = parse(test.template);
    const compiledTemplate = compile(ast);
    return {
      run: () => {
        compiledTemplate(test.input);
      },
    };
  },
};

async function writeTable(filename: string, ...testees: ObjectUnderTest[]) {
  if (!force && existsSync(filename)) {
    console.log(
      "Skipping performance generation for existing file: " + filename
    );
    return;
  }
  const bench = new TestBench();
  for (const testee of testees) {
    bench.addTestee(testee);
  }
  const table = bench.addTests(tests).run().asTable();
  await mkdirp(path.dirname(filename));
  fs.writeFile(filename, JSON.stringify(table));
}

await writeTable(
  "src/__generated__/benchmarks/parser.json",
  ngParser,
  originalHandlebars.parser
);
await writeTable(
  "src/__generated__/benchmarks/runner.json",
  ngRunner,
  originalHandlebars.runner
);
