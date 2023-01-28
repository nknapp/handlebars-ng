/* eslint-disable no-console */
import {
  ObjectUnderTest,
  TestBench,
  originalHandlebars,
  tests,
} from "@handlebars-ng/benchmarks";
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
  .addTests([
    {
      name: "long-unescape",
      template: "abc {{abc}}\n".repeat(1000),
      input: { abc: "abcabc".repeat(100) },
    },
  ])
  .addTests([
    {
      name: "long-escape",
      template: "abc {{abc}}\n".repeat(1000),
      input: { abc: "abc<=>".repeat(100) },
    },
  ])

  .addTestee(originalHandlebars.runner)
  .addTestee(ngRunner);

await bench.run({ iterations: 200, warmupIterations: 100 });

const numberFormat = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
});

const f = (number: number) => numberFormat.format(number).padStart(7);

console.table(
  bench.asTable((r) => `${f(r.min)} ${f(r.mean)} ${f(r.p99)} ${f(r.max)}`)
);
