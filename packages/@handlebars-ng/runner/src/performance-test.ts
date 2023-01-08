/* eslint-disable no-console */
import { ObjectUnderTest, TestBench } from "@handlebars-ng/benchmarks";
import { originalHandlebars } from "@handlebars-ng/benchmarks";
import { tests } from "@handlebars-ng/benchmarks";
import { parse } from "@handlebars-ng/parser";
import { compile } from "./index";

const ngRunner: ObjectUnderTest = {
  name: "ng runner",
  testFn(test) {
    const ast = parse(test.template);
    const compiledTemplate = compile(ast);
    return () => {
      compiledTemplate(test.input);
    };
  },
};

const bench = new TestBench()
  .addTests(tests)
  .addTestee(originalHandlebars.runner)
  .addTestee(ngRunner);

await bench.run();

console.table(bench.asTable());
