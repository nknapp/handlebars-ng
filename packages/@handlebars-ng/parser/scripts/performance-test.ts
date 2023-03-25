import { ObjectUnderTest, TestBench } from "@handlebars-ng/benchmarks";
import { originalHandlebars } from "@handlebars-ng/benchmarks";
import { tests } from "@handlebars-ng/benchmarks";
import { parse } from "../src/index";
import { createHbsLexer } from "../src/lexer";

const parserNg: ObjectUnderTest = {
  name: "ng parser",
  testFn(test) {
    return () => {
      parse(test.template);
    };
  },
};

const hbsLexer: ObjectUnderTest = {
  name: "hbs-lexer",
  testFn(test) {
    return () => {
      const lexer = createHbsLexer().lex(test.template);
      for (const ignoredToken of lexer) {
        /* noop */
      }
    };
  },
};

const bench = new TestBench({
  roundsPerExecution: 1,
})
  .addTests(tests)
  .addTestee(originalHandlebars.parser)
  .addTestee(parserNg)
  .addTestee(hbsLexer);

await bench.run({ iterations: 200, warmupIterations: 100 });

console.table(bench.asTable());
