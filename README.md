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

I use [Visual Studio Code]() to work in this repository.
The following extensions are helpful:

- [grammarkdown](https://marketplace.visualstudio.com/items?itemName=rbuckton.grammarkdown-vscode)
- [astro](https://marketplace.visualstudio.com/items?itemName=astro-build.astro-vscode)
- [eslint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [mdx](https://marketplace.visualstudio.com/items?itemName=unifiedjs.vscode-mdx)
- [prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
- [TailwindDocs](https://marketplace.visualstudio.com/items?itemName=austenc.tailwind-docs)
- [Teildinw CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)

You can contribute by adding new sections to the specification and fixing the resulting failing
tests in the parser and runner.

I use the following workflow for this:

_All the yarn-commands in the following description are run in the main directory._

### Write a description of the feature

- In general, it is helpful to run `yarn site dev:server` while editing the spec. It shows the current website
  instantly, including live-reload on content changes.
- In the directory [src/spec](packages/@handlebars-ng/specification/src/spec), add a new chapter-directory or use an existing chapter, if it fits semantically.
- Create a file `index.md` and describe the feature. Use existing chapters as a template.

### Add grammar

Grammar is written in [grammarkdown](https://github.com/rbuckton/grammarkdown) which allows to use a language grammar
as defined the [ECMA 262 Specification](https://262.ecma-international.org/#sec-grammar-notation).

- Adjust the file [handlebars.grammar](packages/@handlebars-ng/specification/src/spec/handlebars.grammar) by adding more
  statements and extending existing ones.
- If you want to include parts of the grammar into your text, add a `// @section:MySectionName` comment to the grammar file
- Add a link `[My FeatureName](../handlebars.grammer#MySectionName)` to the text, linking to the grammar file.

The part of the grammar starting with the linked section, up to the next section marker (or end-of-file) will be inlined
instead of the link.

### Add a testcase to the spec

- Add one file named `[feature-name].hb-spec.json`, give it a `$schema`, `description`, `template` and `input` (and possible more relevant data that is
  NOT `ast` or `output`)
- Create a link from the markdown-file to the test-file using markdown-syntax.
- Run `yarn spec generate:auto-complete-tests`. This will run Handlebars 4.x and add `ast` and `output` to the test-file
- Validate output and ast. If the AST does not match your expectations, correct it and run `yarn spec generate:auto-complete-tests` again. This will add the `originalAst` feature.
- The output should match your expectation, because handlebars-ng ist supposed to be compatible to Handlebars 4.x at least in that respect. If you really think it is a bug, you can add a description of the bug to the field `possibleBug`. We can discuss this later.
- If the generated AST does not match, the JSON schema, you add the correct TypeScript-types to the file `packages/@handlebars-ng/abstract-syntax-tree/index.d.ts` and run `yarn spec generate` to update the JSON schema. The Handlebars 4.x types are in `types/handlebars/index.d.ts`. You can use them as hints.
- Only add as many types as necessary to represent the generated AST. We want to build up the model incrementally.
- Run `yarn spec test-and-build` to make sure all the dist-files are updated correctly.

### Adjust the parser

**Go to "packages/@handlebars-ng/parser"**

- Run `yarn parser dev:unit` to run unit-tests in watch mode. Your specification-test should be run as well and fail, so you can try to fix.
- Add values to the `TokenType` and new tokens in [src/lexer/lexer.ts](packages/@handlebars-ng/parser/src/lexer/rules.ts) if necessary.
- Add new node-types to [src/parser/ParserContext.ts](packages/@handlebars-ng/parser/src/parser/ParserContext.ts) and a corresponding node-parser to
  [src/parser/nodes](packages/@handlebars-ng/parser/src/parser/nodes/)
- When the test is green, cleanup your code.
- You can run `yarn parser perf` to run the performance tests, but performance optimizations can also be done later on.
- Finally, run `yarn parser test-and-build` to update the `dist`-folder

### Adjust the runner

**Go to "packages/@handlebars-ng/runner"**

- Run `yarn runner dev:unit` to run unit-tests in watch mode. Your specification-test should be run as well and fail, so you can try to fix.
- Add a new renderer to [src/renderer](packages/@handlebars-ng/runner/src/renderer) if necessary.
- Register the new renderer in [src/index.ts](packages/@handlebars-ng/runner/src/index.ts)
- Adjust renders and needed
- Cleanup your code afterwards.
- You can run `yarn runner perf` to run the performance tests, but performance optimizations can also be done later on.
- Finally, run `yarn runner test-and-build` to update the `dist`-folder

## Work in progress

- We need to set up a publishing progress and maybe some browser tests.
- Should we put this unter the `@handlebars`-scope in npm? And move it to then `handlebars-lang` org? I am reluctant doing that unless I know that this project will get some drive from other people as well.
