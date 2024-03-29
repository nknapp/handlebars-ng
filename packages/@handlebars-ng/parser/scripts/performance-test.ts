import { ObjectUnderTest, TestBench } from "@handlebars-ng/benchmarks";
import { originalHandlebars } from "@handlebars-ng/benchmarks";
import { tests } from "@handlebars-ng/benchmarks";
import { createDefaultParser } from "../src";

const parserNg: ObjectUnderTest = {
  name: "ng parser",
  testFn(test) {
    const parser = createDefaultParser();
    return () => {
      parser.parse(test.template);
    };
  },
};

const bench = new TestBench({
  roundsPerExecution: 1,
})
  .addTests(tests)
  .addTestee(originalHandlebars.parser)
  .addTestee(parserNg);

await bench.run({ iterations: 200, warmupIterations: 100 });

console.table(bench.asTable());
