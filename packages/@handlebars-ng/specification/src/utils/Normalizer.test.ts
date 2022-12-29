import { expect, test } from "vitest";
import { Normalizer } from "./Normalizer";

test("Normalizer", () => {
  const ast: unknown = {
    type: "Program",
    body: [
      {
        type: "ContentStatement",
        original: "{{abc}} ",
        value: "{{abc}} ",
        loc: {
          start: { line: 1, column: 1 },
          end: { line: 1, column: 9 },
        },
      },
      {
        type: "ContentStatement",
        original: "{{{cde}}}",
        value: "{{{cde}}}",
        loc: {
          start: { line: 1, column: 10 },
          end: { line: 1, column: 19 },
        },
      },
    ],
    strip: {},
    loc: {
      start: { line: 1, column: 1 },
      end: { line: 1, column: 19 },
    },
  };

  new Normalizer().accept(ast as hbs.AST.Program);
  expect(ast).toEqual({
    type: "Program",
    body: [
      {
        type: "ContentStatement",
        original: "{{abc}} {{{cde}}}",
        value: "{{abc}} {{{cde}}}",
        loc: {
          start: { line: 1, column: 1 },
          end: { line: 1, column: 19 },
        },
      },
    ],
    strip: {},
    loc: {
      start: { line: 1, column: 1 },
      end: { line: 1, column: 19 },
    },
  });
});
