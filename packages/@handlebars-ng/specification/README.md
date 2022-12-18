# Handlebars Specification

This project fulfills two purposes:

* Create the website of the Handlebars Specification, using http://astro.build
* Export a list of test-cases that can be used to test a (javascript-based) Handlebars
  implementation against specification.

The exported test-cases are used in the other modules of this repository.

## Using the AST types

```js
import type {Program} from '@handlebars-ng/specification/ast'
```
will import the main type of the abstract-syntax-tree. Other node-types can be imported as well.


## Using the tests

The [parser-specification test](../parser/src/parser-specification.test.ts) and the [runner-specification test](../runner/src/index.test.ts) are 
examples of using test test-cases.

```js
import {handlebarsSpec} from '@handlebars-ng/specification/tests'
```

will return an array of test-cases in the defined in [test.d.ts](./types/tests.d.ts)


## Module structure

* **src/** - contains source-files for the website
* **src/pages/spec** - contains the texts and test-cases of the specification.
* **astro-plugins/** - contains custom plugins for astro.
* **ast.d.ts** - entrypoint for projects using the AST sources 
* **tests.d.ts** - entrypoint for projects using the test-cases
* **tests.js** - JavaScript entrypoint, generated from `*.hb-spec.json` files in `src/pages/spec`

## Specification syntax

The specification is written in [.mdx](https://mdxjs.com/docs/) format. Each section of the specification
contains one more test-cases. 

A test-case is a JSON file ending with `.hb-spec.json`. The file must match the [testcase-schema](./src/pages/spec/schema/testcase.json)

The section links to the test-cases via simple markdown links (i.e. `[](./example.hb-spec.json)`). 

The plugin in [astro-plugins/inject-testcase.mjs](astro-plugins/inject-testcase.mjs) identifies such links and renders a human-readable form of 
the test-case into that website.

## Styling 

We use [tailwind](https://docs.astro.build/de/guides/integrations-guide/tailwind/) for styling.


# Work in progress

The whole specification is very much work in progress. Apart from specs and tests, the following things are still missing:

* A lot of markdown-styling is still missing. The [MarkdownLayout.astro](src/layouts/MarkdownLayout.astro) is used by pages and missing styles should be added
  there as we proceed with the spec.
* We should generate a JSON file that contains the same data as the export of the specification module. It can then be used by implementations in 
  other languages.
