import { HandlebarsTest } from "../../exported/HandlebarsTest";

export default {
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
        loc: {
          start: {
            line: 1,
            column: 0,
          },
          end: {
            line: 1,
            column: 6,
          },
        },
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
            start: {
              line: 1,
              column: 8,
            },
            end: {
              line: 1,
              column: 12,
            },
          },
        },
        params: [],
        escaped: true,
        strip: {
          open: false,
          close: false,
        },
        loc: {
          start: {
            line: 1,
            column: 6,
          },
          end: {
            line: 1,
            column: 14,
          },
        },
      },
      {
        type: "ContentStatement",
        original: ".",
        value: ".",
        loc: {
          start: {
            line: 1,
            column: 14,
          },
          end: {
            line: 1,
            column: 15,
          },
        },
      },
    ],
    strip: {},
    loc: {
      start: {
        line: 1,
        column: 0,
      },
      end: {
        line: 1,
        column: 15,
      },
    },
  },
  input: {
    name: "world < sun",
  },
  output: "Hello world &lt; sun.",
} satisfies HandlebarsTest;
