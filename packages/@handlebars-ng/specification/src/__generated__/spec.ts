export interface HandlebarsTest {
  filename: string;
  description: string;
  template: string;
  ast: object;
  input: object;
  helpers?: Record<string, string>;
  output: string;
  failsInOriginalHandlebars?: boolean;
}

export const testCases: HandlebarsTest[] = [
  {
    description: "An empty template yields an empty result\n",
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
    filename: "basic/empty.hb-spec.yaml",
  },
  {
    description: "A simple text is output as is\n",
    template: "This is a simple text",
    ast: {
      type: "Program",
      body: [
        {
          type: "ContentStatement",
          original: "This is a simple text",
          value: "This is a simple text",
          loc: { start: { line: 1, column: 0 }, end: { line: 1, column: 21 } },
        },
      ],
      strip: {},
      loc: { start: { line: 1, column: 0 }, end: { line: 1, column: 21 } },
    },
    input: {},
    output: "This is a simple text",
    filename: "basic/just-text.hb-spec.yaml",
  },
  {
    description:
      "A mustache designates a property to be inserted from the input\n",
    template: "Hello {{name}}.",
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
            parts: ["name"],
            original: "name",
            loc: {
              start: { line: 1, column: 8 },
              end: { line: 1, column: 12 },
            },
          },
          params: [],
          escaped: true,
          strip: { open: false, close: false },
          loc: { start: { line: 1, column: 6 }, end: { line: 1, column: 14 } },
        },
        {
          type: "ContentStatement",
          original: ".",
          value: ".",
          loc: { start: { line: 1, column: 14 }, end: { line: 1, column: 15 } },
        },
      ],
      strip: {},
      loc: { start: { line: 1, column: 0 }, end: { line: 1, column: 15 } },
    },
    input: { name: "world < sun" },
    output: "Hello world &lt; sun.",
    filename: "basic/simple-mustache.hb-spec.yaml",
  },
  {
    description:
      "A triple mustache indicates that the output should not be HTML escaped\n",
    template: "Hello {{{name}}}.",
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
            parts: ["name"],
            original: "name",
            loc: {
              start: { line: 1, column: 9 },
              end: { line: 1, column: 13 },
            },
          },
          params: [],
          escaped: false,
          strip: { open: false, close: false },
          loc: { start: { line: 1, column: 6 }, end: { line: 1, column: 16 } },
        },
        {
          type: "ContentStatement",
          original: ".",
          value: ".",
          loc: { start: { line: 1, column: 16 }, end: { line: 1, column: 17 } },
        },
      ],
      strip: {},
      loc: { start: { line: 1, column: 0 }, end: { line: 1, column: 17 } },
    },
    input: { name: "<world>" },
    output: "Hello <world>.",
    filename: "basic/simple-raw-mustache.hb-spec.yaml",
  },
];
