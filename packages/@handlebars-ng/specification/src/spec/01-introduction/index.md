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