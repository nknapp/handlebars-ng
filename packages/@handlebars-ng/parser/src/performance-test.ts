/* eslint-disable no-console */
import { ObjectUnderTest, TestBench } from "@handlebars-ng/benchmarks";
import { originalHandlebars } from "@handlebars-ng/benchmarks";
import { tests } from "@handlebars-ng/benchmarks";
import { parseWithoutProcessing } from ".";

const parserNg: ObjectUnderTest = {
  name: "ng parser",
  createRunner(test) {
    return {
      run: () => {
        parseWithoutProcessing(test.template);
      },
    };
  },
};

const result = new TestBench()
  .addTests(tests)
  .addTestee(originalHandlebars.parser)
  .addTestee(parserNg)
  .run()
  .asTable();

console.table(result);
