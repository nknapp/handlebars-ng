// DO NOT EDIT THIS FILE MANUALLY
// generate by scripts/build-testcases.ts

export const handlebarsSpec = [
  {
    filename: "01-introduction/example.hb-spec.json",
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
          value: "Hello ",
          original: "Hello ",
          loc: { start: { line: 1, column: 0 }, end: { line: 1, column: 6 } },
        },
        {
          type: "MustacheStatement",
          escaped: true,
          params: [],
          path: {
            type: "PathExpression",
            original: "something",
            data: false,
            depth: 0,
            parts: ["something"],
            loc: {
              start: { line: 1, column: 8 },
              end: { line: 1, column: 17 },
            },
          },
          strip: { open: false, close: false },
          loc: { start: { line: 1, column: 6 }, end: { line: 1, column: 19 } },
        },
      ],
      strip: {},
      loc: { start: { line: 1, column: 0 }, end: { line: 1, column: 19 } },
    },
  },
  {
    filename: "02-abstract-syntax-tree/empty.hb-spec.json",
    $schema: "../schema/testcase.json",
    description: "An empty template yields an empty result",
    template: "",
    ast: {
      type: "Program",
      body: [],
      strip: {},
      loc: { start: { line: 1, column: 0 }, end: { line: 1, column: 1 } },
    },
    input: {},
    output: "",
    originalAst: { type: "Program", body: [], strip: {} },
  },
  {
    filename: "02-abstract-syntax-tree/newline-around-mustache.hb-spec.json",
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
          value: "\n",
          original: "\n",
          loc: { start: { line: 1, column: 0 }, end: { line: 2, column: 0 } },
        },
        {
          type: "MustacheStatement",
          escaped: true,
          params: [],
          path: {
            type: "PathExpression",
            original: "a",
            data: false,
            depth: 0,
            parts: ["a"],
            loc: { start: { line: 2, column: 2 }, end: { line: 2, column: 3 } },
          },
          strip: { open: false, close: false },
          loc: { start: { line: 2, column: 0 }, end: { line: 2, column: 5 } },
        },
        {
          type: "ContentStatement",
          value: "\n",
          original: "\n",
          loc: { start: { line: 2, column: 5 }, end: { line: 3, column: 0 } },
        },
      ],
      strip: {},
      loc: { start: { line: 1, column: 0 }, end: { line: 3, column: 0 } },
    },
  },
  {
    filename: "02-abstract-syntax-tree/newline.hb-spec.json",
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
          value: "\n",
          original: "\n",
          loc: { start: { line: 1, column: 0 }, end: { line: 2, column: 0 } },
        },
      ],
      strip: {},
      loc: { start: { line: 1, column: 0 }, end: { line: 2, column: 0 } },
    },
  },
  {
    filename: "04-content-statement/content.hb-spec.json",
    $schema: "../schema/testcase.json",
    description: "A simple template without mustaches",
    template: "hello\nworld",
    input: {},
    output: "hello\nworld",
    ast: {
      type: "Program",
      body: [
        {
          type: "ContentStatement",
          value: "hello\nworld",
          original: "hello\nworld",
          loc: { start: { line: 1, column: 0 }, end: { line: 2, column: 5 } },
        },
      ],
      strip: {},
      loc: { start: { line: 1, column: 0 }, end: { line: 2, column: 5 } },
    },
  },
  {
    filename: "04-content-statement/escaped-content.hb-spec.json",
    $schema: "../schema/testcase.json",
    description: "Escaped mustache expression",
    template: "\\{{abc}} \\{{{cde}}}",
    input: {},
    output: "{{abc}} {{{cde}}}",
    ast: {
      type: "Program",
      body: [
        {
          type: "ContentStatement",
          value: "{{abc}} {{{cde}}}",
          original: "\\{{abc}} \\{{{cde}}}",
          loc: { start: { line: 1, column: 0 }, end: { line: 1, column: 19 } },
        },
      ],
      strip: {},
      loc: { start: { line: 1, column: 0 }, end: { line: 1, column: 19 } },
    },
    originalAst: {
      type: "Program",
      body: [
        {
          type: "ContentStatement",
          value: "{{abc}} {{{cde}}}",
          original: "{{abc}} {{{cde}}}",
          loc: { start: { line: 1, column: 1 }, end: { line: 1, column: 19 } },
        },
      ],
      strip: {},
      loc: { start: { line: 1, column: 1 }, end: { line: 1, column: 19 } },
    },
  },
  {
    filename: "05-mustache-statement/html-escaped-mustache.hb-spec.json",
    $schema: "../schema/testcase.json",
    description: "A simple mustache with html-escaped output",
    template: "{{ value }}",
    input: { value: "abc & < > \" ' ` = 123" },
    output: "abc &amp; &lt; &gt; &quot; &#x27; &#x60; &#x3D; 123",
    ast: {
      type: "Program",
      body: [
        {
          type: "MustacheStatement",
          escaped: true,
          params: [],
          path: {
            type: "PathExpression",
            original: "value",
            data: false,
            depth: 0,
            parts: ["value"],
            loc: { start: { line: 1, column: 3 }, end: { line: 1, column: 8 } },
          },
          strip: { open: false, close: false },
          loc: { start: { line: 1, column: 0 }, end: { line: 1, column: 11 } },
        },
      ],
      strip: {},
      loc: { start: { line: 1, column: 0 }, end: { line: 1, column: 11 } },
    },
  },
  {
    filename: "05-mustache-statement/unescaped-mustache.hb-spec.json",
    $schema: "../schema/testcase.json",
    description: "A simple mustache with unescaped output",
    template: "{{{ value }}}",
    input: { value: "abc & < > \" ' ` = 123" },
    output: "abc & < > \" ' ` = 123",
    ast: {
      type: "Program",
      body: [
        {
          type: "MustacheStatement",
          escaped: false,
          params: [],
          path: {
            type: "PathExpression",
            original: "value",
            data: false,
            depth: 0,
            parts: ["value"],
            loc: { start: { line: 1, column: 4 }, end: { line: 1, column: 9 } },
          },
          strip: { open: false, close: false },
          loc: { start: { line: 1, column: 0 }, end: { line: 1, column: 13 } },
        },
      ],
      strip: {},
      loc: { start: { line: 1, column: 0 }, end: { line: 1, column: 13 } },
    },
  },
  {
    filename:
      "05-mustache-statement/white-space-control-empty-nodes.hb-spec.json",
    $schema: "../schema/testcase.json",
    description:
      "ContentStatements that become empty due to white-space control, are preserved.",
    template: " {{~name~}} {{~name~}}",
    input: { name: "joe" },
    output: "joejoe",
    ast: {
      type: "Program",
      body: [
        {
          type: "ContentStatement",
          value: "",
          original: " ",
          loc: { start: { line: 1, column: 0 }, end: { line: 1, column: 1 } },
        },
        {
          type: "MustacheStatement",
          escaped: true,
          params: [],
          path: {
            type: "PathExpression",
            original: "name",
            data: false,
            depth: 0,
            parts: ["name"],
            loc: { start: { line: 1, column: 4 }, end: { line: 1, column: 8 } },
          },
          strip: { open: true, close: true },
          loc: { start: { line: 1, column: 1 }, end: { line: 1, column: 11 } },
        },
        {
          type: "ContentStatement",
          value: "",
          original: " ",
          loc: { start: { line: 1, column: 11 }, end: { line: 1, column: 12 } },
        },
        {
          type: "MustacheStatement",
          escaped: true,
          params: [],
          path: {
            type: "PathExpression",
            original: "name",
            data: false,
            depth: 0,
            parts: ["name"],
            loc: {
              start: { line: 1, column: 15 },
              end: { line: 1, column: 19 },
            },
          },
          strip: { open: true, close: true },
          loc: { start: { line: 1, column: 12 }, end: { line: 1, column: 22 } },
        },
      ],
      strip: {},
      loc: { start: { line: 1, column: 0 }, end: { line: 1, column: 22 } },
    },
  },
  {
    filename: "05-mustache-statement/white-space-control-escaped.hb-spec.json",
    $schema: "../schema/testcase.json",
    description:
      "White space should be removed when control characters are in place",
    template: "|- {{~name}} | {{name~}} -|- {{~name~}} -|",
    input: { name: "joe" },
    output: "|-joe | joe-|-joe-|",
    ast: {
      type: "Program",
      body: [
        {
          type: "ContentStatement",
          value: "|-",
          original: "|- ",
          loc: { start: { line: 1, column: 0 }, end: { line: 1, column: 3 } },
        },
        {
          type: "MustacheStatement",
          escaped: true,
          params: [],
          path: {
            type: "PathExpression",
            original: "name",
            data: false,
            depth: 0,
            parts: ["name"],
            loc: {
              start: { line: 1, column: 6 },
              end: { line: 1, column: 10 },
            },
          },
          strip: { open: true, close: false },
          loc: { start: { line: 1, column: 3 }, end: { line: 1, column: 12 } },
        },
        {
          type: "ContentStatement",
          value: " | ",
          original: " | ",
          loc: { start: { line: 1, column: 12 }, end: { line: 1, column: 15 } },
        },
        {
          type: "MustacheStatement",
          escaped: true,
          params: [],
          path: {
            type: "PathExpression",
            original: "name",
            data: false,
            depth: 0,
            parts: ["name"],
            loc: {
              start: { line: 1, column: 17 },
              end: { line: 1, column: 21 },
            },
          },
          strip: { open: false, close: true },
          loc: { start: { line: 1, column: 15 }, end: { line: 1, column: 24 } },
        },
        {
          type: "ContentStatement",
          value: "-|-",
          original: " -|- ",
          loc: { start: { line: 1, column: 24 }, end: { line: 1, column: 29 } },
        },
        {
          type: "MustacheStatement",
          escaped: true,
          params: [],
          path: {
            type: "PathExpression",
            original: "name",
            data: false,
            depth: 0,
            parts: ["name"],
            loc: {
              start: { line: 1, column: 32 },
              end: { line: 1, column: 36 },
            },
          },
          strip: { open: true, close: true },
          loc: { start: { line: 1, column: 29 }, end: { line: 1, column: 39 } },
        },
        {
          type: "ContentStatement",
          value: "-|",
          original: " -|",
          loc: { start: { line: 1, column: 39 }, end: { line: 1, column: 42 } },
        },
      ],
      strip: {},
      loc: { start: { line: 1, column: 0 }, end: { line: 1, column: 42 } },
    },
  },
  {
    filename:
      "05-mustache-statement/white-space-control-unescaped.hb-spec.json",
    $schema: "../schema/testcase.json",
    description:
      "White space should be removed when control characters are in place",
    template: "|- {{{~name}}} | {{{name~}}} -|- {{{~name~}}} -|",
    input: { name: "joe" },
    output: "|-joe | joe-|-joe-|",
    ast: {
      type: "Program",
      body: [
        {
          type: "ContentStatement",
          value: "|-",
          original: "|- ",
          loc: { start: { line: 1, column: 0 }, end: { line: 1, column: 3 } },
        },
        {
          type: "MustacheStatement",
          escaped: false,
          params: [],
          path: {
            type: "PathExpression",
            original: "name",
            data: false,
            depth: 0,
            parts: ["name"],
            loc: {
              start: { line: 1, column: 7 },
              end: { line: 1, column: 11 },
            },
          },
          strip: { open: true, close: false },
          loc: { start: { line: 1, column: 3 }, end: { line: 1, column: 14 } },
        },
        {
          type: "ContentStatement",
          value: " | ",
          original: " | ",
          loc: { start: { line: 1, column: 14 }, end: { line: 1, column: 17 } },
        },
        {
          type: "MustacheStatement",
          escaped: false,
          params: [],
          path: {
            type: "PathExpression",
            original: "name",
            data: false,
            depth: 0,
            parts: ["name"],
            loc: {
              start: { line: 1, column: 20 },
              end: { line: 1, column: 24 },
            },
          },
          strip: { open: false, close: true },
          loc: { start: { line: 1, column: 17 }, end: { line: 1, column: 28 } },
        },
        {
          type: "ContentStatement",
          value: "-|-",
          original: " -|- ",
          loc: { start: { line: 1, column: 28 }, end: { line: 1, column: 33 } },
        },
        {
          type: "MustacheStatement",
          escaped: false,
          params: [],
          path: {
            type: "PathExpression",
            original: "name",
            data: false,
            depth: 0,
            parts: ["name"],
            loc: {
              start: { line: 1, column: 37 },
              end: { line: 1, column: 41 },
            },
          },
          strip: { open: true, close: true },
          loc: { start: { line: 1, column: 33 }, end: { line: 1, column: 45 } },
        },
        {
          type: "ContentStatement",
          value: "-|",
          original: " -|",
          loc: { start: { line: 1, column: 45 }, end: { line: 1, column: 48 } },
        },
      ],
      strip: {},
      loc: { start: { line: 1, column: 0 }, end: { line: 1, column: 48 } },
    },
    originalParseError: true,
  },
];

export default handlebarsSpec;
