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
  testFn(test) {
    return () => {
      parse(test.template);
    };
  },
};

const ngRunner: ObjectUnderTest = {
  name: "ng-runner",
  testFn(test) {
    const ast = parse(test.template);
    const compiledTemplate = compile(ast);
    return () => {
      compiledTemplate(test.input);
    };
  },
};

async function writeData(filename: string, ...testees: ObjectUnderTest[]) {
  if (!force && existsSync(filename)) {
    console.log(
      "Skipping performance generation for existing file: " + filename
    );
    return;
  }
  const bench = new TestBench({
    roundsPerExecution: 1,
    time: 5000,
    warmupTime: 500,
  });
  for (const testee of testees) {
    bench.addTestee(testee);
  }
  await bench.addTests(tests).run();

  const table = bench.asTable();
  const graph = bench.asGraphData();

  await mkdirp(path.dirname(filename));
  fs.writeFile(filename, JSON.stringify({ table, graph }));
}

await writeData(
  "src/__generated__/benchmarks/parser.json",
  ngParser,
  originalHandlebars.parser
);
await writeData(
  "src/__generated__/benchmarks/runner.json",
  ngRunner,
  originalHandlebars.runner
);
