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
import { HandlebarsNgRunner } from "@handlebars-ng/runner";
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
    const runner = new HandlebarsNgRunner();
    const compiledTemplate = runner.compile(ast);
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
  });

  for (const testee of testees) {
    bench.addTestee(testee);
  }
  await bench.addTests(tests).run({ iterations: 1000, warmupIterations: 100 });

  const format = new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 3,
    minimumFractionDigits: 3,
  });

  const table = bench.asTable(
    (result) =>
      `x̄=${format.format(result.mean)} p99=${format.format(result.p99)}`
  );
  const graph = bench.asGraphData((result) => [result.mean, result.p99]);

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
