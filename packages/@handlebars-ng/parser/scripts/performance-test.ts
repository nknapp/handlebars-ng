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

const mooLexer = createHbsLexer("moo");

const hbsLexerMoo: ObjectUnderTest = {
  name: "hbs-lexer moo",
  testFn(test) {
    return () => {
      const lexer = mooLexer.lex(test.template);
      for (const ignoredToken of lexer) {
        /* noop */
      }
    };
  },
};

const baaLexer = createHbsLexer("hbs");

const hbsLexerBaa: ObjectUnderTest = {
  name: "hbs-lexer baa",
  testFn(test) {
    return () => {
      const lexer = baaLexer.lex(test.template);
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
  .addTestee(hbsLexerMoo)
  .addTestee(hbsLexerBaa);

await bench.run({ iterations: 200, warmupIterations: 100 });

console.table(bench.asTable());
