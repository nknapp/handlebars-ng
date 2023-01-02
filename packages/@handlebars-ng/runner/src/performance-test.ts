/* eslint-disable no-console */
import { ObjectUnderTest, TestBench } from "@handlebars-ng/benchmarks";
import { originalHandlebars } from "@handlebars-ng/benchmarks";
import { tests } from "@handlebars-ng/benchmarks";
import { parse } from "@handlebars-ng/parser";
import { compile } from "./index";

const ngRunner: ObjectUnderTest = {
  name: "ng runner",
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

const result = new TestBench()
  .addTests(tests)
  .addTestee(originalHandlebars.runner)
  .addTestee(ngRunner)
  .run()
  .asTable();

console.table(result);
