# Introduction

The Handlebars language is a templating language,
that was originally implemented by Yehuda Katz in JavaScript (see https://handlebarsjs.com).

Since then, implementations in many other languages
have been created. The goal of this document is to define
the language and provide language-independent
test-cases that allow implementations to converge.

## Basic structure

A Handlebars implementation consists of multiple
components

- The **parser** parses a template into an Abstract Syntax Tree (AST).
- The **compiler** creates an executable function from the AST.
- The **runtime** provides an execution environment that can be used
  to register **helpers**, **partials** and **decorators**.

This document defines the templating language and the AST. It also specifies
the output of the template execution, given the input-data and the runtime
configuration.

It does not specify how exactly helpers, partials and decorators are registered,
how the template is executed and how input data is provided.
Those are implementation details and may vary from implementation to
implementation.

## Test cases

This document contains test-cases in a JSON format, that can be used
to test an implementation against. Testcases are included in the document,
but there is also a single JSON file that contains all tests as array.
There is also a documented JSON schema for the test-case and for the AST.

This is a simple example of a test-case:

[](./example.hb-spec.json)

In the test-case, the AST of the template is represented in a normalized form:

- Consecutive `ContentStatement` nodes are merged into a single node.

  - The `value` property of the new node is the concatenation of all nodes
  - The `original` property of the new node is the concationation of all nodes
  - `loc.start` is taken from the first node
  - `loc.end` is taken from the last node
  - `loc.source` is taken from the first node. It should be the same in all nodes.

  ```typescript
  function merge(c1: ContentStatement, c2: ContentStatement): ContentStatement {
    return {
      type: "ContentStatement",
      original: c1.original + c2.original,
      value: c1.value + c2.value,
      loc: {
        start: c1.loc.start,
        end: c2.loc.end,
        source: c1.loc.source,
      },
    };
  }
  ```

- Properties in the normalized AST are sorted by their index in the following list.
  All not-listed properties are considered "OTHERS_LEXICAL" and are sorted lexically among themselves.

  ```js
  "type",
  "value",
  "original",
  OTHERS_LEXICAL,
  "loc",
  // used inside "loc"
  "start",
  "end",
  "source",
  // used inside "loc.start" and "loc.end"
  "line",
  "column",
  // used inside "trim"
  "open",
  "close",
  ```

Some test-cases do not pass for the current Handlebars.js 4.x implementation for one of the following reasons:

- The AST deviates from the expected AST. The test-case will then contain a `originalAst` that contains the generated AST.
- The parser cannot parse the template. The tst-case will then have a `originalParseError: true` property.

In such cases, we need to discuss whether this is a bug in Handlebars.js or should be changed in the spec. For now we simply
document the differences.
