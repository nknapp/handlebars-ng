import { ObjectUnderTest, TestBench } from "@handlebars-ng/benchmarks";
import { originalHandlebars } from "@handlebars-ng/benchmarks";
import { tests } from "@handlebars-ng/benchmarks";
import { HandlebarsParser } from "../src";
import { createHbsLexer } from "../src/lexer";
import { createExperimentalLexer } from "../src/lexer/experimental-lexer";

const parserNg: ObjectUnderTest = {
  name: "ng parser",
  testFn(test) {
    const parser = new HandlebarsParser();
    return () => {
      parser.parse(test.template);
    };
  },
};

const experimentalParserNg: ObjectUnderTest = {
  name: "ng parser experimental",
  testFn(test) {
    const parser = new HandlebarsParser({ lexer: createExperimentalLexer() });
    return () => {
      parser.parse(test.template);
    };
  },
};

const lexer: ObjectUnderTest = {
  name: "ng lexer",
  testFn(test) {
    const lexer = createHbsLexer();
    return () => {
      for (const ignoredToken of lexer.lex(test.template)) {
        /* do nothing */
      }
    };
  },
};

const alternativeLexer: ObjectUnderTest = {
  name: "alternative ng parser",
  testFn(test) {
    const lexer = createExperimentalLexer();
    return () => {
      for (const ignoredToken of lexer.lex(test.template)) {
        /* do nothing */
      }
    };
  },
};

const bench = new TestBench({
  roundsPerExecution: 1,
})
  .addTests(tests)
  .addTestee(alternativeLexer)
  .addTestee(lexer)
  .addTestee(originalHandlebars.parser)
  .addTestee(parserNg)
  .addTestee(experimentalParserNg);

await bench.run({ iterations: 200, warmupIterations: 100 });

console.table(bench.asTable());
