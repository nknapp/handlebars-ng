import { HandlebarsTest } from "../../exported/HandlebarsTest";

export default {
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
              column: 9,
            },
            end: {
              line: 1,
              column: 13,
            },
          },
        },
        params: [],
        escaped: false,
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
            column: 16,
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
            column: 16,
          },
          end: {
            line: 1,
            column: 17,
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
        column: 17,
      },
    },
  },
  input: {
    name: "<world>",
  },
  output: "Hello <world>.",
} satisfies HandlebarsTest;
