import { expect, test } from "vitest";
import { combineContentStatements } from "./combineContentStatements";

test("combines content", () => {
  const nodes = [
    {
      type: "ContentStatement",
      original: "{{abc}} ",
      value: "{{abc}} ",
      loc: {
        start: { line: 1, column: 1 },
        end: { line: 1, column: 9 },
        source: "",
      },
    },
    {
      type: "ContentStatement",
      original: "{{{cde}}}",
      value: "{{{cde}}}",
      loc: {
        start: { line: 1, column: 10 },
        end: { line: 1, column: 19 },
        source: "",
      },
    },
    {
      type: "MustacheStatement",
      original: "{{abc}} ",
      value: "{{abc}} ",
      loc: {
        start: { line: 1, column: 20 },
        end: { line: 1, column: 28 },
        source: "",
      },
    },
    {
      type: "ContentStatement",
      original: "{{abc}} ",
      value: "{{abc}} ",
      loc: {
        start: { line: 1, column: 29 },
        end: { line: 1, column: 38 },
        source: "",
      },
    },
    {
      type: "ContentStatement",
      original: "{{{cde}}}",
      value: "{{{cde}}}",
      loc: {
        start: { line: 1, column: 39 },
        end: { line: 1, column: 48 },
        source: "",
      },
    },
  ];
  combineContentStatements(nodes);
  expect(nodes).toEqual([
    {
      type: "ContentStatement",
      original: "{{abc}} {{{cde}}}",
      value: "{{abc}} {{{cde}}}",
      loc: {
        start: { line: 1, column: 1 },
        end: { line: 1, column: 19 },
        source: "",
      },
    },
    {
      type: "MustacheStatement",
      original: "{{abc}} ",
      value: "{{abc}} ",
      loc: {
        start: { line: 1, column: 20 },
        end: { line: 1, column: 28 },
        source: "",
      },
    },
    {
      type: "ContentStatement",
      original: "{{abc}} {{{cde}}}",
      value: "{{abc}} {{{cde}}}",
      loc: {
        start: { line: 1, column: 29 },
        end: { line: 1, column: 48 },
        source: "",
      },
    },
  ]);
});
