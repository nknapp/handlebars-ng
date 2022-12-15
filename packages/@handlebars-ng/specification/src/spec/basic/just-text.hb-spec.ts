import { HandlebarsTest } from "../../exported/HandlebarsTest";

export default {
  description: "A simple text is output as is\n",
  template: "This is a simple text",
  ast: {
    type: "Program",
    body: [
      {
        type: "ContentStatement",
        original: "This is a simple text",
        value: "This is a simple text",
        loc: {
          start: {
            line: 1,
            column: 0,
          },
          end: {
            line: 1,
            column: 21,
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
        column: 21,
      },
    },
  },
  input: {},
  output: "This is a simple text",
} satisfies HandlebarsTest;
