import { HandlebarsTest } from "../../exported/HandlebarsTest";

export default {
  description: "An empty template yields an empty result\n",
  template: "",
  ast: {
    type: "Program",
    body: [],
    strip: {},
    loc: {
      start: {
        line: 1,
        column: 0,
      },
      end: {
        line: 1,
        column: 1,
      },
    },
  },
  input: {},
  failsInOriginalHandlebars: true,
  output: "",
} satisfies HandlebarsTest;
