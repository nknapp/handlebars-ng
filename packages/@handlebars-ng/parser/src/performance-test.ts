/* eslint-disable no-console */
import { ObjectUnderTest, TestBench } from "@handlebars-ng/benchmarks";
import { originalHandlebars } from "@handlebars-ng/benchmarks";
import { tests } from "@handlebars-ng/benchmarks";
import { parse } from ".";
import { HandlebarsLexer } from "./lexer";
import { createHandlebarsMooLexer } from "./lexer/moo-lexer";

const parserNg: ObjectUnderTest = {
  name: "ng parser",
  testFn(test) {
    return () => {
      parse(test.template);
    };
  },
};

const mooLexer: ObjectUnderTest = {
  name: "noo-lexer",
  testFn(test) {
    const lexer = createHandlebarsMooLexer();
    return () => {
      lexer.reset(test.template);
      for (const ignoredToken of lexer) {
        /* noop */
      }
    };
  },
};

const hbsLexer: ObjectUnderTest = {
  name: "hbs-lexer",
  testFn(test) {
    return () => {
      const lexer = new HandlebarsLexer(test.template);
      for (const ignoredToken of lexer) {
        /* noop */
      }
    };
  },
};

const bench = new TestBench({
  time: 2000,
  warmupTime: 100,
  roundsPerExecution: 1,
})
  .addTests(tests)
  .addTestee(originalHandlebars.parser)
  .addTestee(parserNg)
  .addTestee(hbsLexer)
  .addTestee(mooLexer);

await bench.run();

console.table(bench.asTable());
