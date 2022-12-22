// DO NOT EDIT THIS FILE MANUALLY
// generaty by scripts/assemble-testcases.ts

export const handlebarsSpec = [
  {
    $schema: "../schema/testcase.json",
    description: "A basic example with one mustache",
    template: "Hello {{something}}",
    input: { something: "world" },
    output: "Hello world",
    ast: {
      type: "Program",
      body: [
        {
          type: "ContentStatement",
          original: "Hello ",
          value: "Hello ",
          loc: { start: { line: 1, column: 0 }, end: { line: 1, column: 6 } },
        },
        {
          type: "MustacheStatement",
          path: {
            type: "PathExpression",
            data: false,
            depth: 0,
            parts: ["something"],
            original: "something",
            loc: {
              start: { line: 1, column: 8 },
              end: { line: 1, column: 17 },
            },
          },
          params: [],
          escaped: true,
          strip: { open: false, close: false },
          loc: { start: { line: 1, column: 6 }, end: { line: 1, column: 19 } },
        },
      ],
      strip: {},
      loc: { start: { line: 1, column: 0 }, end: { line: 1, column: 19 } },
    },
    filename: "01-introduction/example.hb-spec.json",
  },
  {
    $schema: "../spec.schema.json",
    description: "An empty template yields an empty result",
    template: "",
    ast: {
      type: "Program",
      body: [],
      strip: {},
      loc: { start: { line: 1, column: 0 }, end: { line: 1, column: 1 } },
    },
    input: {},
    failsInOriginalHandlebars: true,
    output: "",
    filename: "02-abstract-syntax-tree/empty.hb-spec.json",
  },
  {
    $schema: "../spec.schema.json",
    description: "Newlines around a mustache statement",
    template: "\n{{a}}\n",
    input: { a: 2 },
    output: "\n2\n",
    ast: {
      type: "Program",
      body: [
        {
          type: "ContentStatement",
          original: "\n",
          value: "\n",
          loc: { start: { line: 1, column: 0 }, end: { line: 2, column: 0 } },
        },
        {
          type: "MustacheStatement",
          path: {
            type: "PathExpression",
            data: false,
            depth: 0,
            parts: ["a"],
            original: "a",
            loc: { start: { line: 2, column: 2 }, end: { line: 2, column: 3 } },
          },
          params: [],
          escaped: true,
          strip: { open: false, close: false },
          loc: { start: { line: 2, column: 0 }, end: { line: 2, column: 5 } },
        },
        {
          type: "ContentStatement",
          original: "\n",
          value: "\n",
          loc: { start: { line: 2, column: 5 }, end: { line: 3, column: 0 } },
        },
      ],
      strip: {},
      loc: { start: { line: 1, column: 0 }, end: { line: 3, column: 0 } },
    },
    filename: "02-abstract-syntax-tree/newline-around-mustache.hb-spec.json",
  },
  {
    $schema: "../spec.schema.json",
    description: "A single newline",
    template: "\n",
    output: "\n",
    input: {},
    ast: {
      type: "Program",
      body: [
        {
          type: "ContentStatement",
          original: "\n",
          value: "\n",
          loc: { start: { line: 1, column: 0 }, end: { line: 2, column: 0 } },
        },
      ],
      strip: {},
      loc: { start: { line: 1, column: 0 }, end: { line: 2, column: 0 } },
    },
    filename: "02-abstract-syntax-tree/newline.hb-spec.json",
  },
];