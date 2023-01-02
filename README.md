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

## Work in progress

- We need to set up a publishing progress and maybe some browser tests.
- Should we put this unter the `@handlebars`-scope in npm? And move it to then `handlebars-lang` org? I am reluctant doing that unless I know that this project will get some drive from other people as well.
