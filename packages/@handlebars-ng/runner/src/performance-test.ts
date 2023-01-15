/* eslint-disable no-console */
import { ObjectUnderTest, TestBench } from "@handlebars-ng/benchmarks";
import { originalHandlebars } from "@handlebars-ng/benchmarks";
import { tests } from "@handlebars-ng/benchmarks";
import { parse } from "@handlebars-ng/parser";
import { HandlebarsNgRunner } from ".";

const ngRunner: ObjectUnderTest = {
  name: "ng runner",
  testFn(test) {
    const ast = parse(test.template);
    const instance = new HandlebarsNgRunner();
    const compiledTemplate = instance.compile(ast);
    return () => {
      compiledTemplate(test.input);
    };
  },
};

const bench = new TestBench({ roundsPerExecution: 1 })
  .addTests(tests)
  .addTestee(originalHandlebars.runner)
  .addTestee(ngRunner);

await bench.run({ iterations: 200, warmupIterations: 100 });

console.table(bench.asTable());
