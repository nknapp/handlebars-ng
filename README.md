## Handlebars next-generation

This is an attempt to rewrite [Handlebars](https://handlebarsjs.com) cleanly and with modern tools,
and a the same time provide a reliable [specification](https://github.com/handlebars-lang/handlebars.js/issues/1277) of its language.

In the best of all cases, this repo replaces Handlebars completely when all the original features are implemented.

## Contents

This project is a mono-repo. The directory [packages/@handlebars-ng](packages/%40handlebars-ng) contains the following modules:

- [specification](packages/%40handlebars-ng/specification) - builds a specification site and exports testcases and AST types
- [parser](packages/%40handlebars-ng/parser/) - a TypeScript-based parser for the Handlebars language
- [runner](packages/%40handlebars-ng/runner/) - a TypeScript-based compiler/executor for Handlebars ASTs
- [benchmark](packages/@handlebars-ng/benchmarks) - measures the performance of the new parser/executor compared to the original Handlebars

## Contributing

You can contribute by adding new sections to the specification and fixing the resulting failing
tests in the parser and runner.

I use the following workflow for this:

### Adding a new testcase to the spec

**Go to "packages/@handlebars-ng/specification"**

- In the directory[src/spec](packages/@handlebars-ng/specification/src/spec), add a new chapter-directory or use an existing chapter, if it fits semantically.
- Create a file `index.md` and describe the feature. Use existing chapters are template.
- Add one file named `[feature-name].hb-spec.json`, give it a `$schema`, `description`, `template` and `input` (and possible more relevant data that is
  NOT `ast` or `output`)
- Create a link from the markdown-file to the test-file using markdown-syntax
- Run `yarn auto-complete-tests`. This will run Handlebars 4.x and add `ast` and `output` to the test-file
- Validate output and ast. If the AST does not match your expectations, correct it and run `yarn auto-complete-tests` again. This will add the `originalAst` feature.
- The output should match your expectation, because handlebars-ng ist supposed to be compatible to Handlebars 4.x at least in that respect. If you really think it is a bug, you can add a description of the bug to the field `possibleBug`. We can discuss this later.
- If the generated AST does not match, the JSON schema, you add the correct TypeScript-types to the file `types/ast.d.ts` and run `yarn generate` to update the JSON schema. The Handlebars 4.x types are in `types/handlebars/index.d.ts`. You can use them as hints.
- Only add as many types as necessary to represent the generated AST. We want to build up the model incrementally.
- Run `yarn test-and-build` to make sure all the dist-files are updated correctly.

### Adjust the parser

**Go to "packages/@handlebars-ng/parser"**

- Run `yarn dev:unit` to run unit-tests in watch mode. Your specification-test should be run as well and fail, so you can try to fix.
- Add values to the `TokenType` type in [src/lexer/model.ts](packages/@handlebars-ng/parser/src/lexer/model.ts) if necessary.
- Add new tokens to [src/lexer/moo-lexer.ts](packages/@handlebars-ng/parser/src/lexer/moo-lexer.ts) if necessary.
- Add new node-types to [src/parser/ParserContext.ts](packages/@handlebars-ng/parser/src/parser/ParserContext.ts) and a corresponding node-parser to
  [src/parser/nodes](packages/@handlebars-ng/parser/src/parser/nodes/)
- When the test is green, cleanup your code.
- You can run `yarn perf` to run the performance tests, but performance optimizations can also be done later on.
- Finally, run `yarn test-and-build` to update the `dist`-folder

### Adjust the runner

**Go to "packages/@handlebars-ng/runner"**

- Run `yarn dev:unit` to run unit-tests in watch mode. Your specification-test should be run as well and fail, so you can try to fix.
- Add a new renderer to [src/renderer](packages/@handlebars-ng/runner/src/renderer) if necessary.
- Register the new renderer in [src/index.ts](packages/@handlebars-ng/runner/src/index.ts)
- Adjust renders and needed
- Cleanup your code afterwards.
- You can run `yarn perf` to run the performance tests, but performance optimizations can also be done later on.
- Finally, run `yarn test-and-build` to update the `dist`-folder

## Work in progress

- We need to set up a publishing progress and maybe some browser tests.
- Should we put this unter the `@handlebars`-scope in npm? And move it to then `handlebars-lang` org? I am reluctant doing that unless I know that this project will get some drive from other people as well.
